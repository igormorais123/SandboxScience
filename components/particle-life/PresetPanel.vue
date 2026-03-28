<template>
    <section mx-auto>
        <div class="flex space-x-1 p-0.75 bg-slate-700/80 rounded-[0.625rem] shadow-md">
            <button key="tab-1" @click="openTab = 1" :class="openTab === 1 ? 'bg-slate-900/80' : 'hover:bg-slate-800/80'" class="pl-1 text-sm flex-1 py-1 rounded-lg focus:outline-none focus:shadow-outline-blue transition-all duration-100">
                Cenarios Oficiais
                <TooltipInfo container="#mainContainer" tag="div"
                             tooltip="Cenarios pre-configurados com cores, forcas e distribuicao definidos. <br>
                             Clique para carregar um cenario completo.">
                </TooltipInfo>
            </button>
            <button key="tab-2" @click="openTab = 2" :class="openTab === 2 ? 'bg-slate-900/80' : 'hover:bg-slate-800/80'" class="pl-1 text-sm flex-1 py-1 rounded-lg focus:outline-none focus:shadow-outline-blue transition-all duration-100">
                Meus Cenarios
                <TooltipInfo container="#mainContainer" tag="div"
                             tooltip="Cenarios salvos por voce. <br>
                             Carregue, exporte ou exclua suas configuracoes personalizadas.">
                </TooltipInfo>
            </button>
        </div>

        <div mt-2>
            <!--------------------------------------------------------------------------------------------------------->
            <div v-if="openTab === 1">
                <!-- Cenarios Eleitorais -->
                <div mb-3>
                    <div class="flex items-center text-2sm mb-1.5">
                        <div class="i-tabler-flag text-amber-500 text-md"></div>
                        <span mx-1 font-semibold>Cenarios Eleitorais</span>
                        <TooltipInfo container="#mainContainer" tooltip="Cenarios baseados em dados reais do TSE e pesquisa sintetica de Roraima. <br> Cada cenario configura segmentos, cores, forcas e distribuicao automaticamente." />
                    </div>
                    <div class="grid grid-cols-2 gap-1.5">
                        <button v-for="(scenario, idx) in electoralScenarios" :key="idx"
                            @click="loadElectoralScenario(scenario)"
                            type="button"
                            class="text-left px-2.5 py-2 rounded-lg text-xs transition-all border"
                            :class="scenario.meta.category === 'Eventos RR'
                              ? 'bg-amber-900/20 border-amber-500/20 hover:bg-amber-900/40 hover:border-amber-500/40'
                              : 'bg-indigo-900/20 border-indigo-500/20 hover:bg-indigo-900/40 hover:border-indigo-500/40'">
                            <div font-semibold class="text-white/90">{{ scenario.meta.name }}</div>
                            <div class="text-gray-400 mt-0.5 leading-tight" style="font-size:10px">{{ scenario.meta.description }}</div>
                        </button>
                    </div>
                </div>
                <hr border-slate-600 mb-3>
                <div>
                    <div class="flex items-center text-2sm mb-1">
                        <div class="i-tabler-palette text-emerald-500 text-md"></div>
                        <span mx-1>Paleta de Cores</span>
                        <TooltipInfo container="#mainContainer" tooltip="Escolha entre geradores de paleta estaticos ou generativos. <br> Paletas <b>estaticas</b> sao fixas, enquanto as <b>generativas</b> produzem novas variacoes a cada vez." />
                    </div>
                    <div flex gap-2>
                        <SelectInput class="w-8/12" v-model="particleLife.selectedColorPaletteOption" @change="updateColors" :options="paletteOptions"></SelectInput>
                        <div grid grid-cols-2 gap-1 class="w-4/12">
                            <button @click="updateColors" type="button" title="Recarregar paleta" aria-label="Recarregar paleta" btn px-3 rounded-full flex justify-center items-center bg="slate-800/80 hover:slate-800/50">
                                <span i-tabler-reload></span>
                            </button>
                            <button @click="updateColors(true)" type="button" title="Paleta aleatoria" aria-label="Paleta aleatoria" btn px-3 rounded-full flex justify-center items-center bg="cyan-900/80 hover:cyan-900/50">
                                <span i-game-icons-perspective-dice-six-faces-random></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div mt-2>
                    <div class="flex items-center text-2sm mb-1">
                        <div class="i-tabler-grid-4x4 text-indigo-500 text-md"></div>
                        <span mx-1>Matriz de Afinidades</span>
                        <TooltipInfo container="#mainContainer" tooltip="Escolha entre diferentes geradores de matriz. <br> Estes sao experimentais e podem produzir resultados imprevisiveis." />
                    </div>
                    <div flex gap-2>
                        <SelectInput class="w-8/12" v-model="particleLife.selectedRulesOption" @change="updateRulesMatrix" :options="rulesOptions"></SelectInput>
                        <div grid grid-cols-2 gap-1 class="w-4/12">
                            <button @click="updateRulesMatrix" type="button" title="Recarregar matriz" aria-label="Recarregar matriz" btn px-3 rounded-full flex justify-center items-center bg="slate-800/80 hover:slate-800/50">
                                <span i-tabler-reload></span>
                            </button>
                            <button @click="updateRulesMatrix(true)" type="button" title="Matriz aleatoria" aria-label="Matriz aleatoria" btn px-3 rounded-full flex justify-center items-center bg="cyan-900/80 hover:cyan-900/50">
                                <span i-game-icons-perspective-dice-six-faces-random></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div mt-2 v-if="particleLife.engineType !== 'CPU'">
                    <div class="flex items-center text-2sm mb-1">
                        <div class="i-tabler-spiral text-cyan-500 text-md"></div>
                        <span mx-1>Distribuicao de Eleitores</span>
                        <TooltipInfo container="#mainContainer" tooltip="Escolha entre diferentes geradores de distribuicao. <br> Cada um define como os eleitores sao posicionados inicialmente." />
                    </div>
                    <div flex gap-2>
                        <SelectInput class="w-8/12" v-model="particleLife.selectedSpawnPositionOption" @change="updateParticlePositions" :options="positionOptions"></SelectInput>
                        <div grid grid-cols-2 gap-1 class="w-4/12">
                            <button @click="updateParticlePositions" type="button" title="Recarregar distribuicao" aria-label="Recarregar distribuicao" btn px-3 rounded-full flex justify-center items-center bg="slate-800/80 hover:slate-800/50">
                                <span i-tabler-reload></span>
                            </button>
                            <button @click="updateParticlePositions(true)" type="button" title="Distribuicao aleatoria" aria-label="Distribuicao aleatoria" btn px-3 rounded-full flex justify-center items-center bg="cyan-900/80 hover:cyan-900/50">
                                <span i-game-icons-perspective-dice-six-faces-random></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!--------------------------------------------------------------------------------------------------------->
            <div v-if="openTab === 2">
                <MyPresets :store="particleLife" @loadPreset="loadPreset"></MyPresets>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RULES_OPTIONS } from '~/helpers/utils/rulesGenerator';
import { PALETTE_OPTIONS } from "~/helpers/utils/colorsGenerator";
import { POSITION_OPTIONS } from "~/helpers/utils/positionsGenerator";
import { ELECTORAL_SCENARIOS, type ElectoralScenario, type ElectoralSegment } from "~/constants/electoralScenarios";
import { float32ArrayToHsl } from "~/helpers/utils/colorsGenerator";
import MyPresets from "~/components/particle-life/MyPresets.vue";

function hexToHsl(hex: string): number[] {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    const l = (max + min) / 2
    if (max === min) return [0, 0, l * 100]
    const d = max - min
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    let h = 0
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
    return [h * 360, s * 100, l * 100]
}

function hexToRgbaFlat(hexColors: string[]): Float32Array {
    const arr = new Float32Array(hexColors.length * 4)
    hexColors.forEach((hex, i) => {
        arr[i * 4] = parseInt(hex.slice(1, 3), 16) / 255
        arr[i * 4 + 1] = parseInt(hex.slice(3, 5), 16) / 255
        arr[i * 4 + 2] = parseInt(hex.slice(5, 7), 16) / 255
        arr[i * 4 + 3] = 1.0
    })
    return arr
}

export default defineComponent({
    components: { MyPresets },
    props: {
        store: {
            type: Object,
            required: true,
        }
    },
    setup(props, { emit }) {
        const particleLife = props.store
        const rulesOptions = RULES_OPTIONS
        const paletteOptions = PALETTE_OPTIONS
        const positionOptions = POSITION_OPTIONS
        const electoralScenarios = ELECTORAL_SCENARIOS

        const openTab = ref<number>(1)
        const hasAutoLoaded = ref(false)

        // Auto-load primeiro cenario eleitoral para mostrar legenda de cores
        onMounted(() => {
            if (!hasAutoLoaded.value && ELECTORAL_SCENARIOS.length > 0) {
                hasAutoLoaded.value = true
                setTimeout(() => {
                    // Carregar "RR — Modelo Documental" (index 2) por padrao, ou fallback para o primeiro
                    const docIdx = ELECTORAL_SCENARIOS.findIndex(s => s.meta.name.includes('JE'))
                    loadElectoralScenario(ELECTORAL_SCENARIOS[docIdx >= 0 ? docIdx : 0])
                }, 1500)
            }
        })

        const updateColors = async (useRandomGenerator: boolean | Event = false) => {
            emit('updateColors', useRandomGenerator)
        }
        const updateRulesMatrix = async (useRandomGenerator: boolean | Event = false) => {
            particleLife.segmentNames = []
            particleLife.segmentData = []
            emit('updateRulesMatrix', useRandomGenerator)
        }
        const updateParticlePositions = async (useRandomGenerator: boolean | Event = false) => {
            emit('updateParticlePositions', useRandomGenerator)
        }
        const loadPreset = async (options: { presetRules?: number[][], presetMinRadius?: number[][], presetMaxRadius?: number[][], presetColors?: Float32Array | number[][] }, presetTypeCount: number, matchPresetCount: boolean) => {
            particleLife.segmentNames = []
            particleLife.segmentData = []
            emit('loadPreset', options, presetTypeCount, matchPresetCount)
        }

        const loadElectoralScenario = (scenario: ElectoralScenario) => {
            const isCpu = particleLife.engineType === 'CPU'
            const colors = isCpu
                ? scenario.colors.map(hexToHsl)
                : hexToRgbaFlat(scenario.colors)

            emit('loadPreset', {
                presetRules: scenario.matrices.forces,
                presetMinRadius: scenario.matrices.minRadius,
                presetMaxRadius: scenario.matrices.maxRadius,
                presetColors: colors,
                segmentInfo: scenario.segments.map((s: ElectoralSegment) => ({
                    id: s.id, name: s.name, shortName: s.shortName, color: s.color, proportion: s.proportion
                })),
            }, scenario.settings.species, true)

            // Apply settings after preset load — use setTimeout to ensure loadPreset has fully completed
            setTimeout(() => {
                if (scenario.settings.numParticles) particleLife.numParticles = scenario.settings.numParticles
                if (scenario.settings.frictionFactor != null) particleLife.frictionFactor = scenario.settings.frictionFactor
                if (scenario.settings.forceFactor != null) particleLife.forceFactor = scenario.settings.forceFactor
                particleLife.segmentNames = scenario.segments.map((s: ElectoralSegment) => s.shortName)
                particleLife.segmentData = scenario.segments.map((s: ElectoralSegment) => ({
                    id: s.id, name: s.name, shortName: s.shortName, color: s.color, proportion: s.proportion
                }))
            }, 500)
        }

        return {
            particleLife, openTab, electoralScenarios,
            rulesOptions, paletteOptions, positionOptions,
            updateColors, updateRulesMatrix, updateParticlePositions, loadPreset, loadElectoralScenario
        }
    }
})
</script>

<style scoped>

</style>