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

// ---- Normalization: raw force range [-60, +60] → [-1, 1] ----
const FORCE_SCALE = 60
function norm(raw: number): number {
  return Math.max(-1, Math.min(1, raw / FORCE_SCALE))
}
function normMatrix(raw: number[][]): number[][] {
  return raw.map(row => row.map(v => norm(v)))
}

// ---- Uniform radius matrices ----
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
  { id: 0, name: 'Base Fiel',      shortName: 'Base',    description: 'Eleitorado ja conquistado, manter engajado', proportion: 0.18, color: '#1a4a8a', strategicAction: 'MANTER' },
  { id: 1, name: 'Campo Disputa',  shortName: 'Campo',   description: 'Onde se ganha a eleicao, volatil e decisivo', proportion: 0.42, color: '#7744bb', strategicAction: 'CONQUISTAR' },
  { id: 2, name: 'Mercado do Voto',shortName: 'Mercado',  description: 'Compra de voto, negociacao, traicao frequente', proportion: 0.25, color: '#cc7020', strategicAction: 'DISPUTAR' },
  { id: 3, name: 'Alheio',         shortName: 'Alheio',   description: 'Nao vota ou e intratavel, nao investir', proportion: 0.15, color: '#cc2020', strategicAction: 'IGNORAR' },
]

const FORCE_4_RAW = [
  [-40, -15,  -5,   5],
  [-15, -12, -20,   0],
  [ -5, -20,  -8,  -5],
  [  5,   0,  -5, -35],
]

// ============================================================
// 10 SEGMENTOS DE RORAIMA — Visao granular
// ============================================================

const SEGMENTOS_10: ElectoralSegment[] = [
  { id: 0, name: 'Funcionalismo',   shortName: 'Func',  description: 'Servidores publicos, voto por emprego', proportion: 0.108, color: '#1a6b7a' },
  { id: 1, name: 'Comissionados',   shortName: 'Comis', description: 'Cargos de confianca, voto cativo do deputado', proportion: 0.038, color: '#3a3a4a' },
  { id: 2, name: 'Evangelicos',     shortName: 'Evang', description: 'Pastor indica, rebanho segue', proportion: 0.141, color: '#d4a030' },
  { id: 3, name: 'Jovens Urbanos',  shortName: 'Jovem', description: 'TikTok, volateis, decidem tarde', proportion: 0.251, color: '#8855cc' },
  { id: 4, name: 'Mercado do Voto', shortName: 'Merc',  description: 'R$800/voto, traem no sigilo', proportion: 0.128, color: '#cc7020' },
  { id: 5, name: 'Indigena Org.',   shortName: 'Indig', description: 'CIR organiza, voto em bloco', proportion: 0.090, color: '#cc2020' },
  { id: 6, name: 'Classe Media',    shortName: 'CMed',  description: 'Bolsonaristas convictos, ideologicos', proportion: 0.090, color: '#2266cc' },
  { id: 7, name: 'Interior Agro',   shortName: 'Agro',  description: 'Querem estrada e energia, pragmaticos', proportion: 0.077, color: '#33aa55' },
  { id: 8, name: 'Mulheres Perif.', shortName: 'MulP',  description: 'Periferia, buscam protecao e servicos', proportion: 0.052, color: '#cc4488' },
  { id: 9, name: 'Fronteira/Seg.',  shortName: 'Front', description: 'PM/PC/PF, berco de Jorge Everton', proportion: 0.025, color: '#1a5530' },
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
    settings: { species: 4, numParticles: 1000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_4_RAW),
      minRadius: uniformRadius(4, 30, 50),
      maxRadius: uniformMaxRadius(4, 60, 80),
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
    settings: { species: 10, numParticles: 1000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_10_RAW),
      minRadius: uniformRadius(10, 25, 45),
      maxRadius: uniformMaxRadius(10, 55, 80),
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
    settings: { species: 4, numParticles: 1000, frictionFactor: 0.15, forceFactor: 1.0 },
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
    settings: { species: 4, numParticles: 1000, frictionFactor: 0.15, forceFactor: 1.0 },
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
    settings: { species: 4, numParticles: 1000, frictionFactor: 0.15, forceFactor: 1.0 },
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
]

// Exported segment data for use in legends and matrix headers
export { CLUSTERS_4, SEGMENTOS_10 }
