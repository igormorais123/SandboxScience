<template>
    <div flex-1 flex flex-col items-center>
        <section container class="mt-24 sm:mt-36 mb-16 sm:mb-32">
            <div flex class="px-0 xl:px-16 2xl:px-24 flex-col sm:flex-row">
                <div class="mr-0 sm:mr-4 md:mr-6 mb-4 sm-mb-0 flex justify-center items-start md-items-center">
                    <div class="i-custom:icon text-7xl sm:text-9xl md:text-[9.5rem] text-[#c89520] drop-shadow-[0_0_20px_rgba(200,149,32,0.4)]"></div>
                </div>
                <div class="text-center sm:text-start">
                    <h1 class="text-4xl sm:text-5xl" font-bold text="#c89520">
                        INTE<span class="text-white">IA</span>
                    </h1>
                    <p class="text-sm sm:text-base mt-1 tracking-wider uppercase font-semibold text-[#c89520]/70">Inteligencia Artificial Estrategica</p>
                    <h2 class="text-lg sm:text-2xl" font-bold mt-3>Simulador universal de sistemas complexos</h2>
                    <p mt-4 class="text-sm sm:text-base">
                        Eleicoes, galaxias, ecossistemas — sistemas complexos emergem de regras simples.
                        Descreva seu caso — a IA configura. O motor simula. Voce decide.
                    </p>
                </div>
            </div>
        </section>
        <section container>
            <div grid gap-4 grid-cols-1 class="sm:grid-cols-3">
                <NuxtLink to="/particle-life" bg="gray-900 hover:gray-800"
                          class="relative overflow-hidden rounded-lg border border-gray-800 shadow-lg p-6 sm:p-5 md:p-6 pt-3 sm:pt-4 md:pt-4">
                    <div flex items-center mb-2>
                        <span class="text-2xl md:text-3xl" font-bold mr-2>⚛</span>
                        <h3 class="text-lg md:text-xl font-semibold">Simulador Eleitoral</h3>
                    </div>
                    <p class="text-sm md:text-base">3 modos de simulacao: <strong>Eleitoral</strong> (segmentos, campanhas), <strong>Galaxias</strong> (gravidade, orbitas) e <strong>Vida Microscopica</strong> (bacterias, predadores). Mesmo motor, mundos diferentes.</p>
                    <div class="absolute right-0 top-0 h-16 w-16">
                        <div class="shadow-lg absolute transform rotate-45 bg-[#c89520] bg-opacity-70 text-center text-sm text-white font-semibold py-1 right-[-38px] top-[13px] w-[128px]">
                            INTEIA
                        </div>
                    </div>
                </NuxtLink>
                <NuxtLink to="/game-of-life" bg="gray-900 hover:gray-800"
                          class="relative overflow-hidden rounded-lg border border-gray-800 shadow-lg p-6 sm:p-5 md:p-6 pt-3 sm:pt-4 md:pt-4">
                    <div flex items-center mb-2>
                        <span class="text-2xl md:text-3xl" font-bold mr-1>🧬</span>
                        <h3 class="text-lg md:text-xl font-semibold">Jogo da Vida</h3>
                    </div>
                    <p class="text-sm md:text-base">Explore os padroes intrigantes de automatos celulares na simulacao classica de John Conway.</p>
                    <div class="absolute right-0 top-0 h-16 w-16">
                        <div class="shadow-lg absolute transform rotate-45 bg-[#e76f51] bg-opacity-70 text-center text-sm text-white font-semibold py-1 right-[-38px] top-[13px] w-[128px]">
                            ALFA
                        </div>
                    </div>
                </NuxtLink>
                <NuxtLink to="/hash-life" bg="gray-900 hover:gray-800"
                          class="relative overflow-hidden rounded-lg border border-gray-800 shadow-lg p-6 sm:p-5 md:p-6 pt-3 sm:pt-4 md:pt-4">
                    <div flex items-center mb-2>
                        <span class="text-2xl md:text-3xl" font-bold mr-2>🚀</span>
                        <h3 class="text-lg md:text-xl font-semibold">Hash Life</h3>
                    </div>
                    <p class="text-sm md:text-base">Versao otimizada do Jogo da Vida, com simulacao mais rapida e eficiente de padroes complexos.</p>
                    <div class="absolute right-0 top-0 h-16 w-16">
                        <div class="shadow-lg absolute transform rotate-45 bg-[#5b2e48] bg-opacity-70 text-center text-sm text-white font-semibold py-1 right-[-38px] top-[13px] w-[128px]">
                            DEV
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </section>
        <section my-12 flex-1 flex flex-col justify-end>
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
</script>

<style scoped lang="scss">

</style>
