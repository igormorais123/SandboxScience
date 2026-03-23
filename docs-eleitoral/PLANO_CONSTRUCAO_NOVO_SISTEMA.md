# PLANO DE CONSTRUCAO — SIMULADOR ELEITORAL INTEIA v2
## Novo sistema baseado no codigo do Particle Life Lab
### INTEIA | Igor Morais Vasconcelos | 2026-03-21

---

## DECISAO ARQUITETURAL

### Dois sistemas coexistem:
| Arquivo | Papel | Status |
|---------|-------|--------|
| `vida_artificial.html` | Sistema atual — continua funcionando para experimentos | MANTER intacto |
| **`simulador_eleitoral.html`** | **NOVO sistema** — construido do zero sobre a base do lab | CRIAR |
| `vida_artificial_lenia.html` | Lab de fisica (presets biologicos + eleitoral) | MANTER como referencia |

### Por que novo arquivo e nao refatorar o atual?
- O atual tem 1244 linhas de codigo acumulado de muitas iteracoes com bugs residuais
- O lab (`vida_artificial_lenia.html`) tem fisica COMPROVADA em 869 linhas limpas
- Construir sobre o lab e mais seguro que consertar o atual
- O atual continua disponivel para comparacao

---

## BASE: O QUE PEGAR DO LAB (vida_artificial_lenia.html)

### Manter EXATAMENTE como esta:
```
COMPONENTE                  LINHAS    MOTIVO
CSS completo                1-88      Layout painel+canvas funciona bem
Engine (mkP, mkGroup)       668-677   Criacao de particulas
Spatial hash (typeGrid)     700-714   Performance comprovada
Fisica (applyAllRules)      716-795   Hunar g/d + viscosidade + wall + brush = FUNCIONA
Render (update/draw)        836-855   fillRect + trails + FPS counter
Keyboard shortcuts          258-264   Espaco, T, B, R
Mouse tracking              198-231   Brush atrair/repelir + click pulse
```

### Remover do lab:
```
COMPONENTE                  MOTIVO
Presets biologicos (P)      Substituir por presets eleitorais
Cores fixas (C, N)          Substituir por segmentos eleitorais
```

### Adicionar ao lab:
```
COMPONENTE                  DESCRICAO
Dados RR_DATA               15 municipios com dados auditados TSE
4 clusters eleitorais       Base, Campo, Mercado, Alheio
Classificador               classifyVoter com proporcoes corretas
10 segmentos opcionais      Cardapio expandido
Stakeholders                18 figuras de poder como particulas grandes
Eventos eleitorais          15 eventos com efeito nos atributos
Metricas JE                 Captura de votos em tempo real
Timeline campanha           8 meses simulados
Testes de hipotese          5 pre-programados
Super-ima mover             Modo brush adicional
UI de segmentos             Checkboxes + sliders + cores editaveis
Matriz editavel visual      Grid clicavel com cores
```

---

## ESTRUTURA DO NOVO ARQUIVO (simulador_eleitoral.html)

```
BLOCO 1: HTML + CSS (linhas 1-150)
├── Head (meta, titulo, fonte Inter)
├── CSS painel esquerdo (320px, scrollavel, colapsavel)
├── CSS canvas (flex, responsivo)
├── CSS barra inferior (metricas)
└── CSS componentes (sliders, matriz, stakeholders)

BLOCO 2: HTML ESTRUTURA (linhas 150-250)
├── Header INTEIA (logo, titulo, pesquisador)
├── Sidebar
│   ├── Cenario (dropdown presets)
│   ├── Mundo (sliders: eleitores, segmentos, territorio, inercia)
│   ├── Segmentos (checkboxes com cores)
│   ├── Matriz (grid visual editavel)
│   ├── Stakeholders (cardapio toggleavel)
│   ├── Eventos (botoes + timeline)
│   ├── Ferramentas (brush mode, add/remove)
│   └── Metricas JE (captura, votos, barra progresso)
├── Canvas
└── Barra inferior (FPS, tick, volatilidade, polarizacao)

BLOCO 3: DADOS (linhas 250-400)
├── RR_DATA (15 municipios auditados)
├── CLUSTERS_4 (Base, Campo, Mercado, Alheio)
├── CLUSTERS_10 (10 segmentos detalhados)
├── FORCE_MATRIX (4x4 ou 10x10 conforme escolha)
├── RADIUS_MATRIX (4x4 ou 10x10)
├── STAKEHOLDERS (18 figuras)
├── EVENTS (15 eventos)
├── PRESETS (7 cenarios)
└── SEG_PROFILES (atributos por segmento)

BLOCO 4: ENGINE (linhas 400-600) — copiado do lab com adaptacoes
├── Variaveis globais (viscosity, force_mult, etc)
├── Criacao de particulas (mkP, createParticles)
├── Classificacao (classifyVoter)
├── Spatial hash (buildTypeGrid)
├── Fisica (applyAllRules — Hunar g/d exato)
├── Brush (atrair/repelir/mover)
├── Stakeholders como particulas especiais
└── Eventos (aplicar efeitos nos atributos)

BLOCO 5: RENDER (linhas 600-700)
├── Clear (trails ou limpo)
├── Particulas (fillRect batch por cor)
├── Stakeholders (circulo + nome + raio)
├── Brush cursor
└── FPS counter

BLOCO 6: UI (linhas 700-1000)
├── buildPresetDropdown()
├── buildWorldSliders()
├── buildSegmentPanel()
├── buildForceMatrix()
├── buildStakeholderPanel()
├── buildEventButtons()
├── buildToolbar()
├── updateMetrics()
├── updateCapture() — votos JE tempo real
└── Testes de hipotese

BLOCO 7: INIT + MAIN LOOP (linhas 1000-1050)
├── init()
├── mainLoop() com auto-throttle
├── Event listeners (mouse, keyboard, resize)
└── Startup (carregar preset default)

TOTAL ESTIMADO: ~1050 linhas
```

---

## PLANO DE CONSTRUCAO EM 6 ETAPAS

### ETAPA 1: Esqueleto (30 min)
**Objetivo**: arquivo funciona, painel + canvas, 1000 particulas se movendo

Tarefas:
- [ ] Criar `simulador_eleitoral.html`
- [ ] Copiar CSS do lab adaptando cores INTEIA (dourado #c89520)
- [ ] Trocar fonte de JetBrains Mono para Inter
- [ ] Criar HTML: header INTEIA + sidebar vazio + canvas
- [ ] Copiar engine do lab (mkP, spatial hash, applyAllRules, render)
- [ ] Criar RR_DATA com 15 municipios
- [ ] Criar 4 clusters com proporcoes (180/420/250/150)
- [ ] Criar FORCE_MATRIX 4x4 e RADIUS_MATRIX 4x4
- [ ] createParticles() com classificador por score ponderado
- [ ] Main loop com auto-throttle
- [ ] Testar: 1000 particulas, 4 cores, 60fps

**Criterio de sucesso**: abre no browser, 4 cores se movem, nao trava.

### ETAPA 2: Painel basico (30 min)
**Objetivo**: usuario controla a simulacao

Tarefas:
- [ ] Dropdown de cenarios (7 presets)
- [ ] Sliders de mundo (eleitores, inercia, intensidade, espaco pessoal, rastro)
- [ ] Botoes REINICIAR e ALEATORIO
- [ ] Legenda de segmentos com cores e contagens
- [ ] FPS e tick na barra inferior
- [ ] Pause/resume com espaco
- [ ] Keyboard shortcuts (R, T, B, S)

**Criterio**: usuario muda slider, simulacao responde.

### ETAPA 3: Matriz + Brush (30 min)
**Objetivo**: usuario edita forcas e interage com particulas

Tarefas:
- [ ] Matriz de forcas visual (grid 4x4 com cores verde/vermelho)
- [ ] Click na celula altera forca em +5 (shift = -5)
- [ ] Tooltip em cada celula com significado social
- [ ] Brush atrair (click+drag)
- [ ] Brush repelir (shift+click+drag)
- [ ] Brush mover (ctrl+click+drag)
- [ ] Slider raio e intensidade do brush
- [ ] Cursor visual do brush no canvas

**Criterio**: usuario clica na matriz, forcas mudam, clusters reagem. Brush move particulas.

### ETAPA 4: Stakeholders (30 min)
**Objetivo**: candidatos e figuras de poder no campo

Tarefas:
- [ ] Lista de 18 stakeholders com toggle individual
- [ ] Stakeholder como particula 3x maior com nome
- [ ] Raio de influencia translucido
- [ ] Stakeholder migra para zona de afinidade
- [ ] Eleitores proximos e compativeis sao contados
- [ ] Click no stakeholder mostra perfil
- [ ] Painel mostra "Eleitores proximos: X (Y%)" por stakeholder ativo

**Criterio**: ativar JE e Sampaio, ver os dois disputando particulas.

### ETAPA 5: Eventos + Metricas (45 min)
**Objetivo**: simulacao conta historia e mede impacto

Tarefas:
- [ ] 15 botoes de evento organizados por categoria
- [ ] Cada evento modifica atributos das particulas afetadas
- [ ] Bias por segmento (fake news afeta jovens 2x mais)
- [ ] Metricas JE: votos estimados, % captura por cluster
- [ ] Barra de progresso: 6.627 → meta 10.000
- [ ] Log de eventos com timestamp
- [ ] Interpretacao automatica (polarizacao, volatilidade, fidelidade media)
- [ ] Timeline visual de campanha (barra inferior, 8 meses)

**Criterio**: clicar "CNH Gratis TikTok", ver Campo de Disputa se mover, metricas atualizarem.

### ETAPA 6: Segmentos expandidos + Polish (30 min)
**Objetivo**: versao completa

Tarefas:
- [ ] Toggle entre 4 clusters e 10 segmentos
- [ ] Modos de cor: segmento, orientacao, fidelidade, vulnerabilidade, municipio
- [ ] Testes de hipotese pre-programados (5)
- [ ] Snapshot e comparacao
- [ ] Screenshot PNG
- [ ] Adicionar/remover particulas por click
- [ ] Zoom e pan
- [ ] Modo fullscreen
- [ ] Warning se >2000 particulas

**Criterio**: sistema completo, todas features funcionam, 60fps.

---

## MAPA DE RISCO

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| Performance com 10 clusters | Media | Alto | Manter cr=3, batch render, auto-throttle |
| Matriz 10x10 pesada | Baixa | Medio | Lazy update (so recalcula quando editada) |
| Brush + stakeholders juntos | Media | Medio | Brush desativa stakeholder force temporariamente |
| Timeline trava com muitos eventos | Baixa | Alto | Eventos em batch, nao renderiza intermediarios |
| CSS quebra em tela pequena | Alta | Baixo | Min-width no sidebar, canvas flex |

---

## PRIORIDADE DE FEATURES (cortar se necessario)

### Deve ter (Etapas 1-4):
- 4 clusters funcionando
- Matriz editavel
- Brush
- Stakeholders
- 60fps

### Deveria ter (Etapa 5):
- Eventos com efeito
- Metricas JE
- Log
- Timeline

### Bom ter (Etapa 6):
- 10 segmentos
- Testes de hipotese
- Snapshot/comparacao
- Zoom/pan
- Adicionar/remover particulas

---

## CHECKLIST PRE-CONSTRUCAO

- [x] Plano completo escrito
- [x] Dados eleitorais auditados (RORAIMA_CONSOLIDADO_INTEIA.md)
- [x] 4 clusters definidos (CLUSTERS_4_JORGE_EVERTON.md)
- [x] FORCE_MATRIX 4x4 com logica social
- [x] RADIUS_MATRIX 4x4
- [x] 18 stakeholders com perfis
- [x] 15 eventos com efeitos
- [x] Lab testado e funcionando (vida_artificial_lenia.html, 869 linhas)
- [x] Performance medida: 14ms/frame para 1000 particulas
- [x] Fonte Inter carregada
- [ ] **PROXIMO PASSO: criar simulador_eleitoral.html**

---

*INTEIA — Igor Morais Vasconcelos — 2026-03-21*
*"O melhor codigo e o que voce nao precisa reescrever."*
*Base: vida_artificial_lenia.html (869 linhas comprovadas)*
*Alvo: simulador_eleitoral.html (~1050 linhas, 6 etapas, ~3.5 horas)*
