<template>
    <div class="mx-auto">
        <div class="flex space-x-1 p-0.75 bg-slate-700/80 rounded-[0.625rem] shadow-md">
            <button key="tab-1" @click="openTab = 1" :class="openTab === 1 ? 'bg-slate-900/80' : 'hover:bg-slate-800/80'" class="pl-1 text-sm flex-1 py-1 rounded-lg focus:outline-none focus:shadow-outline-blue transition-all duration-100">
                Afinidades
                <TooltipInfo container="#mainContainer" tag="div"
                             tooltip="Grade de forcas de interacao entre segmentos. <br>
                             Clique numa celula para ajustar a afinidade entre dois segmentos.">
                </TooltipInfo>
            </button>
            <button key="tab-2" @click="openTab = 2" :class="openTab === 2 ? 'bg-slate-900/80' : 'hover:bg-slate-800/80'" class="pl-1 text-sm flex-1 py-1 rounded-lg focus:outline-none focus:shadow-outline-blue transition-all duration-100">
                Esp. Pessoal
                <TooltipInfo container="#mainContainer" tag="div"
                             tooltip="Grade de distancia minima de interacao entre segmentos. <br>
                             Clique numa celula para definir a distancia minima em que eleitores dos dois segmentos comecam a interagir.">
                </TooltipInfo>
            </button>
            <button key="tab-3" @click="openTab = 3" :class="openTab === 3 ? 'bg-slate-900/80' : 'hover:bg-slate-800/80'" class="pl-1 text-sm flex-1 py-1 rounded-lg focus:outline-none focus:shadow-outline-blue transition-all duration-100">
                Alcance
                <TooltipInfo container="#mainContainer" tag="div"
                             tooltip="Grade de alcance maximo de influencia entre segmentos. <br>
                             Clique numa celula para definir ate onde eleitores de dois segmentos se influenciam. <br>
                             Aumentar este valor pode impactar o desempenho.">
                </TooltipInfo>
            </button>
        </div>

        <div mt-2>
            <div v-if="openTab === 1" class="p-2 rounded-lg shadow-md bg-slate-700/40">
                <RulesMatrix :store="particleLife" @update="(...args) => $emit('updateRulesMatrix', ...args)" />
<!--                <button type="button" btn p2 mt-2 flex items-center rounded-xl bg="slate-700/40 hover:slate-700/40" @click="$emit('randomRulesMatrix')">-->
<!--                    <span i-game-icons-perspective-dice-six-faces-random text-lg></span>-->
<!--                    <span class="ml-2 mr-1 text-sm">Randomize</span>-->
<!--                </button>-->
            </div>

            <div v-if="openTab === 2" class="p-2 rounded-lg shadow-md bg-slate-700/40">
                <MinMatrix :store="particleLife" @update="(...args) => $emit('updateMinMatrix', ...args)" />
            </div>

            <div v-if="openTab === 3" class="p-2 rounded-lg shadow-md bg-slate-700/40">
                <MaxMatrix :store="particleLife" @update="(...args) => $emit('updateMaxMatrix', ...args)" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RulesMatrix from "~/components/particle-life/RulesMatrix.vue";
import MinMatrix from "~/components/particle-life/MinMatrix.vue";
import MaxMatrix from "~/components/particle-life/MaxMatrix.vue";
export default defineComponent({
    components: { MaxMatrix, MinMatrix, RulesMatrix },
    props: {
        store: {
            type: Object,
            required: true,
        }
    },
    setup(props, { emit }) {
        const particleLife = props.store

        const openTab = ref<number>(1)

        return { particleLife, openTab }
    }
})
</script>

<style scoped>

</style>