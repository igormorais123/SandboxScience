<template>
    <section class="rounded-xl bg-gray-900/80 ring-1 ring-gray-700/60 p-3 backdrop-blur-sm">
        <h3 class="text-sm font-bold text-gray-100 mb-2">Cenarios do DF</h3>
        <div class="space-y-1.5">
            <button v-for="sc in scenarios" :key="sc.meta.id"
                    class="w-full text-left rounded-lg px-2.5 py-2 ring-1 transition-all"
                    :class="sc.meta.id === currentId
                        ? 'bg-indigo-600/25 ring-indigo-400/60'
                        : sc.meta.category === 'DF: Ideias'
                        ? 'bg-fuchsia-900/15 ring-fuchsia-700/30 hover:bg-fuchsia-900/30'
                        : 'bg-gray-800/60 ring-gray-700/50 hover:bg-gray-700/60'"
                    @click="$emit('select', sc.meta.id)">
                <div class="text-xs font-semibold text-gray-100">{{ sc.meta.name }}</div>
                <p class="text-[10px] text-gray-400 mt-0.5 leading-tight">{{ sc.meta.description }}</p>
            </button>
        </div>

        <div v-if="current" class="mt-3 pt-2 border-t border-gray-700/50">
            <h4 class="text-[10px] uppercase tracking-wide text-gray-500 font-mono mb-1">Formas esperadas</h4>
            <ul class="space-y-0.5">
                <li v-for="(f, i) in current.meta.expectedForms" :key="i" class="text-[11px] text-gray-300 flex gap-1.5">
                    <span class="text-indigo-400">◆</span><span>{{ f }}</span>
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { DfScenario } from '~/constants/dfScenarios'

const props = defineProps<{
    scenarios: DfScenario[]
    currentId: string
}>()
defineEmits<{ (e: 'select', id: string): void }>()

const current = computed(() => props.scenarios.find(s => s.meta.id === props.currentId) ?? null)
</script>
