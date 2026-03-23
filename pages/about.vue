<template>
    <div flex-1 flex flex-col items-center>
        <section container class="mb-24 mt-24 sm:mt-36">
            <div flex class="px-0 xl:px-16 2xl:px-24 flex-col sm:flex-row">
                <div class="mr-0 sm:mr-2 mb-4 sm:mb-0 flex justify-center">
                    <div text-5xl font-bold>🧠</div>
                </div>
                <div class="text-center sm:text-start">
                    <h1 text-5xl font-bold text="#c89520">
                        Sobre
                    </h1>
                    <h2 text-2xl font-bold mt-3>INTEIA — Inteligencia Artificial Estrategica</h2>
                    <p mt-5>
                        Este simulador e um motor visual de dinamica social desenvolvido pela INTEIA.
                        Permite modelar interacoes entre grupos, testar cenarios e visualizar comportamento
                        coletivo em tempo real. Baseado no motor de particulas SandboxScience (AGPL-3.0),
                        adaptado para analise eleitoral, corporativa e geopolitica.
                    </p>
                    <p mt-4>
                        A plataforma integra inteligencia artificial para configuracao automatica de cenarios:
                        descreva um caso em linguagem natural e a IA identifica grupos, relacoes, forcas
                        e eventos relevantes. O motor de particulas simula a dinamica e a IA interpreta
                        os resultados em tempo real.
                    </p>
                    <p mt-4>
                        Projeto de codigo aberto licenciado sob
                        <NuxtLink to="https://github.com/igormorais123/SandboxScience/blob/master/LICENSE" target="_blank" class="text-#c89520 hover:underline">GNU Affero General Public License v3.0 (AGPL-3.0)</NuxtLink>.
                        Motor base: SandboxScience por Charly Luzzi (DicSo92).
                        Adaptacao eleitoral: Igor Morais Vasconcelos / INTEIA.
                    </p>
                    <p mt-4>
                        Pesquisador responsavel: <strong class="text-#c89520">Igor Morais Vasconcelos</strong><br>
                        INTEIA — Inteligencia Artificial Estrategica<br>
                        <NuxtLink to="https://inteia.com.br" target="_blank" class="text-#c89520 hover:underline">inteia.com.br</NuxtLink>
                    </p>
                </div>
            </div>
        </section>
        <section mb-12 flex-1 flex flex-col justify-end>
            <div w-full flex>
                <NuxtLink to="https://inteia.com.br" title="INTEIA" aria-label="INTEIA" target="_blank" flex items-center py-0 mx-2>
                    <button type="button" name="INTEIA" aria-label="INTEIA" text="zinc-3 hover:zinc-1" flex>
                        <span i-tabler-brain text-5xl></span>
                    </button>
                </NuxtLink>
                <NuxtLink to="https://github.com/igormorais123/SandboxScience" title="Github" aria-label="Github" target="_blank" flex items-center py-0 mx-2>
                    <button type="button" name="Github" aria-label="Github" text="zinc-3 hover:zinc-1" flex>
                        <span i-carbon-logo-github text-5xl></span>
                    </button>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'life'
})
useSeoMeta({
    title: 'Sobre | INTEIA',
    ogTitle: 'Sobre | INTEIA Simulador',
    twitterTitle: 'Sobre | INTEIA Simulador',
    description: 'INTEIA — Motor visual de dinamica social com inteligencia artificial. Simule eleicoes, conflitos e cenarios sociais. Pesquisador: Igor Morais Vasconcelos.',
    ogDescription: 'INTEIA — Motor visual de dinamica social com inteligencia artificial. Simule eleicoes, conflitos e cenarios sociais.',
    twitterDescription: 'INTEIA — Motor visual de dinamica social com inteligencia artificial.',
})
</script>

<style scoped lang="scss">

</style>
