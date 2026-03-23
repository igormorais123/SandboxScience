<template>
  <div class="helena-panel">
    <div class="flex items-center gap-2 mb-2">
      <div class="i-tabler-brain text-amber-500 text-lg"></div>
      <span class="font-semibold text-sm text-amber-400">Helena -- IA Estrategista</span>
    </div>

    <textarea
      v-model="userPrompt"
      placeholder="Descreva o cenario que quer simular... Ex: 'Simule uma eleicao com 5 partidos onde evangelicos sao decisivos e ha forte rejeicao entre esquerda e direita'"
      class="w-full bg-slate-800/80 text-gray-200 text-xs rounded-lg p-2.5 border border-slate-600/50 resize-none focus:border-amber-500/50 focus:outline-none placeholder:text-gray-500"
      rows="3"
      @keydown.ctrl.enter="askHelena"
    ></textarea>

    <div class="flex gap-1.5 mt-1.5">
      <button
        @click="askHelena"
        :disabled="loading || !userPrompt.trim()"
        class="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        :class="loading ? 'bg-amber-900/40 text-amber-400/50 cursor-wait' : 'bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600/40'"
      >
        {{ loading ? "Helena pensando..." : "Configurar com IA" }}
      </button>
      <button
        @click="interpretCurrent"
        :disabled="loading"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/40 transition-all"
        :class="loading ? 'opacity-50 cursor-wait' : ''"
      >
        Interpretar
      </button>
    </div>

    <div v-if="errorMsg" class="mt-2 text-xs text-red-400 bg-red-900/20 rounded-lg p-2 border border-red-500/20">
      {{ errorMsg }}
    </div>

    <div v-if="interpretation" class="mt-2 text-xs bg-slate-800/60 rounded-lg p-2.5 border border-amber-500/10">
      <div v-if="interpretation.whatToWatch?.length" class="mb-1.5">
        <span class="text-amber-400 font-semibold">O que observar:</span>
        <ul class="list-disc list-inside text-gray-300 mt-0.5">
          <li v-for="item in interpretation.whatToWatch" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div v-if="interpretation.hypotheses?.length" class="mb-1.5">
        <span class="text-indigo-400 font-semibold">Hipoteses:</span>
        <ul class="list-disc list-inside text-gray-300 mt-0.5">
          <li v-for="item in interpretation.hypotheses" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div v-if="interpretation.keyDynamics?.length">
        <span class="text-emerald-400 font-semibold">Dinamicas-chave:</span>
        <ul class="list-disc list-inside text-gray-300 mt-0.5">
          <li v-for="item in interpretation.keyDynamics" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  props: {
    store: { type: Object, required: true }
  },
  emits: ["applyConfig"],
  setup(props, { emit }) {
    const userPrompt = ref("")
    const loading = ref(false)
    const errorMsg = ref("")
    const interpretation = ref<any>(null)
    const particleLife = props.store

    const getCurrentState = () => ({
      numParticles: particleLife.numParticles,
      numColors: particleLife.numColors,
      segmentNames: particleLife.segmentNames || [],
      forceFactor: particleLife.forceFactor,
      frictionFactor: particleLife.frictionFactor,
    })

    const askHelena = async () => {
      if (!userPrompt.value.trim() || loading.value) return
      loading.value = true
      errorMsg.value = ""
      interpretation.value = null

      try {
        const res = await $fetch("/api/helena", {
          method: "POST",
          body: {
            prompt: userPrompt.value,
            currentState: getCurrentState(),
          },
        })

        if ((res as any).error) {
          errorMsg.value = (res as any).error
          return
        }

        if ((res as any).config) {
          emit("applyConfig", (res as any).config)
          if ((res as any).interpretation) {
            interpretation.value = (res as any).interpretation
          } else if ((res as any).config.interpretation) {
            interpretation.value = (res as any).config.interpretation
          }
        }
      } catch (err: any) {
        errorMsg.value = "Erro de conexao: " + (err.message || "falha na requisicao")
      } finally {
        loading.value = false
      }
    }

    const interpretCurrent = async () => {
      if (loading.value) return
      loading.value = true
      errorMsg.value = ""

      try {
        const state = getCurrentState()
        const prompt = `Analise o estado atual desta simulacao e explique o que esta acontecendo em termos de dinamica social/eleitoral. Estado: ${JSON.stringify(state)}. Segmentos ativos: ${(particleLife.segmentNames || []).join(", ") || "genericos"}. Responda com JSON no formato { "interpretation": { "whatToWatch": [...], "hypotheses": [...], "keyDynamics": [...] } }`

        const res = await $fetch("/api/helena", {
          method: "POST",
          body: { prompt, currentState: state },
        })

        if ((res as any).error) {
          errorMsg.value = (res as any).error
          return
        }

        if ((res as any).config?.interpretation) {
          interpretation.value = (res as any).config.interpretation
        } else if ((res as any).interpretation) {
          interpretation.value = (res as any).interpretation
        }
      } catch (err: any) {
        errorMsg.value = "Erro: " + (err.message || "falha")
      } finally {
        loading.value = false
      }
    }

    return { userPrompt, loading, errorMsg, interpretation, askHelena, interpretCurrent }
  }
})
</script>
