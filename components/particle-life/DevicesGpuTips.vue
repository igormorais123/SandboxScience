<template>
    <section>
        <h3 class="text-sm font-semibold text-white/90 mb-3">Ativar WebGPU</h3>
        <div flex mb-2 gap-1>
            <div v-for="value in values" :key="value + '-btn'">
                <input type="radio" name="devices-gpu-tips" :id="value" :value="value" class="peer hidden" v-model="currentValue" />
                <label :for="value" class="block cursor-pointer select-none rounded-full px-2.5 py-1 text-[12px] text-center shrink-0 whitespace-nowrap first-letter:uppercase transition ring-1 text-white bg-white/5 hover:bg-white/10
                    peer-checked:font-bold peer-checked:text-slate-900 peer-checked:bg-white/90 peer-checked:ring-white">
                    {{ value }}
                </label>
            </div>
        </div>
        <div class="rounded-lg ring-1 ring-gray-500/30 bg-slate-700/20 text-gray-50 text-sm p-4">
            <div v-if="currentValue === 'windows'">
                <h3 mb-2>Vamos ativar o WebGPU no seu dispositivo.</h3>
                <ul class="list-disc list-outside pl-5">
                    <li>Abra <strong>Configuracoes → Sistema → Tela → Graficos</strong>, adicione seu navegador (Chrome/Edge) e defina como <strong>GPU de alto desempenho.</strong></li>
                    <li>Atualize para <strong>Chrome/Edge 113+</strong> e ative <strong>Aceleracao por hardware</strong> nas configuracoes do navegador.</li>
                    <li>Atualize os drivers da GPU (NVIDIA/AMD/Intel) e reinicie o navegador.</li>
                </ul>
            </div>
            <div v-else-if="currentValue === 'macOS'">
                <h3 mb-2>Vamos ativar o WebGPU no seu dispositivo.</h3>
                <ul class="list-disc list-outside pl-5">
                    <li>Use <strong>Safari 17+</strong> ou <strong>Chrome 113+</strong> recentes. Certifique-se de que a <strong>aceleracao por hardware</strong> esta ativada (Chrome → Configuracoes → Sistema).</li>
                    <li>Em notebooks: <strong>conecte na tomada</strong> e evite o <strong>Modo Economia de Energia</strong>.</li>
                    <li><strong>Firefox no macOS</strong>: suporte a WebGPU ainda limitado.</li>
                </ul>
            </div>
            <div v-else-if="currentValue === 'mobile'">
                <h3 mb-2>O suporte mobile depende do seu dispositivo e sistema.</h3>
                <ul class="list-disc list-outside pl-5">
                    <li>No <strong>Android</strong>, use a versao mais recente do <strong>Chrome</strong>. Alguns dispositivos podem usar CPU automaticamente.</li>
                    <li>No <strong>iOS/iPadOS</strong>, use a versao mais recente do <strong>Safari</strong>. Se WebGPU nao estiver disponivel, o modo CPU sera usado.</li>
                </ul>
            </div>
            <div v-else-if="currentValue === 'linux'">
                <h3 mb-2>Vamos ativar o WebGPU no seu dispositivo.</h3>
                <ul class="list-disc list-outside pl-5">
                    <li>Use <strong>Chrome/Chromium 113+</strong> com <strong>aceleracao por hardware</strong> ativada.</li>
                    <li>Em <em>chrome://flags</em>: ative <strong>Unsafe WebGPU</strong> (e as vezes <strong>Vulkan</strong>).</li>
                    <li>Prefira <strong>drivers proprietarios da GPU</strong> (NVIDIA/AMD/Intel).</li>
                    <li><strong>Firefox estavel</strong>: suporte a WebGPU praticamente ausente.</li>
                </ul>
            </div>
            <div v-else-if="currentValue === 'verificar'">
                <h3 mb-2>Vamos verificar o WebGPU no seu dispositivo.</h3>
                <ul class="list-disc list-outside pl-5 mb-1">
                    <li>Abra <strong>chrome://gpu (ou edge://gpu)</strong> e procure por <strong>WebGPU</strong> → <em>Hardware accelerated</em>.</li>
                </ul>
                <p>No iOS, essa pagina nao esta disponivel. Use o status e desempenho do app como referencia.</p>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {},
    setup(props, { emit }) {
        const currentValue = ref('windows')
        const values = ['windows', 'macOS', 'mobile', 'linux', 'verificar']

        return { currentValue, values }
    }
})
</script>

<style scoped>

</style>
