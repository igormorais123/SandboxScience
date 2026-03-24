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
// CONVENÇÃO: POSITIVO = ATRAÇÃO, NEGATIVO = REPULSÃO (igual ao motor original).
// Redesign Helena Strategos: dinamica predador-presa eleitoral.
// Inspirado em Rock-Paper-Scissors (perseguicao ciclica) + Concentric Shells (coesao).
//
// Base = nucleo coeso (self +80), atrai Campo (+40), repele Mercado (-30)
// Campo = volatil (self +15), atraido por Base (+50), REPELE Mercado (-60)
// Mercado = predador (self +10), ATRAI Campo forte (+80), repele Base (-20)
// Alheio = bolha isolada (self +90), repele todos
//
// Assimetria chave: Mercado→Campo = +80 (caca), Campo→Mercado = -60 (fuga)
// Isso cria perseguicao eterna como Rock-Paper-Scissors.
const FORCE_4_RAW = [
  [ 80,   40,  -30,  -50],   // Base: coeso, atrai Campo, repele Mercado e Alheio
  [ 50,   15,  -60,  -20],   // Campo: atrai Base, coesao FRACA, FOGE de Mercado
  [-20,   80,   10,  -40],   // Mercado: repele Base, CACA Campo (+80), coesao fraca
  [-50,  -30,  -40,   90],   // Alheio: repele todos, auto-coesao MAXIMA (bolha densa)
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

// FORCE_10_RAW: POSITIVO = ATRAÇÃO, NEGATIVO = REPULSÃO.
// Inspirado em Concentric Shells + Rock-Paper-Scissors ciclico.
// Func=nucleo estavel, Comis=satelite Func, Evang=bloco coeso, Jovem=volatil (presa)
// Merc=predador (caca Jovem+MulP), Indig=bloco isolado, CMed=repele Indig/Evang
// Agro=pragmatico, MulP=vulneravel (Merc caca), Front=nucleo JE (coeso com Func)
const FORCE_10_RAW = [
//  Func  Comis Evang Jovem Merc  Indig CMed  Agro  MulP  Front
  [ 70,  60, -10, -15,  -5, -20,  30,   20,   15,  55],  // Func: coeso, atrai Comis+Front+CMed
  [ 65,  50, -15, -10,  25, -20,  -5,  -15,  -10,  25],  // Comis: satelite de Func
  [-10, -15,  70,  25, -15, -45,  45,   35,   35,  10],  // Evang: bloco coeso, atrai CMed+Agro+MulP
  [-20, -10,  25,  20, -60, -10, -10,  -15,   30, -10],  // Jovem: volatil, FOGE de Mercado (-60)
  [ -5,  30, -15,  70,  15,  10, -10,   10,   60, -15],  // Merc: CACA Jovem (+70) e MulP (+60)
  [-25, -20,  55, -10,  10,  75, -55,   10,  -10, -25],  // Indig: bloco isolado, repele CMed
  [ 35,  -5,  50, -10, -10, -55,  60,   35,  -10,  40],  // CMed: atrai Evang, repele Indig, coeso
  [ 20, -15,  35, -15,  10,  10,  35,   55,  -10,  25],  // Agro: pragmatico, atrai Func+CMed
  [ 15, -10,  35,  30, -55, -10, -10,  -10,   40, -10],  // MulP: presa, FOGE de Mercado (-55)
  [ 60,  25,  10, -10, -15, -25,  40,   25,  -10,  65],  // Front: nucleo JE, coeso com Func
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
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_4_RAW),
      // Raios na faixa que funciona: minR [30-60], maxR [90-150]
      minRadius: [
        [30, 35, 45, 50],   // Base: nucleo compacto
        [35, 40, 30, 45],   // Campo: zona media, proximo de Mercado (sente cedo)
        [45, 30, 40, 50],   // Mercado: chega perto de Campo (minR=30)
        [50, 45, 50, 25],   // Alheio: distante de tudo, compacto entre si
      ],
      maxRadius: [
        [100, 130, 95,  80],   // Base: busca Campo longe
        [120, 100, 140, 90],   // Campo: sente Mercado longe (140=fuga antecipada)
        [95,  150, 100, 85],   // Mercado: alcanca Campo em 150px (caca!)
        [80,  90,  85,  70],   // Alheio: zona curta, bolha isolada
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
    settings: { species: 10, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_10_RAW),
      minRadius: uniformRadius(10, 30, 50),
      maxRadius: uniformMaxRadius(10, 90, 140),
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
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      // Alianca pastoral: Base e Campo se fundem forte (ambos +60 mutuo)
      forces: normMatrix([
        [ 85,  60, -25, -50],   // Base: SUPER coeso, puxa Campo FORTE
        [ 60,  25, -55, -20],   // Campo: migra para Base, foge Mercado
        [-25,  70,  10, -40],   // Mercado: perde alvo (Campo protegido pela Base)
        [-50, -25, -40,  90],   // Alheio: bolha isolada
      ]),
      minRadius: [
        [28, 30, 45, 50],
        [30, 38, 32, 45],
        [45, 32, 40, 50],
        [50, 45, 50, 25],
      ],
      maxRadius: [
        [100, 140, 95, 80],
        [130, 100, 135, 90],
        [95, 145, 100, 85],
        [80, 90, 85, 70],
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Compra de Voto',
      description: 'Mercado ativado: persegue Campo com forca maxima, perde coesao interna.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      // Mercado enloquece: persegue Campo com tudo, perde auto-coesao
      forces: normMatrix([
        [ 75,  35, -25, -50],   // Base: tenta manter nucleo
        [ 40,  15, -70, -20],   // Campo: FOGE de Mercado forte (-70)
        [-20,  90,   5, -35],   // Mercado: CACA Campo +90 (maximo!), coesao minima
        [-50, -25, -40,  85],   // Alheio: bolha
      ]),
      minRadius: [
        [30, 35, 45, 50],
        [35, 42, 30, 45],
        [45, 28, 42, 50],      // Mercado chega perto de Campo (minR=28)
        [50, 45, 50, 25],
      ],
      maxRadius: [
        [100, 125, 90, 80],
        [115, 95, 145, 90],    // Campo sente Mercado de longe (145)
        [90, 150, 95, 80],     // Mercado alcanca Campo em 150
        [80, 90, 80, 70],
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Fake News Viral',
      description: 'Desinformacao massiva. Coesao cai, repulsao sobe. Tipo Rock-Paper-Scissors descontrolado.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.12, forceFactor: 1.0 },
    matrices: {
      // Inspirado em anti-symmetric swirl: todos perseguem o proximo, fogem do anterior
      forces: normMatrix([
        [ 40, -50,  60, -30],   // Base: repele Campo, persegue Mercado (confusao)
        [ 60,  30, -50, -20],   // Campo: persegue Base, repele Mercado
        [-50,  60,  20, -40],   // Mercado: persegue Campo, repele Base (caos ciclico)
        [ 30, -30,  40,  50],   // Alheio: atrai tudo (absorve desistentes)
      ]),
      minRadius: [
        [35, 40, 35, 45],
        [35, 35, 40, 45],
        [40, 35, 38, 45],
        [45, 45, 45, 30],
      ],
      maxRadius: [
        [110, 130, 120, 100],
        [120, 100, 130, 110],
        [130, 120, 100, 110],
        [100, 110, 110, 90],
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — CNH Gratis',
      description: 'Programa social: Base puxa Campo para dentro. Organismo Base+Campo cresce.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix([
        [ 85,  55, -30, -50],   // Base: atrai Campo FORTE (CNH funcionou)
        [ 60,  20, -55, -20],   // Campo: migra para Base, ainda foge Mercado
        [-25,  75,  10, -40],   // Mercado: perde grip (Campo na orbita da Base)
        [-50, -25, -40,  90],   // Alheio: estavel
      ]),
      minRadius: [
        [28, 30, 45, 50],
        [30, 38, 32, 45],
        [45, 30, 40, 50],
        [50, 45, 50, 25],
      ],
      maxRadius: [
        [105, 140, 95, 80],    // Base busca Campo longe
        [130, 100, 135, 90],
        [95, 145, 100, 85],
        [80, 90, 85, 70],
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Cenario Otimista JE',
      description: 'CNH + pastoral + Denarium. Base absorve Campo e ate Mercado. Organismo politico dominante.',
      category: 'Estrategia JE',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      // Hub and Spokes: Base e o hub, todos orbitam
      forces: normMatrix([
        [ 90,  65,   30, -45],   // Base: SUPER coeso, puxa Campo E Mercado
        [ 70,  30,  -40, -15],   // Campo: forte atracao a Base, foge Mercado menos
        [ 35,  50,   15, -35],   // Mercado: atraido por Base E Campo (maquina funciona)
        [-50, -20,  -35,  85],   // Alheio: irrelevante, bolha
      ]),
      minRadius: [
        [25, 30, 35, 50],
        [30, 35, 35, 45],
        [35, 32, 38, 48],
        [50, 45, 48, 25],
      ],
      maxRadius: [
        [110, 145, 130, 80],   // Base domina o espaco
        [135, 100, 130, 85],
        [120, 140, 100, 85],
        [80, 85, 85, 70],
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Cenario Pessimista JE',
      description: 'Concorrentes compram Mercado, fake news, crise. Base perde coesao, Mercado domina.',
      category: 'Estrategia JE',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.13, forceFactor: 1.0 },
    matrices: {
      // Base fraca, Mercado caca livremente, Campo em panico
      forces: normMatrix([
        [ 40,  20, -15, -45],   // Base: coesao FRACA, Campo escapa
        [ 25,  10, -75, -20],   // Campo: foge de Mercado FORTE (-75)
        [-15,  90,   5, -30],   // Mercado: SUPER predador caca Campo +90
        [-45, -25, -35,  80],   // Alheio: cresce (absorve desistentes)
      ]),
      minRadius: [
        [35, 38, 45, 50],
        [38, 42, 30, 45],
        [45, 28, 40, 50],
        [50, 45, 50, 28],
      ],
      maxRadius: [
        [95, 115, 90, 80],     // Base perde alcance
        [105, 90, 145, 90],
        [90, 150, 95, 85],     // Mercado alcanca Campo em 150
        [80, 90, 85, 75],
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Cassacao Denarium',
      description: 'Governador cassado. Maquina fragmenta. Tipo anti-symmetric swirl: todos se perseguem ciclicamente.',
      category: 'Eventos RR',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.12, forceFactor: 1.0 },
    matrices: {
      // Anti-symmetric: A persegue B, B persegue C, C persegue D, D persegue A
      forces: normMatrix([
        [ 50,  70, -60, -40],   // Base: persegue Campo, foge de Mercado
        [-40,  30,  70, -50],   // Campo: foge Base, persegue Mercado
        [ 60, -50,  25,  65],   // Mercado: persegue Base, foge Campo, persegue Alheio
        [-50,  55, -45,  40],   // Alheio: coesao cai, tudo gira
      ]),
      minRadius: [
        [32, 35, 40, 48],
        [35, 35, 35, 45],
        [40, 35, 38, 42],
        [48, 45, 42, 30],
      ],
      maxRadius: [
        [105, 130, 120, 95],
        [120, 100, 130, 110],
        [120, 130, 100, 115],
        [95, 110, 115, 85],
      ],
    },
    colors: CLUSTERS_4.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'RR — Servico de Mandato',
      description: 'JE entrega: 300 PC, CPI Saude. Tipo Concentric Shells: Base nucleo, Campo orbita, Mercado periferia.',
      category: 'Estrategia JE',
    },
    segments: CLUSTERS_4,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 4, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      // Concentric Shells: Base nucleo, Campo primeira orbita, Mercado segunda, Alheio fora
      forces: normMatrix([
        [ 80,  45, -20, -55],   // Base: coeso, atrai Campo, repele Mercado/Alheio
        [ 50,  20, -50, -20],   // Campo: orbita Base, foge Mercado
        [-25,  70,  15, -40],   // Mercado: caca Campo mas Base protege
        [-55, -25, -40,  90],   // Alheio: isolado
      ]),
      minRadius: [
        [30, 32, 45, 50],
        [32, 38, 32, 45],
        [45, 30, 40, 50],
        [50, 45, 50, 25],
      ],
      maxRadius: [
        [100, 135, 95, 80],
        [125, 100, 135, 90],
        [95, 145, 100, 85],
        [80, 90, 85, 70],
      ],
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
    // Hub and Spokes: Buracos Negros = hub central, tudo orbita
    settings: { species: 5, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      // POSITIVO = ATRAÇÃO. Inspirado em Hub&Spokes + Concentric Shells.
      // Buracos Negros atraem tudo. Gigantes atraem anas. Nebulosas sao neutras.
      forces: [
        [ 0.80,  0.50,  0.30, -0.20,  0.90],  // Gigantes: coesas, atraem anas, atraem BHole
        [ 0.40,  0.60,  0.20,  0.10,  0.70],  // Anas: atraem gigantes, coesas, atraem BHole
        [ 0.25,  0.15,  0.30, -0.10,  0.60],  // Nebulosas: leve atracao a todos, coesao media
        [-0.15, -0.10,  0.10,  0.50, -0.30],  // Materia Escura: repele estrelas, coesa, repele BHole
        [ 0.95,  0.85,  0.70,  0.40, -0.05],  // Buracos Negros: atraem TUDO, self quase neutro
      ],
      minRadius: [
        [30, 35, 40, 45, 30],
        [35, 32, 38, 42, 32],
        [40, 38, 35, 45, 35],
        [45, 42, 45, 30, 42],
        [30, 32, 35, 42, 35],
      ],
      maxRadius: [
        [100, 130, 120, 140, 110],
        [120, 100, 115, 135, 120],
        [110, 110, 95, 125, 115],
        [140, 135, 125, 110, 130],
        [145, 140, 135, 140, 90],
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
    // Rock-Paper-Scissors ciclico: Predadores cacam Bacterias, Bacterias fogem, Virus infectam
    settings: { species: 6, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      // POSITIVO = ATRAÇÃO. Predadores atraem presas, presas fogem.
      forces: [
        [ 0.60, -0.20,  0.30, -0.40,  0.10,  0.20],  // Bact: coesas, fogem de Algas, atraem Pred(!), fogem Virus
        [ 0.15,  0.70,  0.20, -0.30,  0.15,  0.10],  // Algas: atraem Bact, coesas, fogem Virus
        [ 0.80,  0.60, -0.10,  0.15, -0.20,  0.45],  // Pred: CACAM Bact+Algas, self neutro, cacam Amebas
        [-0.50, -0.40, -0.15,  0.25, -0.35, -0.25],  // Virus: repelem tudo, leve coesao
        [ 0.35,  0.25, -0.10,  0.55,  0.50,  0.10],  // Fungos: atraem Bact, atraem Virus (decompoe), coesos
        [ 0.55,  0.45,  0.35,  0.20,  0.10,  0.65],  // Amebas: atraem TUDO (englobam), coesas
      ],
      minRadius: [
        [32, 40, 35, 42, 38, 38],
        [38, 30, 35, 40, 35, 38],
        [30, 30, 38, 40, 42, 35],
        [45, 45, 42, 35, 40, 42],
        [35, 35, 40, 32, 32, 38],
        [35, 35, 35, 38, 38, 28],
      ],
      maxRadius: [
        [95, 110, 120, 105, 100, 105],
        [105, 90, 110, 105, 100, 100],
        [140, 130, 95, 105, 100, 115],
        [130, 130, 115, 100, 125, 120],
        [110, 105, 100, 135, 90, 105],
        [125, 120, 110, 110, 105, 85],
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
    // Chains + Dimers: moleculas formam cadeias e membranas espontaneamente
    settings: { species: 5, numParticles: 5000, frictionFactor: 0.15, forceFactor: 1.0 },
    matrices: {
      // POSITIVO = ATRAÇÃO. Inspirado em Chains2: self coeso, vizinho atrai, distante repele.
      // Amino→Lipidio→RNA→Mineral→Agua→Amino (cadeia ciclica)
      forces: [
        [ 0.70,  0.80,  0.30, -0.20,  0.10],  // Amino: coeso, atrai Lipidio FORTE (forma membrana)
        [ 0.60,  0.85,  0.35, -0.25,  0.05],  // Lipidio: atrai Amino, MUITO coeso (membrana)
        [ 0.25,  0.30,  0.70,  0.50, -0.15],  // RNA: atrai Mineral (catalise), coeso
        [-0.15, -0.20,  0.45,  0.55, -0.05],  // Mineral: atrai RNA, coeso, repele organicos
        [ 0.05,  0.05, -0.10,  0.05,  0.20],  // Agua: quase neutro, leve coesao (solvente)
      ],
      minRadius: [
        [32, 30, 38, 45, 42],
        [30, 28, 35, 42, 40],
        [38, 35, 32, 32, 42],
        [45, 42, 32, 35, 42],
        [42, 40, 42, 42, 40],
      ],
      maxRadius: [
        [95, 120, 105, 90, 85],
        [115, 90, 105, 95, 85],
        [105, 100, 95, 120, 90],
        [90, 95, 120, 95, 85],
        [85, 85, 90, 85, 100],
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
