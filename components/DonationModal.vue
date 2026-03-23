<template>
    <Modal :modal-active="isOpen" @close="close" overlayColor="bg-gray-950/50 backdrop-blur-sm">
        <section>
            <header class="-mt-2 sm:-mt-4">
                <div flex items-center font-bold class="text-2xl sm:text-[1.75rem]">
                    <span i-tabler-brain class="mr-3 text-3xl text-amber-400"></span>
                    <h1>Sobre o INTEIA Simulador Eleitoral</h1>
                </div>
                <p text-sm text-gray-400 mt-3>
                    Simulador de dinamica social desenvolvido pela
                    <span font-semibold text-amber-300>INTEIA</span> —
                    Inteligencia Artificial Estrategica.
                    Baseado no motor SandboxScience (AGPL-3.0).
                </p>
            </header>

            <hr my-4 class="border-slate-700/60">

            <div flex flex-col gap-3>
                <NuxtLink to="https://inteia.com.br" target="_blank" external no-underline
                   class="group border-slate-600/50 hover:border-amber-500/50 hover:translate-x-1" rounded-xl p-4 border transition-all duration-200
                   bg="slate-800/60 hover:slate-800/90" shadow="hover:lg hover:amber-500/5">
                    <div flex items-center>
                        <div flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center mr-4 bg="amber-500/15 group-hover:amber-500/25" transition-colors duration-200>
                            <span i-tabler-world w-7 h-7 text-amber-400></span>
                        </div>
                        <div flex-1>
                            <div flex items-center justify-between>
                                <h3 font-semibold text-base text-white class="group-hover:text-amber-300" transition-colors duration-200>inteia.com.br</h3>
                                <span i-tabler-external-link text-gray-500 class="group-hover:text-amber-400" w-4.5 h-4.5 transition-colors duration-200></span>
                            </div>
                            <p text-sm text-gray-400 mt-0.5>Conheca a INTEIA e nossos servicos de inteligencia artificial</p>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <hr my-4 class="border-slate-700/60">

            <p text-xs text-center text-gray-500>
                INTEIA — Inteligencia Artificial Estrategica
            </p>
        </section>
    </Modal>
</template>

<script setup lang="ts">
const { isOpen, close } = useDonationModal()
</script>
