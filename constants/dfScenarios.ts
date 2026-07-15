/**
 * Cenarios politicos do Distrito Federal — Particle Life DF v2.
 *
 * Plano: docs-eleitoral/PLANO_PARTICLE_LIFE_DF_V2.md
 * Convencao de sinais (igual ao motor RR): POSITIVO = ATRACAO, NEGATIVO = REPULSAO.
 * Escala raw [-100, +100], normalizada para [-1, +1].
 * FORCE[i][j] = forca que o segmento i sente em direcao ao segmento j (linha = quem sente).
 *
 * Calibracao documental (proxies V/G/E/S/I adaptados do RR):
 *  - TSE 2022: Bolsonaro 58,81% no DF (1.041.331 votos); Lula venceu apenas na Asa Norte.
 *  - Censo 2022 / estimativas 2026: ~30-35% evangelicos (maior proporcao entre capitais).
 *  - PDAD/CODEPLAN: renda Lago Sul ~16x Estrutural; Gini 0,468; Ceilandia maior colegio (3 zonas).
 *  - FCDF: ~40% do orcamento do GDF (R$ 28,4 bi / R$ 74,4 bi em 2026) — funcionalismo e classe politica.
 *  - Pesquisas GDF jul/2026 (Exata OP DF-02994/2026): Celina 23,4%, Arruda 17,3%, Grass 15,8%.
 *
 * Gramatica visual (secao 2.5 do plano): cada matriz e calibrada para produzir formas
 * nomeaveis — nucleo, membrana, ponte, ilha, orbita, perseguicao, nuvem, mare de migracao.
 */

// ============================================================
// Tipos v2
// ============================================================

export interface DfTerritory {
  id: number
  name: string
  shortName: string
  /** centro no mundo (WORLD_W x WORLD_H) */
  cx: number
  cy: number
  radius: number
  /** tom de fundo (renda/perfil), bem escuro para nao competir com particulas */
  tint: string
  description: string
}

export interface DfSegment {
  id: number
  name: string
  shortName: string
  description: string
  proportion: number      // 0-1, soma ~1.0
  color: string
  /** disposicao a trocar de voto: 0 = rocha (evangelico), 1 = totalmente volatil (jovem) */
  volatility: number
  /** lean politico medio inicial: -1 esquerda ... +1 direita */
  lean: number
  /** engajamento medio: 0 browniano/desligado ... 1 militante/balistico */
  engagement: number
  /** onde mora: pares [territoryId, peso] */
  homes: Array<[number, number]>
  /** true = nao vota no DF (Entorno/RIDE): fica fora do placar */
  nonVoter?: boolean
}

export interface DfCandidate {
  id: number
  name: string
  party: string
  color: string
  /** posicao base no mundo (deriva levemente em torno dela) */
  x: number
  y: number
  /** raio de captura de voto (particula dentro dele acumula afinidade) */
  charismaRadius: number
  /** raio de atracao fisica (maior que o de captura) */
  reachRadius: number
  /** maquina/orcamento: multiplica alcance e velocidade de captura (Celina alta, Grass baixa) */
  machine: number
  lean: number
  /** atracao raw [-100,100] que cada segmento sente pelo candidato (indexado por segmento) */
  pull: number[]
  description: string
}

export interface DfEventEffect {
  /** celulas da matriz de forca a interpolar: [i, j, novoValorRaw] */
  forceDelta?: Array<[number, number, number]>
  /** pull de candidato a interpolar: [candidatoId, segmentoId, novoPullRaw] */
  pullDelta?: Array<[number, number, number]>
  /** ruido termico extra durante o evento (sacode particulas desengajadas) */
  noiseBoost?: number
  /** remove o candidato em 3o lugar no placar (cenario 2o turno) */
  removeThird?: boolean
  /** multiplica o alcance de um candidato: [candidatoId, fator] */
  reachBoost?: Array<[number, number]>
}

export interface DfEvent {
  id: string
  name: string
  icon: string
  description: string
  /** duracao em frames (60/s); 0 = permanente */
  durationFrames: number
  /** frames da rampa de entrada/saida da interpolacao */
  rampFrames: number
  effect: DfEventEffect
  /** frase do narrador ao disparar */
  narration: string
  /** dispara sozinho neste frame (cenarios roteirizados); ausente = so manual */
  autoFireAtFrame?: number
}

export interface DfScenario {
  v: 2
  meta: {
    id: string
    name: string
    description: string
    category: string
    /** formas visuais esperadas — contrato da gramatica visual, exibido na UI */
    expectedForms: string[]
  }
  segments: DfSegment[]
  territories: DfTerritory[]
  candidates: DfCandidate[]
  events: DfEvent[]
  settings: {
    numParticles: number
    frictionFactor: number
    forceFactor: number
    /** forca da ancora domiciliar (retorno ao territorio de origem) */
    homeStrength: number
    /** ruido termico base */
    noise: number
    opinion: { mu: number; epsilon: number; everyNFrames: number }
  }
  matrices: {
    forces: number[][]     // normalizada [-1,1]
    minRadius: number[][]
    maxRadius: number[][]
  }
}

// ============================================================
// Mundo e helpers
// ============================================================

export const DF_WORLD_W = 1200
export const DF_WORLD_H = 800

const FORCE_SCALE = 100
const norm = (raw: number) => Math.max(-1, Math.min(1, raw / FORCE_SCALE))
const normMatrix = (raw: number[][]) => raw.map(row => row.map(norm))

/**
 * Gera matrizes de raio a partir da diagonal de coesao (mesma heuristica validada no RR):
 *   minR(diag) = 45 - coesao*0.25  → blocos coesos ficam densos
 *   maxR(diag) = 80 + coesao*0.30  → blocos coesos se enxergam de longe
 * Off-diagonal: padrao 30/95, com overrides pontuais [i, j, minR, maxR]
 * (perseguicoes e pontes precisam de alcance maior para a forma emergir).
 */
function makeRadii(forceRaw: number[][], overrides: Array<[number, number, number, number]> = []) {
  const n = forceRaw.length
  const minR: number[][] = []
  const maxR: number[][] = []
  for (let i = 0; i < n; i++) {
    minR.push([])
    maxR.push([])
    for (let j = 0; j < n; j++) {
      if (i === j) {
        const c = Math.max(0, forceRaw[i][i])
        minR[i].push(Math.round(45 - c * 0.25))
        maxR[i].push(Math.round(80 + c * 0.30))
      } else {
        minR[i].push(30)
        maxR[i].push(95)
      }
    }
  }
  for (const [i, j, mn, mx] of overrides) {
    minR[i][j] = mn
    maxR[i][j] = mx
  }
  return { minR, maxR }
}

function cloneMatrix(m: number[][]): number[][] {
  return m.map(r => [...r])
}

// ============================================================
// Territorios do DF (aneis estilizados; mundo 1200x800)
// Plano no centro, periferia decisiva a oeste, Entorno na borda.
// ============================================================

const TERRITORIES: DfTerritory[] = [
  { id: 0, name: 'Plano Piloto',            shortName: 'Plano',      cx: 620, cy: 400, radius: 90,  tint: '#1a2438', description: 'Asa Sul, area central. Renda ~7 SM per capita, classe media alta.' },
  { id: 1, name: 'Asa Norte',               shortName: 'A. Norte',   cx: 640, cy: 265, radius: 58,  tint: '#1b2a3a', description: 'Unica RA onde Lula venceu em 2022. UnB, servidores, progressistas.' },
  { id: 2, name: 'Lago Sul / Sudoeste',     shortName: 'Lago Sul',   cx: 790, cy: 490, radius: 78,  tint: '#2a2334', description: 'Maior renda per capita do Brasil. Bolsonaro confinado aqui: peregrinacao da direita.' },
  { id: 3, name: 'Aguas Claras / Guara',    shortName: 'A. Claras',  cx: 470, cy: 500, radius: 72,  tint: '#1d2836', description: 'Classe media vertical, funcionalismo distrital e federal.' },
  { id: 4, name: 'Taguatinga / Gama',       shortName: 'Taguatinga', cx: 335, cy: 430, radius: 82,  tint: '#20272f', description: 'Comercio popular, classe trabalhadora consolidada. PT perdeu 37pp no Gama.' },
  { id: 5, name: 'Ceilandia / Samambaia',   shortName: 'Ceilandia',  cx: 210, cy: 330, radius: 105, tint: '#252420', description: 'MAIOR colegio eleitoral (3 zonas). Quem ganha aqui, ganha o DF.' },
  { id: 6, name: 'Sol Nascente / Estrutural', shortName: 'Sol Nasc.', cx: 290, cy: 165, radius: 62,  tint: '#2b2118', description: 'Menor renda do DF. Regularizacao fundiaria e a moeda politica.' },
  { id: 7, name: 'Planaltina / Sobradinho', shortName: 'Planaltina', cx: 860, cy: 215, radius: 80,  tint: '#232a24', description: 'Eixo norte, perfil interiorano e evangelico.' },
  { id: 8, name: 'Entorno / RIDE',          shortName: 'Entorno',    cx: 1060, cy: 580, radius: 88, tint: '#242621', description: 'Nao vota no DF, mas pressiona servicos e puxa pauta conservadora/agro.' },
]

// ============================================================
// 12 Segmentos do DF
// Paleta por familia: direita = quentes, esquerda = frios,
// evangelicos = dourado, maquina = branco, volateis = roxo/rosa.
// ============================================================

const SEGMENTS_DF: DfSegment[] = [
  { id: 0,  name: 'Elite Bolsonarista',      shortName: 'Elite',   description: 'Lago Sul/Sudoeste. Ideologica, coesa, financia campanhas. Bolsonaro mora aqui.', proportion: 0.08, color: '#d94f30', volatility: 0.10, lean: 0.85,  engagement: 0.90, homes: [[2, 0.7], [0, 0.3]] },
  { id: 1,  name: 'Funcionalismo Federal',   shortName: 'F.Fed',   description: 'Carreiras federais. Volatil por pauta (carreira, estabilidade), anti-caos.', proportion: 0.09, color: '#44aaff', volatility: 0.45, lean: -0.20, engagement: 0.65, homes: [[0, 0.4], [1, 0.25], [3, 0.35]] },
  { id: 2,  name: 'Func. Distrital + Seguranca', shortName: 'F.Dis', description: 'Pagos pelo FCDF (40% do orcamento). Clientes historicos da maquina do GDF.', proportion: 0.08, color: '#66ddee', volatility: 0.35, lean: 0.30,  engagement: 0.60, homes: [[3, 0.4], [4, 0.35], [0, 0.25]] },
  { id: 3,  name: 'Evangelicos de Periferia', shortName: 'Ev.Per', description: 'Voto em bloco via igrejas. Damares fez 45% do voto evangelico. Ponte entre classes.', proportion: 0.14, color: '#ffcc33', volatility: 0.12, lean: 0.55,  engagement: 0.80, homes: [[5, 0.4], [6, 0.2], [4, 0.25], [7, 0.15]] },
  { id: 4,  name: 'Evangelicos Classe Media', shortName: 'Ev.CM',  description: 'Mesma fe, mais ideologia. Elo entre igreja e bolsonarismo de elite.', proportion: 0.06, color: '#ffaa00', volatility: 0.15, lean: 0.70,  engagement: 0.75, homes: [[3, 0.4], [0, 0.3], [7, 0.3]] },
  { id: 5,  name: 'Periferia Consolidada',   shortName: 'Perif',   description: 'Ceilandia/Samambaia. MAIOR bloco: decide a eleicao. Ex-base PT, hoje volatil.', proportion: 0.16, color: '#ff88aa', volatility: 0.60, lean: 0.10,  engagement: 0.45, homes: [[5, 0.6], [4, 0.4]] },
  { id: 6,  name: 'Vulneraveis / Regularizacao', shortName: 'Vuln', description: 'Sol Nascente/Estrutural. O "mercado do voto" do DF: regularizacao fundiaria como moeda.', proportion: 0.08, color: '#ff9933', volatility: 0.75, lean: 0.00,  engagement: 0.35, homes: [[6, 0.7], [5, 0.3]] },
  { id: 7,  name: 'Classe Media Progressista', shortName: 'Prog',  description: 'Asa Norte, UnB, cultura. Base Grass/Kokay: coesa, mobilizada — e pequena.', proportion: 0.07, color: '#6644ff', volatility: 0.15, lean: -0.80, engagement: 0.85, homes: [[1, 0.6], [0, 0.4]] },
  { id: 8,  name: 'Jovens Urbanos',          shortName: 'Jovem',   description: 'Difusos, decidem tarde, rede social > palanque. Presa de todos os predadores.', proportion: 0.08, color: '#bb77ff', volatility: 0.80, lean: -0.10, engagement: 0.30, homes: [[0, 0.2], [3, 0.2], [4, 0.2], [5, 0.25], [7, 0.15]] },
  { id: 9,  name: 'Maquina do GDF',          shortName: 'Maq',     description: '35 administradores regionais nomeados + comissionados: predador benigno que caca voto para a situacao.', proportion: 0.04, color: '#f2f2f2', volatility: 0.05, lean: 0.25,  engagement: 0.95, homes: [[4, 0.3], [5, 0.3], [3, 0.2], [7, 0.2]] },
  { id: 10, name: 'Empresariado / Comercio', shortName: 'Empr',    description: 'Taguatinga, SIA. Pragmatico: segue o favorito e o alvara.', proportion: 0.05, color: '#44dd88', volatility: 0.50, lean: 0.40,  engagement: 0.55, homes: [[4, 0.5], [3, 0.3], [0, 0.2]] },
  { id: 11, name: 'Entorno / Agro (nao vota)', shortName: 'Entor',  description: 'RIDE: consome servicos do DF, pressiona pauta conservadora — mas nao vota aqui.', proportion: 0.07, color: '#99aa66', volatility: 0.00, lean: 0.50,  engagement: 0.40, homes: [[8, 0.85], [7, 0.15]], nonVoter: true },
]

// ============================================================
// Matriz base DF — Panorama 2026
// Formas-alvo (gramatica visual):
//  NUCLEO elite (0) e progressistas (7) · MEMBRANA elite<->progressistas (-70)
//  PONTE evangelica: EvP (3) liga Perif (5) <-> EvCM (4) <-> Elite (0)
//  ILHA progressista (auto 80, repele direita, so FFed a conecta)
//  PERSEGUICAO: Maquina (9) caca Vulneraveis (6): 9->6 = +75, 6->9 = -35
//  ORBITA: FDis (2) orbita a Maquina (9)
//  NUVEM jovem (8): auto 10, tudo fraco — presa difusa
//  BOLHA Entorno (11): auto 70 na borda, quase nao interage
// ============================================================

const FORCE_DF_BASE_RAW = [
  //          0Eli  1FFe  2FDi  3EvP  4EvC  5Per  6Vul  7Pro  8Jov  9Maq 10Emp 11Ent
  /* 0 Eli */ [ 75,  -25,   10,   20,   45,  -10,  -20,  -70,    5,   25,   40,   15],
  /* 1 FFe */ [-25,   65,   35,    0,   -5,   10,    5,   45,   15,  -15,   10,  -10],
  /* 2 FDi */ [ 15,   35,   60,   15,   10,   20,   10,    0,    5,   55,   10,   -5],
  /* 3 EvP */ [ 20,    0,   15,   75,   60,   45,   35,  -35,   20,   15,    5,   10],
  /* 4 EvC */ [ 45,   -5,   10,   60,   70,   15,    5,  -50,   10,   15,   20,   10],
  /* 5 Per */ [-15,   10,   20,   40,    5,   45,   30,   -5,   25,   10,    5,    0],
  /* 6 Vul */ [-20,    5,   10,   30,    0,   35,   40,    0,   15,  -35,    0,    5],
  /* 7 Pro */ [-70,   40,    0,  -30,  -50,   10,   15,   80,   30,  -25,   -5,  -20],
  /* 8 Jov */ [ -5,   10,    5,   10,    0,   20,   10,   25,   10,  -20,    5,   -5],
  /* 9 Maq */ [ 25,  -10,   45,   20,   15,   35,   75,  -20,   30,   50,   20,    0],
  /*10 Emp */ [ 40,    5,   10,    5,   15,    5,    0,  -10,    5,   30,   65,   20],
  /*11 Ent */ [ 10,  -15,   -5,   15,   10,    5,    5,  -25,    0,    0,   15,   70],
]

// Overrides de raio: perseguicoes e pontes precisam de alcance longo para a forma aparecer.
const RADII_DF_BASE = makeRadii(FORCE_DF_BASE_RAW, [
  [9, 6, 28, 150],   // Maquina enxerga Vulneraveis de longe (caca)
  [6, 9, 28, 140],   // Vulneraveis sentem a Maquina chegando (fuga)
  [3, 5, 30, 120],   // Ponte evangelica alcanca a periferia
  [3, 4, 30, 120],   // ... e a classe media evangelica
  [0, 7, 35, 130],   // Membrana: os blocos opostos se "veem" e mantem o muro
  [7, 0, 35, 130],
])

// ============================================================
// Candidatos 2026 (atratores nomeados)
// pull[segmento] raw [-100,100]: quanto cada segmento e puxado pelo candidato.
// Fontes: Exata OP jul/2026, Correio/OPINIAO jun/2026, historico Damares/evangelicos.
// ============================================================

const CANDIDATES_2026: DfCandidate[] = [
  {
    id: 0, name: 'Celina', party: 'PP', color: '#ffd75e',
    x: 400, y: 420, charismaRadius: 95, reachRadius: 240, machine: 0.9, lean: 0.45,
    //      Eli  FFe  FDi  EvP  EvC  Per  Vul  Pro  Jov  Maq  Emp  Ent
    pull: [  35,  10,  55,  50,  45,  35,  40, -20,  15,  90,  45,   0],
    description: 'Vice que herdou a maquina. Ancorada nos administradores regionais, evangelicos (ponte Damares) e no funcionalismo distrital.',
  },
  {
    id: 1, name: 'Arruda', party: 'PSD', color: '#ff7733',
    x: 760, y: 470, charismaRadius: 85, reachRadius: 210, machine: 0.6, lean: 0.65,
    pull: [  55,  -5,  20,  25,  35,  30,  30, -45,  10,  10,  40,   0],
    description: 'Ex-governador de volta pela Lei 219/2025. Atrai o anti-petismo e a elite — mas carrega a cicatriz da Caixa de Pandora.',
  },
  {
    id: 2, name: 'Grass', party: 'PT', color: '#ee3355',
    x: 640, y: 260, charismaRadius: 75, reachRadius: 180, machine: 0.35, lean: -0.75,
    pull: [ -60,  45,   0,  -25, -40,  20,  25,  85,  30, -30, -10,   0],
    description: 'Forte na Asa Norte e no funcionalismo federal. O desafio visivel: atravessar a cidade ate Ceilandia.',
  },
]

// ============================================================
// Eventos DF
// ============================================================

const EVENTS_DF: DfEvent[] = [
  {
    id: 'pesquisa', name: 'Pesquisa divulgada', icon: '📊',
    description: 'Efeito bandwagon: empresariado e jovens gravitam para o lider do placar.',
    durationFrames: 1500, rampFrames: 180,
    effect: { pullDelta: [[0, 10, 70], [0, 8, 40], [0, 6, 55]] },
    narration: 'Pesquisa na rua: o efeito bandwagon empurra pragmaticos e indecisos para o lider.',
  },
  {
    id: 'escandalo', name: 'Caixa de Pandora reativada', icon: '💥',
    description: 'O escandalo de Arruda volta ao noticiario: repulsao geral, exceto no nucleo anti-petista.',
    durationFrames: 2400, rampFrames: 120,
    effect: {
      pullDelta: [[1, 5, -40], [1, 6, -30], [1, 8, -35], [1, 10, -20], [1, 2, -25], [1, 3, -20], [1, 4, 5]],
      noiseBoost: 0.35,
    },
    narration: 'Caixa de Pandora reativada: o eleitorado medio se afasta de Arruda; so o nucleo anti-petista segura.',
  },
  {
    id: 'regularizacao', name: 'Anuncio de regularizacao', icon: '🏠',
    description: 'GDF anuncia escrituras no Sol Nascente: a maquina intensifica a caca aos vulneraveis.',
    durationFrames: 2000, rampFrames: 150,
    effect: { forceDelta: [[6, 9, 45], [9, 6, 95]], pullDelta: [[0, 6, 85], [0, 5, 55]] },
    narration: 'Escritura na mao: a maquina do GDF avanca sobre Sol Nascente e Estrutural com a regularizacao.',
  },
  {
    id: 'greve', name: 'Greve do funcionalismo', icon: '✊',
    description: 'Federais e distritais fundem temporariamente contra o governo; a maquina vira alvo.',
    durationFrames: 1800, rampFrames: 150,
    effect: { forceDelta: [[1, 2, 70], [2, 1, 70], [2, 9, -30], [1, 9, -45]], pullDelta: [[0, 2, 10], [2, 1, 65]] },
    narration: 'Greve unifica o funcionalismo: federais e distritais marcham juntos — e a maquina perde o cabresto.',
  },
  {
    id: 'ato-lago-sul', name: 'Ato no Lago Sul', icon: '🟢',
    description: 'Ato bolsonarista em frente ao condominio: direita se adensa, progressistas se afastam.',
    durationFrames: 1500, rampFrames: 120,
    effect: { forceDelta: [[0, 0, 90], [4, 0, 65], [0, 4, 60], [7, 0, -90], [0, 7, -85]], noiseBoost: 0.2 },
    narration: 'Ato no Lago Sul: o nucleo bolsonarista endurece e a membrana com o campo progressista fica nitida.',
  },
  {
    id: 'debate', name: 'Debate na TV', icon: '📺',
    description: 'Choque de temperatura: sacode o eleitor desengajado, que volta a circular.',
    durationFrames: 900, rampFrames: 60,
    effect: { noiseBoost: 0.9 },
    narration: 'Debate na TV: a temperatura sobe e o eleitor desengajado volta a se mover.',
  },
  {
    id: 'segundo-turno', name: 'Segundo turno', icon: '🗳️',
    description: 'Remove o 3o colocado do placar; a fisica decide quem herda o voto orfao.',
    durationFrames: 0, rampFrames: 120,
    effect: { removeThird: true, noiseBoost: 0.5 },
    narration: 'Segundo turno: o terceiro colocado sai da disputa — observe quem herda o voto orfao.',
  },
]

// ============================================================
// Settings padrao
// ============================================================

const SETTINGS_DEFAULT: DfScenario['settings'] = {
  numParticles: 4500,
  frictionFactor: 0.14,
  forceFactor: 0.9,
  homeStrength: 0.0022,
  noise: 0.09,
  opinion: { mu: 0.08, epsilon: 0.45, everyNFrames: 12 },
}

// ============================================================
// Helper: subconjunto de segmentos (recorta matrizes e reindexa)
// ============================================================

function subsetMatrices(force: number[][], minR: number[][], maxR: number[][], ids: number[]) {
  const pick = (m: number[][]) => ids.map(i => ids.map(j => m[i][j]))
  return { force: pick(force), minR: pick(minR), maxR: pick(maxR) }
}

function subsetSegments(ids: number[], proportionBoost: Record<number, number> = {}): DfSegment[] {
  const subset = ids.map((oldId, newId) => {
    const s = SEGMENTS_DF[oldId]
    return { ...s, id: newId, proportion: proportionBoost[oldId] ?? s.proportion, homes: [...s.homes] as Array<[number, number]> }
  })
  const total = subset.reduce((acc, s) => acc + s.proportion, 0)
  return subset.map(s => ({ ...s, proportion: s.proportion / total }))
}

function remapPull(pull: number[], ids: number[]): number[] {
  return ids.map(oldId => pull[oldId])
}

function remapEvents(events: DfEvent[], ids: number[]): DfEvent[] {
  const map = new Map(ids.map((oldId, newId) => [oldId, newId]))
  const remapCell = (cells?: Array<[number, number, number]>) =>
    cells
      ?.filter(([a, b]) => map.has(a) && map.has(b))
      .map(([a, b, v]) => [map.get(a)!, map.get(b)!, v] as [number, number, number])
  const remapPullDelta = (cells?: Array<[number, number, number]>) =>
    cells
      ?.filter(([, seg]) => map.has(seg))
      .map(([c, seg, v]) => [c, map.get(seg)!, v] as [number, number, number])
  return events
    .map(e => ({
      ...e,
      effect: {
        ...e.effect,
        forceDelta: remapCell(e.effect.forceDelta),
        pullDelta: remapPullDelta(e.effect.pullDelta),
      },
    }))
    .filter(e => (e.effect.forceDelta?.length || e.effect.pullDelta?.length || e.effect.noiseBoost || e.effect.removeThird))
}

// ============================================================
// CENARIO 1 — DF Panorama 2026 (baseline)
// ============================================================

const SCENARIO_PANORAMA: DfScenario = {
  v: 2,
  meta: {
    id: 'df-panorama',
    name: 'DF — Panorama 2026',
    description: 'O equilibrio de forcas da eleicao: Celina ancorada na maquina e nos evangelicos, Arruda orbitando o anti-petismo, Grass ilhado na Asa Norte.',
    category: 'Distrito Federal',
    expectedForms: [
      'Nucleo denso da elite no Lago Sul',
      'Membrana elite × progressistas',
      'Ponte evangelica ligando periferia à direita',
      'Ilha progressista na Asa Norte',
      'Maquina do GDF caçando vulneraveis (perseguicao)',
      'Nuvem difusa de jovens',
    ],
  },
  segments: SEGMENTS_DF,
  territories: TERRITORIES,
  candidates: CANDIDATES_2026,
  events: EVENTS_DF,
  settings: { ...SETTINGS_DEFAULT },
  matrices: {
    forces: normMatrix(FORCE_DF_BASE_RAW),
    minRadius: RADII_DF_BASE.minR,
    maxRadius: RADII_DF_BASE.maxR,
  },
}

// ============================================================
// CENARIO 2 — A Batalha de Ceilandia
// Zoom na disputa pelo anel decisivo: so os segmentos que vivem/disputam la.
// ============================================================

const CEILANDIA_IDS = [2, 3, 5, 6, 8, 9]  // FDis, EvP, Perif, Vuln, Jovem, Maq
const CEILANDIA_M = subsetMatrices(FORCE_DF_BASE_RAW, RADII_DF_BASE.minR, RADII_DF_BASE.maxR, CEILANDIA_IDS)
// intensifica a disputa: todos os predadores com alcance maior sobre Perif/Vuln
CEILANDIA_M.force[5][3] = 85   // Maq -> Vuln (caca maxima)
CEILANDIA_M.force[5][2] = 50   // Maq -> Perif
CEILANDIA_M.maxR[5][3] = 160
CEILANDIA_M.maxR[5][2] = 140

const SCENARIO_CEILANDIA: DfScenario = {
  v: 2,
  meta: {
    id: 'df-ceilandia',
    name: 'DF — A Batalha de Ceilandia',
    description: 'O maior colegio eleitoral do DF em disputa: maquina, igrejas e candidatos cacando o voto da periferia que decide a eleicao.',
    category: 'Distrito Federal',
    expectedForms: [
      'Perseguicao dupla: maquina caça vulneraveis e periferia',
      'Ponte evangelica dentro da periferia',
      'Nuvem jovem sendo disputada pelos tres candidatos',
    ],
  },
  segments: subsetSegments(CEILANDIA_IDS, { 5: 0.34, 6: 0.18, 8: 0.14 }),
  territories: TERRITORIES.filter(t => [3, 4, 5, 6].includes(t.id)),
  candidates: CANDIDATES_2026.map(c => ({
    ...c,
    pull: remapPull(c.pull, CEILANDIA_IDS),
    // todos "sobem a serra": posicoes deslocadas para o anel oeste
    x: c.id === 0 ? 330 : c.id === 1 ? 430 : 380,
    y: c.id === 0 ? 380 : c.id === 1 ? 500 : 240,
  })),
  events: remapEvents(EVENTS_DF.filter(e => ['regularizacao', 'pesquisa', 'debate', 'escandalo'].includes(e.id)), CEILANDIA_IDS),
  settings: { ...SETTINGS_DEFAULT, numParticles: 4000, homeStrength: 0.0012 },
  matrices: {
    forces: normMatrix(CEILANDIA_M.force),
    minRadius: CEILANDIA_M.minR,
    maxRadius: CEILANDIA_M.maxR,
  },
}

// ============================================================
// CENARIO 3 — Rachadura na Direita
// PL desorganizado (Michelle rompeu): um 4o atrator divide o campo conservador.
// ============================================================

const FORCE_RACHADURA = cloneMatrix(FORCE_DF_BASE_RAW)
FORCE_RACHADURA[0][0] = 45   // elite perde coesao (racha interna)
FORCE_RACHADURA[4][0] = 30   // evangelicos CM hesitam com a elite dividida
FORCE_RACHADURA[3][4] = 40   // ponte evangelica afrouxa
const RADII_RACHADURA = makeRadii(FORCE_RACHADURA, [
  [9, 6, 28, 150], [6, 9, 28, 140], [3, 5, 30, 120], [0, 7, 35, 130], [7, 0, 35, 130],
])

const SCENARIO_RACHADURA: DfScenario = {
  v: 2,
  meta: {
    id: 'df-rachadura',
    name: 'DF — Rachadura na Direita',
    description: 'Michelle rompe, o PL se desorganiza: um quarto atrator ("Bolsonarismo raiz") disputa a elite e os evangelicos com Celina e Arruda.',
    category: 'Distrito Federal',
    expectedForms: [
      'Nucleo da elite fragmentado em dois sub-blocos',
      'Evangelicos oscilando entre tres atratores da direita',
      'Ilha progressista intacta observando o racha',
    ],
  },
  segments: SEGMENTS_DF,
  territories: TERRITORIES,
  candidates: [
    ...CANDIDATES_2026,
    {
      id: 3, name: 'B. Raiz', party: 'PL', color: '#33dd66',
      x: 830, y: 420, charismaRadius: 80, reachRadius: 190, machine: 0.45, lean: 0.9,
      //      Eli  FFe  FDi  EvP  EvC  Per  Vul  Pro  Jov  Maq  Emp  Ent
      pull: [  70, -15,  10,  40,  55,  15,  10, -60,   5, -10,  15,   0],
      description: 'O bolsonarismo puro-sangue sem candidato unico: rouba elite e evangelicos de Celina e Arruda.',
    },
  ],
  events: EVENTS_DF,
  settings: { ...SETTINGS_DEFAULT },
  matrices: {
    forces: normMatrix(FORCE_RACHADURA),
    minRadius: RADII_RACHADURA.minR,
    maxRadius: RADII_RACHADURA.maxR,
  },
}

// ============================================================
// CENARIO 4 — Escandalo (roteirizado)
// Panorama com a Caixa de Pandora disparando sozinha aos ~30s.
// ============================================================

const SCENARIO_ESCANDALO: DfScenario = {
  ...SCENARIO_PANORAMA,
  meta: {
    id: 'df-escandalo',
    name: 'DF — Escandalo em Cena',
    description: 'Roteiro: a eleicao corre normal ate a Caixa de Pandora voltar ao noticiario (~30s). Observe quem herda o voto que abandona Arruda.',
    category: 'Distrito Federal',
    expectedForms: [
      'Mare de migracao saindo da orbita de Arruda',
      'Nucleo anti-petista resistindo ao escandalo',
      'Celina absorvendo o voto orfao pragmatico',
    ],
  },
  events: EVENTS_DF.map(e => e.id === 'escandalo' ? { ...e, autoFireAtFrame: 1800 } : e),
}

// ============================================================
// CENARIO 5 — Segundo Turno
// ============================================================

const SCENARIO_SEGUNDO_TURNO: DfScenario = {
  ...SCENARIO_PANORAMA,
  meta: {
    id: 'df-segundo-turno',
    name: 'DF — Segundo Turno',
    description: 'Deixe o placar estabilizar e dispare o 2o turno: o terceiro colocado sai e a fisica redistribui o voto orfao em tempo real.',
    category: 'Distrito Federal',
    expectedForms: [
      'Colapso do cluster do eliminado',
      'Mare de migracao para os dois finalistas',
      'Membrana final: a cidade dividida em dois campos',
    ],
  },
  events: EVENTS_DF,
}

// ============================================================
// CENARIO 6 — Capital Rachada (modo ideias, herdeiro do Bleger RR)
// Particulas = valores em disputa na cidade mais desigual e mais bolsonarista.
// ============================================================

const VALUE_SEGMENTS: DfSegment[] = [
  { id: 0, name: 'Ordem',         shortName: 'Ordem',  description: 'Seguranca, hierarquia, "bandido bom...". Combustivel da direita do DF.', proportion: 0.16, color: '#d94f30', volatility: 0.2, lean: 0.8,  engagement: 0.8, homes: [[2, 0.5], [7, 0.5]] },
  { id: 1, name: 'Fe',            shortName: 'Fe',     description: 'O valor mais aglutinador da capital evangelica.', proportion: 0.18, color: '#ffcc33', volatility: 0.1, lean: 0.5,  engagement: 0.85, homes: [[5, 0.4], [4, 0.3], [7, 0.3]] },
  { id: 2, name: 'Prosperidade',  shortName: 'Prosp',  description: 'Meritocracia, empreendedorismo, teologia da prosperidade.', proportion: 0.14, color: '#44dd88', volatility: 0.4, lean: 0.5,  engagement: 0.6, homes: [[3, 0.5], [4, 0.5]] },
  { id: 3, name: 'Igualdade',     shortName: 'Igual',  description: 'Justica social na cidade com renda 16x desigual.', proportion: 0.14, color: '#6644ff', volatility: 0.2, lean: -0.8, engagement: 0.8, homes: [[1, 0.5], [5, 0.5]] },
  { id: 4, name: 'Estado',        shortName: 'Estado', description: 'Servico publico como projeto de vida: o DF vive do Estado.', proportion: 0.14, color: '#44aaff', volatility: 0.3, lean: -0.3, engagement: 0.65, homes: [[0, 0.5], [3, 0.5]] },
  { id: 5, name: 'Pertencimento', shortName: 'Pert',   description: 'O valor-ponte: comunidade, quadrilha junina, igreja, torcida. Oscila entre os blocos.', proportion: 0.12, color: '#ff88aa', volatility: 0.7, lean: 0.0,  engagement: 0.5, homes: [[5, 0.5], [4, 0.3], [6, 0.2]] },
  { id: 6, name: 'Liberdade',     shortName: 'Liber',  description: 'Anti-regulacao para uns, liberdades civis para outros: valor em disputa.', proportion: 0.12, color: '#bb77ff', volatility: 0.6, lean: 0.1,  engagement: 0.5, homes: [[0, 0.5], [1, 0.5]] },
]

const FORCE_VALUES_RAW = [
  //          Ordem   Fe  Prosp Igual Estado Pert  Liber
  /* Ordem */ [  80,  55,   40,  -75,  -20,   30,  -40],
  /* Fe    */ [  50,  85,   45,  -30,  -10,   55,  -35],
  /* Prosp */ [  35,  40,   65,  -45,  -35,   15,   40],
  /* Igual */ [ -75, -25,  -45,   80,   50,   35,   20],
  /* Estado*/ [ -20, -10,  -35,   50,   70,   20,  -15],
  /* Pert  */ [  30,  55,   10,   40,   15,   40,   10],
  /* Liber */ [ -40, -30,   45,   15,  -20,   10,   55],
]
const RADII_VALUES = makeRadii(FORCE_VALUES_RAW, [
  [5, 1, 30, 125],   // Pertencimento alcanca a Fe de longe...
  [5, 3, 30, 125],   // ...e a Igualdade tambem: e a corda do cabo de guerra
  [0, 3, 35, 130],   // membrana Ordem x Igualdade
  [3, 0, 35, 130],
])

const SCENARIO_CAPITAL_RACHADA: DfScenario = {
  v: 2,
  meta: {
    id: 'df-capital-rachada',
    name: 'DF — Capital Rachada (ideias)',
    description: 'Particulas sao VALORES, nao eleitores: Ordem e Fe de um lado, Igualdade e Estado do outro — e o Pertencimento como corda do cabo de guerra.',
    category: 'DF: Ideias',
    expectedForms: [
      'Dois blocos densos (conservador × progressista)',
      'Membrana nitida entre os blocos',
      'Pertencimento como ponte oscilando entre os dois',
    ],
  },
  segments: VALUE_SEGMENTS,
  territories: TERRITORIES,
  candidates: [],
  events: [
    {
      id: 'polarizacao', name: 'Polarizacao maxima', icon: '⚡',
      description: 'A ponte quebra: Pertencimento e arrastado para o bloco conservador.',
      durationFrames: 0, rampFrames: 240,
      effect: { forceDelta: [[5, 3, -30], [3, 5, -20], [5, 1, 80], [1, 5, 75], [0, 3, -95], [3, 0, -95]] },
      narration: 'A ponte quebrou: Pertencimento foi arrastado para o bloco conservador. A cidade agora e duas cidades.',
    },
    {
      id: 'secularizacao', name: 'Secularizacao', icon: '🌊',
      description: 'A Fe perde coesao e o Pertencimento se autonomiza.',
      durationFrames: 0, rampFrames: 240,
      effect: { forceDelta: [[1, 1, 50], [5, 1, 25], [5, 5, 70], [3, 3, 85]] },
      narration: 'Secularizacao em curso: a Fe afrouxa, o Pertencimento se autonomiza e a Igualdade se adensa.',
    },
  ],
  settings: { ...SETTINGS_DEFAULT, numParticles: 4000, homeStrength: 0.0008 },
  matrices: {
    forces: normMatrix(FORCE_VALUES_RAW),
    minRadius: RADII_VALUES.minR,
    maxRadius: RADII_VALUES.maxR,
  },
}

// ============================================================
// Export
// ============================================================

export const DF_SCENARIOS: DfScenario[] = [
  SCENARIO_PANORAMA,
  SCENARIO_CEILANDIA,
  SCENARIO_RACHADURA,
  SCENARIO_ESCANDALO,
  SCENARIO_SEGUNDO_TURNO,
  SCENARIO_CAPITAL_RACHADA,
]
