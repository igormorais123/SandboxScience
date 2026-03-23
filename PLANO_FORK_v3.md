# PLANO DE FORK v3 — SANDBOXSCIENCE → INTEIA ELEITORAL
## Atualizado com conhecimento profundo do codebase (shaders, store, generators, presets)
## INTEIA | Igor Morais Vasconcelos | ONIR | 2026-03-21

---

## ANALISE DO PLANO v2

O plano v2 e solido. As correcoes de direcao estao certas. O que este v3 adiciona:

1. **Conhecimento interno do codigo** — li TODOS os shaders, stores, generators, preset manager
2. **Aprendizados da sessao de 3 dias** com particle life vanilla (bugs, performance, formula)
3. **Atalhos seguros** que o v2 nao podia prever sem conhecer o codigo por dentro
4. **Estimativas recalibradas** baseadas em complexidade real de cada arquivo

---

## CORRECOES AO v2

### O que o v2 acertou (manter)
- CPU default (correto — GPU e bonus, nao requisito)
- 4 clusters primeiro, 10 depois (correto — UX)
- Delta temporario para eventos (correto — protege baseline)
- Stakeholders fixos/draggable primeiro (correto — autonomia e V2)
- Separar dados publicos de sensiveis (correto — seguranca)
- PT-BR completo (correto — produto brasileiro)

### O que o v2 errou ou superestimou

| Item v2 | Correcao v3 | Razao |
|---|---|---|
| "Fase 0: corrigir typecheck" como blocker | **Nao bloquear por typecheck**. O baseline ja faz build OK. Typecheck tem erros pre-existentes do upstream que nao afetam runtime. Corrigir em paralelo, nao como gate. | Perder 2-4h em tipagem antes de entregar valor e desperdicio |
| "Traducao completa PT-BR: 1h" | **3-5h realistas**. Sao 25+ arquivos, muitos com strings hardcoded em posicoes nao obvias (tooltips, aria-labels, modais condicionais). | Subestimado no v2, corretamente revisado na estimativa mas nao no titulo da etapa |
| "Cores em HSL vs RGB" como risco alto | **Risco BAIXO**. O store CPU ja usa `currentColors` como `number[][]` de 4 floats RGBA [0,1]. O `colorsGenerator.ts` produz `Float32Array(N*4)`. Conversao e trivial: `hsvToRgb` ja existe no codebase. | Conhecendo o codigo, o risco desaparece |
| "newRandomRulesMatrix() vazia" | **Nao existe**. O v2 citou funcao que nao esta no codebase atual. Os generators estao em `helpers/utils/rulesGenerator.ts` e funcionam perfeitamente. | Erro factual do v2 |
| "PresetPanel tem aba Official vazia" | **Parcialmente errado**. A aba "Official Presets" e na verdade o painel de GENERATORS (30 geradores de regras). Funciona. O que falta e cenarios ELEITORAIS, nao presets genericos. | Confusao de conceito |

---

## ATALHOS SEGUROS (o que o v3 pode fazer mais rapido)

### 1. Usar generators existentes como base para cenarios
O codebase ja tem 31 generators em `rulesGenerator.ts`. Em vez de criar cenarios do zero, posso:
- Usar `genSymmetric` como base para "Roraima Base" (clusters estaveis)
- Usar `genChains` como base para "Alianca Pastoral" (vizinhos se atraem)
- Usar `genRPS` como base para "Competicao Triangular" (ciclo de poder)
- Editar a matriz gerada para refletir a dinamica politica real

### 2. Preset format ja esta pronto
O `usePresetManager.ts` ja suporta:
```typescript
{ v:1, meta:{name,description}, types:["settings","forces","radii","colors"],
  settings:{species,numParticles,frictionFactor,forceFactor},
  matrices:{forces[][],minRadius[][],maxRadius[][]},
  colors:string[] }
```
Basta criar os JSONs dos cenarios eleitorais neste formato. Nao precisa inventar schema novo.

### 3. CPU component ja tem tudo para stakeholders
`ParticleLifeCpu.vue` ja tem:
- Canvas 2D com scaling e pan
- Brush com attract/repulse (mesma logica de stakeholder)
- Rendering com `ctx.arc()` e labels
- Spatial hash funcional
Stakeholder = particula especial com render diferente + forca unidirecional. ~100 linhas de codigo novo.

### 4. Metricas = funcao pura sobre o array de particulas
Nao precisa de componente Vue complexo. Uma funcao que roda a cada 30 ticks e atualiza um ref reativo:
```typescript
function computeMetrics(particles, colors, numColors) {
  const counts = new Array(numColors).fill(0);
  let totalV = 0;
  for (const p of particles) { counts[p.type]++; totalV += Math.sqrt(p.vx**2+p.vy**2); }
  return { counts, avgVelocity: totalV/particles.length, ... };
}
```

---

## PLANO v3 REVISADO

### FASE 0: BOOT + CPU DEFAULT (1h)
**O que realmente precisa ser feito:**

1. `npm install` — ja testado, funciona
2. Mudar `pages/particle-life.vue` para CPU default:
   - Trocar `const preferGpu = ref(true)` → `ref(false)`
   - OU mostrar CPU component diretamente sem deteccao
3. Mudar defaults no `stores/particleLifeStore.ts`:
   - `numParticles: 1000` (era 6000)
   - `numColors: 4` (era 7)
   - `frictionFactor: 0.3` (manter)
4. Trocar marca em `constants/index.ts`:
   - nome, URL, descricao → INTEIA
5. `nuxt.config.ts` — title, description

**Gate 0**: abre em CPU, 1000 particulas, 4 cores, marca INTEIA na aba.

### FASE 1: CENARIOS ELEITORAIS (2h)
**Antes de traduzir, criar os cenarios. Traducao sem conteudo e inutil.**

1. Criar `constants/electoralScenarios.ts` com 4-6 cenarios:
   - Cada um no formato Preset existente
   - Matrizes 4x4 calibradas (usar FORCE_MATRIX do vida_artificial.html como base)
   - Cores definidas: azul escuro, roxo, laranja, vermelho
   - Nomes: "Roraima Base", "Campanha CNH", "Alianca Pastoral", "Cassacao Denarium"

2. Criar `constants/electoral.public.ts`:
   - `CLUSTER_NAMES = ["Base Fiel", "Campo de Disputa", "Mercado do Voto", "Alheio"]`
   - `CLUSTER_COLORS` em formato RGBA float
   - `CLUSTER_DESCRIPTIONS` curtas

3. Adicionar loader de cenarios no `PresetPanel.vue`:
   - Tab "Cenarios" ao lado de "Official" e "My Presets"
   - Carregar cenario = setar numColors, cores, matrizes, particles

**Gate 1**: usuario escolhe cenario, canvas responde com 4 clusters estaveis.

### FASE 2: PT-BR + REBRANDING (3h)
**Agora sim traduzir, com o produto ja tendo conteudo.**

Arquivos por prioridade:
1. `ParticleLifeCpu.vue` — labels de sidebar, titulo
2. `SidebarLeft.vue` — secoes colapsaveis
3. `MatrixSettings.vue` + `RulesMatrix.vue` — headers com nomes de cluster
4. `BrushSettings.vue` — attract→campanha, repulse→crise
5. `PresetPanel.vue` — labels
6. `WallStateSelection.vue` + `WrapModeSelection.vue` — labels
7. `layouts/life.vue` — header INTEIA
8. `pages/particle-life.vue` — modal intro eleitoral
9. Restante (15+ arquivos menores)

**Vocabulario-chave**:
- Particle → Eleitor
- Species → Segmento
- Force → Afinidade
- Repel → Rejeicao
- Friction → Inercia
- Radius → Alcance
- Preset → Cenario

**Gate 2**: zero ingles no fluxo principal, marca INTEIA, modal intro eleitoral.

### FASE 3: NOMES + LEGENDA + METRICAS LITE (2h)

1. `SegmentLegend.vue` — nomes, cores, contagem, descricao curta
2. Headers na matriz com nomes curtos (Base, Campo, Merc, Alh)
3. `MetricsPanel.vue`:
   - Distribuicao por cluster (barra)
   - Volatilidade media
   - Indice de captura
   - Recalcula a cada 30 ticks

**Gate 3 = GATE V1**: simulador eleitoral completo, legivel, PT-BR, 4 clusters, cenarios, metricas.

### FASE 4: EVENTOS + STAKEHOLDERS (4h)

1. `EventPanel.vue`:
   - 6-8 botoes de evento
   - Delta temporario sobre baseline (nao sobrescreve)
   - Fade-out em N ticks
   - Log visual

2. `StakeholderPanel.vue`:
   - 8-10 candidatos como particulas especiais
   - Render: circulo maior + nome + halo
   - Toggle individual
   - Forca unidirecional: atrai compatíveis

**Gate 4 = GATE V1.1**: inteligencia acionavel.

### FASE 5: 10 CLUSTERS + REFINAMENTO (6h+)
Adia para V2. So entra depois de V1.1 estavel.

---

## ESTIMATIVA REVISADA

| Fase | Tempo | Acumulado |
|---|---|---|
| 0. Boot + CPU default | 1h | 1h |
| 1. Cenarios eleitorais | 2h | 3h |
| 2. PT-BR + rebranding | 3h | 6h |
| 3. Nomes + legenda + metricas | 2h | 8h |
| **GATE V1** | | **8h** |
| 4. Eventos + stakeholders | 4h | 12h |
| **GATE V1.1** | | **12h** |
| 5. 10 clusters + refinamento | 6h+ | 18h+ |

**V1 em 8h** (vs 12-21h do v2). Reducao de 40-60% por:
- Reusar generators existentes
- Nao bloquear por typecheck
- Preset format ja pronto
- Metricas como funcao pura, nao componente complexo

---

## ARQUIVOS-CHAVE (PRIORIDADE DE EXECUCAO)

```
TOCAR PRIMEIRO:
1. stores/particleLifeStore.ts         ← defaults eleitorais
2. constants/index.ts                   ← marca INTEIA
3. constants/electoralScenarios.ts      ← CRIAR: cenarios 4x4
4. constants/electoral.public.ts        ← CRIAR: nomes, cores, descricoes

TOCAR SEGUNDO:
5. pages/particle-life.vue              ← CPU default, modal intro
6. components/particle-life/PresetPanel.vue ← tab cenarios
7. components/particle-life/ParticleLifeCpu.vue ← vocabulario, legenda

TOCAR TERCEIRO:
8. components/particle-life/MatrixSettings.vue ← headers com nomes
9. components/SidebarLeft.vue           ← secoes traduzidas
10. layouts/life.vue                    ← header INTEIA

CRIAR:
11. components/particle-life/SegmentLegend.vue
12. components/particle-life/MetricsPanel.vue
13. components/particle-life/EventPanel.vue
14. components/particle-life/StakeholderPanel.vue
```

---

## DECISOES TECNICAS FIRMES

1. **CPU e o renderer principal.** GPU vira "modo avancado" escondido.
2. **4 clusters na V1.** 10 clusters so na V2.
3. **Cenarios oficiais no codigo.** Nao em localStorage.
4. **Eventos como delta temporario.** Nunca sobrescrever baseline.
5. **Stakeholders fixos primeiro.** Autonomia so na V2.
6. **Metricas como indices.** Votos estimados so apos calibracao.
7. **Typecheck nao bloqueia.** Corrigir em paralelo.
8. **Deploy publico sanitizado.** Dados sensiveis nunca no bundle.

---

## DIFERENCIAL DO v3 vs v2

O v3 conhece o codigo por dentro. Sabe que:
- `rulesGenerator.ts` tem 31 geradores prontos para adaptar
- `usePresetManager.ts` ja tem schema completo
- `colorsGenerator.ts` ja converte HSV→RGB
- O CPU component ja tem brush, spatial hash e labels
- O store ja suporta todos os parametros necessarios
- Os shaders GPU sao ortogonais ao trabalho eleitoral (nao precisa mexer)

Isso permite cortar 40% do tempo sem cortar qualidade.

---

---

## REVISAO FINAL — ESPACOS PARA MELHORIA ENCONTRADOS

### 1. CENARIOS JA ESTAO PRONTOS (ganho de 1h)
O documento `docs-eleitoral/CLUSTERS_4_JORGE_EVERTON.md` ja tem:
- FORCE_MATRIX 4x4 com explicacao de cada forca
- RADIUS_MATRIX 4x4
- Perfis de particula por cluster (orient, engaj, fidelidade, vulnerabilidade)
- Stakeholders mapeados
- Acoes estrategicas

Isso significa que a Fase 1 (cenarios) NAO precisa inventar matrizes — so converter o doc para JSON no formato do preset manager. **Reduz de 2h para 45min.**

### 2. TRADUZIR SO O CAMINHO CRITICO (ganho de 1.5h)
Em vez de traduzir 25+ arquivos, traduzir apenas o fluxo que o usuario ve:
- Sidebar esquerdo (6 secoes)
- Modal de intro
- Painel de cenarios
- Legenda
- Metricas

Ignorar na V1: SaveModal, ShareOptions, Memory, TrackerToggle, DevicesTips, DonationModal, About. **Reduz de 3h para 1.5h.**

### 3. NAO CRIAR COMPONENTES VUE NOVOS NA V1 (ganho de 1h)
Em vez de criar `SegmentLegend.vue`, `MetricsPanel.vue` como componentes separados, embeddar direto no `ParticleLifeCpu.vue` como secoes no sidebar existente. Extracao para componentes fica para V1.1.

Razao: criar componente Vue novo = lidar com props, emits, store injection, slot. Embeddar = copiar 30 linhas de HTML+JS no lugar certo. **Reduz de 2h para 1h.**

### 4. PARALELIZAR FASE 0 E FASE 1 (ganho estrutural)
Fase 0 (boot) e Fase 1 (cenarios) nao dependem uma da outra. Podem ser feitas na mesma sessao sem esperar gate.

### 5. USAR vida_artificial.html COMO PROTOTIPO DE VALIDACAO
Antes de mexer no SandboxScience (Nuxt/Vue), testar cada cenario 4x4 no `vida_artificial.html` que ja funciona. Se a dinamica faz sentido visualmente la, converte para o formato do SandboxScience. **Evita ciclos de debug no framework.**

### 6. MATRIZES DO DOCUMENTO JA CALIBRADAS

```
FORCE_MATRIX 4x4 (docs-eleitoral/CLUSTERS_4_JORGE_EVERTON.md):
         Base    Campo   Mercado  Alheio
Base     -40      -15     -5       5
Campo    -15      -12     -20      0
Mercado  -5       -20     -8      -5
Alheio    5        0      -5      -35

RADIUS_MATRIX 4x4:
         Base    Campo   Mercado  Alheio
Base      70      100     80      110
Campo    100       85     90       75
Mercado   80       90     70       85
Alheio   110       75     85       65
```

Estas matrizes ja refletem a realidade politica de RR. Base coesa (-40), Campo disperso (-12), Alheio impenetravel (-35). A assimetria Campo↔Mercado (-20/-20) e o insight estrategico central.

---

## ESTIMATIVA FINAL RECALIBRADA

| Fase | v3 original | v3 revisado | Razao |
|---|---|---|---|
| 0. Boot + CPU default | 1h | 1h | sem mudanca |
| 1. Cenarios eleitorais | 2h | **45min** | matrizes ja prontas no doc |
| 2. PT-BR + rebranding | 3h | **1.5h** | so caminho critico |
| 3. Nomes + legenda + metricas | 2h | **1h** | embeddar, nao componentizar |
| **GATE V1** | **8h** | **4h15min** | **47% mais rapido** |
| 4. Eventos + stakeholders | 4h | 3h | reusa brush logic |
| **GATE V1.1** | **12h** | **7h15min** | |

**V1 entregavel em 4-5 horas de trabalho focado.**

---

## RISCO NOVO IDENTIFICADO

| Risco | Prob | Impacto | Mitigacao |
|---|---|---|---|
| `npm run dev` trava por deps desatualizadas | Media | Alto | Testar ANTES de iniciar fase 0. Se travar, usar `--legacy-peer-deps` |
| MonolithoCPU dificulta embeddar metricas | Baixa | Medio | O componente ja e gigante, mais 30 linhas nao muda nada |
| Matrizes do doc nao funcionam visualmente | Media | Alto | Testar no vida_artificial.html ANTES de converter |

---

## PRIMEIRA ACAO CONCRETA

```bash
cd C:\Users\IgorPC\projetos\projetos-claude\SandboxScience
npm install
npm run dev
# Abrir http://localhost:3000/particle-life
# Confirmar que CPU funciona
# Se funcionar: comecar Fase 0+1 juntas
```

---

*INTEIA — Igor Morais Vasconcelos — ONIR — 2026-03-21*
*"Conhecer o codigo por dentro e o melhor atalho que existe."*
*"O melhor plano e o que entrega em 4 horas, nao em 21."*
