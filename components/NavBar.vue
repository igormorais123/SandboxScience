<template>
    <nav flex justify-center py-2 px-3 z-100 fixed top-0 left-0 right-0 class="bg-#090909AA" style="box-shadow: 0 2px 8px 0 rgba(0,0,0,.5); border-bottom: 1px solid rgba(200,149,32,0.3)">
        <div flex justify-between container>
            <div flex items-center>
                <NuxtLink to="/" title="Inicio" aria-label="Inicio" flex items-center>
                    <span class="i-custom:icon text-lg mr-1"></span>
                    <div font-semibold text-lg>INTE<span class="text-[#c89520]">IA</span></div>
                </NuxtLink>
                <div flex ml-8>
                    <Dropdown placement="left">
                        <template v-slot:button>
                            <div flex items-center mx-2>
                                <span class="mr-1" text="zinc-2 hover:zinc-1">Simulacoes</span>
                                <span i-tabler-chevron-down mt-px></span>
                            </div>
                        </template>
                        <template v-slot:content>
                            <NuxtLink to="/particle-life" flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-zinc-700>
                                Simulador Eleitoral
                            </NuxtLink>
                            <NuxtLink to="/game-of-life" flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-zinc-700>
                                Jogo da Vida
                            </NuxtLink>
                            <NuxtLink to="/hash-life" flex w-full justify-between items-center rounded px-2 py-1 my-1 hover:bg-zinc-700>
                                Hash Life
                            </NuxtLink>
                        </template>
                    </Dropdown>
                    <NuxtLink to="/about" mx-2 class="text-zinc-2 hover:text-zinc-1">
                        Sobre
                    </NuxtLink>
                </div>
            </div>
            <div flex items-center>
                <NuxtLink to="https://inteia.com.br" title="INTEIA" aria-label="INTEIA" target="_blank" external class="flex items-center py-1 px-2.5 mr-2 rounded-lg text-xs font-medium transition-all duration-200 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50">
                    <span i-tabler-brain text-sm mr-1></span>
                    inteia.com.br
                </NuxtLink>
                <NuxtLink to="https://github.com/igormorais123/SandboxScience" title="Github" aria-label="Github" target="_blank" external class="flex items-center py-0 mx-1">
                    <button type="button" name="Github" aria-label="Github" text="zinc-3 hover:zinc-1" flex>
                        <span i-carbon-logo-github text-lg m-0.5></span>
                    </button>
                </NuxtLink>
                <NuxtLink to="https://inteia.com.br" title="Site INTEIA" aria-label="Site INTEIA" target="_blank" external class="flex items-center py-0 ml-1.5 mr-1">
                    <button type="button" name="INTEIA" aria-label="Site INTEIA" text="zinc-3 hover:zinc-1" flex>
                        <span i-tabler-world text-lg m-0.5></span>
                    </button>
                </NuxtLink>
                <NuxtLink to="https://x.com" title="Twitter" aria-label="Twitter" target="_blank" external class="flex items-center py-0 mx-1">
                    <button type="button" name="Twitter" aria-label="Twitter" text="zinc-3 hover:zinc-1" flex>
                        <span i-carbon-logo-x text-lg m-0.5></span>
                    </button>
                </NuxtLink>
            </div>
        </div>

    </nav>
</template>

<script setup lang="ts">
const { open: openDonationModal } = useDonationModal()
</script>

<style scoped>

</style>
