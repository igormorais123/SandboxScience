<template>
    <div class="relative w-full h-screen overflow-hidden bg-gray-950 select-none">
        <!-- canvas -->
        <canvas ref="canvasEl" class="absolute inset-0 w-full h-full" @mousemove="onMouseMove" @mouseleave="hover = null"></canvas>

        <!-- legenda no topo -->
        <div class="absolute top-2 left-2 right-2 z-20 flex justify-center pointer-events-none">
            <div class="pointer-events-auto max-w-full">
                <DfLegendBar :segments="scenario.segments" :candidates="activeCandidates"
                             :focus-segment="focusSegment" @focus="focusSegment = $event" />
            </div>
        </div>

        <!-- painel esquerdo: cenarios + eventos -->
        <aside class="absolute left-2 top-14 bottom-2 z-20 w-60 flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin">
            <div class="rounded-xl bg-gray-900/80 ring-1 ring-gray-700/60 p-3 backdrop-blur-sm">
                <div class="flex items-center gap-2">
                    <NuxtLink to="/" class="text-gray-400 hover:text-white text-lg leading-none" title="Voltar">←</NuxtLink>
                    <h2 class="text-sm font-bold text-white">Particle Life DF <span class="text-indigo-400 font-mono text-xs">v2</span></h2>
                </div>
                <p class="text-[10px] text-gray-400 mt-1 leading-tight">
                    Modelo qualitativo de dinamicas politicas — <strong>nao e pesquisa eleitoral</strong>.
                </p>
                <div class="flex items-center gap-1.5 mt-2">
                    <button class="ctrl-btn" :class="running ? 'bg-amber-600/30 ring-amber-400/50' : 'bg-emerald-600/30 ring-emerald-400/50'"
                            @click="running = !running">
                        {{ running ? '⏸ Pausar' : '▶ Rodar' }}
                    </button>
                    <button class="ctrl-btn bg-gray-800/70 ring-gray-600/50" @click="resetScenario()">↺ Reiniciar</button>
                    <button class="ctrl-btn ring-gray-600/50" :class="speed === 2 ? 'bg-indigo-600/40' : 'bg-gray-800/70'"
                            @click="speed = speed === 2 ? 1 : 2" title="Velocidade">
                        {{ speed === 2 ? '2×' : '1×' }}
                    </button>
                </div>
            </div>
            <DfScenarioPicker :scenarios="scenarios" :current-id="scenarioId" @select="selectScenario" />
            <DfEventsPanel v-if="scenario.events.length" :events="scenario.events"
                           :active-ids="activeEventIds" :fired-ids="firedEventIds" @fire="fireEvent" />
        </aside>

        <!-- painel direito: leitura politica -->
        <aside class="absolute right-2 top-14 bottom-2 z-20 w-66 flex flex-col gap-2 overflow-y-auto pl-1 scrollbar-thin">
            <DfScoreboard :scores="metrics?.scores ?? []" :undecided="metrics?.undecided ?? 1" :history="history" />
            <DfMetricsPanel :metrics="metrics" />
            <DfNarratorFeed :messages="narrator.messages" />
        </aside>

        <!-- tooltip de particula -->
        <div v-if="hover" class="absolute z-30 pointer-events-none rounded-lg bg-gray-950/95 ring-1 ring-gray-600 px-2.5 py-1.5 text-xs max-w-56"
             :style="{ left: `${hover.sx + 14}px`, top: `${hover.sy + 10}px` }">
            <div class="font-semibold" :style="{ color: hover.color }">{{ hover.segName }}</div>
            <div class="text-gray-400 text-[10px]">mora em {{ hover.territory }}</div>
            <div class="text-gray-300 text-[10px] mt-0.5">
                lean: <span class="font-mono">{{ hover.lean }}</span> ·
                voto: <span class="font-mono" :style="{ color: hover.voteColor }">{{ hover.vote }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DfLegendBar from '~/components/particle-life-df/DfLegendBar.vue'
import DfScenarioPicker from '~/components/particle-life-df/DfScenarioPicker.vue'
import DfEventsPanel from '~/components/particle-life-df/DfEventsPanel.vue'
import DfScoreboard from '~/components/particle-life-df/DfScoreboard.vue'
import DfMetricsPanel from '~/components/particle-life-df/DfMetricsPanel.vue'
import DfNarratorFeed from '~/components/particle-life-df/DfNarratorFeed.vue'
import { DfEngine, type DfMetrics } from '~/composables/useDfEngine'
import { DfNarrator } from '~/composables/useDfNarrator'
import { DF_SCENARIOS, DF_WORLD_H, DF_WORLD_W, type DfScenario } from '~/constants/dfScenarios'

const scenarios = DF_SCENARIOS
const scenarioId = ref(scenarios[0].meta.id)
const scenario = computed<DfScenario>(() => scenarios.find(s => s.meta.id === scenarioId.value) ?? scenarios[0])

const engine = new DfEngine()
const narrator = reactive(new DfNarrator()) as DfNarrator

const canvasEl = ref<HTMLCanvasElement | null>(null)
const running = ref(true)
const speed = ref<1 | 2>(1)
const focusSegment = ref<number | null>(null)
const metrics = ref<DfMetrics | null>(null)
const history = reactive(new Map<number, { color: string; values: number[] }>())
const activeEventIds = ref<string[]>([])
const firedEventIds = ref<string[]>([])

const activeCandidates = computed(() =>
    engineReady.value ? engine.candidates.filter(c => c.active) : scenario.value.candidates)
const engineReady = ref(false)

// ------------------------------------------------------------------
// ciclo de vida
// ------------------------------------------------------------------

let raf = 0
let bgCanvas: HTMLCanvasElement | null = null
let colorCache = new Map<string, string>()
let segRgb: Array<[number, number, number]> = []
let candRgb = new Map<number, [number, number, number]>()

onMounted(() => {
    resetScenario()
    window.addEventListener('resize', fitCanvas)
    raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', fitCanvas)
})

function selectScenario(id: string) {
    scenarioId.value = id
    resetScenario()
}

function resetScenario() {
    engine.init(scenario.value)
    engine.onEventFired = (e) => {
        narrator.onEvent(engine.frame, e.narration)
        if (!firedEventIds.value.includes(e.id)) firedEventIds.value.push(e.id)
    }
    narrator.reset()
    metrics.value = null
    history.clear()
    firedEventIds.value = []
    activeEventIds.value = []
    focusSegment.value = null
    engineReady.value = true
    prepareColors()
    prepareBackground()
    fitCanvas()
    running.value = true
}

function fireEvent(id: string) {
    engine.fireEvent(id)
}

// ------------------------------------------------------------------
// loop principal
// ------------------------------------------------------------------

function loop() {
    raf = requestAnimationFrame(loop)
    if (running.value) {
        for (let s = 0; s < speed.value; s++) engine.step()
        if (engine.frame % 30 === 0) {
            const m = engine.computeMetrics()
            metrics.value = m
            narrator.observe(m, scenario.value)
            for (const s of m.scores) {
                if (!history.has(s.candidateId)) history.set(s.candidateId, { color: s.color, values: [] })
                const h = history.get(s.candidateId)!
                h.values.push(s.share)
                if (h.values.length > 240) h.values.shift()
            }
            activeEventIds.value = engine.activeEvents.map(a => a.event.id)
        }
    }
    draw()
}

// ------------------------------------------------------------------
// render
// ------------------------------------------------------------------

let viewScale = 1
let viewOx = 0
let viewOy = 0

function fitCanvas() {
    const cv = canvasEl.value
    if (!cv) return
    const dpr = Math.min(1.25, window.devicePixelRatio || 1)
    cv.width = cv.clientWidth * dpr
    cv.height = cv.clientHeight * dpr
    viewScale = Math.min(cv.width / DF_WORLD_W, cv.height / DF_WORLD_H)
    viewOx = (cv.width - DF_WORLD_W * viewScale) / 2
    viewOy = (cv.height - DF_WORLD_H * viewScale) / 2
}

function prepareColors() {
    colorCache = new Map()
    segRgb = scenario.value.segments.map(s => hexToRgb(s.color))
    candRgb = new Map(scenario.value.candidates.map(c => [c.id, hexToRgb(c.color)]))
}

function prepareBackground() {
    bgCanvas = document.createElement('canvas')
    bgCanvas.width = DF_WORLD_W
    bgCanvas.height = DF_WORLD_H
    const ctx = bgCanvas.getContext('2d')!
    ctx.fillStyle = '#0a0e16'
    ctx.fillRect(0, 0, DF_WORLD_W, DF_WORLD_H)
    for (const t of scenario.value.territories) {
        const grad = ctx.createRadialGradient(t.cx, t.cy, t.radius * 0.2, t.cx, t.cy, t.radius)
        grad.addColorStop(0, t.tint)
        grad.addColorStop(1, '#0a0e16')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(t.cx, t.cy, t.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.28)'
        ctx.font = '600 13px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(t.shortName, t.cx, t.cy - t.radius + 16)
    }
}

function draw() {
    const cv = canvasEl.value
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = '#05070c'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.setTransform(viewScale, 0, 0, viewScale, viewOx, viewOy)

    if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0)
    if (!engineReady.value) return

    // particulas agrupadas por cor (quantiza voteStr em 4 niveis para cache de cor)
    const { n, px, py, seg, voteFor, voteStr } = engine
    const focus = focusSegment.value
    const buckets = new Map<string, number[]>()
    for (let i = 0; i < n; i++) {
        const s = seg[i]
        const v = voteFor[i]
        const q = v >= 0 ? Math.min(3, Math.round(voteStr[i] * 3.5)) : 0
        const dim = focus !== null && s !== focus
        const key = `${s}:${v}:${q}:${dim ? 1 : 0}`
        let arr = buckets.get(key)
        if (!arr) { arr = []; buckets.set(key, arr) }
        arr.push(i)
    }
    for (const [key, arr] of buckets) {
        ctx.fillStyle = bucketColor(key)
        for (const i of arr) {
            ctx.fillRect(px[i] - 1.8, py[i] - 1.8, 3.6, 3.6)
        }
    }

    // candidatos: losango + raio de carisma
    ctx.font = '700 15px system-ui, sans-serif'
    ctx.textAlign = 'center'
    for (const c of engine.candidates) {
        if (!c.active) continue
        ctx.strokeStyle = c.color + '33'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.charismaRadius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.save()
        ctx.translate(c.x, c.y)
        ctx.rotate(Math.PI / 4)
        ctx.fillStyle = c.color
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'
        ctx.lineWidth = 1.5
        ctx.fillRect(-7, -7, 14, 14)
        ctx.strokeRect(-7, -7, 14, 14)
        ctx.restore()
        ctx.fillStyle = c.color
        ctx.fillText(c.name, c.x, c.y - 16)
    }
}

function bucketColor(key: string): string {
    let col = colorCache.get(key)
    if (col) return col
    const [sStr, vStr, qStr, dimStr] = key.split(':')
    const s = +sStr, v = +vStr, q = +qStr, dim = dimStr === '1'
    const base = segRgb[s]
    let r = base[0], g = base[1], b = base[2]
    if (v >= 0) {
        const cand = candRgb.get(v)
        if (cand) {
            const k = (q / 3) * 0.55
            r = r * (1 - k) + cand[0] * k
            g = g * (1 - k) + cand[1] * k
            b = b * (1 - k) + cand[2] * k
        }
    }
    const a = dim ? 0.16 : 0.92
    col = `rgba(${r | 0},${g | 0},${b | 0},${a})`
    colorCache.set(key, col)
    return col
}

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

// ------------------------------------------------------------------
// tooltip
// ------------------------------------------------------------------

const hover = ref<null | {
    sx: number; sy: number; segName: string; color: string
    territory: string; lean: string; vote: string; voteColor: string
}>(null)
let hoverThrottle = 0

function onMouseMove(ev: MouseEvent) {
    const now = performance.now()
    if (now - hoverThrottle < 60) return
    hoverThrottle = now
    const cv = canvasEl.value
    if (!cv || !engineReady.value) return
    const rect = cv.getBoundingClientRect()
    const dpr = cv.width / rect.width
    const wx = ((ev.clientX - rect.left) * dpr - viewOx) / viewScale
    const wy = ((ev.clientY - rect.top) * dpr - viewOy) / viewScale
    const { n, px, py } = engine
    let best = -1
    let bestD2 = 100
    for (let i = 0; i < n; i++) {
        const dx = px[i] - wx
        const dy = py[i] - wy
        const d2 = dx * dx + dy * dy
        if (d2 < bestD2) { bestD2 = d2; best = i }
    }
    if (best < 0) { hover.value = null; return }
    const sDef = scenario.value.segments[engine.seg[best]]
    const terr = scenario.value.territories.find(t => t.id === engine.homeTerritory[best])
    const v = engine.voteFor[best]
    const cand = v >= 0 ? scenario.value.candidates.find(c => c.id === v) : null
    const lean = engine.lean[best]
    hover.value = {
        sx: ev.clientX - rect.left,
        sy: ev.clientY - rect.top,
        segName: sDef.name,
        color: sDef.color,
        territory: terr?.name ?? '—',
        lean: `${lean > 0 ? '+' : ''}${lean.toFixed(2)} ${lean > 0.25 ? '(direita)' : lean < -0.25 ? '(esquerda)' : '(centro)'}`,
        vote: cand ? cand.name : sDef.nonVoter ? 'nao vota' : 'indeciso',
        voteColor: cand?.color ?? '#9ca3af',
    }
}
</script>

<style scoped>
.ctrl-btn {
    @apply text-xs font-semibold text-gray-100 rounded-lg px-2.5 py-1.5 ring-1 transition-all hover:brightness-125;
}
.scrollbar-thin::-webkit-scrollbar { width: 5px; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
</style>
