<template>
    <div>
        <div flex justify-between items-end mb-3>
            <button type="button" @click="particleLife.isSaveModalOpen = true" btn pl-2 pr-3 rounded-lg flex justify-center items-center bg="cyan-800/80 hover:cyan-800/60">
                <span mr-1 i-tabler-plus></span>
                New Preset
            </button>
            <button type="button" @click="matchPresetCount = !matchPresetCount" text-xs btn px-2 rounded-full flex justify-center items-center
                    :class="!matchPresetCount ? 'bg-red-800/80 hover:bg-red-800/60' : 'bg-slate-700/80 hover:bg-slate-700/50'">
                <span mr-1 :class="!matchPresetCount ? 'i-tabler-lock' : 'i-tabler-lock-open'"></span>
                {{ !matchPresetCount ? 'Keep' : 'Align' }} Species
            </button>
        </div>


        <div v-if="Object.keys(particleLife.savedPresets).length > 0" flex justify-between items-end>
            <span text-sm text-gray-400 underline>Filters:</span>

            <div flex items-center gap-1 text-xs>
                <button type="button" v-for="meta in PRESET_TYPE_META" :key="meta.id"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-500"
                        :class="activeTypeFilters.includes(meta.id) ? meta.color : 'bg-slate-800/60 text-gray-300'"
                        @click="toggleTypeFilter(meta.id)"
                >
                    <span v-if="meta.icon" :class="meta.icon" text-sm></span>
                    <span>{{ meta.label }}</span>
                </button>
            </div>
        </div>

        <hr border-gray-500 my-2>

        <div v-if="Object.keys(particleLife.savedPresets).length === 0" text-sm text-gray-400 italic>
            No presets saved yet.
        </div>
        <div v-else flex flex-col gap-2 overflow-y-auto -mr-1 pr-1 class="thin-scrollbar max-h-[39vh]">
            <div v-for="(preset, id) in filteredPresets" :key="id" @click="loadPreset(id)" p-2 pr-0 rounded-lg flex justify-between items-center cursor-pointer class="bg-slate-700/30 hover:bg-slate-600/30">
                <div flex-1 min-w-0 pr-2>
                    <p font-bold text-slate-200 text-sm truncate capitalize>{{ preset.meta.name }}</p>
                    <p text-xs text-slate-400>{{ getPresetSpeciesCount(preset) }} species</p>
                </div>
                <div flex items-center flex-shrink-0 self-stretch>
                    <div flex gap-1>
                        <span v-for="meta in PRESET_TYPE_META" :key="meta.id"
                              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-500 text-slate-50"
                              :class="preset.types.includes(meta.id) ? meta.color : 'bg-slate-600/40 opacity-60'"
                        >
                            <span v-if="meta.icon" :class="meta.icon" text-sm></span>
                        </span>
                    </div>
                    <div w-px h-5 bg-slate-700 ml-2></div>

                    <VDropdown placement="right-start" popperClass="dropdownPresetOptions" :arrowPadding="10" instant-move @click.stop self-stretch>
                        <div flex items-center pl-2 pr-2.5 h-full text-slate-300 class="hover:text-slate-100">
                            <button type="button" i-tabler-dots-vertical text-center text-lg></button>
                        </div>

                        <template #popper>
                            <div flex flex-col class="bg-slate-800/70 backdrop-blur-sm rounded-md shadow-md">
                                <button type="button" @click="copyToClipboard(getPresetByID(id))" text-sm text-slate-100 class="rounded-t hover:bg-slate-500/50 px-4 py-2">
                                    <span i-tabler-copy></span>
                                    Copy JSON
                                </button>
                                <button type="button" @click="download(getPresetByID(id))" text-sm text-slate-100 class="hover:bg-slate-500/50 px-4 py-2">
                                    Download JSON
                                </button>
                                <hr>
                                <button type="button" @click="removePreset(id)" text-sm text-slate-100 class="rounded-b bg-red-700/30 hover:bg-red-700/60 px-4 py-2">
                                    Delete
                                </button>
                            </div>
                        </template>
                    </VDropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePresetManager } from "~/composables/usePresetManager";
import type { Preset } from "~/composables/usePresetManager";

export default defineComponent({
    name: 'MyPresets',
    props: {
        store: {
            type: Object,
            required: true
        }
    },
    setup(props, {emit}) {
        const particleLife = props.store

        const { success, error } = useToasts()
        const { getSavedPresets, getPresetByID, copyToClipboard, download, removePreset, hexListToFlatRgba, clone2D } = usePresetManager(particleLife)

        const activeTypeFilters = ref<string[]>([])
        const matchPresetCount = ref<boolean>(false)

        const PRESET_TYPE_META: { id: string; label: string; color: string; icon?: string }[] = [
            {id: "forces", label: "Forces", color: "bg-sky-700/60", icon: "i-tabler-arrows-random"},
            {id: "radii", label: "Radii", color: "bg-purple-700/60", icon: "i-tabler-circles"},
            {id: "colors", label: "Colors", color: "bg-amber-700/60", icon: "i-tabler-palette"},
            {id: "settings", label: "Settings", color: "bg-emerald-700/60", icon: "i-tabler-adjustments"},
        ]

        onMounted(() => {
            getSavedPresets()
        })

        const filteredPresets = computed(() => {
            const filters = activeTypeFilters.value
            if (filters.length === 0) return particleLife.savedPresets

            const savedPresets = particleLife.savedPresets as Record<string, Preset>
            const result: Record<string, Preset> = {}
            for (const [id, preset] of Object.entries(savedPresets) as [string, Preset][]) {
                const matchesAll = filters.every(t => preset.types.includes(t))
                if (matchesAll) {
                    result[id] = preset
                }
            }
            return result
        })
        const getPresetSpeciesCount = (preset: Preset): number | undefined => {
            let typeCount: number | undefined = undefined
            if (preset.matrices) {
                if (preset.matrices.forces && preset.matrices.forces.length > 0) {
                    typeCount = preset.matrices.forces.length
                } else if (preset.matrices.minRadius && preset.matrices.minRadius.length > 0) {
                    typeCount = preset.matrices.minRadius.length
                } else if (preset.matrices.maxRadius && preset.matrices.maxRadius.length > 0) {
                    typeCount = preset.matrices.maxRadius.length
                }
            } else if (preset.colors && preset.colors.length > 0) {
                typeCount = preset.colors.length
            }
            return typeCount
        }
        const toggleTypeFilter = (typeId: string) => {
            const idx = activeTypeFilters.value.indexOf(typeId)
            if (idx === -1) {
                activeTypeFilters.value.push(typeId)
            } else {
                activeTypeFilters.value.splice(idx, 1)
            }
        }
        const loadPreset = (id: string) => {
            const preset: Preset | undefined = getPresetByID(id)
            if (!preset) return

            const presetTypeCount = getPresetSpeciesCount(preset) || particleLife.numColors

            const options: {
                presetRules?: number[][],
                presetMinRadius?: number[][],
                presetMaxRadius?: number[][],
                presetColors?: Float32Array
            } = {}
            if (preset.colors) {
                options.presetColors = hexListToFlatRgba(preset.colors)
            }
            if (preset.matrices) {
                if (preset.matrices.forces) {
                    options.presetRules = clone2D(preset.matrices.forces)
                }
                if (preset.matrices.minRadius && preset.matrices.maxRadius) {
                    options.presetMinRadius = clone2D(preset.matrices.minRadius)
                    options.presetMaxRadius = clone2D(preset.matrices.maxRadius)
                }
            }

            emit("loadPreset", options, presetTypeCount, matchPresetCount.value)
            success("Preset loaded.")
        }

        return {
            particleLife, PRESET_TYPE_META,
            activeTypeFilters, filteredPresets, matchPresetCount,
            getPresetSpeciesCount, toggleTypeFilter, getPresetByID,
            copyToClipboard, download, removePreset, loadPreset,
        }
    }
})
</script>

<style>
.dropdownPresetOptions {
    transition: none !important;
    .v-popper__inner {
        background: none !important;
        @apply border-slate-400;
    }
    .v-popper__arrow-outer, .v-popper__arrow-inner {
        @apply border-slate-300;
    }
}
</style>