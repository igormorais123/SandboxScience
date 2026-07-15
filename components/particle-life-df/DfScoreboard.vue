<template>
    <section class="rounded-xl bg-gray-900/80 ring-1 ring-gray-700/60 p-3 backdrop-blur-sm">
        <header class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-gray-100">Placar emergente</h3>
            <span class="text-[10px] uppercase tracking-wide text-gray-500 font-mono">da fisica, nao de urna</span>
        </header>

        <div v-if="scores.length === 0" class="text-xs text-gray-500 py-2">
            Sem candidatos neste cenario — observe as formas e as metricas.
        </div>

        <div v-else class="space-y-1.5">
            <div v-for="s in scores" :key="s.candidateId" class="flex items-center gap-2">
                <span class="w-14 text-xs font-semibold truncate" :style="{ color: s.color }">{{ s.name }}</span>
                <div class="flex-1 h-3.5 rounded bg-gray-800 overflow-hidden">
                    <div class="h-full rounded transition-all duration-500"
                         :style="{ width: `${Math.max(1.5, s.share * 100)}%`, backgroundColor: s.color }"></div>
                </div>
                <span class="w-10 text-right text-xs font-mono text-gray-300">{{ (s.share * 100).toFixed(1) }}%</span>
            </div>
            <div class="flex items-center gap-2 opacity-70">
                <span class="w-14 text-xs font-semibold text-gray-400 truncate">Indec.</span>
                <div class="flex-1 h-3.5 rounded bg-gray-800 overflow-hidden">
                    <div class="h-full rounded bg-gray-600 transition-all duration-500"
                         :style="{ width: `${Math.max(1.5, undecided * 100)}%` }"></div>
                </div>
                <span class="w-10 text-right text-xs font-mono text-gray-400">{{ (undecided * 100).toFixed(1) }}%</span>
            </div>
        </div>

        <canvas v-if="scores.length" ref="sparkCanvas" class="w-full h-14 mt-2 rounded bg-gray-950/60" width="252" height="56"></canvas>
        <p v-if="scores.length" class="text-[10px] text-gray-500 mt-1">Serie temporal do placar (captura por raio de carisma).</p>
    </section>
</template>

<script setup lang="ts">
import type { DfScore } from '~/composables/useDfEngine'

const props = defineProps<{
    scores: DfScore[]
    undecided: number
    /** historico de share por candidato (ordem estavel por id) */
    history: Map<number, { color: string; values: number[] }>
}>()

const sparkCanvas = ref<HTMLCanvasElement | null>(null)

watch(() => props.scores, () => drawSpark(), { deep: false })

function drawSpark() {
    const cv = sparkCanvas.value
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const W = cv.width, H = cv.height
    ctx.clearRect(0, 0, W, H)
    let maxShare = 0.15
    for (const { values } of props.history.values())
        for (const v of values) if (v > maxShare) maxShare = v
    for (const { color, values } of props.history.values()) {
        if (values.length < 2) continue
        ctx.strokeStyle = color
        ctx.lineWidth = 1.6
        ctx.beginPath()
        const len = values.length
        for (let i = 0; i < len; i++) {
            const x = (i / (len - 1)) * (W - 4) + 2
            const y = H - 3 - (values[i] / maxShare) * (H - 8)
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
    }
}

onMounted(drawSpark)
</script>
