<template>
    <transition name="fade" @after-leave="onBootOverlayHidden">
        <div v-if="isBooting" class="fixed inset-0 z-100 bg-gray-950">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="flex flex-col items-center gap-3">
                    <div class="h-10 w-10 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
                    <p class="text-white/80 text-sm">Carregando simulacao...</p>
                </div>
            </div>
        </div>
    </transition>
    <transition name="overlay-animation">
        <div v-if="isOverlayOpen" class="fixed inset-0 z-90 bg-gray-950/40 backdrop-blur-[0.6px]"></div>
    </transition>

    <Modal :modal-active="isModalOpen" @close="closeIntroModal" overlayColor="transparent" modalClass="max-w-[880px]">
        <section class="space-y-4">
            <header>
                <div flex items-center mb-3 class="text-2xl sm:text-[1.75rem] font-bold">
                    <h1 flex items-center>Simulador Eleitoral</h1>
                    <p class="ml-2 px-2 py-1 rounded-lg ring-1 uppercase justify-center font-mono" :class="currentRenderer === 'gpu' ? 'bg-fuchsia-600/20 text-fuchsia-400 ring-fuchsia-500/30' : 'bg-sky-600/20 text-sky-400 ring-sky-500/30'">
                        {{ currentRenderer }}
                    </p>
                </div>
                <h2 class="text-gray-300 mb-2">
                    <strong>Simulador Eleitoral</strong> e um <strong>simulador de particulas</strong> onde <em>regras simples de interacao</em> produzem <strong>comportamentos complexos e emergentes</strong>.
                    Ajuste <strong>forcas</strong> e <strong>condicoes iniciais</strong> para revelar <em>aglomerados estaveis</em>, <em>padroes fluidos</em> e <em>transicoes caoticas</em> em <strong>tempo real</strong>.
                </h2>
                <p class="text-sm text-gray-300">
                    <span class="font-bold text-fuchsia-500">WebGPU</span> oferece <strong>FPS mais alto</strong>, <strong>movimento mais suave</strong> e <strong>mais particulas</strong> quando suportado, enquanto o <span class="font-bold text-sky-500">renderizador CPU</span> permanece <em>compativel</em> em todos os dispositivos.
                </p>
            </header>

            <div v-if="isWebGPUSupported && currentRenderer === 'cpu'" class="rounded-lg ring-1 ring-gray-500/30 bg-slate-700/20 text-gray-50 text-sm p-4">
                <div class="flex items-center rounded-full bg-amber-700/60 ring-1 ring-amber-400/30 w-fit pl-2 pr-3 py-0.5 mb-3">
                    <div i-tabler-alert-hexagon text-lg mr-1></div>
                    <h3 class="font-semibold">WebGPU esta disponivel</h3>
                </div>

                <div flex flex-col gap-2>
                    <p>
                        Este dispositivo suporta <strong>WebGPU</strong>. Voce esta usando o <strong>renderizador CPU</strong>.
                    </p>
                    <div rounded-lg py-2 px-3 mb-1 class="bg-sky-600/10 ring-1 ring-sky-400/20">
                        <div class="text-sky-100 text-sm font-semibold">Modo CPU — Totalmente compativel</div>
                        <p class="text-indigo-50/90 text-sm mt-1">
                            Funciona em todos os dispositivos e suporta a <strong>simulacao 3D</strong> completa. Mude para <strong>WebGPU</strong> para FPS mais alto e mais particulas. Voce pode voltar a qualquer momento.
                        </p>
                    </div>
                    <div class="flex items-center gap-3 mt-1">
                        <button class="px-4 sm:px-8 py-2 rounded-xl bg-gray-50 hover:bg-gray-200 transition-all ring-1 ring-black text-black text-base font-semibold" @click.prevent="selectRenderer('gpu', true)">
                            Mudar para WebGPU <em>(Recomendado)</em>
                        </button>
                        <button class="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700/75 transition-all text-white text-base font-semibold" @click.prevent="closeIntroModal">
                            Manter CPU
                        </button>
                    </div>
                </div>
            </div>
            <div v-else-if="isWebGPUSupported && currentRenderer === 'gpu'" class="rounded-lg border border-green-800 bg-green-900/20 ring-1 ring-green-400/30 text-green-100 text-sm p-4">
                <div class="flex items-center rounded-full bg-green-700/60 ring-1 ring-green-400/30 w-fit pl-2 pr-3 py-0.5 mb-3">
                    <div i-tabler-check text-lg mr-1></div>
                    <h3 class="font-semibold">WebGPU esta disponivel</h3>
                </div>

                <div flex flex-col gap-2>
                    <p>
                        Voce esta usando o <strong>renderizador GPU</strong> para desempenho maximo.
                    </p>
                    <div rounded-lg py-2 px-3 class="bg-emerald-500/10 ring-1 ring-emerald-400/20">
                        <div class="text-emerald-100 text-sm font-semibold">Modo WebGPU — Alto desempenho</div>
                        <p class="text-emerald-50/90 text-sm mt-1">
                            <strong>WebGPU</strong> executa a simulacao na sua placa de video para <strong>FPS mais alto</strong>, <strong>mais particulas</strong> e <em>visuais mais ricos</em>. Tambem reduz a carga da <strong>CPU</strong> para manter a <em>interface</em> responsiva conforme a cena cresce.
                        </p>
                    </div>
                    <p class="text-slate-300/90">
                        Precisa de compatibilidade ou menor consumo de energia?
                        <a href="#" class="underline hover:no-underline" @click.prevent="selectRenderer('cpu', true)">
                            Mudar para CPU
                        </a>
                    </p>
                    <div class="flex items-center gap-3 mt-1">
                        <button class="px-4 sm:px-8 py-2 w-fit rounded-xl bg-gray-50 hover:bg-gray-200 transition-all ring-1 ring-black text-black text-base font-semibold" @click.prevent="closeIntroModal">
                            Iniciar Simulacao
                        </button>
                        <button class="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700/75 ring-1 ring-gray-500/20 transition-all text-white text-base font-semibold" @click.prevent="selectRenderer('cpu', true)">
                            Mudar para CPU
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="rounded-lg bg-amber-900/20 ring-1 ring-amber-400/30 text-amber-100 text-sm p-4">
                <div class="flex items-center rounded-full bg-amber-700/60 ring-1 ring-amber-400/30 w-fit pl-2 pr-3 py-0.5 mb-3">
                    <div i-tabler-alert-triangle text-lg mr-1></div>
                    <h3 class="font-semibold">WebGPU nao esta disponivel</h3>
                </div>
                <div flex flex-col gap-2>
                    <p>
                        <strong>WebGPU</strong> <strong>nao e suportado</strong> neste <em>dispositivo ou navegador</em>. Voce esta usando o <strong>renderizador CPU</strong>.
                    </p>
                    <div rounded-lg py-2 px-3 class="bg-amber-500/10 ring-1 ring-amber-400/20">
                        <div class="text-amber-100 text-sm font-semibold">Modo CPU — Totalmente compativel</div>
                        <p class="text-amber-50/90 text-sm mt-1">
                            Funciona em <strong>todos os dispositivos</strong> e suporta a <strong>simulacao 3D</strong> completa. Ative <strong>WebGPU</strong> para FPS mais alto e mais particulas quando seu dispositivo suportar.
                        </p>
                    </div>
                    <p class="text-stone-300/90">
                        Siga o guia <em>Ativar WebGPU</em> abaixo para configurar seu navegador com FPS mais alto e mais particulas.
                    </p>
                    <button class="mt-1 px-4 sm:px-8 py-2 w-fit rounded-xl bg-gray-50 hover:bg-gray-200 transition-all ring-1 ring-black text-black text-base font-semibold" @click.prevent="closeIntroModal">
                        Iniciar Simulacao
                    </button>
                </div>
            </div>

            <!-- Performance warning even when WebGPU is available -->
            <div v-if="isWebGPUSupported && currentRenderer === 'gpu'" class="mt-3 rounded-lg border border-yellow-700 bg-yellow-900/30 text-yellow-100 p-4">
                <div class="flex items-center gap-2 font-medium text-white/90 mb-2">
                    <div i-tabler-alert-triangle text-lg mr-1></div>
                    <h3>Aviso de desempenho</h3>
                </div>
                <p class="mt-1 text-sm">
                    Se o desempenho estiver abaixo do esperado, seu sistema pode estar usando a GPU integrada ou o perfil grafico errado.
                </p>
                <p class="mt-1 text-sm">
                    No Windows, abra <em>Configuracoes → Sistema → Tela → Graficos</em>, adicione o Chrome ou Edge e defina como <strong>GPU de alto desempenho</strong>.
                    <br>
                    Certifique-se tambem de que a <strong>Aceleracao por Hardware</strong> esta ativada nas configuracoes do navegador, e reinicie-o.
                </p>
                <p class="mt-2 text-xs opacity-90">
                    Dica: Abra <code>chrome://gpu</code> ou <code>edge://gpu</code> e verifique se WebGPU mostra <em>"Hardware accelerated"</em>.
                </p>
            </div>

            <div class="flex flex-col md:flex-row gap-4" v-if="currentRenderer === 'cpu'" :key="currentRenderer">
                <DevicesGpuTips class="w-full md:w-1/2"></DevicesGpuTips>
                <div class="w-full md:w-1/2 flex flex-col sm:flex-row md:flex-col gap-3">
                    <div class="rounded-2xl p-4 bg-gradient-to-br from-amber-500/15 to-rose-500/10 ring-1 ring-amber-400/30 sm:w-1/2 md:w-auto">
                        <div class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-1">
                            <div i-tabler-alert-triangle text-lg mr-1></div>
                            <h3 class="font-semibold">Desempenho ruim?</h3>
                        </div>
                        <p text-sm>Siga as dicas no guia ao lado para seu sistema operacional e reinicie o navegador — pequenas mudancas fazem grande diferenca.</p>
                    </div>
                    <div class="rounded-2xl p-4 bg-gradient-to-br from-sky-500/15 to-indigo-500/10 ring-1 ring-sky-400/30 sm:w-1/2 md:w-auto">
                        <div class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-1">
                            <div i-tabler-info-circle text-lg mr-1></div>
                            <h3 class="font-semibold">Lembretes uteis</h3>
                        </div>
                        <ul class="list-disc list-outside pl-5 text-sm">
                            <li>Mantenha navegador e drivers da GPU atualizados.</li>
                            <li>Conecte notebooks na tomada e evite economia de energia.</li>
                            <li>Feche abas pesadas se notar travamentos.</li>
                        </ul>
                    </div>
                </div>
            </div>

<!--            <div flex justify-end>-->
<!--                <ToggleSwitch label="Don't show this again" colorful-label v-model="modalDismissed" @update:modelValue="toggleModalDismiss" />-->
<!--            </div>-->
        </section>
    </Modal>

    <component v-if="particleLifeComponent" :is="particleLifeComponent" :key="currentRenderer" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DevicesGpuTips from "~/components/particle-life/DevicesGpuTips.vue";
import CpuComp from '~/components/particle-life/ParticleLifeCpu.vue'

export default defineComponent({
    components: {DevicesGpuTips},
    setup() {
        definePageMeta({
            layout: 'life',
            hideNavBar: true
        })
        useSeoMeta({
            title: 'Simulador Eleitoral',
            ogTitle: 'Simulador Eleitoral — INTEIA',
            twitterTitle: 'Simulador Eleitoral — INTEIA',
            description: 'Simulador de dinamica social com particulas. Regras simples de interacao produzem comportamentos complexos e emergentes em tempo real.',
            ogDescription: 'Simulador de dinamica social com particulas. Regras simples de interacao produzem comportamentos complexos e emergentes em tempo real.',
            twitterDescription: 'Simulador de dinamica social com particulas. Regras simples de interacao produzem comportamentos complexos e emergentes em tempo real.',
        })

        const GpuComp = defineAsyncComponent({
            loader: () => import('~/components/particle-life/ParticleLifeGpu.vue'),
            suspensible: false
        })
        const particleLifeComponent = shallowRef<any>(CpuComp)
        const currentRenderer = ref<'gpu' | 'cpu'>('cpu') // track active renderer
        const isWebGPUSupported = ref<boolean>(true)
        const isModalOpen = ref<boolean>(false)
        const isOverlayOpen = ref<boolean>(true)
        const MODAL_DISMISS_KEY = 'particle-life:intro-modal-dismissed' // key stored in localStorage
        const modalDismissed = ref<boolean>(false)
        const isBooting = ref<boolean>(true)

        onMounted(async () => {
            modalDismissed.value = localStorage.getItem(MODAL_DISMISS_KEY) === 'true'
            isOverlayOpen.value = !modalDismissed.value
            try {
                isWebGPUSupported.value = await checkGPUAdapter()
                // isWebGPUSupported.value = false // TEMP DISABLE GPU RENDERER
                await selectRenderer(isWebGPUSupported.value ? 'gpu' : 'cpu')
            } catch (err) {
                console.error('Boot error:', err)
                isWebGPUSupported.value = false
                try { await selectRenderer('cpu') } catch {}
            }
        })
        // -------------------------------------------------------------------------------------------------------------
        const checkGPUAdapter = async (): Promise<boolean> => {
            try {
                if (!('gpu' in navigator) || !navigator.gpu?.requestAdapter) {
                    console.warn('WebGPU not available on this device/browser')
                    return false
                }
                const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' })
                if (!adapter) {
                    console.warn('WebGPU adapter not found')
                    return false
                }
                const device = await adapter.requestDevice()
                if (!device) {
                    console.warn('WebGPU device not found')
                    return false
                }
                console.log('WebGPU is supported')
                return true
            } catch (err) {
                console.warn('WebGPU check failed:', err)
                return false
            }
        }
        const selectRenderer = async (mode: 'gpu' | 'cpu', isSwitching = false) => {
            isBooting.value = true
            try {
                if (isSwitching) {
                    isModalOpen.value = false
                    await new Promise(r => setTimeout(r, 600)) // wait for fade out
                }
                if (mode === 'gpu' && !isWebGPUSupported.value) mode = 'cpu'

                particleLifeComponent.value = mode === 'gpu' ? GpuComp : CpuComp
                currentRenderer.value = mode
                await nextTick()

                await new Promise(r => setTimeout(r, 100)) // wait for component to mount
            } catch (err) {
                console.error('selectRenderer error:', err)
                particleLifeComponent.value = CpuComp
                currentRenderer.value = 'cpu'
            } finally {
                isBooting.value = false
                if (isSwitching) isModalOpen.value = true
            }
        }
        // -------------------------------------------------------------------------------------------------------------
        const onBootOverlayHidden = () => {
            isModalOpen.value = !modalDismissed.value
            isOverlayOpen.value = !modalDismissed.value
        }
        const closeIntroModal = () => {
            isModalOpen.value = false
            isOverlayOpen.value = false
        }
        const toggleModalDismiss = () => {
            if (modalDismissed.value) {
                localStorage.setItem(MODAL_DISMISS_KEY, 'true')
            } else {
                localStorage.removeItem(MODAL_DISMISS_KEY)
            }
        }
        // -------------------------------------------------------------------------------------------------------------
        onUnmounted(() => {
            console.log('Particle Life Unmounted')
        })

        return {
            isModalOpen, isWebGPUSupported, particleLifeComponent, selectRenderer, currentRenderer,
            modalDismissed, toggleModalDismiss,
            isBooting, onBootOverlayHidden, isOverlayOpen, closeIntroModal
        }
    }
})
</script>

<style lang="scss" scoped>
.overlay-animation-enter-active,
.overlay-animation-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.overlay-animation-enter-from,
.overlay-animation-leave-to {
    opacity: 0;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 600ms ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
