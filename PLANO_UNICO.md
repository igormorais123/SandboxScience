# PLANO UNICO — INTEIA SIMULADOR DE DINAMICA SOCIAL
## Consolida: 7 planos + 4 projetos + 3 dias de aprendizado
## INTEIA | 2026-03-21

---

## 1. O QUE E

Motor visual onde particulas representam atores sociais. Forcas de atracao/repulsao entre tipos criam dinamica emergente — clusters, orbitas, perseguicoes, isolamentos. A IA configura o caso e interpreta o resultado.

**Nao e**: previsao matematica de eleicao.
**E**: laboratorio para entender estrutura, testar hipoteses e visualizar cenarios.

---

## 2. TRES CAMADAS

```
MOTOR (SandboxScience)     →  Fisica, GPU/CPU, visual, brush, camera
CONTEXTO (Mirofish)        →  Grafo, agentes sinteticos, narrativa [futuro]
INTERPRETACAO (Claude API)  →  Configura, interpreta, compara, recomenda
```

Cada camada e independente. O motor funciona sem as outras duas (modo manual). As camadas de IA adicionam inteligencia progressivamente.

---

## 3. ESTADO ATUAL

| Componente | Status | Onde |
|---|---|---|
| Motor particulas (Hunar g/d) | Funciona, 10K particulas | vida_artificial.html |
| Particle Life Lab (27 presets) | Online | inteia.com.br/particle-life |
| Lenia Eleitoral (10 segmentos RR) | Online | inteia.com.br/lenia-eleitoral |
| SandboxScience fork (Nuxt/GPU) | Fork pronto, nao customizado | github.com/igormorais123/SandboxScience |
| Mirofish | Sprint 1 em andamento | C:\projetos\Mirofish INTEIA |
| Skill particle-life-lab | Completa | ~/.claude/skills/particle-life-lab |
| IA configuradora | Nao implementada | — |
| IA interpretadora | Nao implementada | — |

### Problemas resolvidos (nao revisitar)
- Formula de forca: `F*ddx` sem normalizar ✓
- Performance: batch render + cached DOM + flat matrices ✓
- Colapso: limites empiricos de forca calibrados ✓
- Deploy: Vercel com rewrites ✓

---

## 4. DADOS DE REFERENCIA (consolidados de todos os docs)

### 10 Segmentos de Roraima (ESTRUTURA_PARTICULAS_v3)
```
0 Funcionalismo    108/1000  #1a6b7a  Servidores, voto por emprego
1 Comissionados     38/1000  #3a3a4a  Voto cativo do deputado
2 Evangelicos      141/1000  #d4a030  Pastor indica, rebanho segue
3 Jovens Urbanos   251/1000  #8855cc  TikTok, volateis
4 Mercado do Voto  128/1000  #cc7020  R$800/voto, traem
5 Indigena Org      90/1000  #cc2020  CIR, voto em bloco
6 Classe Media      90/1000  #2266cc  Bolsonaristas convictos
7 Interior Agro     77/1000  #33aa55  Querem estrada e energia
8 Mulheres Perif    52/1000  #cc4488  Buscam protecao
9 Fronteira/Seg     25/1000  #1a5530  PM/PC/PF, berco JE
```

### 4 Clusters Estrategicos (CLUSTERS_4_JORGE_EVERTON)
```
0 Base Fiel     180/1000  #1a4a8a  MANTER (ja sao fieis)
1 Campo Disputa 420/1000  #7744bb  CONQUISTAR (onde se ganha)
2 Mercado       250/1000  #cc7020  DISPUTAR COM CAUTELA
3 Alheio        150/1000  #cc2020  NAO INVESTIR
```

### FORCE_MATRIX 4x4 (calibrada, doc CLUSTERS_4)
```
         Base  Campo  Mercado  Alheio
Base     -40    -15     -5       5
Campo    -15    -12    -20       0
Mercado   -5    -20     -8      -5
Alheio     5      0     -5     -35
```

### FORCE_MATRIX 10x10 (amplificada, testada no navegador)
```
         Func  Comis Evang Jovem Merc  Indig CMed  Agro  MulPe Front
Func     -40   -50    10    15   -5     20   -20    10    -5   -45
Comis    -50   -55    15    10  -30     20     5    15    -5   -15
Evang     10    15   -55   -15   15     40   -35   -25   -25    -5
Jovem     15    10   -15   -20  -25     10    10    15   -20    10
Merc      -5   -30    15   -25  -12     -5    10    -5   -40    15
Indig     20    20    40    10   -5    -60    45    -5     5    25
CMed     -20     5   -35    10   10     45   -50   -25    10   -30
Agro      10    15   -25    15   -5     -5   -25   -45    10   -15
MulP      -5    -5   -25   -20  -40      5    10    10   -30     5
Front    -45   -15    -5    10   15     25   -30   -15     5   -50
```

### Parametros de fisica (testados e validados)
```
Modelo: Hunar g/d — F = g/sqrt(d²); fx += F*ddx (SEM normalizar)
Viscosidade: 0.85 (v = v*0.15 + force)
FORCE_MULT: 1.0
MAX_RADIUS: 80 (cap para interacoes locais)
CELL_SIZE: 50 (spatial hash)
Particulas: 1000 base (multiplicador 1-10x)
Canvas: 600x600
Borda: soft (30px) + bounce
```

### Parametros de eventos (PLANO_IMPLEMENTACAO_v2)
```
Compra de voto:    fidelidade -0.15, engajamento +0.10
Servico mandato:   fidelidade +0.15
Fake news:         orientacao ±0.12, engajamento +0.20, tolerancia -0.18
Programa social:   orientacao -0.08, dependencia +0.15
CNH gratis:        Base↔Campo +10 (300 ticks)
Alianca pastoral:  Base↔Campo +15 (400 ticks)
Cassacao:          Mercado coesao -5 (500 ticks)
```

### Regra de fidelidade (doc implementacao v2)
```
Candidato NAO move eleitor com fidelidade > 0.7 de OUTRO candidato
Fidelidade decai 0.001/tick sem contato com candidato
Servico de mandato aumenta fidelidade +0.15
```

### Mapeamento visual de atributos (ESTRUTURA_PARTICULAS_v3)
```
Tamanho = engajamento (maior = mais engajado)
Cor = segmento/cluster
Posicao = espaco ideologico (proximidade = afinidade)
Velocidade = volatilidade (rapido = instavel)
```

### Traducao conceitual (PLANO_SIMULADOR_v3)
```
Particula       →  Ator / Eleitor
Species         →  Segmento / Grupo
Force           →  Afinidade
Repel           →  Rejeicao
Friction        →  Inercia social
Min Radius      →  Espaco pessoal
Max Radius      →  Alcance de influencia
Preset          →  Cenario
Brush Attract   →  Campanha
Brush Repulse   →  Crise
Wall            →  Fronteira
```

---

## 5. DECISOES RESOLVIDAS (nao reabrir)

| Decisao | Resolucao | Razao |
|---|---|---|
| Motor de fisica | Hunar g/d com `F*ddx` | Testado 3 dias, funciona ate 10K |
| Fork SandboxScience como base | Sim | GPU gratis, UI pronta, presets, brush |
| CPU como default | Sim | GPU e bonus, nao requisito |
| 4 clusters primeiro | Sim | UX, depois 10 como modo avancado |
| Roraima como showcase | Sim | Caso real, cliente real, dados reais |
| Deploy Vercel | Sim | Ja configurado, rewrites funcionam |
| Eventos como delta temporario | Sim | Protege baseline |
| Stakeholders fixos primeiro | Sim | Autonomia e V2+ |
| Dados sensiveis fora do bundle | Sim | Seguranca |

---

## 6. VULNERABILIDADES E BLINDAGENS

### V1: Interpretabilidade (GAP CRITICO)

**Problema**: usuario olha particulas coloridas e nao entende o que significa.

**Blindagens**:
- Legenda com nome + cor + contagem SEMPRE visivel
- Headers da matriz com nomes de segmento (nao numeros)
- Tooltip no hover da particula mostrando perfil
- Painel "O que observar" com frases curtas
- Botao "Interpretar" que chama IA e explica em linguagem natural

### V2: IA configuradora (COMPLEXO)

**Problema**: IA pode gerar matrizes que colapsam, dispersam ou nao fazem sentido.

**Blindagens**:
- Validacao com limites empiricos (auto-atracao -8 a -55, repulsao max +60)
- Pre-teste headless (100 ticks, verifica colapso/dispersao/instabilidade)
- Maximo 3 tentativas automaticas de correcao
- Fallback: templates baseados em generators existentes (Random, RPS, Hub)
- "Editar antes de aplicar" sempre disponivel

### V3: Performance com SandboxScience Nuxt (RISCO)

**Problema**: Nuxt SSR + WebGPU pode travar no deploy Vercel.

**Blindagens**:
- Testar `npm run generate` (estatico) ANTES de desenvolver features
- Se Nuxt travar, manter vida_artificial.html como produto e usar SandboxScience so como referencia de codigo
- CPU engine funciona em HTML standalone (ja provado)

### V4: Mirofish como dependencia (RISCO)

**Problema**: Mirofish em Sprint 1, API pode mudar.

**Blindagem**: Mirofish e integracao OPCIONAL. Sistema funciona 100% sem ele. Interface CaseConfiguration e o contrato — qualquer fonte pode gera-lo.

---

## 7. FASES DE EXECUCAO

### FASE 1 — Fork funcional (4h)
```
0.1  npm install + confirmar boot                    10min
0.2  CPU como default (preferGpu = false)             5min
0.3  Defaults eleitorais (1000 part, 4 cores)        10min
0.4  Marca INTEIA (constants, nuxt.config)           10min
1.1  types/electoral.ts                              10min
1.2  constants/electoral.public.ts (4 clusters)      15min
1.3  constants/electoralScenarios.ts (6 cenarios)    20min
1.4  Validar cenarios no vida_artificial.html        15min
1.5  Loader cenarios no PresetPanel                  15min
2.1  Header INTEIA                                   15min
2.2  Sidebar labels PT-BR (caminho critico)          30min
2.3  Modal intro eleitoral                           15min
2.4  Labels criticos restantes                       30min
3.1  Headers matriz com nomes de cluster             15min
3.2  Legenda segmentos (embeddada)                   15min
3.3  Metricas lite (embeddada, cada 30 ticks)        30min
     Smoke test final                                10min
```
**Entrega**: simulador eleitoral 4 clusters, PT-BR, cenarios, legenda, metricas.

### FASE 2 — Inteligencia basica (4h)
```
4.1  Eventos temporarios (6 botoes + delta + fade)   1h30
4.2  Stakeholders basicos (8 candidatos, toggle)     1h30
4.3  Interpretacao sob demanda (botao + Claude API)  1h
```
**Entrega**: eventos alteram dinamica, candidatos visiveis, IA explica.

### FASE 3 — Motor universal (6h)
```
5.1  CaseConfiguration schema final                 30min
5.2  useAIConfig composable (Claude API call)        1h
5.3  AIConfigPanel UI (textarea + preview)           1h
5.4  Validacao + pre-teste automatico                1h
5.5  3 casos alem de Roraima                         1h
5.6  Modo 10 clusters (toggle avancado)              1h30
```
**Entrega**: descreve caso → IA gera → simula. Universal.

### FASE 4 — Refinamento estetico e analitico (6h)
```
6.1  Additive blending (ctx.globalCompositeOperation) 30min
6.2  Opacity control (ctx.globalAlpha)                15min
6.3  Glow simulado (pre-render sprite)                1h
6.4  Comparador sequencial (A→snapshot, B→snapshot)   2h
6.5  Modo historia (timeline + eventos sequenciais)   2h
```
**Entrega**: visual vivo, comparador, timeline.

### FASE 5 — Produto completo (8h)
```
7.1  Integracao Mirofish (modo profundo, opcional)    3h
7.2  PDF export com marca INTEIA                      2h
7.3  Landing page inteia.com.br/simulador             1h
7.4  Auth basica + Stripe (quando for hora)           2h
```
**Entrega**: produto pagavel.

### RESUMO

| Fase | Horas | Acumulado | Entrega |
|---|---|---|---|
| 1 | 4h | 4h | Fork funcional PT-BR com cenarios |
| 2 | 4h | 8h | Eventos + stakeholders + IA basica |
| 3 | 6h | 14h | Motor universal (qualquer caso) |
| 4 | 6h | 20h | Visual vivo + comparador + timeline |
| 5 | 8h | 28h | Produto completo |

**Fator de correcao realista: 1.5x → 42h total**
*Baseado em velocity observada (3 dias para calibrar fisica)*

---

## 8. FORMATO DE CONFIGURACAO (contrato entre IA e motor)

```typescript
interface CaseConfiguration {
  meta: {
    title: string
    description: string
    source: string
    confidence: number        // 0-1
  }
  world: {
    numParticles: number      // 500-10000
    numGroups: number         // 2-8
    frictionFactor: number    // 0.2-0.5
    forceFactor: number       // 0.5-2.0
  }
  groups: Array<{
    id: number
    name: string
    shortName: string         // max 5 chars (header da matriz)
    description: string
    proportion: number        // soma = 1.0
    color: string             // hex
    attributes: {
      cohesion: number        // -55 a -8 (auto-atracao)
      volatility: number      // 0-1
      vulnerability: number   // 0-1
      engagement: number      // 0-1
      fidelity: number        // 0-1
    }
    strategicAction: string   // "MANTER", "CONQUISTAR", "DISPUTAR", "IGNORAR"
  }>
  forceMatrix: number[][]     // NxN, escala -80 a +60
  minRadiusMatrix: number[][] // NxN, 15-60
  maxRadiusMatrix: number[][] // NxN, 40-150
  stakeholders: Array<{
    name: string
    role: string
    groupAffinity: number[]   // forca para cada grupo
    color: string
    influence: number         // raio
  }>
  events: Array<{
    name: string
    description: string
    type: "campanha" | "crise" | "competicao"
    deltaForces: number[][]   // somado ao baseline
    duration: number          // ticks
  }>
  interpretation: {
    whatToWatch: string[]
    hypotheses: string[]
    keyDynamics: string[]
  }
}
```

---

## 9. CALIBRACAO DE FORCAS (aprendizado empirico de 3 dias)

```
REGRAS PARA IA GERAR MATRIZES:

Auto-atracao (diagonal):
  Grupo muito coeso (indigena, militar): -40 a -55
  Grupo moderado (funcionalismo, evangelico): -20 a -35
  Grupo disperso (jovens, mercado): -8 a -15

Atracao entre aliados:
  Forte (Base↔Campo com campanha ativa): -20 a -30
  Moderada (afinidade natural): -10 a -20
  Fraca (contato casual): -3 a -8

Repulsao entre adversarios:
  Forte (indigena vs classe media): +30 a +45
  Moderada (tensao institucional): +10 a +25
  Fraca (indiferenca com atrito): +3 a +8

Indiferenca: -3 a +3

ASSIMETRIA OBRIGATORIA:
  Se A atrai B com -20, B NAO deve atrair A com -20
  Assimetria cria MOVIMENTO (perseguicao, orbita)
  Simetria cria ESTABILIDADE (cristal, equilibrio)

ESCALA POR NUMERO DE GRUPOS:
  2-3 grupos: forcas -30 a -50 auto, +15 a +30 repulsao
  4-6 grupos: forcas -20 a -40 auto, +10 a +25 repulsao
  7-8 grupos: forcas -15 a -35 auto, +8 a +20 repulsao
```

---

## 10. ARQUIVOS-CHAVE

### No SandboxScience fork (Nuxt)
```
stores/particleLifeStore.ts          ← defaults
constants/index.ts                    ← marca
pages/particle-life.vue               ← entry point
components/particle-life/
  ParticleLifeCpu.vue                 ← engine + render (monolito)
  MatrixSettings.vue                  ← matriz editavel
  PresetPanel.vue                     ← cenarios
  BrushSettings.vue                   ← brush
helpers/utils/
  rulesGenerator.ts                   ← 31 generators
  colorsGenerator.ts                  ← paletas
  positionsGenerator.ts               ← posicoes iniciais
composables/usePresetManager.ts       ← save/load presets
```

### No projeto Lenia Eleitoral (standalone)
```
vida_artificial.html                  ← 10 segmentos RR, online
vida_artificial_lenia.html            ← lab 27 presets, online
APRENDIZADOS_FISICA.md               ← testes e insights
CONFIGURACOES_PARTICLE_LIFE.md        ← catalogo presets
```

### Na skill
```
~/.claude/skills/particle-life-lab/SKILL.md  ← tudo sobre particle life
```

### No Mirofish (futuro)
```
backend/app/api/internal.py           ← endpoint lenia-export
backend/app/services/simulation_config_generator.py ← parametros
```

---

## 11. O QUE NAO FAZER

1. Nao reescrever o motor de fisica (ja funciona)
2. Nao bloquear por typecheck do Nuxt (build funciona, erros sao upstream)
3. Nao prometer votos estimados (e lab, nao oraculo)
4. Nao depender do Mirofish para V1-V3 (integracao opcional)
5. Nao traduzir 25 arquivos antes de ter conteudo (cenarios antes de PT-BR)
6. Nao criar componentes Vue novos na V1 (embeddar, extrair depois)
7. Nao fazer interpretacao automatica a cada 60s (sob demanda, botao)
8. Nao fazer comparador simultaneo (sequencial: A→snapshot, B→snapshot)
9. Nao usar `document.getElementById` dentro de loop de render
10. Nao normalizar direcao com modelo g/d (`F*ddx`, NUNCA `F*ddx/d`)

---

## 12. PRIMEIRA ACAO

```bash
cd C:\Users\IgorPC\projetos\projetos-claude\SandboxScience
npm install
npm run dev
# http://localhost:3000/particle-life
# Se funcionar: Fase 1
```

---

*INTEIA — Igor Morais Vasconcelos — 2026-03-21*
*7 planos viram 1. 4 projetos viram 1. O motor e universal. O caso e qualquer um.*
