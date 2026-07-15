<template>
    <section class="rounded-xl bg-gray-900/80 ring-1 ring-gray-700/60 p-3 backdrop-blur-sm">
        <h3 class="text-sm font-bold text-gray-100 mb-2">Narrador</h3>
        <transition-group name="feed" tag="div" class="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            <div v-for="m in recent" :key="m.id"
                 class="text-xs leading-snug rounded-lg px-2 py-1.5 ring-1"
                 :class="kindClass(m.kind)">
                {{ m.text }}
            </div>
        </transition-group>
        <p v-if="recent.length === 0" class="text-xs text-gray-500">A cena ainda esta se formando...</p>
    </section>
</template>

<script setup lang="ts">
import type { NarrationMessage } from '~/composables/useDfNarrator'

const props = defineProps<{ messages: NarrationMessage[] }>()

const recent = computed(() => [...props.messages].slice(-8).reverse())

function kindClass(kind: NarrationMessage['kind']) {
    switch (kind) {
        case 'evento': return 'bg-amber-900/25 ring-amber-500/30 text-amber-100'
        case 'placar': return 'bg-sky-900/25 ring-sky-500/30 text-sky-100'
        case 'forma': return 'bg-fuchsia-900/20 ring-fuchsia-500/25 text-fuchsia-100'
        default: return 'bg-gray-800/50 ring-gray-600/40 text-gray-300'
    }
}
</script>

<style scoped>
.feed-enter-active { transition: all 0.4s ease; }
.feed-enter-from { opacity: 0; transform: translateY(-6px); }
</style>
