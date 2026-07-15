# PLANO — Particle Life DF v2 ("Particulife DF")

> Planejamento completo da segunda geração do simulador político de partículas, aplicado ao Distrito Federal. Documento de planejamento — nada aqui foi executado ainda.
> Data: 2026-07-15 · Pesquisa: código atual (RR) + política DF 2025-2026 + teoria Particle Life/Lenia/dinâmica de opinião.

---

## 1. Diagnóstico da versão atual (Roraima)

O que existe hoje (`constants/electoralScenarios.ts`, 1509 linhas; motor em `particleComputeForces.wgsl` + `ParticleLifeCpu.vue`):

**Pontos fortes** (aproveitar):
- Arquitetura 100% data-driven: cenários são objetos `ElectoralScenario` com matrizes NxN de força + raios min/max. Adicionar DF não exige mexer no motor.
- Convenção estabelecida: positivo = atração, negativo = repulsão, escala raw [-100,+100] normalizada por `norm()`.
- Assimetria permitida (predador-presa): F[i→j] ≠ F[j→i].
- GPU (WebGPU, spatial hashing) + fallback CPU; painel de presets, editor de matriz, brush, Helena (IA gera config).
- Scripts Python de calibração por proxies documentais (V/G/E/S/I).

**Limitações que a v2 do DF deve atacar**:
1. **Partícula nunca muda de tipo** — não existe conversão de eleitor, o cerne de qualquer eleição. A simulação mostra geografia de afinidades, não disputa.
2. **Sem espaço com significado** — o canvas é homogêneo; no DF o território É a política (Plano Piloto vs 35 RAs).
3. **Sem eventos temporais** — a matriz é fixa após T=0; cenários de evento são presets separados, não uma linha do tempo.
4. **Sem métricas** — o usuário olha bolinhas e precisa "adivinhar" o que significa. Foi exatamente a queixa do Igor: "não consegui interpretar muito bem".
5. **Sem candidatos** — só segmentos; não há atratores nomeados disputando os mesmos eleitores.

A limitação 4 é a causa-raiz do fracasso interpretativo da v1. A v2 precisa **traduzir a física em leitura política em tempo real**.

## 2. Conceito da v2 — "o DF como organismo político"

Três camadas acopladas (em vez de uma):

```
CAMADA 1 — TERRITÓRIO (novo)
  Campo espacial fixo: zonas que representam macro-regiões do DF.
  Partículas têm "âncora domiciliar" — moram em algum lugar e são
  puxadas de volta (política do DF é territorial: Ceilândia decide).

CAMADA 2 — FÍSICA SOCIAL (evolução do motor atual)
  Matriz de atração/repulsão assimétrica entre segmentos (como hoje),
  + candidatos como partículas-atratoras especiais com raio de carisma.

CAMADA 3 — OPINIÃO/CONVERSÃO (novo)
  Cada partícula carrega lean ∈ [-1,+1] (esquerda↔direita) e
  engajamento ∈ [0,1]. Modelo Deffuant (bounded confidence): vizinhos
  espaciais com opinião próxima se influenciam; partícula pode
  CONVERTER de segmento volátil (troca de cor gradual = voto migrando).
```

O que aparece na tela deixa de ser "bolinhas que dançam" e passa a ser: **eleitores morando em regiões, sendo disputados por candidatos, mudando de lado sob eventos — com placar de intenção de voto emergindo da física, não de números digitados.**

### 2.1 Território do DF (Camada 1)

Layout espacial fixo inspirado no mapa real, estilizado em anéis (coerente com a forma radial do DF):

- **Centro**: Plano Piloto (Asa Sul/Asa Norte separadas — Asa Norte foi a única RA de Lula em 2022)
- **Anel 1** (renda alta): Lago Sul, Lago Norte, Sudoeste, Águas Claras
- **Anel 2** (classe média/trabalhadora): Taguatinga, Guará, Gama, Sobradinho
- **Anel 3** (periferia decisiva): Ceilândia (maior colégio, 3 zonas), Samambaia, Planaltina, Recanto
- **Franja** (vulnerabilidade): Sol Nascente, Estrutural, Itapoã
- **Borda externa** (não vota, mas pressiona): Entorno/RIDE — partículas "fantasma" que consomem serviços e geram fluxo pendular

Implementação: campo de âncora por partícula (`homeX, homeY` + força de retorno fraca `homeStrength`), mais gradiente de renda como textura de fundo. Não requer polígonos geográficos reais — anéis estilizados bastam e ficam mais legíveis.

### 2.2 Segmentos do DF (Camada 2) — proposta de 12

Calibrados por: TSE 2022 (Bolsonaro 58,81% no DF), Censo 2022 (~30-35% evangélicos), PDAD/CODEPLAN (renda por RA, Gini 0,468), pesquisas GDF 2026 (Celina 23-28%, Arruda 17-23%, Grass 9-16%).

| # | Segmento | Prop. | Âncora territorial | Papel dinâmico |
|---|----------|-------|--------------------|----------------|
| 0 | Elite bolsonarista | 8% | Lago Sul/Sudoeste | Núcleo ideológico coeso, financia |
| 1 | Funcionalismo federal | 9% | Plano/Águas Claras | Volátil por pauta (carreira), anti-caos |
| 2 | Funcionalismo distrital + segurança (FCDF) | 8% | Anéis 1-2 | Cliente da máquina do GDF |
| 3 | Evangélicos de periferia | 14% | Anéis 2-3 | Voto em bloco, ponte entre classes |
| 4 | Evangélicos de classe média | 6% | Anéis 1-2 | Idem, mais ideológico |
| 5 | Periferia consolidada | 16% | Ceilândia/Samambaia | MAIOR bloco; decide a eleição; volátil |
| 6 | Vulneráveis / regularização | 8% | Sol Nascente/Estrutural | "Mercado do voto" do DF: regularização fundiária como moeda |
| 7 | Classe média progressista | 7% | Asa Norte/universidades | Base Grass/Kokay, coesa mas pequena |
| 8 | Jovens urbanos | 8% | Difusos | Baixa coesão, alta volatilidade, presa de todos |
| 9 | Máquina do GDF | 4% | Difusos (35 RAs) | Predador benigno: administradores regionais + comissionados caçam voto para a situação |
| 10 | Empresariado/comércio | 5% | Taguatinga/SIA | Pragmático, segue favorito |
| 11 | Entorno/agro (fantasma) | 7% | Borda externa | Não vota; pressiona serviços; puxa pauta conservadora |

**Candidatos como atratores nomeados** (partículas especiais, maiores, com rótulo):
- **Celina (PP)** — nasce grudada na Máquina do GDF e evangélicos (Damares como ponte)
- **Arruda (PSD)** — atrator com "cicatriz": atrai anti-petismo, mas emite pulso de repulsão quando o evento "Caixa de Pandora" dispara
- **Grass (PT/federação)** — forte só no cluster progressista; desafio visível: alcançar o Anel 3

Cada atrator tem: raio de carisma, força por segmento (linha própria na matriz), e "orçamento de máquina" que amplifica alcance (Celina alta, Grass baixa).

### 2.3 Física e conversão (Camadas 2-3)

Manter o kernel atual (repulsão < minR, força triangular até maxR, fricção, assimetria) e adicionar:

1. **Opinião contínua + conversão (Deffuant acoplado ao espaço)**:
   - `lean_i ← lean_i + μ·(mean(lean_vizinhos com |Δlean|<ε) − lean_i)` a cada k frames, vizinhos = espaciais.
   - Segmentos têm `volatilidade ∈ [0,1]`: evangélicos 0.1, jovens 0.8, periferia 0.6.
   - Quando `|lean − lean_do_segmento|` cruza limiar E a partícula está há X frames no raio de um atrator, ela **converte**: transição suave de cor. É o voto migrando, visível.
2. **Âncora territorial**: força fraca de retorno ao `home` — impede o colapso em bola única (defeito estético comum) e cria leitura geográfica.
3. **Timeline de eventos** (player com play/pause/velocidade): eventos agendados ou disparados pelo usuário modificam matriz/parâmetros com interpolação suave (`K(t) = lerp(K_old, K_target, smoothstep)`), nunca troca seca de preset. Eventos planejados:
   - *Divulgação de pesquisa* (bandwagon: empresariado/jovens migram ao líder)
   - *Caixa de Pandora reativada* (pulso de repulsão em Arruda, exceto núcleo anti-petista)
   - *Anúncio de regularização fundiária* (Máquina do GDF ganha +80 sobre Vulneráveis)
   - *Ato bolsonarista no Lago Sul* (coesão da direita +, repulsão dos progressistas −)
   - *Greve do funcionalismo* (funcionalismo federal e distrital fundem temporariamente)
   - *Debate na TV* (choque de ruído/temperatura: sacode partículas de baixo engajamento)
   - *2º turno* (remove o atrator 3º colocado; suas partículas são redistribuídas pela física — a simulação "responde" quem herda o voto)
4. **Ruído térmico** (`temperatura`): jitter proporcional a (1 − engajamento) — eleitor desengajado é browniano, militante é balístico.

### 2.4 Métricas e leitura em tempo real (a correção principal da v1)

Painel lateral "Leitura Política", atualizado ao vivo:

- **Placar emergente**: % de partículas dentro do raio de captura de cada atrator (+ indecisos) — gráfico de barras estilo pesquisa eleitoral, com série temporal. É a métrica-estrela: intenção de voto que EMERGE da física.
- **Índice de polarização**: bimodalidade da distribuição de `lean` (coeficiente BMC) — "DF unido ↔ DF rachado".
- **Índice de segregação territorial** (dissimilarity por célula do grid): mede bolhas.
- **Temperatura política**: velocidade média — campanha quente/fria.
- **Narrador automático**: 1 frase gerada por regras a cada mudança relevante ("Ceilândia começou a migrar para Celina após o anúncio da regularização"). Sem isso, leigo não interpreta; com isso, o app se explica.
- Tooltip por partícula já existe (manter): segmento, RA de origem, lean, candidato atual.

### 2.5 Gramática visual — calibrar forças para formas INTELIGÍVEIS (requisito do Igor)

Princípio inviolável da v2: **nenhuma matriz entra no app se não produzir uma forma visual nomeável em até ~20 segundos de simulação**. A física não é decorativa — cada forma é uma frase política que o olho lê sem legenda. Dicionário de formas (cada uma tem receita física conhecida da literatura Particle Life):

| Forma visual | Receita física | Significado político no DF |
|---|---|---|
| **Núcleo denso com casca** | diagonal alta (70-90) + minR baixo (~25) | Bloco coeso que vota fechado (evangélicos, elite bolsonarista) |
| **Nuvem difusa** | diagonal baixa (10-25) + maxR alto | Eleitorado disperso e volátil (jovens, indecisos) |
| **Órbita / satélite** | A→B forte (+60), B→A fraco (+10), raios distintos | Dependência: Máquina do GDF orbitando Celina; comissionados orbitando o poder |
| **Perseguição (predador-presa)** | A→B +70, B→A −60 | Caça ao voto: máquina/regularização caçando vulneráveis; assédio de campanha sobre jovens |
| **Membrana / fronteira nítida** | repulsão mútua forte (−60 a −90) entre dois blocos densos | Polarização: Plano progressista vs elite bolsonarista — o "muro" do DF |
| **Ponte / corrente** | C atrai A e B (+40/+40) que se repelem entre si | Segmento-ponte: evangélicos ligando periferia à direita de elite |
| **Ilha isolada** | auto-atração alta + repulsão de todos os outros | Bolha: cluster progressista da Asa Norte ilhado |
| **Anéis concêntricos** | shells de raios crescentes ao redor de um atrator | Círculos de proximidade de um candidato: núcleo duro → simpatizantes → alcançáveis |
| **Migração de maré** (com conversão) | evento reduz coesão de A + aumenta atração de atrator X | Voto migrando em bloco após evento — a cena-assinatura da v2 |

Protocolo de calibração por forma (substitui o "calibrar e torcer" da v1):
1. Para cada cenário, escrever ANTES a lista de formas esperadas ("Panorama 2026 deve mostrar: 2 núcleos, 1 membrana central, 1 ponte evangélica, 1 ilha, nuvem de jovens sendo caçada").
2. Rodar a matriz calibrada documentalmente e comparar contra a lista — teste visual automatizado via screenshot Playwright + inspeção humana.
3. Se a forma não emerge, ajustar raios primeiro (minR/maxR controlam a forma), força depois (controla intensidade) — mantendo o sinal e a ordem relativa vindos dos dados documentais (a documentação fixa a topologia; a estética calibra a geometria).
4. Regra anti-sopa: máximo de 3-4 formas protagonistas simultâneas por cenário; segmentos coadjuvantes recebem forças fracas (|F| < 20) para virarem fundo, não ruído.
5. O narrador (2.4) nomeia a forma na tela ("membrana formada entre Plano e periferia") — fechando o ciclo forma → palavra → entendimento.

## 3. Arquitetura de arquivos (nova pasta "particle-life-df")

Convivência com Roraima: mesma página raiz do site, novo item de navegação/rota. Nada do RR é alterado.

```
SandboxScience/
├── pages/
│   └── particle-life-df.vue              # nova rota /particle-life-df
├── components/particle-life-df/          # ★ pasta nova pedida pelo Igor
│   ├── ParticleLifeDf.vue                # orquestrador (canvas + painéis)
│   ├── DfCanvas.vue                      # renderização (camadas: território, partículas, atratores)
│   ├── DfScoreboard.vue                  # placar emergente + séries temporais
│   ├── DfTimeline.vue                    # player de eventos (play/pause/inject)
│   ├── DfNarrator.vue                    # narrador automático
│   ├── DfScenarioPanel.vue               # seleção de cenários DF
│   └── DfLegend.vue                      # legenda de segmentos + candidatos
├── composables/
│   ├── useDfEngine.ts                    # motor v2 (física + opinião + âncoras + eventos)
│   ├── useDfMetrics.ts                   # BMC, segregação, placar, temperatura
│   └── useDfNarrator.ts                  # regras → frases
├── constants/
│   └── dfScenarios.ts                    # segmentos, matrizes, candidatos, eventos, territórios
└── scripts/
    └── calibrar_matriz_df.py             # adaptação do calibrador documental (proxies V/G/E/S/I com dados DF)
```

Decisões técnicas:
- **Motor v2 em TypeScript/CPU primeiro** (typed arrays + spatial hash uniforme), alvo 8-15 mil partículas a 60fps — suficiente e muito mais simples de iterar que WGSL. Conversão/opinião/eventos em shader ficam para uma fase 2 opcional.
- **Não tocar no motor GPU atual** — risco zero de regressão no que já funciona (RR).
- Reusar `ElectoralScenario` estendendo o schema para `v: 2` (campos novos: `home`, `volatility`, `attractors[]`, `events[]`, `territory[]`), com narrativa/descrição por cenário como hoje.
- Link cruzado: na página do particle-life atual, um card "Versão DF (v2)" e vice-versa.

## 4. Cenários DF de lançamento (6)

1. **DF — Panorama 2026** (baseline): 12 segmentos + 3 atratores, matriz calibrada, sem eventos. Mostra o equilíbrio: Celina ancorada na máquina+evangélicos, Arruda orbitando o anti-petismo, Grass ilhado na Asa Norte.
2. **DF — A Batalha de Ceilândia**: zoom na disputa pelo Anel 3; eventos de regularização vs presença territorial do PT.
3. **DF — Rachadura na Direita**: Michelle sai / PL desorganizado; simula a fragmentação do voto conservador no Senado.
4. **DF — Escândalo**: timeline com Caixa de Pandora em T=300; observa quem herda o voto de Arruda.
5. **DF — Segundo Turno**: remove o 3º colocado ao vivo; física redistribui.
6. **DF — Capital Rachada** (modo ideias, herdeiro do Bleger): valores em disputa na cidade mais desigual e mais bolsonarista do país; polarização máxima com Pertencimento como ponte.

## 5. Calibração (mesmo método documental do RR, dados DF)

Proxies V/G/E/S/I do `calibrar_matriz_documental.py` adaptados:
- **V**: TSE 2022 por zona eleitoral do DF (Bolsonaro 58,81%; Asa Norte única RA de Lula; Ibaneis 1º turno)
- **G**: PDAD/CODEPLAN — co-residência por RA (renda Lago Sul ~16× Estrutural)
- **E**: dependência do FCDF (~40% do orçamento), funcionalismo como classe econômica
- **S**: peso evangélico (~30-35%), fluxo pendular Entorno
- **I**: pesquisas 2026 (Exata OP jul/2026, Correio/OPINIÃO jun/2026) para forças dos atratores
Toda célula da matriz com comentário-fonte, como já é padrão no arquivo RR.

## 6. Fases de execução (quando autorizada)

| Fase | Entrega | Critério de pronto |
|------|---------|--------------------|
| 1 | `dfScenarios.ts` + motor CPU v2 (física + âncoras territoriais) renderizando o Panorama 2026 | 10k partículas 60fps, clusters territoriais legíveis |
| 2 | Atratores/candidatos + conversão de opinião | Partículas trocam de cor de forma crível; placar emergente estável |
| 3 | Timeline de eventos + interpolação de matrizes | Evento "Escândalo" produz migração visível e reversível |
| 4 | Painel de métricas + narrador + legenda/tooltips | Leigo entende a cena em <30s sem ler manual (teste com Igor) |
| 5 | 6 cenários calibrados pela gramática visual (2.5) + polish + validação no navegador (gate INVIOLÁVEL) | Cada cenário produz suas formas esperadas em <20s; fluxo completo testado ponta a ponta via Playwright antes de declarar pronto |

Estimativa: fases 1-2 são o núcleo (maior esforço); 3-5 incrementais. Cada fase termina com commit.

## 7. Riscos e mitigações

- **Sopa visual** (12 segmentos + 3 atratores = poluição): mitigar com modo "foco" (destacar 1 segmento, esmaecer resto) e paleta por família de cor (direita = quentes, esquerda = frios, evangélicos = dourado, máquina = branco).
- **Falsa precisão**: o placar emergente NÃO é previsão eleitoral. Disclaimer fixo: "modelo qualitativo de dinâmicas, não pesquisa". Rotular inferências.
- **Performance da camada de opinião**: rodar Deffuant a cada 10 frames, não por frame; amostragem de vizinhos.
- **Instabilidade física com âncoras** (oscilação): âncora com amortecimento crítico; testar com friction 0.13-0.15 herdado do RR.
- **Dados 2026 mudam rápido** (Michelle/PL indefinidos): matrizes de atratores num bloco isolado e comentado do `dfScenarios.ts`, fácil de recalibrar.

---
*Fontes principais: relatório de exploração do codebase (electoralScenarios.ts, shaders WGSL, PresetPanel); pesquisa web política DF (Metrópoles, Correio, Exata OP jul/2026, TSE, PDAD); pesquisa teoria (Ventrella Clusters, hunar4321, Lenia/Particle Lenia — Bert Chan/Google Research, Deffuant/Hegselmann-Krause, Schelling, Axelrod).*
