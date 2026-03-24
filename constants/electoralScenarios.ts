/**
 * Cenarios eleitorais para o Simulador INTEIA.
 * Baseado em dados do TSE e pesquisa sintetica de Roraima (1000 eleitores).
 *
 * Force values normalized to [-1, 1] from raw scale [-60, +45].
 * Proportions based on ESTRUTURA_PARTICULAS_v3 and CLUSTERS_4_JORGE_EVERTON.
 */

export interface ElectoralSegment {
  id: number
  name: string
  shortName: string
  description: string
  proportion: number   // 0-1, sum = 1.0
  color: string        // hex
  strategicAction?: string
}

export interface ElectoralScenario {
  v: 1
  meta: {
    name: string
    description: string
    category: string
  }
  segments: ElectoralSegment[]
  types: string[]
  settings: {
    species: number
    numParticles: number
    frictionFactor: number
    forceFactor: number
  }
  matrices: {
    forces: number[][]
    minRadius: number[][]
    maxRadius: number[][]
  }
  colors: string[]
}

// ---- Normalization: raw force range [-100, +100] → [-1, 1] ----
// Escala ampliada para gerar organismos visiveis
const FORCE_SCALE = 100
function norm(raw: number): number {
  return Math.max(-1, Math.min(1, raw / FORCE_SCALE))
}
function normMatrix(raw: number[][]): number[][] {
  return raw.map(row => row.map(v => norm(v)))
}

// ---- Radius matrices diferenciadas por par ----
function uniformRadius(n: number, min: number, max: number): number[][] {
  return Array.from({ length: n }, () => Array(n).fill(0)).map((row, i) =>
    row.map((_: number, j: number) => i === j ? min : min + (max - min) * 0.4)
  )
}
function uniformMaxRadius(n: number, min: number, max: number): number[][] {
  return Array.from({ length: n }, () => Array(n).fill(0)).map((row, i) =>
    row.map((_: number, j: number) => i === j ? max : max * 0.75)
  )
}

// ============================================================
// 4 CLUSTERS ESTRATEGICOS — Visao de campanha
// ============================================================

const CLUSTERS_4: ElectoralSegment[] = [
  { id: 0, name: 'Base Fiel',      shortName: 'Base',    description: 'Eleitorado ja conquistado, manter engajado', proportion: 0.18, color: '#00ccff', strategicAction: 'MANTER' },
  { id: 1, name: 'Campo Disputa',  shortName: 'Campo',   description: 'Onde se ganha a eleicao, volatil e decisivo', proportion: 0.42, color: '#ffee00', strategicAction: 'CONQUISTAR' },
  { id: 2, name: 'Mercado do Voto',shortName: 'Mercado',  description: 'Compra de voto, negociacao, traicao frequente', proportion: 0.25, color: '#ff6600', strategicAction: 'DISPUTAR' },
  { id: 3, name: 'Alheio',         shortName: 'Alheio',   description: 'Nao vota ou e intratavel, nao investir', proportion: 0.15, color: '#ff0066', strategicAction: 'IGNORAR' },
]

// FORCE_4_RAW: escala -100 a +100.
// Assimetria proposital: A atrai B mas B foge de A → cria perseguicao/orbita.
// Base se atrai forte (nucleo coeso). Campo e volatil (coesao fraca).
// Mercado orbita Campo (perseguicao). Alheio se isola (bolha).
const FORCE_4_RAW = [
  [-85, -40,  -10,  25],   // Base: muito coeso, puxa Campo, repele Alheio
  [-25, -20,  -45,   5],   // Campo: atraido por Base E Mercado (disputado)
  [-10, -60,  -15, -10],   // Mercado: persegue Campo forte (assimetria!)
  [ 35,  10,  -10, -75],   // Alheio: bolha isolada, repele Base
]

// ============================================================
// 10 SEGMENTOS DE RORAIMA — Visao granular
// ============================================================

const SEGMENTOS_10: ElectoralSegment[] = [
  { id: 0, name: 'Funcionalismo',   shortName: 'Func',  description: 'Servidores publicos, voto por emprego', proportion: 0.108, color: '#44bbcc' },
  { id: 1, name: 'Comissionados',   shortName: 'Comis', description: 'Cargos de confianca, voto cativo do deputado', proportion: 0.038, color: '#8888aa' },
  { id: 2, name: 'Evangelicos',     shortName: 'Evang', description: 'Pastor indica, rebanho segue', proportion: 0.141, color: '#ffcc33' },
  { id: 3, name: 'Jovens Urbanos',  shortName: 'Jovem', description: 'TikTok, volateis, decidem tarde', proportion: 0.251, color: '#bb77ff' },
  { id: 4, name: 'Mercado do Voto', shortName: 'Merc',  description: 'R$800/voto, traem no sigilo', proportion: 0.128, color: '#ff9933' },
  { id: 5, name: 'Indigena Org.',   shortName: 'Indig', description: 'CIR organiza, voto em bloco', proportion: 0.090, color: '#ff4444' },
  { id: 6, name: 'Classe Media',    shortName: 'CMed',  description: 'Bolsonaristas convictos, ideologicos', proportion: 0.090, color: '#4488ff' },
  { id: 7, name: 'Interior Agro',   shortName: 'Agro',  description: 'Querem estrada e energia, pragmaticos', proportion: 0.077, color: '#44dd66' },
  { id: 8, name: 'Mulheres Perif.', shortName: 'MulP',  description: 'Periferia, buscam protecao e servicos', proportion: 0.052, color: '#ff66aa' },
  { id: 9, name: 'Fronteira/Seg.',  shortName: 'Front', description: 'PM/PC/PF, berco de Jorge Everton', proportion: 0.025, color: '#33cc77' },
]

const FORCE_10_RAW = [
  [-40, -50,  10,  15,  -5,  20, -20,  10,  -5, -45],
  [-50, -55,  15,  10, -30,  20,   5,  15,  -5, -15],
  [ 10,  15, -55, -15,  15,  40, -35, -25, -25,  -5],
  [ 15,  10, -15, -20, -25,  10,  10,  15, -20,  10],
  [ -5, -30,  15, -25, -12,  -5,  10,  -5, -40,  15],
  [ 20,  20,  40,  10,  -5, -60,  45,  -5,   5,  25],
  [-20,   5, -35,  10,  10,  45, -50, -25,  10, -30],
  [ 10,  15, -25,  15,  -5,  -5, -25, -45,  10, -15],
  [ -5,  -5, -25, -20, -40,   5,  10,  10, -30,   5],
  [-45, -15,  -5,  10,  15,  25, -30, -15,   5, -50],
]

// ============================================================
// CENARIOS PRONTOS
// ============================================================

export const ELECTORAL_SCENARIOS: ElectoralScenario[] = [
  {
    v: 1,
    meta: {
      name: 'RR — 4 Clusters',
      description: 'Roraima em 4 blocos estrategicos: Base Fiel, Campo de Disputa, Mercado do Voto e Alheio. Visao de campanha.',
      category: 'Roraima',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.25, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_4_RAW),
      // Raios diferenciados: Base nucleo denso, Campo espalhado, Mercado alcance longo
      minRadius: [
        [20, 30, 40, 50],   // Base: nucleo compacto
        [30, 35, 25, 45],   // Campo: zona media
        [40, 25, 30, 40],   // Mercado: aproxima de Campo
        [50, 45, 40, 15],   // Alheio: bolha densa isolada
      ],
      maxRadius: [
        [70, 120, 80, 60],   // Base: busca Campo longe
        [90, 100, 130, 70],  // Campo: grande alcance com Mercado
        [80, 130, 90, 80],   // Mercado: persegue Campo muito longe
        [60, 70, 80, 55],    // Alheio: zona curta
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — 10 Segmentos',
      description: 'Roraima granular com 10 segmentos eleitorais derivados de 1000 eleitores sinteticos. Dados TSE + pesquisa de campo.',
      category: 'Roraima',
    },
    segments: SEGMENTOS_10,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 10, numParticles: 5000, frictionFactor: 0.25, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_10_RAW),
      minRadius: uniformRadius(10, 20, 40),
      maxRadius: uniformMaxRadius(10, 70, 120),
    },
    colors: SEGMENTOS_10.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Alianca Pastoral',
      description: 'Evento: lideranca evangelica fecha apoio ao candidato. Base↔Campo atracao +15, evangelicos coesao reforçada.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.25, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix([
        [-45, -30,  -5,   5],
        [-30, -18, -20,   0],
        [ -5, -20,  -8,  -5],
        [  5,   0,  -5, -35],
      ]),
      minRadius: uniformRadius(4, 28, 48),
      maxRadius: uniformMaxRadius(4, 58, 80),
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Compra de Voto',
      description: 'Evento: Mercado do Voto ativado. Mercado perde coesao interna (-5), Campo e Mercado se aproximam.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.25, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix([
        [-40, -15,  -5,   5],
        [-15, -12, -30,   0],
        [ -5, -30,  -3,  -5],
        [  5,   0,  -5, -35],
      ]),
      minRadius: uniformRadius(4, 30, 50),
      maxRadius: uniformMaxRadius(4, 60, 80),
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Fake News Viral',
      description: 'Desinformacao massiva. Polarizacao sobe: extremos se atraem mais, centro se fragmenta.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 1000, frictionFactor: 0.12, forceFactor: 1.2 },
    matrices: {
      forces: normMatrix([
        [-50, -10,   5,  15],
        [-10,  -8, -15,   5],
        [  5, -15,  -5,   0],
        [ 15,   5,   0, -40],
      ]),
      minRadius: uniformRadius(4, 30, 50),
      maxRadius: uniformMaxRadius(4, 65, 85),
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — CNH Gratis',
      description: 'Programa social: CNH gratis aproxima Base e Campo. Atracao Base↔Campo +10.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.25, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix([
        [-40, -25,  -5,   5],
        [-25, -15, -20,   0],
        [ -5, -20,  -8,  -5],
        [  5,   0,  -5, -35],
      ]),
      minRadius: uniformRadius(4, 28, 48),
      maxRadius: uniformMaxRadius(4, 60, 80),
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Cenario Otimista JE',
      description: 'CNH funciona + alianca pastoral + Denarium apoia. Base domina, Campo migra para Base.',
      category: 'Estrategia JE',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.25, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix([
        [-50, -35, -15,  10],
        [-35, -18, -20,   0],
        [-15, -20,  -8,  -5],
        [ 10,   0,  -5, -30],
      ]),
      minRadius: uniformRadius(4, 25, 45),
      maxRadius: [
        [70, 110, 85, 80],
        [110, 85, 100, 70],
        [85, 100, 70, 75],
        [80, 70, 75, 60],
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Cenario Pessimista JE',
      description: 'Concorrentes compram Mercado + fake news + crise. Base enfraquece, Campo dispersa, Mercado foge.',
      category: 'Estrategia JE',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 1000, frictionFactor: 0.12, forceFactor: 1.1 },
    matrices: {
      forces: normMatrix([
        [-35, -10,  -5,   8],
        [-10,  -5, -25,   5],
        [ -5, -25, -15,  -5],
        [  8,   5,  -5, -40],
      ]),
      minRadius: uniformRadius(4, 30, 55),
      maxRadius: uniformMaxRadius(4, 65, 90),
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Cassacao Denarium',
      description: 'Governador cassado. Maquina fragmenta: Mercado perde coesao, Campo em disputa aberta, caos.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 1000, frictionFactor: 0.10, forceFactor: 1.2 },
    matrices: {
      forces: normMatrix([
        [-40, -15,  -5,   5],
        [-15, -10, -25,   3],
        [ -5, -25,  -3,  -5],
        [  5,   3,  -5, -30],
      ]),
      minRadius: uniformRadius(4, 32, 52),
      maxRadius: uniformMaxRadius(4, 68, 90),
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Servico de Mandato',
      description: 'Jorge Everton entrega servicos: 300 PC aprovados, fiscalizacao, CPI Saude. Base e Campo se aproximam organicamente.',
      category: 'Estrategia JE',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 1000, frictionFactor: 0.18, forceFactor: 0.9 },
    matrices: {
      forces: normMatrix([
        [-45, -20, -10,   5],
        [-20, -15, -18,   0],
        [-10, -18,  -8,  -5],
        [  5,   0,  -5, -35],
      ]),
      minRadius: uniformRadius(4, 28, 46),
      maxRadius: uniformMaxRadius(4, 58, 78),
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  // ---- Cenarios nao-eleitorais (Universo / Biologia) ----
  {
    v: 1,
    meta: {
      name: 'Galaxias e Estrelas',
      description: 'Simulacao gravitacional. Particulas orbitam, formam galaxias espirais e aglomerados estelares.',
      category: 'Universo',
    },
    segments: [
      { id: 0, name: 'Estrelas Gigantes', shortName: 'Giant', description: 'Massivas, atraem tudo', proportion: 0.08, color: '#ffffff' },
      { id: 1, name: 'Estrelas Anas', shortName: 'Dwarf', description: 'Pequenas, abundantes', proportion: 0.35, color: '#ffdd44' },
      { id: 2, name: 'Nebulosas', shortName: 'Nebul', description: 'Gas difuso, formam estrelas', proportion: 0.25, color: '#ff66aa' },
      { id: 3, name: 'Materia Escura', shortName: 'Dark', description: 'Invisivel, segura galaxias', proportion: 0.25, color: '#4466cc' },
      { id: 4, name: 'Buracos Negros', shortName: 'BHole', description: 'Atraem tudo, nada escapa', proportion: 0.07, color: '#aa22ff' },
    ],
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 5, numParticles: 6000, frictionFactor: 0.05, forceFactor: 1.5 },
    matrices: {
      forces: [
        [-0.95, -0.70, -0.50, -0.30, -0.90],
        [-0.40, -0.60, -0.20, -0.15, -0.80],
        [-0.30, -0.10, -0.25,  0.10, -0.70],
        [-0.20, -0.10,  0.15, -0.40, -0.50],
        [-0.95, -0.85, -0.80, -0.60, -0.99],
      ],
      minRadius: [
        [10, 15, 20, 25, 8],
        [15, 12, 20, 25, 10],
        [20, 20, 18, 30, 12],
        [25, 25, 30, 15, 15],
        [8, 10, 12, 15, 5],
      ],
      maxRadius: [
        [150, 180, 160, 200, 120],
        [140, 120, 140, 180, 130],
        [130, 130, 100, 150, 140],
        [200, 180, 150, 160, 170],
        [200, 200, 200, 200, 80],
      ],
    },
    colors: ['#ffffff', '#ffdd44', '#ff66aa', '#4466cc', '#aa22ff'],
  },
  {
    v: 1,
    meta: {
      name: 'Vida Microscopica',
      description: 'Bacterias, predadores, presas e simbiontes. Regras simples criam ecossistemas complexos.',
      category: 'Biologia',
    },
    segments: [
      { id: 0, name: 'Bacterias', shortName: 'Bact', description: 'Abundantes, base da cadeia', proportion: 0.30, color: '#44ff44' },
      { id: 1, name: 'Algas', shortName: 'Alga', description: 'Fotossinteticas, formam colchoes', proportion: 0.20, color: '#22ccaa' },
      { id: 2, name: 'Predadores', shortName: 'Pred', description: 'Cacam bacterias e algas', proportion: 0.12, color: '#ff4444' },
      { id: 3, name: 'Virus', shortName: 'Viru', description: 'Parasitas, infectam todos', proportion: 0.15, color: '#ff88ff' },
      { id: 4, name: 'Fungos', shortName: 'Fung', description: 'Decompositores, reciclam', proportion: 0.13, color: '#cc8844' },
      { id: 5, name: 'Amebas', shortName: 'Ameb', description: 'Predadores lentos, envolvem presas', proportion: 0.10, color: '#8888ff' },
    ],
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 6, numParticles: 4000, frictionFactor: 0.30, forceFactor: 1.0 },
    matrices: {
      forces: [
        [-0.50,  0.20, -0.30,  0.40,  0.10, -0.20],
        [ 0.10, -0.60, -0.20,  0.30, -0.10, -0.15],
        [ 0.70,  0.50, -0.30, -0.10,  0.20, -0.40],
        [-0.60, -0.50, -0.20, -0.20, -0.40, -0.30],
        [ 0.30,  0.20,  0.10,  0.50, -0.45, -0.10],
        [ 0.50,  0.40,  0.30,  0.20,  0.10, -0.55],
      ],
      minRadius: [
        [15, 25, 30, 35, 25, 30],
        [25, 12, 28, 30, 20, 25],
        [10, 12, 20, 25, 30, 22],
        [8, 8, 15, 15, 10, 10],
        [20, 20, 25, 10, 15, 22],
        [15, 15, 18, 18, 20, 10],
      ],
      maxRadius: [
        [80, 90, 110, 100, 85, 95],
        [90, 70, 100, 95, 80, 85],
        [130, 120, 80, 90, 85, 100],
        [140, 140, 110, 90, 130, 120],
        [100, 95, 85, 130, 75, 90],
        [120, 110, 100, 100, 90, 65],
      ],
    },
    colors: ['#44ff44', '#22ccaa', '#ff4444', '#ff88ff', '#cc8844', '#8888ff'],
  },
  {
    v: 1,
    meta: {
      name: 'Oceano Primordial',
      description: 'Sopa primordial: moleculas simples formam cadeias, membranas e proto-celulas espontaneamente.',
      category: 'Biologia',
    },
    segments: [
      { id: 0, name: 'Aminoacidos', shortName: 'Amino', description: 'Blocos basicos da vida', proportion: 0.30, color: '#66ffcc' },
      { id: 1, name: 'Lipidios', shortName: 'Lipid', description: 'Formam membranas espontaneamente', proportion: 0.25, color: '#ffaa33' },
      { id: 2, name: 'Acidos Nucleicos', shortName: 'RNA', description: 'Replicadores, cadeias longas', proportion: 0.15, color: '#ff5577' },
      { id: 3, name: 'Minerais', shortName: 'Miner', description: 'Catalisadores, superficies', proportion: 0.15, color: '#aaaacc' },
      { id: 4, name: 'Agua', shortName: 'H2O', description: 'Solvente universal, meio', proportion: 0.15, color: '#4488ff' },
    ],
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 5, numParticles: 5000, frictionFactor: 0.08, forceFactor: 1.2 },
    matrices: {
      forces: [
        [-0.40, -0.70, -0.80,  0.20, -0.10],
        [-0.60, -0.85, -0.30,  0.30, -0.05],
        [-0.75, -0.25, -0.65, -0.40,  0.15],
        [ 0.10,  0.20, -0.35, -0.50,  0.05],
        [-0.05, -0.05,  0.10,  0.05, -0.15],
      ],
      minRadius: [
        [12, 10, 8, 25, 20],
        [10, 8, 15, 25, 18],
        [8, 15, 10, 12, 22],
        [25, 25, 12, 15, 20],
        [20, 18, 22, 20, 25],
      ],
      maxRadius: [
        [80, 100, 120, 70, 60],
        [100, 60, 90, 75, 55],
        [120, 90, 85, 110, 65],
        [70, 75, 110, 70, 60],
        [60, 55, 65, 60, 90],
      ],
    },
    colors: ['#66ffcc', '#ffaa33', '#ff5577', '#aaaacc', '#4488ff'],
  },
]

// ============================================================
// CANDIDATOS / STAKEHOLDERS (dados do TSE + pesquisa INTEIA)
// ============================================================

export interface ElectoralCandidate {
  id: string
  nome: string
  partido: string
  cargo: string
  cor: string
  orientacao: number  // 0=esquerda, 1=direita
  intencaoVoto: number | null
  rejeicao: number
  conhecimento: number
  areasFoco: string[]
  // Afinidade por cluster [Base, Campo, Mercado, Alheio] — escala -1 a +1
  afinidadeCluster: number[]
}

export const CANDIDATOS_RR: ElectoralCandidate[] = [
  {
    id: 'jorge-everton', nome: 'Jorge Everton', partido: 'UNIAO', cargo: 'Deputado Estadual',
    cor: '#2563eb', orientacao: 0.65, intencaoVoto: null, rejeicao: 18, conhecimento: 72,
    areasFoco: ['Fiscalizacao', 'Saude', 'Seguranca', 'CNH Gratis'],
    afinidadeCluster: [0.8, 0.5, 0.3, -0.2],
  },
  {
    id: 'soldado-sampaio', nome: 'Soldado Sampaio', partido: 'REPUBLICANOS', cargo: 'Governador',
    cor: '#f97316', orientacao: 0.70, intencaoVoto: 11.8, rejeicao: 16, conhecimento: 68,
    areasFoco: ['Seguranca', 'Interior', 'ALE'],
    afinidadeCluster: [0.4, 0.2, -0.1, 0.5],
  },
  {
    id: 'edilson-damiao', nome: 'Edilson Damiao', partido: 'REPUBLICANOS', cargo: 'Governador',
    cor: '#16a34a', orientacao: 0.75, intencaoVoto: 35, rejeicao: 20, conhecimento: 76,
    areasFoco: ['Interior', 'Base governista', 'Conservadorismo'],
    afinidadeCluster: [0.6, 0.3, 0.5, -0.3],
  },
  {
    id: 'teresa-surita', nome: 'Teresa Surita', partido: 'MDB', cargo: 'Governadora',
    cor: '#2563eb', orientacao: 0.45, intencaoVoto: 42, rejeicao: 26, conhecimento: 94,
    areasFoco: ['Gestao urbana', 'Boa Vista', 'Experiencia'],
    afinidadeCluster: [-0.1, 0.4, 0.3, 0.5],
  },
  {
    id: 'denarium', nome: 'Antonio Denarium', partido: 'PP', cargo: 'Senador',
    cor: '#2563eb', orientacao: 0.80, intencaoVoto: 24, rejeicao: 33, conhecimento: 96,
    areasFoco: ['Agronegocio', 'Interior', 'Maquina'],
    afinidadeCluster: [0.3, 0.1, 0.7, -0.4],
  },
  {
    id: 'catarina-guerra', nome: 'Catarina Guerra', partido: 'UNIAO', cargo: 'Dep. Estadual',
    cor: '#1d4ed8', orientacao: 0.50, intencaoVoto: null, rejeicao: 16, conhecimento: 69,
    areasFoco: ['Educacao', 'Mulheres', 'Saude'],
    afinidadeCluster: [0.2, 0.6, 0.1, 0.3],
  },
  {
    id: 'eder-lourinho', nome: 'Eder Lourinho', partido: 'PSDB', cargo: 'Dep. Estadual',
    cor: '#9333ea', orientacao: 0.50, intencaoVoto: null, rejeicao: 14, conhecimento: 62,
    areasFoco: ['Interior', 'Infraestrutura', 'Municipalismo'],
    afinidadeCluster: [0.1, 0.3, 0.5, 0.2],
  },
]

// ============================================================
// EVENTOS TEMPORARIOS (delta sobre baseline, com duracao em ticks)
// ============================================================

export interface ElectoralEvent {
  id: string
  nome: string
  descricao: string
  icone: string
  duracao: number  // ticks
  // Delta forces: somado ao baseline durante a duracao
  deltaForces4: number[][]  // 4x4 normalizado [-1,1]
  categoria: 'campanha' | 'crise' | 'competicao' | 'institucional'
}

export const EVENTOS_RR: ElectoralEvent[] = [
  {
    id: 'cnh-gratis', nome: 'CNH Gratis (TikTok)', descricao: 'JE lanca CNH gratis para baixa renda no TikTok. Campo atrai para Base.',
    icone: 'i-tabler-car', duracao: 300, categoria: 'campanha',
    deltaForces4: normMatrix([
      [0, -10, 0, 0],
      [-10, -3, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]),
  },
  {
    id: 'alianca-pastoral', nome: 'Alianca Pastoral', descricao: 'Pastor Diniz fecha apoio. Evangelicos migram para Base.',
    icone: 'i-tabler-cross', duracao: 400, categoria: 'campanha',
    deltaForces4: normMatrix([
      [-5, -15, 0, 0],
      [-15, -6, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]),
  },
  {
    id: 'delegado-protege', nome: 'Delegado Protege', descricao: 'Mensagem WhatsApp: delegado protege mulheres. Campo e Base se aproximam.',
    icone: 'i-tabler-shield', duracao: 250, categoria: 'campanha',
    deltaForces4: normMatrix([
      [0, -8, 0, 0],
      [-8, -5, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]),
  },
  {
    id: 'compra-voto', nome: 'Compra de Voto', descricao: 'Concorrente compra Mercado. Mercado dispersa, Campo perde eleitores.',
    icone: 'i-tabler-cash', duracao: 350, categoria: 'competicao',
    deltaForces4: normMatrix([
      [0, 0, 0, 0],
      [0, 0, -10, 0],
      [0, -10, 5, -5],
      [0, 0, -5, 0],
    ]),
  },
  {
    id: 'fake-news', nome: 'Fake News Massiva', descricao: 'Onda de desinformacao. Polarizacao sobe, tolerancia cai, caos.',
    icone: 'i-tabler-alert-triangle', duracao: 200, categoria: 'crise',
    deltaForces4: normMatrix([
      [-5, 5, 5, 8],
      [5, 3, -5, 5],
      [5, -5, 3, 0],
      [8, 5, 0, -5],
    ]),
  },
  {
    id: 'cassacao', nome: 'Cassacao Denarium', descricao: 'Governador cassado. Maquina fragmenta, Mercado dispersa, oportunidade e caos.',
    icone: 'i-tabler-gavel', duracao: 500, categoria: 'institucional',
    deltaForces4: normMatrix([
      [0, 0, 0, 0],
      [0, 2, -5, 3],
      [0, -5, 5, 0],
      [0, 3, 0, 5],
    ]),
  },
  {
    id: 'servico-mandato', nome: 'Servico de Mandato', descricao: 'JE entrega: 300 PC, CPI Saude, IPVA moto. Base e Campo se fortalecem.',
    icone: 'i-tabler-clipboard-check', duracao: 400, categoria: 'campanha',
    deltaForces4: normMatrix([
      [-5, -5, -5, 0],
      [-5, -3, -3, 0],
      [-5, -3, 0, 0],
      [0, 0, 0, 0],
    ]),
  },
  {
    id: 'crise-saude', nome: 'Crise de Saude', descricao: 'Colapso na saude publica. Engajamento sobe, Mercado se torna vulneravel.',
    icone: 'i-tabler-heartbeat', duracao: 300, categoria: 'crise',
    deltaForces4: normMatrix([
      [0, 0, 0, 0],
      [0, 0, -3, 0],
      [0, -3, 3, -3],
      [0, 0, -3, 0],
    ]),
  },
]

// Exported segment data for use in legends and matrix headers
export { CLUSTERS_4, SEGMENTOS_10 }
