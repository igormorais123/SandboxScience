# PLANO DE EXECUCAO DETALHADO — V1 EM 4h15min
## Cada tarefa com arquivo, linha, o que fazer e criterio de done
## INTEIA | 2026-03-21

---

## FASE 0+1: BOOT + CENARIOS (1h45min)
*Paralelizadas — sem dependencia entre si*

---

### 0.1 — npm install e confirmar boot (10min)

```bash
cd C:\Users\IgorPC\projetos\projetos-claude\SandboxScience
npm install
npm run dev
```

**Verificar**:
- http://localhost:3000/particle-life abre
- Canvas renderiza particulas
- Sidebar funciona

**Se falhar**: `npm install --legacy-peer-deps`

**Done**: pagina abre com particulas se movendo.

---

### 0.2 — CPU como default (5min)

**Arquivo**: `pages/particle-life.vue`

**O que fazer**:
- Encontrar `const preferGpu = ref(true)` ou equivalente
- Mudar para `ref(false)`
- OU: comentar o bloco de deteccao WebGPU e carregar `ParticleLifeCpu` direto

**Done**: pagina abre direto no modo CPU, sem modal de GPU.

---

### 0.3 — Defaults eleitorais no store (10min)

**Arquivo**: `stores/particleLifeStore.ts`

**Mudar**:
```
numParticles: 6000 → 1000
numColors: 7 → 4
particleSize: 8 → 6
frictionFactor: 0.3 → 0.3 (manter)
forceFactor: 1.0 → 1.0 (manter)
minRadiusRange: [30, 60] → [25, 50]
maxRadiusRange: [90, 150] → [70, 110]
```

**Done**: recarregar pagina, ver 1000 particulas com 4 cores.

---

### 0.4 — Marca INTEIA nos metadados (10min)

**Arquivo**: `constants/index.ts`

**Mudar**:
- `APP_NAME` → "INTEIA Simulador Eleitoral"
- `APP_DESCRIPTION` → "Simulacao de dinamica eleitoral por particulas"
- `APP_URL` → "https://inteia.com.br"
- Remover referencias a "Sandbox Science" e "Charly Luzzi"

**Arquivo**: `nuxt.config.ts`

**Mudar**:
- `title` → "INTEIA | Simulador Eleitoral"
- `description` → "Laboratorio visual de dinamica eleitoral de Roraima"

**Done**: titulo da aba = "INTEIA | Simulador Eleitoral".

---

### 1.1 — Criar tipos eleitorais (10min)

**Arquivo NOVO**: `types/electoral.ts`

```typescript
export interface ElectoralCluster {
  id: number
  nome: string
  nomeAbrev: string
  cor: string       // hex
  corRGBA: number[] // [r,g,b,a] 0-1
  descricao: string
  acaoEstrategica: string
  proporcao: number // por 1000
}

export interface ElectoralScenario {
  id: string
  nome: string
  descricao: string
  numParticles: number
  numColors: number
  forces: number[][]
  minRadius: number[][]
  maxRadius: number[][]
  colors: number[][] // RGBA float
}

export interface ElectoralEvent {
  id: string
  nome: string
  descricao: string
  deltaForces: number[][] // somado a baseline
  duracao: number         // ticks
  icone: string
}
```

**Done**: arquivo existe, sem erros de import.

---

### 1.2 — Criar dados publicos (15min)

**Arquivo NOVO**: `constants/electoral.public.ts`

```typescript
import type { ElectoralCluster } from '~/types/electoral'

export const CLUSTERS_4: ElectoralCluster[] = [
  {
    id: 0, nome: "Base Fiel", nomeAbrev: "Base",
    cor: "#1a4a8a", corRGBA: [0.10, 0.29, 0.54, 1],
    descricao: "PM, PC, servidores aliados, comissionados JE, classe media conservadora",
    acaoEstrategica: "MANTER — ja sao fieis, usar como multiplicadores",
    proporcao: 180,
  },
  {
    id: 1, nome: "Campo de Disputa", nomeAbrev: "Campo",
    cor: "#7744bb", corRGBA: [0.47, 0.27, 0.73, 1],
    descricao: "Jovens urbanos, mulheres periferia, evangelicos sem candidato, funcionalismo geral",
    acaoEstrategica: "CONQUISTAR — onde a eleicao se ganha",
    proporcao: 420,
  },
  {
    id: 2, nome: "Mercado do Voto", nomeAbrev: "Merc",
    cor: "#cc7020", corRGBA: [0.80, 0.44, 0.13, 1],
    descricao: "Vendem voto, interior agro, comissionados de outros, dependentes da maquina",
    acaoEstrategica: "DISPUTAR COM CAUTELA — fidelizar necessitados, cooptar lideres",
    proporcao: 250,
  },
  {
    id: 3, nome: "Territorio Alheio", nomeAbrev: "Alheio",
    cor: "#cc2020", corRGBA: [0.80, 0.13, 0.13, 1],
    descricao: "Indigena organizado, base Sampaio, base Joilma, anti-Bolsonaro",
    acaoEstrategica: "NAO INVESTIR — custo alto, retorno zero",
    proporcao: 150,
  },
]

// Nomes curtos para headers de matriz
export const CLUSTER_ABREVS = CLUSTERS_4.map(c => c.nomeAbrev)

// Cores em formato Float32Array para o CPU renderer
export function getClusterColorsFloat32(clusters = CLUSTERS_4): Float32Array {
  const arr = new Float32Array(clusters.length * 4)
  clusters.forEach((c, i) => {
    arr[i*4] = c.corRGBA[0]; arr[i*4+1] = c.corRGBA[1]
    arr[i*4+2] = c.corRGBA[2]; arr[i*4+3] = c.corRGBA[3]
  })
  return arr
}
```

**Done**: importavel sem erro.

---

### 1.3 — Criar cenarios oficiais (20min)

**Arquivo NOVO**: `constants/electoralScenarios.ts`

```typescript
import type { ElectoralScenario } from '~/types/electoral'

export const CENARIOS: ElectoralScenario[] = [
  {
    id: 'roraima-base',
    nome: 'Roraima Base',
    descricao: 'Estado natural sem intervencao de campanha. Cada cluster na sua dinamica.',
    numParticles: 1000, numColors: 4,
    forces: [
      [-40, -15,  -5,   5],
      [-15, -12, -20,   0],
      [ -5, -20,  -8,  -5],
      [  5,   0,  -5, -35],
    ],
    minRadius: [
      [25, 35, 28, 38],
      [35, 30, 32, 26],
      [28, 32, 25, 30],
      [38, 26, 30, 23],
    ],
    maxRadius: [
      [ 70, 100,  80, 110],
      [100,  85,  90,  75],
      [ 80,  90,  70,  85],
      [110,  75,  85,  65],
    ],
    colors: [
      [0.10, 0.29, 0.54, 1],  // azul escuro
      [0.47, 0.27, 0.73, 1],  // roxo
      [0.80, 0.44, 0.13, 1],  // laranja
      [0.80, 0.13, 0.13, 1],  // vermelho
    ],
  },
  {
    id: 'campanha-cnh',
    nome: 'Campanha CNH Gratis',
    descricao: 'JE lanca CNH gratis no TikTok. Campo de Disputa reage, Mercado observa.',
    numParticles: 1000, numColors: 4,
    forces: [
      [-40, -25,  -5,   5],   // Base atrai Campo mais forte (-25 vs -15)
      [-25, -18, -15,   0],   // Campo auto-coesao sobe (-18 vs -12) e puxa menos Mercado
      [ -5, -15,  -8,  -5],   // Mercado perde atracao pelo Campo
      [  5,   0,  -5, -35],   // Alheio inalterado
    ],
    minRadius: [[25,35,28,38],[35,30,32,26],[28,32,25,30],[38,26,30,23]],
    maxRadius: [[70,100,80,110],[100,85,90,75],[80,90,70,85],[110,75,85,65]],
    colors: [[0.10,0.29,0.54,1],[0.47,0.27,0.73,1],[0.80,0.44,0.13,1],[0.80,0.13,0.13,1]],
  },
  {
    id: 'alianca-pastoral',
    nome: 'Alianca Pastoral',
    descricao: 'Pastor Diniz indica JE. Evangelicos migram para Base Fiel.',
    numParticles: 1000, numColors: 4,
    forces: [
      [-45, -30,  -5,   5],   // Base auto-coesao e atracao ao Campo sobem
      [-30, -20, -20,   0],   // Campo puxa forte para Base
      [ -5, -20,  -8,  -5],
      [  5,   0,  -5, -35],
    ],
    minRadius: [[25,35,28,38],[35,30,32,26],[28,32,25,30],[38,26,30,23]],
    maxRadius: [[70,110,80,110],[110,85,90,75],[80,90,70,85],[110,75,85,65]],
    colors: [[0.10,0.29,0.54,1],[0.47,0.27,0.73,1],[0.80,0.44,0.13,1],[0.80,0.13,0.13,1]],
  },
  {
    id: 'cassacao-denarium',
    nome: 'Cassacao Denarium',
    descricao: 'Governador cassado. Maquina se fragmenta. Mercado perde ancora.',
    numParticles: 1000, numColors: 4,
    forces: [
      [-40, -15,  -10,  5],
      [-15, -12,  -25,  0],   // Campo disputa Mercado solto
      [-10, -25,   -3, -10],  // Mercado perde coesao (-3 vs -8), atrai Alheio
      [  5,   0,  -10, -30],  // Alheio perde coesao (-30 vs -35)
    ],
    minRadius: [[25,35,28,38],[35,30,32,26],[28,32,25,30],[38,26,30,23]],
    maxRadius: [[70,100,80,110],[100,85,90,75],[80,90,70,85],[110,75,85,65]],
    colors: [[0.10,0.29,0.54,1],[0.47,0.27,0.73,1],[0.80,0.44,0.13,1],[0.80,0.13,0.13,1]],
  },
  {
    id: 'cenario-otimista',
    nome: 'Cenario Otimista',
    descricao: 'CNH funciona + alianca pastoral + Denarium apoiando. Campo e Mercado migram para Base.',
    numParticles: 1000, numColors: 4,
    forces: [
      [-50, -35,  -15,  10],  // Base dominante
      [-35, -25,  -10,   5],  // Campo fortemente puxado para Base
      [-15, -10,  -10,  -5],  // Mercado atraido pela Base
      [ 10,   5,   -5, -30],  // Alheio repelido pela Base
    ],
    minRadius: [[25,35,28,38],[35,30,32,26],[28,32,25,30],[38,26,30,23]],
    maxRadius: [[80,120,90,120],[120,90,100,80],[90,100,75,90],[120,80,90,70]],
    colors: [[0.10,0.29,0.54,1],[0.47,0.27,0.73,1],[0.80,0.44,0.13,1],[0.80,0.13,0.13,1]],
  },
  {
    id: 'cenario-pessimista',
    nome: 'Cenario Pessimista',
    descricao: 'Concorrentes compram Mercado + fake news + crise. Campo dispersa.',
    numParticles: 1000, numColors: 4,
    forces: [
      [-35, -10,   0,  10],   // Base enfraquecida
      [-10,  -5,  -25, -5],   // Campo perde coesao, puxado pelo Mercado
      [  0, -25,  -15, -10],  // Mercado fortalecido e atraindo Campo
      [ 10,  -5,  -10, -40],  // Alheio muito coeso e atraindo Mercado
    ],
    minRadius: [[25,35,28,38],[35,30,32,26],[28,32,25,30],[38,26,30,23]],
    maxRadius: [[65,90,75,100],[90,80,85,70],[75,85,65,80],[100,70,80,60]],
    colors: [[0.10,0.29,0.54,1],[0.47,0.27,0.73,1],[0.80,0.44,0.13,1],[0.80,0.13,0.13,1]],
  },
]
```

**Done**: 6 cenarios importaveis com matrizes calibradas.

---

### 1.4 — Validar cenarios no vida_artificial.html (15min)

**Antes de integrar no SandboxScience**, testar cada FORCE_MATRIX no sistema vanilla:

1. Abrir `vida_artificial.html`
2. Abrir console (F12)
3. Colar:
```javascript
FORCE_MATRIX[0] = [-40,-15,-5,5]; FORCE_MATRIX[1] = [-15,-12,-20,0];
FORCE_MATRIX[2] = [-5,-20,-8,-5]; FORCE_MATRIX[3] = [5,0,-5,-35];
_buildFlatMatrices(); resetSim();
```
4. Verificar se clusters se separam visivelmente
5. Repetir para cada cenario

**Done**: todos os 6 cenarios formam clusters distintos no vanilla.

---

### 1.5 — Integrar loader de cenarios no PresetPanel (15min)

**Arquivo**: `components/particle-life/PresetPanel.vue`

**O que fazer**:
1. Import `CENARIOS` de `~/constants/electoralScenarios`
2. Adicionar tab "Cenarios" ao lado de "Official" e "My Presets"
3. Listar cenarios com nome + descricao
4. Ao clicar: chamar store para setar numColors, cores, matrizes
5. Chamar reset do engine

**Done**: usuario ve tab "Cenarios", clica, canvas muda.

---

## FASE 2: PT-BR + REBRANDING (1h30min)
*So caminho critico — o que o usuario ve*

---

### 2.1 — Header INTEIA (15min)

**Arquivo**: `layouts/life.vue`

**O que fazer**:
- Adicionar barra superior com logo INTEIA
- Estilo: fundo #0a0a0f, borda inferior #1a1a2a
- Texto: "INTE**IA** | Simulador Eleitoral de Roraima"
- Ajustar padding do conteudo abaixo

**Done**: header INTEIA visivel acima do sidebar.

---

### 2.2 — Sidebar labels PT-BR (30min)

**Arquivos**:
- `components/SidebarLeft.vue` — titulos das secoes
- `components/particle-life/ParticleLifeCpu.vue` — labels internos

**Mapa de traducao**:
```
World Settings → Configuracao do Territorio
Physics Settings → Dinamica Social
Matrix Settings → Matriz de Afinidade
Presets → Cenarios
Brush → Ferramenta
Graphics Settings → Visual
Camera Settings → Camera
Debug Tools → Diagnostico
Particle Count → Num. Eleitores
Species Count → Segmentos
Repel Force → Forca de Rejeicao
Force Multiplier → Intensidade
Friction → Inercia Social
Particle Size → Tamanho
Min. Radius → Espaco Pessoal
Max. Radius → Alcance de Influencia
```

**Done**: sidebar em PT-BR no fluxo principal.

---

### 2.3 — Modal intro eleitoral (15min)

**Arquivo**: `pages/particle-life.vue`

**O que fazer**:
- Trocar modal de "WebGPU/CPU" por intro eleitoral
- Texto: "Simulador de Dinamica Eleitoral de Roraima. Cada ponto = 1 eleitor. Escolha um cenario e observe como os segmentos interagem."
- Botao: "Iniciar Simulacao"
- Nao mencionar GPU/CPU

**Done**: modal curto, claro, em PT-BR.

---

### 2.4 — Demais labels criticos (30min)

**Arquivos** (so interface principal):
- `MatrixSettings.vue` — "Forces" → "Afinidade", "Min/Max Radius" → "Alcance"
- `BrushSettings.vue` — "Add" → "Adicionar", "Attract" → "Campanha", "Repulse" → "Crise"
- `WallStateSelection.vue` — "None/Repel/Wrap" → "Sem/Bounce/Migracao"

**NAO traduzir na V1**: SaveModal, ShareOptions, Memory, TrackerToggle, DevicesTips, DonationModal, About, NavBar.

**Done**: zero ingles no fluxo principal de uso.

---

## FASE 3: NOMES + LEGENDA + METRICAS (1h)
*Embeddado no ParticleLifeCpu, sem componentes novos*

---

### 3.1 — Headers de matriz com nomes (15min)

**Arquivo**: `components/particle-life/RulesMatrix.vue` (e Min/MaxMatrix)

**O que fazer**:
- Importar `CLUSTER_ABREVS` de `~/constants/electoral.public`
- Onde mostra bolinha de cor como header, adicionar texto abreviado abaixo: "Base", "Campo", "Merc", "Alh"
- Manter bolinha de cor para referencia visual

**Done**: matriz legivel por nomes, nao so por cor.

---

### 3.2 — Legenda de segmentos (15min)

**Arquivo**: `components/particle-life/ParticleLifeCpu.vue`

**Onde**: no sidebar, abaixo dos sliders de fisica ou acima do canvas

**O que adicionar** (HTML direto, sem componente):
```html
<div class="segment-legend">
  <div v-for="c in CLUSTERS_4" :key="c.id" class="seg-item">
    <span class="seg-dot" :style="{background: c.cor}"></span>
    <span class="seg-name">{{ c.nome }}</span>
    <span class="seg-count">{{ getClusterCount(c.id) }}</span>
  </div>
</div>
```

Funcao `getClusterCount(id)`: conta particulas do tipo `id` no array atual.

**Done**: legenda mostra nome + cor + contagem por cluster.

---

### 3.3 — Metricas lite (30min)

**Arquivo**: `components/particle-life/ParticleLifeCpu.vue`

**Onde**: secao nova no sidebar, abaixo da legenda

**Calcular a cada 30 ticks** (nao por frame):
```typescript
function computeMetrics() {
  const counts = new Array(4).fill(0)
  let totalV = 0, totalEngaj = 0
  for (let i = 0; i < numParticles; i++) {
    counts[colors[i]]++
    totalV += Math.sqrt(velocityX[i]**2 + velocityY[i]**2)
  }
  return {
    distribuicao: counts.map(c => (c/numParticles*100).toFixed(0) + '%'),
    volatilidade: (totalV / numParticles).toFixed(2),
    dominante: CLUSTERS_4[counts.indexOf(Math.max(...counts))].nome,
  }
}
```

**Exibir**:
- Barra de distribuicao por cluster (4 barras coloridas)
- Volatilidade (baixa/media/alta)
- Cluster dominante
- Nao mostrar "votos estimados" (V2)

**Done**: painel de metricas atualiza em tempo real, sem queda de FPS.

---

## GATE V1: CHECKLIST

- [ ] Abre em CPU com 1000 particulas, 4 cores
- [ ] Marca INTEIA na aba e header
- [ ] 6 cenarios eleitorais carregam corretamente
- [ ] Sidebar em PT-BR (caminho critico)
- [ ] Modal intro eleitoral (sem mencionar GPU)
- [ ] Matriz com nomes de segmento
- [ ] Legenda com nome + cor + contagem
- [ ] Metricas lite (distribuicao, volatilidade, dominante)
- [ ] Build OK
- [ ] Nenhum dado sensivel no bundle

---

## FASE 4: EVENTOS + STAKEHOLDERS (3h) — V1.1

### 4.1 — Eventos temporarios (1h30min)

**Onde**: nova secao no sidebar de `ParticleLifeCpu.vue`

**Modelo**:
```typescript
let baseRules: number[][] = []  // salva ao carregar cenario
let eventDelta: number[][] | null = null
let eventTicksLeft = 0

function applyEvent(event: ElectoralEvent) {
  if (!baseRules.length) baseRules = deepCopy(rulesMatrix)
  eventDelta = event.deltaForces
  eventTicksLeft = event.duracao
  recomputeEffectiveMatrix()
}

function recomputeEffectiveMatrix() {
  if (!eventDelta) return
  for (let i=0;i<4;i++) for (let j=0;j<4;j++)
    rulesMatrix[i][j] = baseRules[i][j] + eventDelta[i][j] * (eventTicksLeft / event.duracao)
}
```

**6 eventos**:
| Evento | Delta principal | Duracao |
|---|---|---|
| CNH Gratis (TikTok) | Base↔Campo +10 | 300 ticks |
| Delegado Protege (WhatsApp) | Base↔Campo +8, Campo coesao +5 | 250 |
| Alianca Pastoral | Base↔Campo +15 | 400 |
| Cassacao Denarium | Mercado coesao -5, Campo↔Mercado +10 | 500 |
| Fake News | Campo dispersa +8, Mercado↔Alheio +5 | 200 |
| Concorrente Compra Votos | Mercado↔Alheio +15, Base↔Mercado -5 | 350 |

**Done**: botao de evento altera dinamica, fade-out restaura baseline.

---

### 4.2 — Stakeholders basicos (1h30min)

**Onde**: `ParticleLifeCpu.vue` — array separado, render depois das particulas

**Modelo**:
```typescript
const stakeholders = [
  { nome: "Jorge Everton", partido: "UNIAO", orient: 0.68, cor: "#1a6b7a", ativo: false, x: W/2, y: W/2 },
  { nome: "Soldado Sampaio", partido: "REP", orient: 0.75, cor: "#3a5a3a", ativo: false, x: W/2, y: W/2 },
  // ... 6-8 candidatos
]
```

**Render**: circulo 3x maior + nome acima + halo translucido
**Fisica**: atrai particulas compativeis (orient similar), nao recebe forca de particulas
**Toggle**: checkbox no sidebar

**Done**: stakeholders visiveis no canvas, influenciam particulas proximas.

---

## RESUMO TEMPORAL

```
00:00 — npm install, confirmar boot
00:10 — CPU default + defaults eleitorais
00:25 — Marca INTEIA metadados
00:35 — Tipos + dados publicos
00:50 — Cenarios JSON (6)
01:05 — Validar cenarios no vanilla
01:20 — Loader cenarios no PresetPanel
01:35 — Header INTEIA
01:50 — Sidebar PT-BR
02:20 — Modal intro
02:35 — Labels criticos PT-BR
03:05 — Headers matriz com nomes
03:20 — Legenda segmentos
03:35 — Metricas lite
04:05 — Smoke test final
04:15 — GATE V1 ✓
```

*Cada bloco assume execucao focada sem interrupcao.*
*Buffer de 30min para imprevistos = 4h45min total realista.*
