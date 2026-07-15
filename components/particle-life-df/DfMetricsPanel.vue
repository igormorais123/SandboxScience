<template>
    <section class="rounded-xl bg-gray-900/80 ring-1 ring-gray-700/60 p-3 backdrop-blur-sm">
        <h3 class="text-sm font-bold text-gray-100 mb-2">Leitura politica</h3>
        <div class="space-y-2">
            <div v-for="g in gauges" :key="g.label">
                <div class="flex items-center justify-between text-xs mb-0.5">
                    <span class="text-gray-300">{{ g.label }}</span>
                    <span class="font-mono" :style="{ color: g.color }">{{ g.text }}</span>
                </div>
                <div class="h-1.5 rounded bg-gray-800 overflow-hidden">
                    <div class="h-full rounded transition-all duration-700"
                         :style="{ width: `${g.value * 100}%`, backgroundColor: g.color }"></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { DfMetrics } from '~/composables/useDfEngine'

const props = defineProps<{ metrics: DfMetrics | null }>()

const gauges = computed(() => {
    const m = props.metrics
    const pol = m?.polarization ?? 0
    const seg = m?.segregation ?? 0
    const temp = m?.temperature ?? 0
    return [
        {
            label: 'Polarizacao',
            value: pol,
            color: pol > 0.66 ? '#ff5555' : pol > 0.33 ? '#ffaa33' : '#66cc88',
            text: pol > 0.66 ? 'cidade rachada' : pol > 0.33 ? 'dois campos' : 'misturada',
        },
        {
            label: 'Segregacao territorial',
            value: seg,
            color: seg > 0.55 ? '#ff5555' : seg > 0.3 ? '#ffaa33' : '#66cc88',
            text: seg > 0.55 ? 'bolhas' : seg > 0.3 ? 'aglomerados' : 'integrada',
        },
        {
            label: 'Temperatura da campanha',
            value: temp,
            color: temp > 0.7 ? '#ff7733' : temp > 0.25 ? '#ffdd55' : '#88aacc',
            text: temp > 0.7 ? 'fervendo' : temp > 0.25 ? 'aquecida' : 'fria',
        },
    ]
})
</script>
