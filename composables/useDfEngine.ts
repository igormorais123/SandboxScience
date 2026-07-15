/**
 * Motor CPU do Particle Life DF v2.
 *
 * Tres camadas acopladas (plano: docs-eleitoral/PLANO_PARTICLE_LIFE_DF_V2.md):
 *  1. TERRITORIO  — ancora domiciliar puxa cada particula de volta a sua regiao
 *  2. FISICA      — particle life classico (matriz assimetrica, kernel triangular,
 *                   spatial hash) + candidatos como atratores nomeados
 *  3. OPINIAO     — lean continuo (Deffuant com bounded confidence) + captura de
 *                   voto por afinidade dentro do raio de carisma do candidato
 *
 * Convencao: forca positiva = atracao. Matrizes normalizadas em [-1, 1].
 */

import type { DfCandidate, DfEvent, DfScenario } from '~/constants/dfScenarios'
import { DF_WORLD_H, DF_WORLD_W } from '~/constants/dfScenarios'

export interface DfScore {
  candidateId: number
  name: string
  color: string
  share: number      // 0-1 entre votantes
  count: number
}

export interface DfMetrics {
  frame: number
  scores: DfScore[]
  undecided: number          // share 0-1
  polarization: number       // 0-1 (coeficiente de bimodalidade do lean, reescalado)
  segregation: number        // 0-1 (Herfindahl territorial medio, normalizado)
  temperature: number        // 0-1 (velocidade media normalizada)
  /** id do candidato lider por territorio (-1 = indefinido), indexado por territorio */
  territoryLeaders: number[]
}

interface ActiveEvent {
  event: DfEvent
  firedAt: number
  /** valores raw originais das celulas alteradas (para reverter/interpolar) */
  forceFrom: number[]
  pullFrom: number[]
}

export interface RuntimeCandidate extends DfCandidate {
  active: boolean
  /** alcance atual (eventos podem ampliar) */
  reachNow: number
  /** deriva visual */
  driftPhase: number
  baseX: number
  baseY: number
}

const REPEL_STRENGTH = 1.6
const CAPTURE_RATE = 0.005
const AFFINITY_DECAY = 0.999
const VOTE_THRESHOLD = 0.28
/** peso da "campanha aerea" (TV/radio/redes): canal dominante de captura —
 * faz o placar seguir os pulls calibrados; proximidade fisica e um bonus, nao o motor */
const AIR_CAMPAIGN = 0.4
const CELL = 60

export class DfEngine {
  scenario!: DfScenario
  n = 0
  numSeg = 0

  // estado por particula (SoA)
  px!: Float32Array
  py!: Float32Array
  vx!: Float32Array
  vy!: Float32Array
  seg!: Int16Array
  lean!: Float32Array
  engagement!: Float32Array
  volatility!: Float32Array
  homeX!: Float32Array
  homeY!: Float32Array
  homeTerritory!: Int16Array
  voteFor!: Int8Array
  voteStr!: Float32Array
  affinity!: Float32Array   // n * numCandidates
  /** gosto idiossincratico por candidato (heterogeneidade intra-segmento) */
  taste!: Float32Array     // n * numCandidates

  candidates: RuntimeCandidate[] = []

  // matrizes runtime (base + eventos interpolados)
  private baseForce!: number[][]
  private curForce!: Float32Array   // numSeg*numSeg (flat, atualizada por eventos)
  private minR!: Float32Array
  private maxR!: Float32Array
  private basePull: number[][] = [] // [cand][seg] normalizado
  private curPull: number[][] = []

  // spatial hash
  private gridW = 0
  private gridH = 0
  private cellCount!: Int32Array
  private cellStart!: Int32Array
  private cellEntries!: Int32Array

  frame = 0
  noiseNow = 0
  activeEvents: ActiveEvent[] = []
  /** eventos ja disparados nesta rodada (para autoFire nao repetir) */
  private firedIds = new Set<string>()
  /** callback quando um evento dispara (auto ou manual) — narrador escuta */
  onEventFired: ((e: DfEvent) => void) | null = null

  private rng = mulberry32(20261004)

  init(scenario: DfScenario) {
    this.scenario = scenario
    this.rng = mulberry32(20261004)
    this.numSeg = scenario.segments.length
    this.n = scenario.settings.numParticles
    const n = this.n

    this.px = new Float32Array(n)
    this.py = new Float32Array(n)
    this.vx = new Float32Array(n)
    this.vy = new Float32Array(n)
    this.seg = new Int16Array(n)
    this.lean = new Float32Array(n)
    this.engagement = new Float32Array(n)
    this.volatility = new Float32Array(n)
    this.homeX = new Float32Array(n)
    this.homeY = new Float32Array(n)
    this.homeTerritory = new Int16Array(n)
    this.voteFor = new Int8Array(n).fill(-1)
    this.voteStr = new Float32Array(n)
    this.affinity = new Float32Array(n * Math.max(1, scenario.candidates.length))
    this.taste = new Float32Array(n * Math.max(1, scenario.candidates.length))
    for (let k = 0; k < this.taste.length; k++) this.taste[k] = 0.45 + this.rng() * 1.1

    // matrizes flat
    const s = this.numSeg
    this.baseForce = scenario.matrices.forces.map(r => [...r])
    this.curForce = new Float32Array(s * s)
    this.minR = new Float32Array(s * s)
    this.maxR = new Float32Array(s * s)
    for (let i = 0; i < s; i++) {
      for (let j = 0; j < s; j++) {
        this.curForce[i * s + j] = scenario.matrices.forces[i][j]
        this.minR[i * s + j] = scenario.matrices.minRadius[i][j]
        this.maxR[i * s + j] = scenario.matrices.maxRadius[i][j]
      }
    }

    this.candidates = scenario.candidates.map(c => ({
      ...c,
      pull: [...c.pull],
      active: true,
      reachNow: c.reachRadius,
      driftPhase: this.rng() * Math.PI * 2,
      baseX: c.x,
      baseY: c.y,
    }))
    this.basePull = this.candidates.map(c => c.pull.map(p => p / 100))
    this.curPull = this.basePull.map(r => [...r])

    // distribuir particulas: segmento por proporcao, casa por territorio ponderado
    const territoryById = new Map(scenario.territories.map(t => [t.id, t]))
    let idx = 0
    for (let si = 0; si < scenario.segments.length; si++) {
      const segDef = scenario.segments[si]
      const count = si === scenario.segments.length - 1
        ? n - idx
        : Math.round(segDef.proportion * n)
      for (let k = 0; k < count && idx < n; k++, idx++) {
        this.seg[idx] = si
        // sorteia territorio-casa
        let r = this.rng()
        let tid = segDef.homes[0][0]
        for (const [t, w] of segDef.homes) {
          if (r < w) { tid = t; break }
          r -= w
        }
        const terr = territoryById.get(tid) ?? scenario.territories[0]
        // ponto gaussiano dentro do territorio
        const ang = this.rng() * Math.PI * 2
        const rad = Math.sqrt(this.rng()) * terr.radius * 0.92
        const hx = clamp(terr.cx + Math.cos(ang) * rad, 20, DF_WORLD_W - 20)
        const hy = clamp(terr.cy + Math.sin(ang) * rad, 20, DF_WORLD_H - 20)
        this.homeX[idx] = hx
        this.homeY[idx] = hy
        this.homeTerritory[idx] = tid
        this.px[idx] = hx + (this.rng() - 0.5) * 30
        this.py[idx] = hy + (this.rng() - 0.5) * 30
        this.vx[idx] = 0
        this.vy[idx] = 0
        this.lean[idx] = clamp(segDef.lean + gauss(this.rng) * 0.25, -1, 1)
        this.engagement[idx] = clamp(segDef.engagement + gauss(this.rng) * 0.15, 0.05, 1)
        this.volatility[idx] = clamp(segDef.volatility + gauss(this.rng) * 0.1, 0, 1)
      }
    }

    // spatial grid
    this.gridW = Math.ceil(DF_WORLD_W / CELL)
    this.gridH = Math.ceil(DF_WORLD_H / CELL)
    this.cellCount = new Int32Array(this.gridW * this.gridH)
    this.cellStart = new Int32Array(this.gridW * this.gridH + 1)
    this.cellEntries = new Int32Array(n)

    this.frame = 0
    this.activeEvents = []
    this.firedIds.clear()
    this.noiseNow = scenario.settings.noise
  }

  // ----------------------------------------------------------------
  // Eventos
  // ----------------------------------------------------------------

  fireEvent(eventId: string) {
    const event = this.scenario.events.find(e => e.id === eventId)
    if (!event || this.activeEvents.some(a => a.event.id === eventId)) return
    const forceFrom = (event.effect.forceDelta ?? []).map(([i, j]) => this.baseForce[i][j])
    const pullFrom = (event.effect.pullDelta ?? []).map(([c, sg]) => this.basePull[c]?.[sg] ?? 0)
    this.activeEvents.push({ event, firedAt: this.frame, forceFrom, pullFrom })
    this.firedIds.add(eventId)
    if (event.effect.removeThird) this.removeThirdCandidate()
    this.onEventFired?.(event)
  }

  private removeThirdCandidate() {
    const act = this.candidates.filter(c => c.active)
    if (act.length < 3) return
    const counts = act.map(c => ({ c, n: 0 }))
    for (let i = 0; i < this.n; i++) {
      const v = this.voteFor[i]
      const e = counts.find(x => x.c.id === v)
      if (e) e.n++
    }
    counts.sort((a, b) => b.n - a.n)
    const third = counts[counts.length - 1].c
    third.active = false
    // voto orfao: libera afinidade e voto (a fisica redistribui)
    const ci = this.candidates.indexOf(third)
    for (let i = 0; i < this.n; i++) {
      this.affinity[i * this.candidates.length + ci] = 0
      if (this.voteFor[i] === third.id) this.voteFor[i] = -1
    }
  }

  /** progresso 0-1 do evento com rampa de entrada e saida */
  private eventRamp(a: ActiveEvent): number {
    const t = this.frame - a.firedAt
    const { durationFrames, rampFrames } = a.event
    const up = Math.min(1, t / Math.max(1, rampFrames))
    if (durationFrames === 0) return up   // permanente
    if (t >= durationFrames) return 0
    const down = Math.min(1, (durationFrames - t) / Math.max(1, rampFrames))
    return Math.min(up, down)
  }

  private updateEventInterpolation() {
    const s = this.numSeg
    // remove eventos temporais encerrados (a base e restaurada no reset abaixo)
    this.activeEvents = this.activeEvents.filter(a =>
      a.event.durationFrames === 0 || (this.frame - a.firedAt) < a.event.durationFrames)

    // reconstroi curForce/curPull/noise a partir da base + eventos ativos
    for (let i = 0; i < s; i++)
      for (let j = 0; j < s; j++)
        this.curForce[i * s + j] = this.baseForce[i][j]
    for (let c = 0; c < this.curPull.length; c++)
      for (let g = 0; g < s; g++)
        this.curPull[c][g] = this.basePull[c][g]
    for (const c of this.candidates) c.reachNow = c.reachRadius
    let noise = this.scenario.settings.noise

    for (const a of this.activeEvents) {
      const k = smoothstep(this.eventRamp(a))
      const fd = a.event.effect.forceDelta ?? []
      for (let d = 0; d < fd.length; d++) {
        const [i, j, target] = fd[d]
        this.curForce[i * s + j] = lerp(a.forceFrom[d], target / 100, k)
      }
      const pd = a.event.effect.pullDelta ?? []
      for (let d = 0; d < pd.length; d++) {
        const [c, g, target] = pd[d]
        if (this.curPull[c]) this.curPull[c][g] = lerp(a.pullFrom[d], target / 100, k)
      }
      if (a.event.effect.noiseBoost) noise += a.event.effect.noiseBoost * k
      for (const [c, factor] of a.event.effect.reachBoost ?? []) {
        const cand = this.candidates[c]
        if (cand) cand.reachNow = cand.reachRadius * lerp(1, factor, k)
      }
    }
    this.noiseNow = noise

    // eventos roteirizados
    for (const e of this.scenario.events) {
      if (e.autoFireAtFrame !== undefined && this.frame >= e.autoFireAtFrame && !this.firedIds.has(e.id)) {
        this.fireEvent(e.id)
      }
    }
  }

  // ----------------------------------------------------------------
  // Passo de simulacao
  // ----------------------------------------------------------------

  step() {
    this.frame++
    this.updateEventInterpolation()
    this.rebuildGrid()
    this.applyForces()
    this.applyCandidates()
    this.integrate()
    if (this.frame % this.scenario.settings.opinion.everyNFrames === 0) this.opinionStep()
  }

  private rebuildGrid() {
    const { gridW, gridH, cellCount, cellStart, cellEntries, n } = this
    cellCount.fill(0)
    for (let i = 0; i < n; i++) {
      const cx = clampInt(this.px[i] / CELL, 0, gridW - 1)
      const cy = clampInt(this.py[i] / CELL, 0, gridH - 1)
      cellCount[cy * gridW + cx]++
    }
    let acc = 0
    for (let c = 0; c < gridW * gridH; c++) {
      cellStart[c] = acc
      acc += cellCount[c]
    }
    cellStart[gridW * gridH] = acc
    const cursor = new Int32Array(cellStart.subarray(0, gridW * gridH))
    for (let i = 0; i < n; i++) {
      const cx = clampInt(this.px[i] / CELL, 0, gridW - 1)
      const cy = clampInt(this.py[i] / CELL, 0, gridH - 1)
      const c = cy * gridW + cx
      cellEntries[cursor[c]++] = i
    }
  }

  private applyForces() {
    const { n, gridW, gridH, cellStart, cellEntries, curForce, minR, maxR, numSeg } = this
    const px = this.px, py = this.py, vx = this.vx, vy = this.vy, seg = this.seg
    const ff = this.scenario.settings.forceFactor
    const hs = this.scenario.settings.homeStrength

    for (let i = 0; i < n; i++) {
      const xi = px[i], yi = py[i]
      const ti = seg[i]
      let fx = 0, fy = 0
      const cx = clampInt(xi / CELL, 0, gridW - 1)
      const cy = clampInt(yi / CELL, 0, gridH - 1)
      const x0 = Math.max(0, cx - 2), x1 = Math.min(gridW - 1, cx + 2)
      const y0 = Math.max(0, cy - 2), y1 = Math.min(gridH - 1, cy + 2)

      for (let gy = y0; gy <= y1; gy++) {
        for (let gx = x0; gx <= x1; gx++) {
          const c = gy * gridW + gx
          const start = cellStart[c], end = cellStart[c + 1]
          const count = end - start
          // celulas densas: amostragem com passo + reescala da forca (estatisticamente
          // equivalente, corta o custo O(n*vizinhos) nos aglomerados)
          const stride = count > 48 ? 3 : count > 24 ? 2 : 1
          const scale = stride
          const offset = stride > 1 ? (i + this.frame) % stride : 0
          for (let e = start + offset; e < end; e += stride) {
            const j = cellEntries[e]
            if (j === i) continue
            const dx = px[j] - xi
            const dy = py[j] - yi
            const d2 = dx * dx + dy * dy
            if (d2 < 0.01) continue
            const tj = seg[j]
            const mIdx = ti * numSeg + tj
            const mx = maxR[mIdx]
            if (d2 > mx * mx) continue
            const d = Math.sqrt(d2)
            const mn = minR[mIdx]
            let f: number
            if (d < mn) {
              f = (d / mn - 1) * REPEL_STRENGTH   // repulsao universal de curto alcance
            } else {
              const mid = (mn + mx) * 0.5
              f = curForce[mIdx] * (1 - Math.abs(d - mid) / (mid - mn))
            }
            const inv = f * scale / d
            fx += dx * inv
            fy += dy * inv
          }
        }
      }

      // ancora territorial (camada 1): retorno fraco a casa
      fx += (this.homeX[i] - xi) * hs / ff
      fy += (this.homeY[i] - yi) * hs / ff

      vx[i] += fx * ff
      vy[i] += fy * ff
    }
  }

  private applyCandidates() {
    const C = this.candidates.length
    if (C === 0) return
    const { n, px, py, vx, vy, seg, lean, affinity, volatility } = this
    const ff = this.scenario.settings.forceFactor
    const t = this.frame * 0.01

    // deriva suave dos candidatos em torno da base (campanha circulando)
    for (const c of this.candidates) {
      if (!c.active) continue
      c.x = c.baseX + Math.cos(t + c.driftPhase) * 22
      c.y = c.baseY + Math.sin(t * 0.8 + c.driftPhase) * 16
    }

    for (let i = 0; i < n; i++) {
      const ti = seg[i]
      const nonVoter = this.scenario.segments[ti].nonVoter
      let bestAff = 0
      let bestC = -1
      for (let ci = 0; ci < C; ci++) {
        const cand = this.candidates[ci]
        const aIdx = i * C + ci
        if (!cand.active) { affinity[aIdx] *= 0.97; continue }
        const pull = this.curPull[ci][ti]
        const dx = cand.x - px[i]
        const dy = cand.y - py[i]
        const d2 = dx * dx + dy * dy
        const reach = cand.reachNow
        // peso de captura: 1 no nucleo de carisma, decai ate a borda do alcance,
        // e nunca zera — "campanha aerea" alcanca a cidade toda (TV/radio/redes)
        let captureW = AIR_CAMPAIGN
        if (d2 < reach * reach && pull !== 0) {
          const d = Math.sqrt(d2)
          // atracao fisica triangular (pico no meio do alcance), escalada pela maquina
          const mid = reach * 0.45
          const shape = d < mid ? d / mid : Math.max(0, 1 - (d - mid) / (reach - mid))
          const f = pull * shape * (0.5 + cand.machine * 0.5) * 0.9
          const inv = f / Math.max(8, d)
          vx[i] += dx * inv * ff
          vy[i] += dy * inv * ff
          captureW = d < cand.charismaRadius
            ? 1
            : Math.max(AIR_CAMPAIGN, 1 - 0.8 * (d - cand.charismaRadius) / Math.max(1, reach - cand.charismaRadius))
        }
        // captura de voto (camada 3): gosto idiossincratico dispersa o segmento
        if (!nonVoter && pull > 0) {
          const leanFit = 1 - Math.abs(lean[i] - cand.lean) * 0.5
          affinity[aIdx] += CAPTURE_RATE * captureW * this.taste[aIdx] * (0.25 + volatility[i]) * pull * leanFit * (0.8 + cand.machine * 0.2)
          if (affinity[aIdx] > 1.6) affinity[aIdx] = 1.6
        }
        affinity[aIdx] *= AFFINITY_DECAY
        if (affinity[aIdx] > bestAff) {
          bestAff = affinity[aIdx]
          bestC = ci
        }
      }
      // decisao de voto + transicao suave de cor (voteStr)
      // limiar por particula: engajado decide cedo, desligado decide tarde (indecisos estruturais)
      const threshold = VOTE_THRESHOLD + 0.55 * (1 - this.engagement[i])
      const target = (!nonVoter && bestAff > threshold) ? this.candidates[bestC].id : -1
      this.voteFor[i] = target as any
      const targetStr = target >= 0 ? Math.min(1, bestAff) : 0
      this.voteStr[i] += (targetStr - this.voteStr[i]) * 0.04
      // voto puxa o lean levemente para o candidato (reforco)
      if (target >= 0) {
        const cand = this.candidates.find(c => c.id === target)!
        lean[i] += (cand.lean - lean[i]) * 0.0015 * volatility[i]
      }
    }
  }

  private integrate() {
    const { n, px, py, vx, vy } = this
    const friction = this.scenario.settings.frictionFactor
    const keep = 1 - friction
    const noise = this.noiseNow
    const margin = 12

    for (let i = 0; i < n; i++) {
      // ruido termico: eleitor desengajado e browniano
      const shake = noise * (1.2 - this.engagement[i])
      vx[i] = vx[i] * keep + (this.rng() - 0.5) * shake
      vy[i] = vy[i] * keep + (this.rng() - 0.5) * shake
      px[i] += vx[i]
      py[i] += vy[i]
      // paredes com repique suave
      if (px[i] < margin) { px[i] = margin; vx[i] *= -0.5 }
      else if (px[i] > DF_WORLD_W - margin) { px[i] = DF_WORLD_W - margin; vx[i] *= -0.5 }
      if (py[i] < margin) { py[i] = margin; vy[i] *= -0.5 }
      else if (py[i] > DF_WORLD_H - margin) { py[i] = DF_WORLD_H - margin; vy[i] *= -0.5 }
    }
  }

  /** Deffuant com bounded confidence sobre vizinhos espaciais */
  private opinionStep() {
    const { n, lean, volatility, gridW, gridH, cellStart, cellEntries } = this
    const { mu, epsilon } = this.scenario.settings.opinion
    for (let i = 0; i < n; i++) {
      const cx = clampInt(this.px[i] / CELL, 0, gridW - 1)
      const cy = clampInt(this.py[i] / CELL, 0, gridH - 1)
      const c = cy * gridW + cx
      const start = cellStart[c], end = cellStart[c + 1]
      const size = end - start
      if (size < 2) continue
      const j = cellEntries[start + ((this.rng() * size) | 0)]
      if (j === i) continue
      const diff = lean[j] - lean[i]
      if (Math.abs(diff) < epsilon) {
        lean[i] = clamp(lean[i] + mu * volatility[i] * diff, -1, 1)
      }
    }
  }

  // ----------------------------------------------------------------
  // Metricas (camada de leitura politica)
  // ----------------------------------------------------------------

  computeMetrics(): DfMetrics {
    const { n, voteFor, seg, lean } = this
    const segs = this.scenario.segments

    // placar emergente
    let voters = 0
    let undecidedCount = 0
    const counts = new Map<number, number>()
    for (const c of this.candidates) counts.set(c.id, 0)
    for (let i = 0; i < n; i++) {
      if (segs[seg[i]].nonVoter) continue
      voters++
      const v = voteFor[i]
      if (v < 0) undecidedCount++
      else counts.set(v, (counts.get(v) ?? 0) + 1)
    }
    const scores: DfScore[] = this.candidates
      .filter(c => c.active)
      .map(c => ({
        candidateId: c.id,
        name: c.name,
        color: c.color,
        count: counts.get(c.id) ?? 0,
        share: voters > 0 ? (counts.get(c.id) ?? 0) / voters : 0,
      }))
      .sort((a, b) => b.share - a.share)

    // polarizacao: coeficiente de bimodalidade do lean (amostra)
    const sample = Math.min(n, 1200)
    const stride = Math.max(1, Math.floor(n / sample))
    let m = 0, count = 0
    for (let i = 0; i < n; i += stride) { m += lean[i]; count++ }
    m /= count
    let m2 = 0, m3 = 0, m4 = 0
    for (let i = 0; i < n; i += stride) {
      const d = lean[i] - m
      m2 += d * d; m3 += d * d * d; m4 += d * d * d * d
    }
    m2 /= count; m3 /= count; m4 /= count
    let polarization = 0
    if (m2 > 1e-6) {
      const skew = m3 / Math.pow(m2, 1.5)
      const kurt = m4 / (m2 * m2)
      const bmc = (skew * skew + 1) / Math.max(1e-6, kurt + (3 * (count - 1) ** 2) / ((count - 2) * (count - 3)))
      // BMC: ~0.33 uniforme-unimodal, >0.555 bimodal → reescala para 0-1
      polarization = clamp((bmc - 0.33) / 0.45, 0, 1)
    }

    // segregacao territorial: Herfindahl de segmento por celula de leitura (grade grossa)
    const RX = 10, RY = 7
    const cellSeg: number[][] = Array.from({ length: RX * RY }, () => new Array(this.numSeg).fill(0))
    const cellTotal = new Array(RX * RY).fill(0)
    for (let i = 0; i < n; i++) {
      const cx = clampInt(this.px[i] / (DF_WORLD_W / RX), 0, RX - 1)
      const cy = clampInt(this.py[i] / (DF_WORLD_H / RY), 0, RY - 1)
      const c = cy * RX + cx
      cellSeg[c][seg[i]]++
      cellTotal[c]++
    }
    let hSum = 0, hW = 0
    for (let c = 0; c < RX * RY; c++) {
      if (cellTotal[c] < 8) continue
      let h = 0
      for (let g = 0; g < this.numSeg; g++) {
        const p = cellSeg[c][g] / cellTotal[c]
        h += p * p
      }
      hSum += h * cellTotal[c]
      hW += cellTotal[c]
    }
    const hMean = hW > 0 ? hSum / hW : 1 / this.numSeg
    const segregation = clamp((hMean - 1 / this.numSeg) / (1 - 1 / this.numSeg), 0, 1)

    // temperatura politica: velocidade media
    let vSum = 0
    for (let i = 0; i < n; i += stride) vSum += Math.hypot(this.vx[i], this.vy[i])
    const temperature = clamp(vSum / count / 2.2, 0, 1)

    // lider por territorio (para o narrador)
    const terrs = this.scenario.territories
    const terrCounts = terrs.map(() => new Map<number, number>())
    for (let i = 0; i < n; i++) {
      const v = voteFor[i]
      if (v < 0) continue
      const tIdx = terrs.findIndex(t => t.id === this.homeTerritory[i])
      if (tIdx >= 0) terrCounts[tIdx].set(v, (terrCounts[tIdx].get(v) ?? 0) + 1)
    }
    const territoryLeaders = terrCounts.map((m2c) => {
      let best = -1, bestN = 0
      for (const [cid, cnt] of m2c) if (cnt > bestN) { best = cid; bestN = cnt }
      return best
    })

    return {
      frame: this.frame,
      scores,
      undecided: voters > 0 ? undecidedCount / voters : 1,
      polarization,
      segregation,
      temperature,
      territoryLeaders,
    }
  }
}

// ----------------------------------------------------------------
// utils
// ----------------------------------------------------------------

function clamp(v: number, a: number, b: number) { return v < a ? a : v > b ? b : v }
function clampInt(v: number, a: number, b: number) { const i = v | 0; return i < a ? a : i > b ? b : i }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function smoothstep(t: number) { return t * t * (3 - 2 * t) }

/** PRNG deterministico (reprodutibilidade dos cenarios) */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** gaussiana aproximada (soma de 3 uniformes) */
function gauss(rng: () => number) {
  return (rng() + rng() + rng() - 1.5) / 1.5
}

export function useDfEngine() {
  return new DfEngine()
}
