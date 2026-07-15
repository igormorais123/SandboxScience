<template>
    <section class="rounded-xl bg-gray-900/80 ring-1 ring-gray-700/60 p-3 backdrop-blur-sm">
        <header class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-gray-100">Eventos</h3>
            <span class="text-[10px] uppercase tracking-wide text-gray-500 font-mono">injete um choque</span>
        </header>
        <div class="space-y-1.5">
            <button v-for="e in events" :key="e.id"
                    class="w-full text-left rounded-lg px-2.5 py-1.5 ring-1 transition-all"
                    :class="activeIds.includes(e.id)
                        ? 'bg-amber-500/15 ring-amber-400/50 cursor-default'
                        : firedIds.includes(e.id) && e.durationFrames === 0
                        ? 'bg-gray-800/40 ring-gray-700/40 opacity-50 cursor-default'
                        : 'bg-gray-800/60 ring-gray-700/50 hover:bg-gray-700/60 hover:ring-gray-500/60'"
                    :title="e.description"
                    @click="tryFire(e)">
                <div class="flex items-center gap-1.5">
                    <span class="text-sm leading-none">{{ e.icon }}</span>
                    <span class="text-xs font-semibold text-gray-100">{{ e.name }}</span>
                    <span v-if="activeIds.includes(e.id)" class="ml-auto text-[10px] font-mono text-amber-300 animate-pulse">ativo</span>
                </div>
                <p class="text-[10px] text-gray-400 mt-0.5 leading-tight">{{ e.description }}</p>
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { DfEvent } from '~/constants/dfScenarios'

const props = defineProps<{
    events: DfEvent[]
    activeIds: string[]
    firedIds: string[]
}>()
const emit = defineEmits<{ (e: 'fire', id: string): void }>()

function tryFire(e: DfEvent) {
    if (props.activeIds.includes(e.id)) return
    if (props.firedIds.includes(e.id) && e.durationFrames === 0) return
    emit('fire', e.id)
}
</script>
