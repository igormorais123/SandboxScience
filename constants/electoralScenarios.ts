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
// 10 SEGMENTOS — MODELO DOCUMENTAL (dados reais TSE/Censo/Pesquisa)
// ============================================================
// Proporcoes calibradas por:
//   - Censo 2022: 636.707 hab, 366.240 eleitores
//   - Religiao Censo 2022: 37.9% cat, 35.0% evang, 16.9% sem religiao
//   - Cor/Raca Censo 2022: 57.2% parda, 20.6% branca, 14.1% indigena
//   - PIB RR: 47.1% admin publica (IBGE 2023)
//   - TSE 2022: Bolsonaro 76.08% (maior do Brasil), Denarium 56.47%
//   - Pesquisa INTEIA (n=200): pastor 25.5% influencia, igreja 19.5%
//   - Faixa etaria mediana: 26 anos (estado mais jovem do Brasil)
//
// JUSTIFICATIVA DA MATRIZ DE FORCAS (cada celula documentada):
//
// Func→Func (+75): servidores = 47.1% do PIB, corporativismo extremo.
//   Alta interdependencia: demissao coletiva = colapso do estado.
// Func→Comis (+65): comissionados dependem estruturalmente dos efetivos
//   para operar a maquina. Alianca natural dentro do funcionalismo.
// Func→Evang (-5): relacao neutra. Funcionalismo e transversal a religiao
//   (servidores sao evangelicos E catolicos). Leve tensao por pautas de costumes.
// Func→Jovem (-20): jovens contestam emprego publico como privilegio.
//   Pesquisa INTEIA: economia e desemprego sao prioridades 1 e 4.
// Func→Merc (-10): funcionalismo tem salario fixo, pouca vulnerabilidade
//   ao mercado de voto. Leve repulsa moral.
// Func→Indig (-25): tensao historica: funcionalismo estadual vs demarcacao.
//   Governo RR = anti-demarcacao (Denarium pro-garimpo). Servidores alinham.
// Func→CMed (+35): classe media urbana e funcionalismo se sobrepoe em BV.
//   Ambos bolsonaristas (76% em 2022), interesses convergentes.
// Func→Agro (+20): funcionalismo depende de arrecadacao, agro cresceu 118.6%.
//   Alianca pragmatica: agro gera receita, estado gera emprego.
// Func→MulP (+10): mulheres perifericas usam servicos publicos (saude, CRAS).
//   Funcionalismo atende essa demanda. Atracao fraca mas positiva.
// Func→Front (+55): seguranca publica E funcionalismo. PM/PC sao servidores
//   estaduais. Sobreposicao direta. Forte atracao.
//
// Comis→Func (+60): comissionados orbitam os efetivos por sobrevivencia.
// Comis→Comis (+45): coesao moderada. Competem entre si por cargos limitados.
// Comis→Evang (-10): neutro com leve tensao — comissionados seguem o chefe, nao o pastor.
// Comis→Jovem (+15): comissionados recrutam jovens para cargos de confianca.
//   Estrategia real: ofertar emprego publico a faixa 25-34 (23.7% do eleitorado).
// Comis→Merc (+30): comissionados sao intermediarios naturais da compra de voto.
//   Ponto de contato entre maquina e mercado. Alta afinidade operacional.
// Comis→Indig (-15): distancia cultural. Terras indigenas = 46% do territorio,
//   mas comissionados sao urbanos (65% do estado em BV).
// Comis→CMed (-10): classe media desconfia de comissionados (vistos como cabide).
// Comis→Agro (-5): neutro. Pouca interacao direta.
// Comis→MulP (+5): comissionados distribuem beneficios em periferias.
// Comis→Front (+20): seguranca e comissionados compartilham estrutura estatal.
//
// Evang→Func (-5): neutro-negativo. Ver simetria com Func→Evang.
// Evang→Comis (-10): ver simetria.
// Evang→Evang (+80): MAIOR coesao da simulacao. Dado: 35% da populacao evangelica
//   (2o maior bloco religioso), pastor = 25.5% influencia no voto (PESQUISA INTEIA).
//   Voto em bloco documentado em todas as eleicoes de RR.
// Evang→Jovem (+30): evangelicos recrutam jovens ativamente (cultos, musica,
//   midias sociais). Dado: faixa 18-24 = 15% do eleitorado, maioria em BV.
// Evang→Merc (-20): evangelicos rejeitam moralmente a compra de voto.
//   "Voto e sagrado" e narrativa pastoral dominante.
// Evang→Indig (-50): MAIOR tensao intergrupal. Missionarios vs tradicoes indigenas.
//   Conflito historico: evangelizacao em terras Yanomami documentada.
//   Bolsonaro = 76% em RR, mas Uiramuta (88% indigena) = 68% Lula.
// Evang→CMed (+45): alianca bolsonarista. Evangelicos + classe media = base
//   ideologica de direita. RR votou 76% Bolsonaro (maior do Brasil).
// Evang→Agro (+35): alianca rural-religiosa. Interior = evangelico + agro.
//   Municipios do interior: Rorainopolis, Caracarai, Pacaraima.
// Evang→MulP (+35): mulheres perifericas sao principal publico das igrejas.
//   Dado: feminino = 51.33% do eleitorado. Acolhimento como porta de entrada.
// Evang→Front (+10): neutro-positivo. Militares e policiais frequentam igrejas
//   mas relacao nao e estruturante.
//
// Jovem→Func (-15): jovens contestam estabilidade publica. Desemprego = prioridade 4.
// Jovem→Comis (+10): comissionados oferecem primeiro emprego. Ver Comis→Jovem.
// Jovem→Evang (+20): jovens atraidos por culto evangelico. Ver Evang→Jovem.
// Jovem→Jovem (+15): BAIXA coesao. Jovens sao o segmento mais volatil.
//   Dado: idade mediana RR = 26 anos, mas fragmentado (TikTok, funk, gamer, igreja).
// Jovem→Merc (-55): jovens FOGEM da compra de voto (maior rejeicao apos evangelicos).
//   Dado: corrupcao = tema 6 na pesquisa INTEIA (26 mencoes).
// Jovem→Indig (-5): neutro. Pouca interacao direta em BV.
// Jovem→CMed (-15): jovens rejeitam conservadorismo rigido da classe media.
// Jovem→Agro (-10): jovens urbanos desconectados do agro.
// Jovem→MulP (+25): solidariedade geracional. Jovens e mulheres perifericas
//   compartilham vulnerabilidade socioeconomica. 50% em classes D/E.
// Jovem→Front (-5): neutro-negativo. PM gera ambivalencia em jovens perifericos.
//
// Merc→Func (+5): mercado tenta cooptar funcionalismo (oferta a servidores de baixo escalao).
// Merc→Comis (+35): mercado opera ATRAVES de comissionados. Canal principal.
//   Dado: comissionados = 3.8%, mas sao engrenagem da compra de voto.
// Merc→Evang (-15): mercado evita evangelicos (bloco coeso, dificil comprar individualmente).
// Merc→Jovem (+65): mercado CACA jovens. Principal alvo por vulnerabilidade economica.
//   Dado: R$800/voto (valor documentado em RR). 50% em classes D/E.
//   Desemprego jovem = porta de entrada para mercado de voto.
// Merc→Merc (+10): coesao baixa. Mercado e transacional, sem lealdade interna.
// Merc→Indig (+15): mercado tenta comprar caciques. Sucesso parcial em
//   municipios com CIR mais fraco.
// Merc→CMed (-15): classe media nao vende voto (renda suficiente).
// Merc→Agro (+10): agro no interior e vulneravel a compra de voto.
// Merc→MulP (+55): mercado caca mulheres perifericas. 2o alvo apos jovens.
//   Dado: mulheres perif. = 5.2%, vulnerabilidade socioeconomica maxima.
// Merc→Front (-20): seguranca publica e antagonista do mercado (fiscalizacao).
//
// Indig→Func (-20): tensao. Ver Func→Indig (simetria).
// Indig→Comis (-15): distancia. Ver Comis→Indig.
// Indig→Evang (-50): MAIOR repulsa reciproca. Missionarios vs tradicoes.
//   Ver Evang→Indig. Conflito bilateral.
// Indig→Jovem (-5): neutro. Jovens indigenas existem mas sao minoria.
// Indig→Merc (+10): mercado oferece dinheiro, alguns aceitam. Ver Merc→Indig.
// Indig→Indig (+85): 2a MAIOR coesao. CIR (Conselho Indigena de Roraima) organiza
//   voto em bloco. 14.1% da populacao (MAIOR do Brasil).
//   Dado: Uiramuta = 68% Lula num estado 76% Bolsonaro. Voto contra a corrente.
// Indig→CMed (-55): antagonismo ideologico total. Indigenas = demarcacao,
//   CMed = anti-demarcacao, pro-garimpo. Conflito Yanomami 2023.
// Indig→Agro (-30): agro quer terra, indigenas defendem demarcacao. Conflito direto.
//   Dado: 46% do territorio de RR e terra indigena.
// Indig→MulP (+5): neutro-positivo. Mulheres indigenas sao liderancas crescentes.
// Indig→Front (-30): PM/PF = operacoes em terra indigena. Tensao historica.
//
// CMed→Func (+30): sobreposicao em BV. Ver Func→CMed.
// CMed→Comis (-5): desconfianca de cabide. Ver Comis→CMed.
// CMed→Evang (+50): alianca ideologica forte. Ver Evang→CMed.
// CMed→Jovem (-10): ver Jovem→CMed (simetria fraca).
// CMed→Merc (-15): rejeicao moral. Ver Merc→CMed.
// CMed→Indig (-55): antagonismo total reciproco. Ver Indig→CMed.
// CMed→CMed (+60): coesao alta. Bolsonarismo como identidade de grupo.
//   Dado: 76% Bolsonaro em RR, classe media e nucleo ideologico.
// CMed→Agro (+40): alianca economica. Agronegocio + classe media = base produtiva.
//   Dado: agro cresceu 118.6% (2019-2023). Interesses alinhados.
// CMed→MulP (-5): neutro-negativo. Distancia socioeconomica.
// CMed→Front (+40): militares + classe media = base bolsonarista. Afinidade forte.
//
// Agro→Func (+15): ver Func→Agro.
// Agro→Comis (-5): neutro. Pouca interacao.
// Agro→Evang (+30): alianca rural-religiosa. Ver Evang→Agro.
// Agro→Jovem (-10): ver Jovem→Agro.
// Agro→Merc (+10): ver Merc→Agro.
// Agro→Indig (-35): conflito por terra. Ver Indig→Agro (intensidade assimetrica:
//   agro quer expandir, indigenas defendem. Agro mais agressivo).
// Agro→CMed (+35): alianca produtiva. Ver CMed→Agro.
// Agro→Agro (+55): coesao alta. Ruralistas organizam em bloco (sindicatos, cooperativas).
//   Dado: agropecuaria = setor que mais cresce em RR (+118.6%).
// Agro→MulP (-5): neutro. Pouca interacao direta.
// Agro→Front (+25): seguranca rural (abigeato, invasao). PM atua no interior.
//
// MulP→Func (+15): demanda servicos publicos. Ver Func→MulP.
// MulP→Comis (+5): comissionados distribuem beneficios. Ver Comis→MulP.
// MulP→Evang (+30): igrejas acolhem. Ver Evang→MulP.
// MulP→Jovem (+25): solidariedade geracional. Ver Jovem→MulP.
// MulP→Merc (-50): mulheres FOGEM do mercado de voto (medo de represalia).
//   Dado: pesquisa INTEIA — mulheres perifericas citam "protecao" como prioridade.
// MulP→Indig (+5): ver Indig→MulP.
// MulP→CMed (-10): distancia socioeconomica.
// MulP→Agro (-5): neutro.
// MulP→MulP (+40): coesao moderada. Redes de vizinhanca e parentesco.
// MulP→Front (-10): ambivalencia com PM (protecao vs violencia policial).
//
// Front→Func (+55): sobreposicao PM/PC = servidores. Ver Func→Front.
// Front→Comis (+20): ver Comis→Front.
// Front→Evang (+10): ver Evang→Front.
// Front→Jovem (-10): PM desconfia de jovens perifericos. Tensao operacional.
// Front→Merc (-25): seguranca fiscaliza compra de voto. Antagonismo direto.
// Front→Indig (-30): operacoes em terra indigena. Ver Indig→Front.
// Front→CMed (+40): base bolsonarista. Ver CMed→Front.
// Front→Agro (+25): seguranca rural. Ver Agro→Front.
// Front→MulP (-5): neutro-negativo. Ver MulP→Front.
// Front→Front (+70): coesao corporativa alta. Esprit de corps policial/militar.

// Matriz calculada por 5 proxies ponderados (script: calibrar_matriz_documental.py)
// V=alinhamento eleitoral(0.30), G=geografia(0.15), E=economia(0.20), S=social(0.15), I=ideologia(0.20)
// Diagonal = homogeneidade_de_voto × nivel_organizacional × 100
const FORCE_10_DOCUMENTAL = [
//  Func  Comis Evang Jovem Merc  Indig CMed  Agro  MulP  Front
  [  56,   74,   52,   48,   32,  -24,   56,   40,   40,   63],  // Func  (H=0.70×O=0.80=56)
  [  82,   48,   55,   38,   35,  -27,   59,   38,   31,   50],  // Comis (H=0.80×O=0.60=48)
  [  52,   55,   76,   44,   26,  -42,   61,   52,   41,   60],  // Evang (H=0.85×O=0.90=76)
  [  44,   38,   38,    4,   32,    6,   30,   18,   62,   27],  // Jovem (H=0.25×O=0.15=4)
  [  32,   33,   26,   62,    2,   22,   13,   20,   66,   15],  // Merc  (H=0.15×O=0.10=2)
  [ -26,  -27,  -44,    6,   22,   81,  -55,  -28,   13,  -31],  // Indig (H=0.90×O=0.90=81)
  [  56,   59,   61,   30,   13,  -55,   41,   47,   22,   59],  // CMed  (H=0.82×O=0.50=41)
  [  42,   38,   52,   18,   20,  -24,   45,   39,   13,   47],  // Agro  (H=0.65×O=0.60=39)
  [  48,   31,   42,   62,   38,   13,   22,   13,   12,   22],  // MulP  (H=0.40×O=0.30=12)
  [  63,   50,   60,   27,   13,  -31,   59,   47,   22,   75],  // Front (H=0.88×O=0.85=75)
]

// Raios calculados: minR = 45 - coesao*25 (diagonal) ou 40 - forca*15 (off-diagonal)
// maxR = 80 + coesao*30 (diagonal) ou 95 + alcance*40 + forca*15 (off-diagonal)
const MIN_RADIUS_10_DOC = [
//  Func  Comis Evang Jovem Merc  Indig CMed  Agro  MulP  Front
  [ 31,   28,   32,   32,   35,   43,   31,   34,   34,   30],  // Func
  [ 27,   33,   31,   34,   34,   44,   31,   34,   35,   32],  // Comis
  [ 32,   31,   25,   33,   36,   46,   30,   32,   33,   31],  // Evang
  [ 33,   34,   34,   44,   35,   39,   35,   37,   30,   35],  // Jovem
  [ 35,   35,   36,   30,   44,   36,   38,   37,   30,   37],  // Merc
  [ 43,   44,   46,   39,   36,   24,   48,   44,   38,   44],  // Indig
  [ 31,   31,   30,   35,   38,   48,   34,   32,   36,   31],  // CMed
  [ 33,   34,   32,   37,   37,   43,   33,   35,   38,   32],  // Agro
  [ 32,   35,   33,   30,   34,   38,   36,   38,   42,   36],  // MulP
  [ 30,   32,   31,   35,   38,   44,   31,   32,   36,   26],  // Front
]

const MAX_RADIUS_10_DOC = [
//  Func  Comis Evang Jovem Merc  Indig CMed  Agro  MulP  Front
  [ 96,  126,  122,  122,  119,  111,  123,  121,  121,  124],  // Func
  [131,   94,  127,  124,  124,  114,  127,  124,  123,  126],  // Comis
  [134,  135,  102,  133,  130,  120,  136,  134,  133,  136],  // Evang
  [129,  128,  128,   81,  127,  123,  127,  125,  132,  127],  // Jovem
  [135,  135,  134,  140,   80,  134,  132,  134,  140,  133],  // Merc
  [ 99,   98,   96,  103,  106,  104,   94,   98,  104,   98],  // Indig
  [123,  123,  124,  119,  116,  106,   92,  122,  118,  123],  // CMed
  [117,  116,  118,  113,  114,  107,  117,   91,  112,  118],  // Agro
  [114,  111,  113,  116,  112,  108,  110,  108,   83,  110],  // MulP
  [128,  126,  128,  123,  120,  114,  127,  126,  122,  102],  // Front
]

// ============================================================
// CENARIO PRE-ELEITORAL JORGE EVERTON — Dep. Estadual RR 2026
// ============================================================
// Segmentos definidos pela DECISAO DE CAMPANHA: onde investir?
// Cross-tabs reais: pesquisa INTEIA n=200 + relatorio JE
// Script: calibrar_cenario_jorge_everton.py

const SEGMENTOS_JE: ElectoralSegment[] = [
  { id: 0, name: 'Base JE',          shortName: 'Base',    description: 'Homens 35+, cat, c-dir, BV, policia. JE=45%', proportion: 0.18, color: '#00ccff', strategicAction: 'MANTER' },
  { id: 1, name: 'Convertivel',      shortName: 'Conv',    description: '2a opcao JE (35%). Conhecem, gostam, nao decidiram', proportion: 0.20, color: '#44ee88', strategicAction: 'CONVERTER' },
  { id: 2, name: 'Evang. Sampaio',   shortName: 'Evang',   description: 'Bloco pastoral. JE=16%, Sampaio=42%. Gap 26pp', proportion: 0.14, color: '#ffcc33', strategicAction: 'INFILTRAR' },
  { id: 3, name: 'Mulheres BV',      shortName: 'MulBV',   description: 'JE=30% vs 39% homens. Gap 9pp. Catarina=28%', proportion: 0.12, color: '#ff66aa', strategicAction: 'CONQUISTAR' },
  { id: 4, name: 'Interior Disp.',   shortName: 'Inter',   description: 'JE=28.8% vs Neto=26.1%. 2.7pp margem erro', proportion: 0.10, color: '#ff9933', strategicAction: 'CONSOLIDAR' },
  { id: 5, name: 'Jovens Volateis',  shortName: 'Jovem',   description: '16-29 anos. JE=32% (lidera). Decidem tarde', proportion: 0.12, color: '#bb77ff', strategicAction: 'ENGAJAR' },
  { id: 6, name: 'Adversarios',      shortName: 'Adver',   description: 'Esquerda (Catarina 94%) + CIR. JE=3%', proportion: 0.08, color: '#ff4444', strategicAction: 'IGNORAR' },
  { id: 7, name: 'Mercado Voto',     shortName: 'Merc',    description: 'Classes D/E transacionais. R$800/voto', proportion: 0.06, color: '#888888', strategicAction: 'MONITORAR' },
]

// Diagonal = H*O*100. Off-diagonal = interacao documentada por cross-tabs
const FORCE_JE_RAW = [
//  BaseJE  Conv  Evang  MulBV  Inter  Jovem  Adver  Merc
  [  60,   55,   20,   35,   40,   25,  -50,  -15],  // Base JE (H=0.85*O=0.70=60)
  [  45,    4,   25,   30,   20,   35,  -20,  -25],  // Convertivel (H=0.30*O=0.15=4)
  [  10,   30,   68,   45,   35,   30,  -45,  -20],  // Evang (H=0.75*O=0.90=68)
  [  20,   25,   30,    9,    5,   30,   15,  -35],  // Mulheres (H=0.35*O=0.25=9)
  [  30,   15,   30,    5,   12,  -10,  -35,  -20],  // Interior (H=0.30*O=0.40=12)
  [  15,   30,   15,   25,  -15,    2,   10,  -40],  // Jovens (H=0.20*O=0.10=2)
  [ -55,  -15,  -40,   25,  -25,   20,   63,  -30],  // Adversarios (H=0.90*O=0.70=63)
  [   5,   45,  -10,   40,   35,   50,   -5,    2],  // Mercado (H=0.10*O=0.20=2)
]

const MIN_RADIUS_JE = [
  [ 30,  31,  37,  34,  34,  36,  47,  42],
  [ 33,  43,  36,  35,  37,  34,  43,  43],
  [ 38,  35,  28,  33,  34,  35,  46,  43],
  [ 37,  36,  35,  42,  39,  35,  37,  45],
  [ 35,  37,  35,  39,  42,  41,  45,  43],
  [ 37,  35,  37,  36,  42,  44,  38,  46],
  [ 48,  42,  46,  36,  43,  37,  29,  44],
  [ 39,  33,  41,  34,  34,  32,  40,  44],
]

const MAX_RADIUS_JE = [
  [ 97, 123, 118, 120, 121, 118, 107, 112],
  [113,  81, 110, 111, 110, 112, 104, 103],
  [130, 133, 100, 135, 134, 133, 122, 126],
  [110, 110, 111,  82, 107, 111, 109, 101],
  [115, 113, 115, 111,  83, 109, 105, 108],
  [125, 127, 125, 126, 120,  80, 124, 117],
  [106, 112, 109, 118, 111, 118,  98, 110],
  [119, 125, 117, 125, 124, 126, 118,  80],
]

// ============================================================
// BLEGER: IDEIAS COMO PARTICULAS — Teoria de Grupos
// ============================================================
// REFERENCIAS TEORICAS:
//   - Bleger, J. (1961) "Grupos Operativos no Ensino"
//   - Bleger, J. (1967) "Simbiose e Ambiguidade"
//   - Schwartz, S.H. (1992) "Universals in the content of values" — modelo circular
//   - Haidt, J. (2012) "The Righteous Mind" — 6 fundacoes morais
//   - Inglehart & Welzel (2005) — mapa cultural mundial
//
// CONCEITO: As particulas NAO sao eleitores — sao IDEIAS-VALOR.
// Cada particula = um valor que habita o espaco psicossocial.
// Quando ideias se agrupam, formam PERFIS IDEOLOGICOS emergentes.
// A aglomeracao nao e racional — e SINCRETICA (Bleger):
//   ideias se fundem porque compartilham substrato emocional,
//   nao porque sao logicamente compativeis.
//
// CALIBRACAO EMPIRICA (modelo circular de Schwartz):
//   Schwartz (1992) provou que valores humanos se organizam em circulo:
//   valores ADJACENTES no circulo sao compativeis (atracao),
//   valores OPOSTOS sao conflitantes (repulsao).
//
//   Circulo de Schwartz (simplificado):
//     Autodirecao (Liberdade, Corpo) ←→ Conformidade/Tradicao (Seguranca, Fe)
//     Universalismo (Igualdade, Justica) ←→ Poder (Propriedade)
//     Benevolencia (Pertencimento) = ponte entre ambos
//     Realizacao (Progresso) = entre Autodirecao e Poder
//
// NUCLEOS SINCRETICOS ESPERADOS (Bleger + Schwartz + Haidt):
//   1. CONSERVADOR: Seguranca + Fe + Nacao → Schwartz: Conservation cluster
//      Haidt: Authority + Sanctity + Loyalty. Fusao por ansiedade de perda.
//   2. PROGRESSISTA: Igualdade + Corpo + Justica → Schwartz: Self-Transcendence + Openness
//      Haidt: Care + Fairness + Liberty. Fusao por utopia reparadora.
//   3. LIBERAL: Liberdade + Propriedade + Progresso → Schwartz: Self-Enhancement + Openness
//      Fusao por individuacao e merito.
//   4. COMUNITARIO: Pertencimento → Schwartz: Benevolence (adjacente a todos)
//      E o VALOR-PONTE: atrai tanto Fe/Seguranca quanto Igualdade.
//      Na simulacao, Pertencimento deve orbitar entre os nucleos.
//
// FRONTEIRAS DE REPULSAO (Schwartz: valores diametralmente opostos):
//   - Fe ↔ Corpo: Tradicao vs Autodirecao (eixo principal do circulo)
//   - Propriedade ↔ Igualdade: Poder vs Universalismo (eixo secundario)
//   - Nacao ↔ Justica: Conformidade vs Universalismo (narrativa fundacional)
//   - Seguranca ↔ Liberdade: Conservacao vs Abertura (tensao autoridade)
//
// CONEXAO COM PESQUISA ELEITORAL:
//   Ideias que se agrupam definem perfis de voto.
//   Em Roraima: Fe+Seguranca+Nacao = 76% Bolsonaro (2022)
//   Igualdade+Justica = voto indigena (Uiramuta 68% Lula)
//   Pertencimento+Seguranca = funcionalismo (47% PIB)
//
// CONEXAO COM DOUTORADO (Psicologia Organizacional):
//   Bleger mostra que grupos se organizam pelo NAO-DITO.
//   O nucleo sincretico e pre-verbal: pessoas aderem a ideias
//   sem conseguir articular por que. A simulacao VISUALIZA isso:
//   os clusters emergem das forcas, nao de rotulos.

const IDEIAS_10: ElectoralSegment[] = [
  { id: 0, name: 'Liberdade Individual', shortName: 'Liber', description: 'Autodirecao, livre mercado, estado minimo. Schwartz: Self-Direction. Haidt: Liberty.', proportion: 0.10, color: '#ffcc00' },
  { id: 1, name: 'Seguranca e Ordem',    shortName: 'Segur', description: 'Estabilidade, policia, hierarquia. Schwartz: Security. Haidt: Authority.', proportion: 0.12, color: '#4488ff' },
  { id: 2, name: 'Igualdade Social',     shortName: 'Igual', description: 'Redistribuicao, cotas, SUS. Schwartz: Universalism. Haidt: Fairness (igualdade).', proportion: 0.11, color: '#ff4444' },
  { id: 3, name: 'Identidade Nacional',  shortName: 'Nacao', description: 'Patriotismo, soberania. Schwartz: Conformity/Tradition. Haidt: Loyalty.', proportion: 0.10, color: '#22cc66' },
  { id: 4, name: 'Fe Religiosa',         shortName: 'Fe',    description: 'Familia, moral crista, igreja. Schwartz: Tradition. Haidt: Sanctity.', proportion: 0.13, color: '#ff88ff' },
  { id: 5, name: 'Progresso Tecnico',    shortName: 'Progr', description: 'Inovacao, meritocracia, digital. Schwartz: Achievement + Stimulation.', proportion: 0.09, color: '#00ddff' },
  { id: 6, name: 'Pertencimento Local',  shortName: 'Pert',  description: 'Raizes, vizinhanca, mutirao. Schwartz: Benevolence. VALOR-PONTE.', proportion: 0.11, color: '#ff9933' },
  { id: 7, name: 'Autonomia do Corpo',   shortName: 'Corpo', description: 'Direitos reprodutivos, genero, LGBTQ+. Schwartz: Self-Direction. Haidt: Liberty (corpo).', proportion: 0.08, color: '#bb44ff' },
  { id: 8, name: 'Propriedade',          shortName: 'Propr', description: 'Riqueza, empreendedorismo, heranca. Schwartz: Power. Haidt: Fairness (proporcionalidade).', proportion: 0.09, color: '#ddaa33' },
  { id: 9, name: 'Justica Restaurativa', shortName: 'Just',  description: 'Reparacao historica, indigenas, ambiental. Schwartz: Universalism. Haidt: Care.', proportion: 0.07, color: '#44cc88' },
]

// ---- MATRIZ DE FORCAS (10 IDEIAS) — escala -100 a +100 ----
//
// PRINCIPIO DE CALIBRACAO:
//   1. Schwartz (1992): adjacencia no circulo = atracao, oposicao = repulsao
//   2. Haidt (2012): fundacoes morais compartilhadas = substrato de atracao
//   3. Bleger (1967): fusao sincretica = coesao pre-verbal (diagonal)
//   4. Inglehart-Welzel: Brasil = Traditional + Self-Expression (tensao interna)
//
// REGRAS DE INTENSIDADE:
//   |force| > 60: relacao ESTRUTURANTE (define o cluster)
//   |force| 35-60: relacao SIGNIFICATIVA (reforça ou tensiona o cluster)
//   |force| < 35: relacao FRACA ou NEUTRA (nao define cluster)
//   → Valores fracos empurrados para 0 para aumentar contraste visual.
//
// DIAGONAL (auto-coesao = homogeneidade × organizacao do grupo):
//   Fe=85 (maior: rebanho, pre-verbal, Bleger: nucleo sincretico mais denso)
//   Segur=75, Nacao=75 (corporacoes e tribos: alta organização)
//   Pert=65 (comunidade: forte vinculo mas heterogenea)
//   Just=65 (movimentos sociais: coesos por luta)
//   Propr=60, Igual=60 (associacoes e movimentos: moderado)
//   Liber=55 (liberais divergem entre si: libertario vs classico)
//   Progr=50 (nerds: competencia une, nao ideologia)
//   Corpo=50 (identitario: diverso internamente)
//
// DOCUMENTACAO CELULA A CELULA:
//
// LIBERDADE (Schwartz: Self-Direction)
//   →Segur(-50): Schwartz: OPOSTOS no circulo. Liberdade exige risco, seguranca exige controle.
//   →Igual(-40): Poder vs Universalismo. Livre mercado rejeita redistribuicao forcada.
//   →Nacao(-25): Nacionalismo pode implicar protecionismo. Tensao moderada.
//   →Fe(-35): Moral imposta limita liberdade. Schwartz: Tradition oposta a Self-Direction.
//   →Progr(+65): ADJACENTES em Schwartz (Stimulation). Inovacao = liberdade aplicada.
//   →Pert(0): Sem relacao direta significativa. Cosmopolita vs local se anulam.
//   →Corpo(+60): MESMO SETOR em Schwartz (Self-Direction). Liberdade sobre o proprio corpo
//     E liberdade individual. Nao e apenas "alianca pragmatica" — e o MESMO valor
//     manifestado em dominios diferentes (economico vs corporal).
//   →Propr(+75): FORTISSIMA. Propriedade e fundacao da liberdade liberal.
//     Locke: "vida, liberdade e propriedade" como direitos naturais inalienaveis.
//   →Just(-30): Justica restaurativa implica intervencao estatal. Tensao moderada.
//
// SEGURANCA (Schwartz: Security/Conservation)
//   →Igual(-40): Hierarquia vs nivelamento. Haidt: Authority vs Care.
//   →Nacao(+70): ADJACENTES. "Patria precisa de quem a defenda." Fusao classica.
//   →Fe(+60): Trindade conservadora: "Deus, patria e familia." Haidt: Sanctity + Authority.
//   →Progr(0): Neutro. Tecnologia serve tanto vigilancia quanto disrupção.
//   →Pert(+45): Seguranca comunitaria, ronda, vigilancia de bairro. Alianca funcional.
//   →Corpo(-65): FORTE. Autonomia do corpo desafia a moral que sustenta a ordem.
//     Schwartz: Security e Self-Direction sao OPOSTOS no circulo.
//   →Propr(+35): Propriedade precisa de seguranca. Funcional, nao ideologica.
//   →Just(-50): Justica restaurativa questiona a LEGITIMIDADE da ordem vigente.
//
// IGUALDADE (Schwartz: Universalism)
//   →Nacao(-35): Igualdade transcende fronteiras; nacionalismo as reforca.
//   →Fe(0): Ambivalente: teologia da libertacao existe, mas igreja institucional e conservadora.
//     Forcas se anulam → neutro. Nao ha substrato claro para atracao nem repulsao.
//   →Progr(0): Neutro. Progresso pode ser inclusivo (ed tech) ou excludente (automacao).
//   →Pert(+50): Mutirao, cooperativa, associacao de bairro. Schwartz: Universalism
//     e adjacente a Benevolence. Igualdade local = pertencimento solidario.
//   →Corpo(+60): FORTE. Direitos iguais incluem direitos sobre o corpo.
//     Schwartz: ambos no hemisfério Self-Transcendence + Openness.
//   →Propr(-60): OPOSTOS em Schwartz (Universalism vs Power). Marx vs Locke.
//     Redistribuir vs acumular. Tensao ESTRUTURANTE que define o eixo esquerda-direita.
//   →Just(+75): FORTISSIMA. MESMO SETOR em Schwartz (Universalism).
//     Igualdade e justica restaurativa compartilham o substrato utopico: reparar o mundo.
//     Bleger: fusao sincretica — quem busca igualdade busca justica e vice-versa.
//
// IDENTIDADE NACIONAL (Schwartz: Conformity/Tradition)
//   →Fe(+65): "Deus e patria." Schwartz: ADJACENTES no cluster Conservation.
//     No Brasil: "Brasil acima de tudo, Deus acima de todos" = fusao literal.
//   →Progr(0): Neutro. "Brasil potencia" e atraente mas nao estruturante.
//   →Pert(+50): Patria = casa. Amor a terra, municipalismo. Schwartz: adjacentes.
//   →Corpo(-60): Autonomia do corpo ameaca a "familia brasileira".
//     Schwartz: Conformity oposta a Self-Direction.
//   →Propr(+45): Nacionalismo + propriedade rural = agronegocio brasileiro.
//   →Just(-70): FORTE. Justica restaurativa questiona a narrativa fundacional da nacao.
//     "Indios vs colonizadores" inverte quem e heroi e quem e vilao.
//     Schwartz: Conformity vs Universalism = tensao maxima.
//
// FE RELIGIOSA (Schwartz: Tradition — nucleo do cluster Conservation)
//   →Progr(-25): Secularismo e racionalismo tecnico desafiam a fe.
//     Mas nao e forte: igrejas usam tecnologia ativamente.
//   →Pert(+55): Igreja = comunidade. Schwartz: Tradition adjacente a Benevolence.
//     Fe e pertencimento se fundem no bairro: culto = encontro social.
//   →Corpo(-85): REPULSAO MAXIMA DA SIMULACAO. Aborto, genero, LGBTQ+ = ameaca
//     existencial a moralidade religiosa. Schwartz: OPOSTOS DIAMETRAIS no circulo
//     (Tradition vs Self-Direction). Haidt: Sanctity ameacada.
//     Bleger: quando o nucleo sincretico e ameacado, a reacao e de PANICO GRUPAL.
//     E exatamente o que observamos nas "guerras culturais."
//   →Propr(+25): Teologia da prosperidade: "riqueza como bencao de Deus."
//     Relacao real mas nao estruturante.
//   →Just(-40): Justica restaurativa e secular; fe busca redencao divina, nao terrena.
//
// PROGRESSO TECNICO (Schwartz: Achievement/Stimulation)
//   →Pert(-25): Progresso e cosmopolita/global; pertencimento e local/raiz.
//   →Corpo(+40): Biohacking, transumanismo, liberdade digital.
//     Schwartz: Achievement adjacente a Self-Direction.
//   →Propr(+55): Inovacao gera riqueza. Silicon Valley como ideal.
//     Schwartz: Achievement adjacente a Power.
//   →Just(0): Neutro. Tecnologia pode servir qualquer causa.
//
// PERTENCIMENTO LOCAL (Schwartz: Benevolence — VALOR-PONTE)
//   →Corpo(-10): Leve tensao. Comunidade tradicional resiste a pautas individuais,
//     mas nao e antagonismo forte. Quase neutro.
//   →Propr(+20): "Meu pedaco de chao." Propriedade como enraizamento.
//   →Just(+30): Comunidade indigena, quilombo, periferia = justica local.
//     Pertencimento conecta-se a justica quando a comunidade e a vitima.
//
// AUTONOMIA DO CORPO (Schwartz: Self-Direction)
//   →Propr(-10): Quase neutro. "Corpo nao e mercadoria" e debate, nao conflito.
//   →Just(+65): FORTE. Direitos sobre o corpo COMO reparacao historica.
//     Corpos negros, indigenas, femininos foram historicamente controlados.
//     Schwartz: Self-Direction adjacente a Universalism.
//
// PROPRIEDADE (Schwartz: Power)
//   →Just(-55): Propriedade vs reforma agraria/fundiaria. Conflito direto.
//     Schwartz: Power vs Universalism = OPOSTOS no circulo.
//
const FORCE_IDEIAS_RAW = [
//  Liber Segur Igual Nacao  Fe   Progr  Pert  Corpo Propr  Just
  [  55,  -50,  -40,  -25, -35,   65,    0,   60,   75,  -30],  // Liberdade
  [ -50,   75,  -40,   70,  60,    0,   45,  -65,   35,  -50],  // Seguranca
  [ -40,  -40,   60,  -35,   0,    0,   50,   60,  -60,   75],  // Igualdade
  [ -25,   70,  -35,   75,  65,    0,   50,  -60,   45,  -70],  // Nacao
  [ -35,   60,    0,   65,  85,  -25,   55,  -85,   25,  -40],  // Fe
  [  65,    0,    0,    0, -25,   50,  -25,   40,   55,    0],  // Progresso
  [   0,   45,   50,   50,  55,  -25,   65,  -10,   20,   30],  // Pertencimento
  [  60,  -65,   60,  -60, -85,   40,  -10,   50,  -10,   65],  // Corpo
  [  75,   35,  -60,   45,  25,   55,   20,  -10,   60,  -55],  // Propriedade
  [ -30,  -50,   75,  -70, -40,    0,   30,   65,  -55,   65],  // Justica
]

// ---- MATRIZES DE RAIO — CALIBRADAS POR FORMULA ----
//
// PRINCIPIO: raios derivados das forcas para maxima coerencia.
//
// minRadius (distancia minima de interacao):
//   SELF: 45 - (coesao/100)*23 → Fe(85)=25, Segur(75)=28, Corpo(50)=34
//     Justificativa: grupos coesos se compactam (raio curto entre si).
//   ATRACAO: 30 + (1 - force/100)*8 → forte(75)=32, fraco(20)=36
//     Justificativa: ideias aliadas interagem de perto.
//   REPULSAO: 32 + |force/100|*10 → forte(85)=41, fraco(25)=35
//     Justificativa: ideias hostis mantem distancia minima maior.
//   NEUTRO (|force|<15): 38 fixo.
//
// maxRadius (alcance maximo da interacao):
//   SELF: 85 + (coesao/100)*15 → Fe=98, Segur=96, Corpo=93
//     Justificativa: grupos coesos sao compactos, nao precisam de alcance longo.
//   ATRACAO: 100 + (force/100)*45 → forte(75)=134, fraco(20)=109
//     Justificativa: ideias aliadas se "sentem" de longe — contaminação cultural.
//   REPULSAO: 95 + |force/100|*40 → forte(85)=129, fraco(25)=105
//     Justificativa: ideias hostis precisam detectar ameaca cedo para fugir.
//   NEUTRO: 100 fixo.
//
// As matrizes abaixo foram geradas por essas formulas e depois
// arredondadas para multiplos de 1 para leitura humana.
const MIN_RADIUS_IDEIAS = [
//  Liber Segur Igual Nacao  Fe   Progr  Pert  Corpo Propr  Just
  [ 32,   37,   36,   36,  36,   30,   38,   31,   28,   35],  // Liber (self=32)
  [ 37,   28,   36,   30,  31,   38,   34,   39,   34,   37],  // Segur (self=28)
  [ 36,   36,   31,   36,  38,   38,   32,   31,   38,   28],  // Igual (self=31)
  [ 36,   30,   36,   28,  30,   38,   32,   38,   34,   39],  // Nacao (self=28)
  [ 36,   31,   38,   30,  25,   35,   31,   41,   35,   36],  // Fe    (self=25)
  [ 30,   38,   38,   38,  35,   34,   35,   34,   31,   38],  // Progr (self=34)
  [ 38,   34,   32,   32,  31,   35,   30,   38,   36,   34],  // Pert  (self=30)
  [ 31,   39,   31,   38,  41,   34,   38,   34,   38,   30],  // Corpo (self=34)
  [ 28,   34,   38,   34,  35,   31,   36,   38,   31,   38],  // Propr (self=31)
  [ 35,   37,   28,   39,  36,   38,   34,   30,   38,   30],  // Just  (self=30)
]

const MAX_RADIUS_IDEIAS = [
//  Liber Segur Igual Nacao  Fe   Progr  Pert  Corpo Propr  Just
  [ 93,  115,  113,  107, 109,  129,  100,  127,  134,  109],  // Liber (self=93)
  [115,   96,  113,  132, 127,  100,  120,  121,  116,  115],  // Segur (self=96)
  [113,  113,   94,  111, 100,  100,  123,  127,  122,  134],  // Igual (self=94)
  [107,  132,  111,   96, 129,  100,  123,  119,  120,  123],  // Nacao (self=96)
  [109,  127,  100,  129,  98,  107,  125,  129,  111,  113],  // Fe    (self=98)
  [129,  100,  100,  100, 107,   93,  107,  118,  125,  100],  // Progr (self=93)
  [100,  120,  123,  123, 125,  107,   95,  100,  109,  114],  // Pert  (self=95)
  [127,  121,  127,  119, 129,  118,  100,   93,  100,  129],  // Corpo (self=93)
  [134,  116,  122,  120, 111,  125,  109,  100,   94,  120],  // Propr (self=94)
  [109,  115,  134,  123, 113,  100,  114,  129,  120,   95],  // Just  (self=95)
]

// ============================================================
// 6 MACRO-VALORES — Visualizacao limpa dos nucleos sincreticos
// ============================================================
//
// Reducao de 10→6 por agrupamento Schwartz:
//   Liberdade = Self-Direction (absorve Progresso + Propriedade)
//   Seguranca = Security (absorve Nacao parcialmente)
//   Igualdade = Universalism (absorve Justica parcialmente)
//   Fe = Tradition (puro)
//   Pertencimento = Benevolence (puro, VALOR-PONTE)
//   Autonomia = Self-Direction/corpo (absorve Corpo + parte de Igualdade)
//
// NUCLEOS ESPERADOS NA SIMULACAO:
//   Cluster MAGENTA+AZUL+LARANJA: Fe + Seguranca + Pertencimento (conservador)
//   Cluster VERMELHO+ROXO: Igualdade + Autonomia (progressista)
//   Cluster AMARELO: Liberdade (liberal, satelite que orbita)
//
// PERTENCIMENTO (laranja) e a CHAVE:
//   Schwartz: Benevolence e adjacente TANTO a Tradition quanto a Universalism.
//   Na simulacao, deve orbitar entre os nucleos conservador e progressista,
//   nunca se fixando totalmente em nenhum. E o voto swing.

const IDEIAS_6: ElectoralSegment[] = [
  { id: 0, name: 'Liberdade',      shortName: 'Liber', description: 'Autodirecao + mercado + merito. Schwartz: Self-Direction + Power.', proportion: 0.15, color: '#ffcc00' },
  { id: 1, name: 'Seguranca',      shortName: 'Segur', description: 'Ordem + hierarquia + patria. Schwartz: Security + Conformity.', proportion: 0.18, color: '#4488ff' },
  { id: 2, name: 'Igualdade',      shortName: 'Igual', description: 'Redistribuicao + direitos + justica. Schwartz: Universalism.', proportion: 0.17, color: '#ff4444' },
  { id: 3, name: 'Fe',             shortName: 'Fe',    description: 'Tradicao + moral + familia. Schwartz: Tradition. Aglutinador sincretico.', proportion: 0.20, color: '#ff88ff' },
  { id: 4, name: 'Pertencimento',  shortName: 'Pert',  description: 'Vizinhanca + raizes + comunidade. Schwartz: Benevolence. VALOR-PONTE.', proportion: 0.17, color: '#ff9933' },
  { id: 5, name: 'Autonomia',      shortName: 'Auton', description: 'Corpo + genero + diversidade. Schwartz: Self-Direction (corporal).', proportion: 0.13, color: '#bb44ff' },
]

// FORCAS 6 IDEIAS — Alto contraste para clusters visiveis
//
// Calibracao (Schwartz):
//   Fe↔Auton = -85 (OPOSTOS diametrais: Tradition vs Self-Direction)
//   Segur↔Auton = -65 (Security vs Self-Direction: opostos)
//   Fe↔Segur = +60 (adjacentes em Conservation)
//   Fe↔Pert = +55 (adjacentes: Tradition ↔ Benevolence)
//   Igual↔Auton = +60 (Universalism adjacente a Self-Direction no hemisferio "abertura")
//   Igual↔Pert = +45 (Universalism adjacente a Benevolence)
//   Liber↔Auton = +55 (MESMO setor: Self-Direction economica + corporal)
//   Liber↔Segur = -45 (opostos: Openness vs Conservation)
//   Liber↔Igual = -40 (Power vs Universalism)
//   Pert↔Segur = +45 (adjacentes: Benevolence ↔ Conformity)
//
// Assimetrias intencionais (Bleger: relacoes nao sao simetricas):
//   Fe→Pert(+55) vs Pert→Fe(+60): comunidade busca igreja MAIS do que igreja busca comunidade.
//   Igual→Pert(+45) vs Pert→Igual(+40): igualdade busca base comunitaria mais.
//   Auton→Fe(-85) vs Fe→Auton(-85): SIMETRICA (guerra cultural e mutua).
const FORCE_IDEIAS_6_RAW = [
//  Liber Segur Igual  Fe   Pert  Auton
  [  55,  -45,  -40, -30,    0,   55],  // Liber: atrai Auton (mesmo setor), repele Segur/Igual
  [ -45,   75,  -40,  60,   45,  -65],  // Segur: nucleo conservador, repele Auton FORTE
  [ -40,  -40,   60,   0,   45,   60],  // Igual: nucleo progressista, atrai Auton+Pert
  [ -30,   60,    0,  85,   55,  -85],  // Fe: MEGA coeso, atrai Segur/Pert, REPELE Auton maximo
  [   0,   45,   40,  60,   65,  -15],  // Pert: PONTE — atrai Fe+Segur E Igual. Leve repulsao Auton.
  [  55,  -65,   60, -85,  -15,   50],  // Auton: funde com Igual+Liber, REPELE Fe/Segur
]

// Raios 6 ideias — mesma formula que 10 ideias
const MIN_RADIUS_IDEIAS_6 = [
//  Liber Segur Igual  Fe   Pert  Auton
  [ 32,   37,   36,  35,   38,   31],  // Liber
  [ 37,   28,   36,  31,   34,   39],  // Segur
  [ 36,   36,   31,  38,   34,   31],  // Igual
  [ 35,   31,   38,  25,   31,   41],  // Fe
  [ 38,   34,   34,  31,   30,   38],  // Pert
  [ 31,   39,   31,  41,   38,   34],  // Auton
]

const MAX_RADIUS_IDEIAS_6 = [
//  Liber Segur Igual  Fe   Pert  Auton
  [ 93,  115,  113, 109,  100,  125],  // Liber
  [115,   96,  113, 127,  120,  121],  // Segur
  [113,  113,   94, 100,  120,  127],  // Igual
  [109,  127,  100,  98,  125,  129],  // Fe: longo vs Auton para fugir CEDO
  [100,  120,  118, 127,   95,  102],  // Pert
  [125,  121,  127, 129,  102,   93],  // Auton: longo vs Fe para fugir CEDO
]

// ---- CENARIO: Secularizacao ----
// Evento: modernizacao reduz influencia religiosa.
// Fe perde coesao (85→50), perde atracao com Segur e Pert.
// Autonomia ganha coesao e atracao.
// Pertencimento se AUTONOMIZA (deixa de orbitar Fe, fica mais neutro).
// Resultado esperado: nucleo conservador fragmenta, progressista cresce.
const FORCE_IDEIAS_SECULAR_RAW = [
//  Liber Segur Igual  Fe   Pert  Auton
  [  55,  -35,  -35, -10,    0,   50],  // Liber: menos tensao geral (sociedade mais tolerante)
  [ -35,   65,  -30,  35,   40,  -50],  // Segur: perde aliado Fe, coesao cai
  [ -35,  -30,   65,   0,   45,   65],  // Igual: GANHA forca, atrai Auton mais
  [ -10,   35,    0,  50,   35,  -55],  // Fe: coesao DESPENCA (85→50). Fragmenta. Atracoes enfraquecem.
  [   0,   40,   45,  35,   65,    0],  // Pert: SAI da orbita de Fe. Mais neutro. Equilibrado.
  [  50,  -50,   65, -55,    0,   55],  // Auton: GANHA coesao (50→55), puxa Igual com forca
]

// ---- CENARIO: Polarizacao Maxima ----
// Evento: crise politica radicaliza tudo.
// Todas as atracoes intra-cluster SOBEM. Todas as repulsoes inter-cluster SOBEM.
// Neutros viram repulsao. Pontes quebram.
// Pertencimento e ARRASTADO para o conservador (Bleger: panico grupal
// faz o grupo regressar ao vinculo primario — fe e comunidade).
// Resultado esperado: 2 blocos densos separados por vazio. Sem pontes.
const FORCE_IDEIAS_POLAR_RAW = [
//  Liber Segur Igual  Fe   Pert  Auton
  [  65,  -60,  -65, -45,  -35,   55],  // Liber: radicaliza contra tudo, menos Auton
  [ -60,   80,  -60,  75,   65,  -80],  // Segur: FECHA nucleo conservador
  [ -65,  -60,   75, -35,    0,   75],  // Igual: FECHA nucleo progressista
  [ -45,   75,  -35,  90,   70,  -95],  // Fe: MAXIMA coesao (90), MAXIMA repulsao (-95 vs Auton)
  [ -35,   65,    0,  70,   70,  -45],  // Pert: ARRASTADO para conservador (panico grupal)
  [  55,  -80,   75, -95,  -45,   60],  // Auton: MAXIMA repulsao Fe, funde com Igual+Liber
]

// Raios para polarizacao: TODOS os maxRadius sobem (ideias se detectam de mais longe)
// Efeito: clusters se compactam E se repelem com mais forca
const MIN_RADIUS_IDEIAS_6_POLAR = [
//  Liber Segur Igual  Fe   Pert  Auton
  [ 30,   38,   39,  37,   36,   30],
  [ 38,   26,   38,  28,   30,   41],
  [ 39,   38,   28,  36,   38,   28],
  [ 37,   28,   36,  22,   28,   43],
  [ 36,   30,   38,  28,   28,   37],
  [ 30,   41,   28,  43,   37,   32],
]

const MAX_RADIUS_IDEIAS_6_POLAR = [
//  Liber Segur Igual  Fe   Pert  Auton
  [ 95,  125,  125, 118,  112,  130],
  [125,   98,  125, 140, 135,  130],
  [125,  125,   96, 112, 100,  140],
  [118,  140,  112, 100, 135,  138],
  [112,  135,  100, 135,  96,  118],
  [130,  130,  140, 138, 118,   95],
]

const BLEGER_SCENARIOS: ElectoralScenario[] = [
  {
    v: 1,
    meta: {
      name: 'Bleger — 10 Ideias',
      description: '10 valores-ideia como particulas. Calibrado por Schwartz (modelo circular) + Haidt (fundacoes morais) + Bleger (fusao sincretica). 3 clusters emergentes: conservador, progressista, liberal.',
      category: 'Bleger: Ideias',
    },
    segments: IDEIAS_10,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 10, numParticles: 5000, frictionFactor: 0.14, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_IDEIAS_RAW),
      minRadius: MIN_RADIUS_IDEIAS,
      maxRadius: MAX_RADIUS_IDEIAS,
    },
    colors: IDEIAS_10.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'Bleger — 6 Macro-Valores',
      description: '6 valores: 3 nucleos sincreticos visiveis. Pertencimento (laranja) e VALOR-PONTE que oscila entre nucleos. Fe (rosa) = aglutinador maximo.',
      category: 'Bleger: Ideias',
    },
    segments: IDEIAS_6,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 6, numParticles: 5000, frictionFactor: 0.14, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_IDEIAS_6_RAW),
      minRadius: MIN_RADIUS_IDEIAS_6,
      maxRadius: MAX_RADIUS_IDEIAS_6,
    },
    colors: IDEIAS_6.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'Bleger — Secularizacao',
      description: 'Fe perde coesao (85→50). Nucleo conservador fragmenta. Pertencimento se liberta da orbita religiosa. Progressistas avancam.',
      category: 'Bleger: Eventos',
    },
    segments: IDEIAS_6,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 6, numParticles: 5000, frictionFactor: 0.14, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_IDEIAS_SECULAR_RAW),
      minRadius: MIN_RADIUS_IDEIAS_6,
      maxRadius: MAX_RADIUS_IDEIAS_6,
    },
    colors: IDEIAS_6.map(s => s.color),
  },
  {
    v: 1,
    meta: {
      name: 'Bleger — Polarizacao',
      description: 'Crise radicaliza tudo. 2 blocos densos, zero ponte. Pertencimento arrastado para conservador (regressao ao vinculo primario — Bleger). Fe↔Auton = -95.',
      category: 'Bleger: Eventos',
    },
    segments: IDEIAS_6,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 6, numParticles: 5000, frictionFactor: 0.12, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_IDEIAS_POLAR_RAW),
      minRadius: MIN_RADIUS_IDEIAS_6_POLAR,
      maxRadius: MAX_RADIUS_IDEIAS_6_POLAR,
    },
    colors: IDEIAS_6.map(s => s.color),
  },
]

// ============================================================
// CENARIOS PRONTOS
// ============================================================

export const ELECTORAL_SCENARIOS: ElectoralScenario[] = [
  {
    v: 1,
    meta: {
      name: 'JE — Pre-Eleitoral',
      description: 'Jorge Everton (Uniao Brasil) Dep. Estadual RR 2026. 8 segmentos por decisao de campanha. Cross-tabs reais: pesquisa INTEIA n=200.',
      category: 'Jorge Everton',
    },
    segments: SEGMENTOS_JE,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 8, numParticles: 5000, frictionFactor: 0.13, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_JE_RAW),
      minRadius: MIN_RADIUS_JE,
      maxRadius: MAX_RADIUS_JE,
    },
    colors: SEGMENTOS_JE.map(s => s.color),
  },
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
      name: 'RR — Modelo Calibrado',
      description: 'Roraima 10 segmentos. Forcas calculadas por 5 proxies ponderados (V=eleitoral 30%, G=geografia 15%, E=economia 20%, S=social 15%, I=ideologia 20%). Fonte: TSE 2022, Censo IBGE 2022, PIB 2023, pesquisa INTEIA n=200. Script: calibrar_matriz_documental.py',
      category: 'Roraima',
    },
    segments: SEGMENTOS_10,
    types: ['settings', 'forces', 'radii', 'colors'],
    settings: { species: 10, numParticles: 5000, frictionFactor: 0.14, forceFactor: 1.0 },
    matrices: {
      forces: normMatrix(FORCE_10_DOCUMENTAL),
      minRadius: MIN_RADIUS_10_DOC,
      maxRadius: MAX_RADIUS_10_DOC,
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
  // ---- Cenario Bleger: Ideias como Particulas ----
  // Teoria de Grupos de Bleger: sociabilidade sincretica vs interacao
  // Ideias se agrupam por nucleo sincretico (fusao sem diferenciacao)
  // e se repelem quando ameacam a identidade grupal
  ...BLEGER_SCENARIOS,

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
