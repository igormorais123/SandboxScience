<template>
    <ClientOnly>
        <ParticleLifeDf />
        <template #fallback>
            <div class="fixed inset-0 bg-gray-950 flex items-center justify-center">
                <div class="flex flex-col items-center gap-3">
                    <div class="h-10 w-10 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
                    <p class="text-white/80 text-sm">Carregando o DF politico...</p>
                </div>
            </div>
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">
import ParticleLifeDf from '~/components/particle-life-df/ParticleLifeDf.vue'

definePageMeta({
    layout: 'life',
    hideNavBar: true,
})
useSeoMeta({
    title: 'Particle Life DF — Simulador Politico do Distrito Federal',
    ogTitle: 'Particle Life DF v2 — INTEIA',
    twitterTitle: 'Particle Life DF v2 — INTEIA',
    description: 'O Distrito Federal como organismo politico: eleitores que moram em regioes, candidatos que disputam voto e opinioes que migram — tudo emergindo de regras simples de particulas.',
    ogDescription: 'O Distrito Federal como organismo politico: territorios, candidatos e conversao de voto emergindo de particulas.',
    twitterDescription: 'O Distrito Federal como organismo politico: territorios, candidatos e conversao de voto emergindo de particulas.',
})
</script>
