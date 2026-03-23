# PLANO DE FORK — SANDBOXSCIENCE → SIMULADOR ELEITORAL INTEIA
## 2026-03-21 | Igor Morais Vasconcelos

---

## DECISAO

Usar o SandboxScience (https://github.com/DicSo92/SandboxScience) como BASE.
Fork: https://github.com/igormorais123/SandboxScience

NAO reescrever do zero. Adaptar o que existe.

---

## O QUE JA FUNCIONA NO FORK (nao mexer ainda)

- Fisica CPU completa (spatial hash, forcas, viscosidade, brush)
- Fisica GPU (WebGPU, 64K particulas)
- Matriz de forcas editavel visual (clicavel, cores)
- Matriz de raios min/max
- Presets (save/load/delete)
- Brush (add/remove/attract/repulse)
- Sliders de fisica (repel, friction, force)
- Sliders de mundo (particulas, cores, tamanho)
- Walls (none/repel/wrap)
- Camera (zoom, pan, tracking)
- 3D (depth, opacity)
- GIF capture
- Screenshot
- Keyboard shortcuts
- Responsive
- Dark theme

---

## ETAPAS DE ADAPTACAO

### ETAPA 0: RODAR (15 min)
- [ ] `npm install` no fork
- [ ] `npm run dev`
- [ ] Abrir http://localhost:3000/particle-life
- [ ] Confirmar que funciona identico ao original
- [ ] Confirmar que CPU engine funciona (trocar para CPU se tiver GPU)

### ETAPA 0.5: TRADUCAO COMPLETA PARA PORTUGUES BR (1h)
TODA string visivel ao usuario deve estar em portugues do Brasil.
Nenhuma palavra em ingles na interface.

Arquivos a traduzir:
- [ ] `pages/particle-life.vue` — modal intro, textos, botoes
- [ ] `pages/index.vue` — homepage
- [ ] `pages/about.vue` — sobre
- [ ] `components/particle-life/ParticleLifeCpu.vue` — titulo, labels, tooltips
- [ ] `components/particle-life/ParticleLifeGpu.vue` — titulo, labels
- [ ] `components/particle-life/MatrixSettings.vue` — headers, tooltips
- [ ] `components/particle-life/PresetPanel.vue` — labels, botoes
- [ ] `components/particle-life/BrushSettings.vue` — labels, tooltips
- [ ] `components/particle-life/WallStateSelection.vue` — labels
- [ ] `components/particle-life/WrapModeSelection.vue` — labels
- [ ] `components/particle-life/SaveModal.vue` — textos
- [ ] `components/particle-life/ShareOptions.vue` — textos
- [ ] `components/particle-life/Memory.vue` — labels
- [ ] `components/particle-life/TrackerToggle.vue` — labels
- [ ] `components/particle-life/CaptureOverlay.vue` — textos
- [ ] `components/particle-life/DevicesGpuTips.vue` — textos
- [ ] `components/particle-life/MyPresets.vue` — botoes
- [ ] `components/SidebarLeft.vue` — labels
- [ ] `components/SidebarRight.vue` — tooltips botoes
- [ ] `components/NavBar.vue` — links
- [ ] `components/Collapse.vue` — se tiver texto fixo
- [ ] `components/RangeInput.vue` — se tiver placeholder
- [ ] `components/DonationModal.vue` — remover ou traduzir
- [ ] `components/Modal.vue` — botao fechar
- [ ] `constants/index.ts` — textos constantes

Principio: NENHUMA string em ingles visivel ao usuario final.
Comentarios no codigo podem ficar em ingles (so dev ve).

Tabela de traducao sera gerada pelo agente de mapeamento e aplicada arquivo por arquivo.

### ETAPA 1: REBRANDING INTEIA (30 min)
Mudar identidade visual sem alterar funcionalidade.

Arquivos:
- [ ] `components/particle-life/ParticleLifeCpu.vue` — trocar titulo "Particle Life CPU" → "INTEIA Simulador Eleitoral"
- [ ] `pages/particle-life.vue` — trocar textos do modal intro
- [ ] `layouts/life.vue` — adicionar header INTEIA
- [ ] `assets/scss/main.scss` — cores douradas (#c89520) como accent
- [ ] `nuxt.config.ts` — meta title, description
- [ ] `app.vue` — titulo da aba

Nao mexer: fisica, matriz, brush, presets, componentes genericos.

### ETAPA 2: VOCABULARIO ELEITORAL (45 min)
Trocar termos tecnicos por sociais em toda a UI.

| De | Para |
|----|------|
| Particle | Eleitor |
| Species / Color | Segmento eleitoral |
| Force | Afinidade |
| Repel | Rejeicao |
| Friction | Inercia social |
| Radius | Alcance de influencia |
| Min Radius | Espaco pessoal |
| Brush Add | Adicionar eleitores |
| Brush Remove | Remover eleitores |
| Brush Attract | Campanha (atrair) |
| Brush Repulse | Crise (dispersar) |
| Wall | Fronteira |
| Wrap | Migracao |
| Preset | Cenario |

Arquivos a editar:
- [ ] Todos labels em `components/particle-life/ParticleLifeCpu.vue`
- [ ] `components/particle-life/MatrixSettings.vue` — headers
- [ ] `components/particle-life/BrushSettings.vue` — labels
- [ ] `components/particle-life/PresetPanel.vue` — labels
- [ ] Tooltips em `TooltipInfo` — trocar descricoes

### ETAPA 3: PRESETS ELEITORAIS (45 min)
Criar presets de Roraima usando dados de `docs-eleitoral/CLUSTERS_4_JORGE_EVERTON.md`

Arquivo principal: `composables/usePresetManager.ts`

Presets a criar:
```
Roraima Base          — 4 clusters, 1000 particulas, sem intervenção
Campanha CNH          — JE lanca TikTok, Campo de Disputa reage
Cassacao Denarium     — Mercado perde ancora, caos
Alianca Pastoral      — Evangelicos se aproximam de JE
Cenario Pessimista    — Concorrentes compram + crise
Cenario Otimista      — Tudo funciona para JE
```

Cada preset define:
- numParticles (1000)
- numColors (4)
- rulesMatrix (4x4 do doc CLUSTERS_4)
- minRadiusMatrix (4x4)
- maxRadiusMatrix (4x4)
- currentColors (4 cores: azul escuro, roxo, laranja, vermelho)

### ETAPA 4: NOMES NOS SEGMENTOS (30 min)

Substituir indices numericos por nomes significativos.

Na `MatrixSettings.vue` e `RulesMatrix.vue`:
- Em vez de mostrar cor 0, 1, 2, 3
- Mostrar "Base Fiel", "Campo Disputa", "Mercado", "Alheio"

Na legenda de particulas:
- Mostrar nome + contagem + descricao curta

### ETAPA 5: PAINEL DE EVENTOS (1h)

Criar novo componente: `components/particle-life/EventPanel.vue`

Adicionar ao `SidebarLeft` como nova secao `Collapse`.

Botoes de evento que alteram a matriz de forcas TEMPORARIAMENTE:
- Guardar matriz original
- Aplicar delta do evento (ex: CNH Gratis → Campo auto-atrai +10)
- Apos N ticks, reverter gradualmente ao original

Eventos:
```
CAMPANHAS:
- CNH Gratis (TikTok)
- Delegado Protege (WhatsApp mulheres)
- Alianca Pastoral

CRISES:
- Cassacao Denarium
- Fake News
- Escandalo

COMPETICAO:
- Concorrente compra votos
- Sampaio evento grande
```

### ETAPA 6: STAKEHOLDERS (1h)

Criar novo componente: `components/particle-life/StakeholderPanel.vue`

Stakeholders sao particulas ESPECIAIS:
- Tamanho 3x maior
- Nome visivel acima
- Cor propria com borda branca
- Raio de influencia translucido
- Toggle individual (add/remove)

Implementacao no `ParticleLifeCpu.vue`:
- Array separado `stakeholders[]`
- Render depois das particulas normais
- Fisica: stakeholder atrai particulas compativeis (baseado em afinidade com cada segmento)
- Nao recebe forca de particulas normais (se move lentamente para zona de afinidade)

Lista de stakeholders:
```
CANDIDATOS: Jorge Everton, Soldado Sampaio, Joilma Teodora, Eder Lourinho, + 6
PODER: Denarium, Damiao, Teresa Surita, Arthur Henrique, Juca, Mecias, Joenia, Diniz
FORCAS: CIR, Maquina Estadual, Igreja Evangelica, TikTok/WhatsApp
```

### ETAPA 7: METRICAS ELEITORAIS (45 min)

Criar: `components/particle-life/MetricsPanel.vue`

Adicionar a barra inferior ou ao sidebar como secao colapsavel.

Metricas calculadas em tempo real (a cada 30 ticks):
- Votos estimados JE (particulas dentro do raio de JE com afinidade)
- Barra de progresso 6.627 → 10.000
- % captura por cluster (Base, Campo, Mercado, Alheio)
- Polarizacao (desvio padrao das posicoes)
- Volatilidade (velocidade media)
- Fidelidade media

### ETAPA 8: TOGGLE 4/10 CLUSTERS (30 min)

Permitir alternar entre:
- 4 clusters estrategicos (Base, Campo, Mercado, Alheio)
- 10 segmentos detalhados (Funcionalismo, Comissionados, etc)

Implementacao:
- Botao toggle no topo do sidebar
- Muda numColors, matrizes, cores, nomes
- Regenera particulas

---

## MAPA DE RISCO

| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| `npm install` falha | Alto | Verificar Node version, limpar cache |
| WebGPU nao funciona | Baixo | Usar CPU engine (e o foco) |
| Nuxt/Vue complexo demais | Medio | Focar em 5 arquivos-chave, ignorar o resto |
| Performance com 10 clusters | Medio | Manter 1000 particulas, CPU basta |
| Presets quebram ao mudar estrutura | Medio | Testar apos cada mudanca |

---

## ARQUIVOS-CHAVE (5 para focar, ignorar o resto)

```
1. components/particle-life/ParticleLifeCpu.vue  ← ENGINE + RENDER
2. stores/particleLifeStore.ts                    ← ESTADO (parametros)
3. composables/usePresetManager.ts                ← PRESETS
4. components/particle-life/MatrixSettings.vue    ← MATRIZ UI
5. components/SidebarLeft.vue                     ← CONTAINER DO PAINEL
```

Com esses 5 arquivos + novos componentes (EventPanel, StakeholderPanel, MetricsPanel) = simulador eleitoral completo.

---

## CRONOGRAMA

| Etapa | Tempo | Deps |
|-------|-------|------|
| 0. Rodar | 15 min | — |
| 1. Rebranding | 30 min | Etapa 0 |
| 2. Vocabulario | 45 min | Etapa 1 |
| 3. Presets eleitorais | 45 min | Etapa 2 |
| 4. Nomes segmentos | 30 min | Etapa 3 |
| 5. Eventos | 1h | Etapa 3 |
| 6. Stakeholders | 1h | Etapa 3 |
| 7. Metricas | 45 min | Etapa 6 |
| 8. Toggle 4/10 | 30 min | Etapa 4 |
| **TOTAL** | **~6h** | |

---

## DOCUMENTACAO ELEITORAL

Copiada para `docs-eleitoral/` dentro deste repo.
Ler `docs-eleitoral/INDICE.md` para hierarquia completa.

4 documentos essenciais:
1. `RORAIMA_CONSOLIDADO_INTEIA.md` — tudo sobre RR
2. `CLUSTERS_4_JORGE_EVERTON.md` — clusters + forcas + stakeholders
3. `PLANO_SIMULADOR_ELEITORAL_v3.md` — features detalhadas
4. `PLANO_CONSTRUCAO_NOVO_SISTEMA.md` — etapas tecnicas

---

*INTEIA — Igor Morais Vasconcelos — 2026-03-21*
*Fork: github.com/igormorais123/SandboxScience*
