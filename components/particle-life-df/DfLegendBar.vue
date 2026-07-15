<template>
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 rounded-xl bg-gray-950/85 ring-1 ring-gray-700/60 backdrop-blur-sm">
        <div v-for="s in segments" :key="`s-${s.id}`"
             class="flex items-center gap-1 cursor-pointer select-none transition-opacity"
             :class="focusSegment !== null && focusSegment !== s.id ? 'opacity-35' : ''"
             :title="s.description"
             @click="$emit('focus', focusSegment === s.id ? null : s.id)">
            <span class="inline-block w-2.5 h-2.5 rounded-full ring-1 ring-black/40" :style="{ backgroundColor: s.color }"></span>
            <span class="text-[11px] text-gray-200 whitespace-nowrap">{{ s.shortName }}</span>
        </div>
        <div v-if="candidates.length" class="h-4 w-px bg-gray-700 mx-0.5"></div>
        <div v-for="c in candidates" :key="`c-${c.id}`" class="flex items-center gap-1" :title="c.description">
            <span class="inline-block w-3 h-3 rotate-45 ring-1 ring-white/50" :style="{ backgroundColor: c.color }"></span>
            <span class="text-[11px] font-semibold whitespace-nowrap" :style="{ color: c.color }">{{ c.name }}</span>
        </div>
        <span class="ml-auto text-[10px] text-gray-500 hidden md:inline">clique num segmento para foco</span>
    </div>
</template>

<script setup lang="ts">
import type { DfCandidate, DfSegment } from '~/constants/dfScenarios'

defineProps<{
    segments: DfSegment[]
    candidates: DfCandidate[]
    focusSegment: number | null
}>()
defineEmits<{ (e: 'focus', id: number | null): void }>()
</script>
