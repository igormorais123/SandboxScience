<template>
    <Modal :modal-active="particleLife.isSaveModalOpen" @close="closeModal" overlayColor="transparent" modalClass="max-w-[880px]">
        <section>
            <header class="-mt-2 sm:-mt-4" mb-3>
                <div flex items-center mb-3 class="text-2xl sm:text-[1.75rem] font-bold">
                    <span i-tabler-sparkles text-amber-600 mr-3></span>
                    <h1 flex items-center>Preset Manager</h1>
                </div>
            </header>

            <div w-full h-px mb-4 class="bg-slate-700/80"></div>

            <div class="flex flex-col md:flex-row gap-2">
                <div class="md:w-6/12 pr-0 md:pr-3">
                    <div flex items-center mb-3>
                        <span i-carbon-save text-2xl mr-2 class="text-slate-300/80"></span>
                        <h2 text-xl pt-px>Save New Preset</h2>
                    </div>
                    <div mb-2>
                        <p class="text-2sm text-gray-200 mb-1">Preset Name</p>
                        <input type="text" maxlength="32" placeholder="Enter a name for this preset..." v-model="name"
                               class="w-full border bg-slate-900/70 border-gray-600 rounded px-3 py-2 text-sm text-slate-200 font-500">
                    </div>
                    <div>
                        <p class="text-2sm text-gray-200 mb-1">Description (Optional)</p>
                        <textarea rows="2" maxlength="180" placeholder="Describe what this preset does..." v-model="description"
                                  class="w-full border bg-slate-900/70 border-gray-600 rounded px-3 py-2 text-sm text-slate-200 font-500 leading-5 resize-y min-h-[1.25rem] max-h-[3.75rem] overflow-auto"></textarea>
                    </div>
                    <hr border-gray-500 my-2>
                    <p text-gray-200 class="-mt-0.5" mb-2>
                        Components to include
                        <TooltipInfo container="#mainContainer" tag="div"
                                     tooltip="Choose what to include in this preset. <br>
                                            Forces: interaction matrix between color pairs. <br>
                                            Radii: min/max radius matrices between color pairs. <br>
                                            Colors: particle colors. <br>
                                            Settings: global simulation parameters.">
                        </TooltipInfo>
                        :
                    </p>
                    <div flex gap-2 flex-wrap>
                        <ToggleChip
                            v-model="forceMatrix"
                            label="Forces"
                            icon="i-tabler-arrows-random text-sky-600/80"
                            activeClass="border-sky-600/80 bg-sky-600/20 text-sky-100"
                            inactiveClass="border-slate-600 bg-slate-800 text-slate-300"
                        />
                        <ToggleChip
                            v-model="radiusMatrices"
                            label="Radii"
                            icon="i-tabler-circles text-purple-600/80"
                            activeClass="border-purple-600/80 bg-purple-700/20 text-purple-100"
                            inactiveClass="border-slate-600 bg-slate-800 text-slate-300"
                        />
                        <ToggleChip
                            v-model="colors"
                            label="Colors"
                            icon="i-tabler-palette text-amber-600/80"
                            activeClass="border-amber-600/80 bg-amber-700/20 text-amber-100"
                            inactiveClass="border-slate-600 bg-slate-800 text-slate-300"
                        />
                        <ToggleChip
                            v-model="generalSettings"
                            label="Settings"
                            icon="i-tabler-settings text-emerald-600/80"
                            activeClass="border-emerald-600/80 bg-emerald-700/20 text-emerald-100"
                            inactiveClass="border-slate-600 bg-slate-800 text-slate-300"
                        />
                    </div>
                    <div flex justify-end items-center gap-3 mt-4>
                        <div flex-1 flex justify-around items-center>
                            <button type="button" @click="copyToClipboard(buildPresetData())" :disabled="!canSave" px-2 flex items-center text="slate-300 hover:slate-300/80 disabled:slate-300/40" class="disabled:cursor-not-allowed">
                                <span i-tabler-copy mr-1></span>
                                Copy
                            </button>
                            <div w-px bg-gray-600 h-6></div>
                            <button type="button" @click="download(buildPresetData())" :disabled="!canSave" px-2 flex items-center text="slate-300 hover:slate-300/80 disabled:slate-300/40" class="disabled:cursor-not-allowed">
                                <span i-tabler-download mr-1></span>
                                Download
                            </button>
                        </div>
                        <button type="button" @click="save(buildPresetData())" :disabled="!canSave" whitespace-nowrap btn px-3 rounded-lg flex justify-center items-center bg="cyan-800/80 hover:cyan-800/50 disabled:cyan-800/30" class="disabled:cursor-not-allowed">
                            <span i-carbon-save mr-1></span>
                            Save Preset
                        </button>
                    </div>
                </div>

                <div class="hidden md:block w-px bg-slate-700/80"></div>

                <div class="md:w-6/12 md:pl-3">
                    <div flex items-center mb-3>
                        <span i-tabler-file-upload text-2xl mr-2 class="text-slate-300/80"></span>
                        <h2 text-xl pt-px>Load From JSON</h2>
                    </div>
                    <div flex flex-col gap-2>
                        <h3 text-slate-400>Upload a .json file exported from Particle Life or paste JSON data directly.</h3>
                        <div flex flex-col gap-1>
                            <div class="flex items-center w-full">
                                <button type="button" @click="fileInput?.click()" w-full btn px-3 rounded-lg flex justify-center items-center border border-slate-600 class="bg-slate-800 hover:bg-slate-700/80 transition text-slate-100">
                                    <span i-tabler-file text-base mr-1></span>
                                    Upload JSON File
                                </button>
                                <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" @change="onJsonFileSelected"/>
                            </div>
                            <div v-if="fileError" px-2 py-1 rounded-lg text-sm text-red-600 border border-red-600 class="bg-red-800/20">
                                {{ fileError }}
                            </div>
                            <div v-if="fileWarning" px-2 py-1 rounded-lg text-sm text-amber-600 border border-amber-600 class="bg-amber-800/20">
                                {{ fileWarning }}
                            </div>
                        </div>
                        <JsonEditor v-model="jsonText" v-model:internalError="jsonSyntaxError" :external-error="jsonBusinessError" />
                        <span v-if="jsonSyntaxError" class="text-[0.75rem]" text-red-600>Invalid JSON syntax : {{ jsonSyntaxError }}</span>
                        <span v-if="jsonBusinessError" class="text-[0.75rem]" text-red-600>Invalid JSON : {{ jsonBusinessError }}</span>
                        <div flex items-center justify-between>
                            <span v-if="!jsonSyntaxError && !jsonBusinessError" class="text-[0.75rem]" text-emerald-500>JSON OK</span>
                            <span v-else></span>

                            <button type="button" @click="loadFromJson" :disabled="hasJsonErrors" whitespace-nowrap btn px-3 rounded-lg flex justify-center items-center text-base
                                    bg="cyan-800/80 hover:cyan-800/50 disabled:cyan-800/30" class="disabled:cursor-not-allowed">
                                <span i-tabler-file-upload mr-1></span>
                                Load Preset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePresetManager } from "~/composables/usePresetManager";
import type { Preset } from "~/composables/usePresetManager";
export default defineComponent({
    name: 'SaveModal',
    props: {
        store: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const particleLife = props.store
        const { copyToClipboard, download, save, flatRgbaToHexList, clone2D, validatePreset } = usePresetManager(particleLife)

        const name = ref<string>("")
        const description = ref<string>("")
        const forceMatrix = ref<boolean>(false)
        const radiusMatrices = ref<boolean>(false)
        const colors = ref<boolean>(false)
        const generalSettings = ref<boolean>(false)

        const canSave = computed(() => {
            return forceMatrix.value || radiusMatrices.value || colors.value || generalSettings.value || name.value.trim().length > 0
        })

        const closeModal = () => {
            particleLife.isSaveModalOpen = false
        }
        // -------------------------------------------------------------------------------------------------------------
        // --- Preset management ---------------------------------------------------------------------------------------
        // -------------------------------------------------------------------------------------------------------------
        const buildPresetData = (): Preset => {
            const presetData: Preset = {
                v: 1,
                meta: {
                    name: name.value.trim() || "Untitled preset",
                    description: description.value.trim() || null
                },
                types: [] as string[] // "settings", "forces", "radii", "colors"
            }

            if (generalSettings.value) {
                presetData.settings = {
                    species: particleLife.numColors,
                    numParticles: particleLife.numParticles,
                    frictionFactor: particleLife.frictionFactor,
                    forceFactor: particleLife.forceFactor,
                }
                presetData.types.push("settings")
            }

            if (forceMatrix.value || radiusMatrices.value) {
                presetData.matrices = { forces: [] }
                // presetData.matrices = { size: particleLife.numColors, forces: [] }

                presetData.matrices.forces = clone2D(particleLife.rulesMatrix)
                presetData.types.push("forces")

                if (radiusMatrices.value) {
                    presetData.matrices.minRadius = clone2D(particleLife.minRadiusMatrix)
                    presetData.matrices.maxRadius = clone2D(particleLife.maxRadiusMatrix)
                    presetData.types.push("radii")
                }
            }

            if (colors.value) {
                presetData.colors = flatRgbaToHexList(particleLife.currentColors)
                presetData.types.push("colors")
            }

            return presetData
        }
        // -------------------------------------------------------------------------------------------------------------
        // --- JSON Editor ---------------------------------------------------------------------------------------------
        // -------------------------------------------------------------------------------------------------------------
        const jsonText = ref<string>("")
        const jsonSyntaxError = ref<string | null>(null)
        const jsonBusinessError = ref<string | null>(null)
        const hasJsonErrors = computed(() => !!jsonSyntaxError.value || !!jsonBusinessError.value)

        onMounted(async () => {
            jsonText.value = JSON.stringify(buildPresetData(), null, 2);
        })
        const loadFromJson = () => {
            if (hasJsonErrors.value) return
            const data = JSON.parse(jsonText.value) as Preset
            save(data)
            closeModal()
        }

        const fileInput = ref<HTMLInputElement | null>(null)
        const fileWarning = ref<string | null>(null)
        const fileError = ref<string | null>(null)

        const onJsonFileSelected = (event: Event) => {
            const target = event.target as HTMLInputElement
            const file = target.files?.[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = () => {
                try {
                    const text = String(reader.result || "")
                    const parsed = JSON.parse(text)

                    jsonSyntaxError.value = null

                    const result = validatePreset(parsed)
                    if (!result.valid) {
                        jsonBusinessError.value = result.errors.join(" || ")
                        fileWarning.value = "The JSON file is invalid for a Particle Life preset."
                    } else {
                        jsonBusinessError.value = null
                        fileWarning.value = null
                    }

                    jsonText.value = text
                    fileError.value = null
                } catch (e: any) {
                    // fileError.value = e?.message ?? "Error parsing JSON file"
                    fileWarning.value = "The JSON file contains errors. Please review and correct them."
                    jsonText.value = String(reader.result || "")
                } finally {
                    target.value = ""
                }
            }
            reader.onerror = () => {
                console.log("Error reading JSON file:", reader.error)
                fileError.value = "Unable to read the JSON file."
                target.value = ""
            }
            reader.readAsText(file, "utf-8")
        }
        // -------------------------------------------------------------------------------------------------------------
        // --- Watchers ------------------------------------------------------------------------------------------------
        // -------------------------------------------------------------------------------------------------------------
        watch(forceMatrix, (newVal) => {
            if (!newVal) radiusMatrices.value = false
        })
        watch(radiusMatrices, (newVal) => {
            if (newVal) forceMatrix.value = true
        })
        watch(hasJsonErrors, (newVal) => {
            if (!newVal) fileWarning.value = null
        })
        watch(jsonText, (newVal) => {
            // Reset des erreurs à chaque modification
            jsonSyntaxError.value = null
            jsonBusinessError.value = null

            // Si champ vide, on ne valide pas
            if (!newVal.trim()) return

            try {
                const parsed = JSON.parse(newVal)
                // JSON syntaxiquement valide, on passe à la validation métier
                const result = validatePreset(parsed)
                if (!result.valid) {
                    jsonBusinessError.value = result.errors.join(" || ")
                } else {
                    jsonBusinessError.value = null
                }
            } catch (e: any) {
                // Erreur de syntaxe JSON
                jsonSyntaxError.value = e?.message ?? "Invalid JSON."
                jsonBusinessError.value = null
            }
        }, { immediate: false })

        return {
            particleLife, closeModal,
            name, description, forceMatrix, radiusMatrices, colors, generalSettings, canSave,
            buildPresetData, copyToClipboard, download, save, loadFromJson, onJsonFileSelected, fileInput,
            jsonText, jsonSyntaxError, jsonBusinessError, hasJsonErrors, fileError, fileWarning
        }
    },
})
</script>


<style scoped>

</style>