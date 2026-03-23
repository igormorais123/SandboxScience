# PLANO DE FORK v3 - SANDBOXSCIENCE -> INTEIA ELEITORAL
## Documento refeito apos auditoria real do codigo, do build e da arquitetura
## Arquivo mantido como `PLANO_FORK_v2.md` por compatibilidade de referencias
## INTEIA | Igor Morais Vasconcelos | 2026-03-21

---

## 1. ESSENCIA DO PROJETO

O objetivo nao e "traduzir Particle Life para politica".

O objetivo e transformar o SandboxScience em um **laboratorio visual de dinamica eleitoral** para:
- testar cenarios,
- visualizar captura, dispersao e coesao de segmentos,
- simular perturbacoes de campanha,
- comparar estrategias sem reescrever um motor fisico do zero.

O core fisico continua sendo o do SandboxScience.
O que muda e a **camada de interpretacao**, a **camada de cenarios** e a **camada de leitura estrategica**.

Principio central:

> Adaptar o engine existente e mais inteligente que reescrever.
> Mas adaptar sem respeitar a arquitetura real do codigo gera retrabalho e bugs invisiveis.

---

## 2. VERDADE DO CODIGO HOJE

Esta secao substitui suposicoes por fatos auditados.

### 2.1 Confirmado no codigo

- `pages/particle-life.vue` abre com **preferencia por GPU** quando WebGPU existe.
- `components/particle-life/ParticleLifeCpu.vue` e um **monolito**: sidebar, canvas, render, fisica, presets, watchers e mutacoes do store estao no mesmo arquivo.
- `layouts/life.vue` hoje **nao tem header eleitoral**; ele so esconde a navbar.
- `components/SidebarLeft.vue` usa largura fixa de `400px` e posicoes hardcoded para botoes flutuantes.
- `stores/particleLifeStore.ts` nasce com defaults de **6000 particulas** e **7 cores**, o oposto do alvo eleitoral inicial.
- `PresetPanel.vue` tem aba "Official Presets", mas ela hoje e um painel de geradores de paleta e matriz, nao cenarios oficiais.
- `SaveModal.vue` e `usePresetManager.ts` suportam schema de preset, mas a parte de `settings` esta **desativada na UI**.
- `RulesMatrix.vue`, `MinMatrix.vue` e `MaxMatrix.vue` hoje usam **bolinhas de cor**, nao nomes de segmentos.
- No CPU, as cores sao manipuladas como **HSL arrays**, nao RGB arrays.
- `constants/index.ts` ainda aponta para marca, URL e descricoes do Sandbox Science.

### 2.2 Confirmado por validacao tecnica

- `npm run build`: **OK**
- `npm run typecheck`: **FALHA**

Erros reais encontrados no baseline:
- acesso inseguro a `$event.target` em inputs,
- `implicit any` em arquivos da matriz,
- tipagem incompleta em `pages/game-of-life.vue`,
- incompatibilidade `Float32Array` / `GPUAllowSharedBufferSource` em `ParticleLifeGpu.vue`.

### 2.3 Implicacoes praticas

1. O fork **nao pode comecar direto por features eleitorais**. Primeiro precisa de baseline tecnico minimamente estavel.
2. O plano antigo superestimava o grau de separacao entre UI, store e engine.
3. O plano antigo subestimava o risco de GPU virar caminho default e quebrar a tese "CPU como foco".
4. O plano antigo jogava dados sensiveis em `constants/electoral.ts` sem considerar que isso vai parar no bundle do cliente.

---

## 3. PRINCIPAIS CORRECOES DE DIRECAO EM RELACAO AO PLANO ANTERIOR

| Problema no plano anterior | Correcao adotada neste plano |
|---|---|
| CPU como foco, mas pagina hoje abre GPU por default | Fase 0 muda o boot para **CPU default** e GPU opt-in |
| `constants/electoral.ts` concentrando tudo, inclusive inteligencia sensivel | Separar **dados publicos**, **tipos compartilhados** e **dados internos** |
| Presets eleitorais tratados como se o sistema atual ja suportasse tudo | Criar **cenarios oficiais** com loader proprio; nao depender so de `savedPresets` |
| Stakeholders ja nascem autonomos e movendo no motor | Entregar primeiro **stakeholders fixos/draggables**, movimento autonomo fica para versao posterior |
| Eventos alterando matriz base diretamente | Usar **camada de delta temporario** sobre a matriz base |
| Metricas com "votos estimados" exatos desde o dia 1 | Primeiro entregar **indices e scorecards**; estimativa de voto so depois de calibracao |
| Toggle 4/10 clusters cedo demais | **4 clusters fixos primeiro**; 10 clusters so depois que UX, performance e leitura estiverem solidas |
| Tempo total de 8.5h | Revisado para um cronograma realista por versao |

---

## 4. DECISOES NAO NEGOCIAVEIS

### 4.1 Produto

- V1 precisa ser um **simulador eleitoral utilizavel**, nao um prototipo bonito.
- O usuario precisa entender a leitura do sistema sem conhecer "Particle Life".
- Toda interface visivel ao usuario final deve ficar em **portugues BR**.
- O primeiro modo entregue sera **4 clusters estrategicos**.
- O simulador deve responder a perguntas estrategicas, nao fingir previsao matematica absoluta.

### 4.2 Engenharia

- **CPU e o renderer principal.**
- GPU continua existente, mas fica:
  - escondido do fluxo principal, ou
  - explicitamente marcado como modo avancado/experimental.
- Nenhuma feature nova entra antes de:
  - build verde,
  - typecheck verde,
  - smoke test visual em `/particle-life`.
- Nao vamos refatorar o monolito inteiro antes de entregar valor.
- Toda feature nova deve entrar por **costuras pequenas e controladas**.

### 4.3 Seguranca e confidencialidade

Se o deploy for publico, **todo dado incluido no frontend e publico**.

Portanto:
- nao colocar analise sensivel, observacoes internas, notas sobre concorrentes ou inteligencia de campanha diretamente em arquivo cliente;
- nao colocar dados eleitorais crus em `public/`;
- nao misturar copy publica com inteligencia interna no mesmo modulo.

Regra:
- `constants/electoral.public.ts`: labels, cores, cenarios public-safe.
- `types/electoral.ts`: tipos compartilhados.
- dados internos so entram se houver deploy privado com server-side e controle de acesso.

---

## 5. ALVO DE PRODUTO POR VERSAO

### V1 - Demo eleitoral forte e confiavel

Objetivo:
- interface em PT-BR,
- marca INTEIA,
- CPU default,
- 4 clusters estrategicos,
- cenarios oficiais,
- nomes de segmentos,
- legenda,
- metricas basicas,
- deploy estavel.

Nao entra em V1:
- timeline de campanha,
- comparador lado a lado,
- 10 clusters,
- stakeholders autonomos,
- voto estimado calibrado,
- auth privada.

### V1.1 - Inteligencia acionavel

Objetivo:
- eventos temporarios,
- stakeholders basicos,
- score de captura por cluster,
- snapshots simples.

### V2 - Sistema estrategico completo

Objetivo:
- 10 clusters,
- timeline,
- comparador de cenarios,
- testes de hipotese automatizados,
- modo interno com dados sensiveis protegidos.

---

## 6. ARQUITETURA ALVO DE BAIXO RISCO

### 6.1 Camada de dados

Criar:

```text
types/electoral.ts
constants/electoral.public.ts
constants/electoralScenarios.ts
```

Responsabilidades:

- `types/electoral.ts`
  - `ElectoralCluster`
  - `ElectoralScenario`
  - `ElectoralEvent`
  - `ElectoralStakeholder`
  - `ElectoralMetrics`

- `constants/electoral.public.ts`
  - nomes public-safe,
  - cores,
  - proporcoes,
  - descricoes curtas de interface,
  - matrizes 4x4 publicas.

- `constants/electoralScenarios.ts`
  - cenarios oficiais em formato consumivel pelo app,
  - sem depender de `localStorage`.

### 6.2 Camada de presets e cenarios

Nao misturar duas coisas diferentes:

- **My Presets** = presets do usuario salvos no navegador.
- **Cenarios Oficiais** = cenarios eleitorais versionados no codigo.

Implementacao recomendada:

- manter `usePresetManager.ts` para presets do usuario;
- adicionar loader de cenarios oficiais no `PresetPanel.vue`;
- reutilizar a pipeline de `loadPreset` do CPU sempre que possivel;
- so expandir `Preset` para `settings` se realmente necessario na V1.

### 6.3 Camada de engine

`ParticleLifeCpu.vue` continua sendo o centro da execucao em V1, mas com regras claras:

- dados eleitorais entram por imports puros;
- calculos auxiliares entram por funcoes puras;
- eventos nao sobrescrevem permanentemente a matriz base;
- stakeholders entram primeiro como overlay simples;
- metricas calculam em janela amortizada, nunca por frame sem necessidade.

### 6.4 Camada de UI

Em vez de uma grande refatoracao inicial, criar subcomponentes novos so onde gera isolamento real:

```text
components/particle-life/SegmentLegend.vue
components/particle-life/MetricsPanel.vue
components/particle-life/EventPanel.vue
components/particle-life/StakeholderPanel.vue
```

Mas:
- o encaixe inicial continua dentro de `ParticleLifeCpu.vue`;
- extracao estrutural maior fica para depois da V1.

---

## 7. ESCOPO TECNICO REVISADO POR FASE

## FASE 0 - BASELINE TECNICO E SEGURANCA
**Estimativa realista: 2h a 4h**

### Objetivo

Criar base confiavel para o fork. Sem isso, qualquer feature nova acumula erro em cima de erro.

### Tarefas obrigatorias

1. Corrigir `typecheck` atual.
2. Mudar boot da pagina para **CPU default**.
3. Decidir explicitamente a estrategia de deploy:
   - publico estatico, ou
   - privado com node server.
4. Trocar metadados globais de marca em:
   - `constants/index.ts`
   - `nuxt.config.ts`
   - `pages/particle-life.vue`
5. Ajustar defaults eleitorais iniciais:
   - `numParticles = 1000`
   - `numColors = 4`
6. Remover ou implementar funcoes vazias/debt visivel, ex. `newRandomRulesMatrix()`.

### Bugs/fontes de bug antecipadas

| ID | Problema | Acao |
|---|---|---|
| B0-1 | GPU abre por default e contradiz o produto | Forcar CPU como renderer inicial |
| B0-2 | Typecheck ja quebra antes do fork eleitoral | Corrigir agora |
| B0-3 | Marca antiga continua em meta tags e SEO | Centralizar troca em `constants/index.ts` e `nuxt.config.ts` |
| B0-4 | 6000 particulas / 7 cores viram UX e performance erradas | Definir defaults eleitorais ja no baseline |

### Criterio de aceite

- `npm run build` OK
- `npm run typecheck` OK
- `/particle-life` abre em CPU sem modal empurrando para GPU
- aba, SEO e descricao ja estao em marca INTEIA

---

## FASE 1 - PT-BR + REBRANDING + LIMPEZA DE FLUXO
**Estimativa realista: 3h a 5h**

### Objetivo

Fazer o produto parecer eleitoral e legivel antes de adicionar inteligencia nova.

### Escopo

- traducao PT-BR da interface principal,
- rebranding INTEIA,
- simplificacao do onboarding,
- esconder lab features nao prioritarias no fluxo inicial.

### Onde mexer

```text
pages/particle-life.vue
components/particle-life/ParticleLifeCpu.vue
components/particle-life/MatrixSettings.vue
components/particle-life/BrushSettings.vue
components/particle-life/PresetPanel.vue
components/particle-life/MyPresets.vue
components/particle-life/SaveModal.vue
components/particle-life/WallStateSelection.vue
components/particle-life/WrapModeSelection.vue
components/particle-life/ShareOptions.vue
components/particle-life/TrackerToggle.vue
components/SidebarLeft.vue
components/NavBar.vue
layouts/life.vue
assets/scss/main.scss
```

### Correcao importante de UX

O onboarding atual e focado em GPU/WebGPU. Para o produto eleitoral isso atrapalha.

Nova regra:
- abrir direto no simulador,
- mostrar modal curto de contexto eleitoral,
- GPU, se continuar, entra como "Modo avancado".

### Riscos

| Risco | Prob | Mitigacao |
|---|---|---|
| Traducoes longas estouram layout | Alta | revisar componente por componente |
| Header novo colide com sidebar fixa | Media | ajustar offsets e largura real do `SidebarLeft.vue` |
| Traduzir label que na verdade e chave interna | Media | traduzir so texto de interface |

### Criterio de aceite

- zero ingles visivel no fluxo principal de `/particle-life`
- marca INTEIA aplicada em UI e metadados
- modal inicial curto, claro e sem empurrar GPU

---

## FASE 2 - 4 CLUSTERS E CENARIOS OFICIAIS
**Estimativa realista: 3h a 5h**

### Objetivo

Entregar o primeiro "simulador eleitoral de verdade", com dinamica coerente e cenarios carregaveis.

### Decisao estrutural

Nao salvar cenarios oficiais em `localStorage`.
Eles devem ser versionados no codigo.

### Estrutura recomendada

```typescript
export type ElectoralScenario = {
  id: string
  name: string
  description: string
  preset: {
    rules: number[][]
    minRadius: number[][]
    maxRadius: number[][]
    colors: number[][]
    numColors: number
    numParticles: number
  }
}
```

### Arquivos

```text
types/electoral.ts
constants/electoral.public.ts
constants/electoralScenarios.ts
components/particle-life/PresetPanel.vue
components/particle-life/ParticleLifeCpu.vue
```

### Cenarios V1

- Roraima Base
- Campanha CNH
- Alianca Pastoral
- Cassacao Denarium
- Cenario Pessimista
- Cenario Otimista

### Correcao tecnica critica

No CPU, cores nao podem nascer como `[r,g,b]` se o renderer espera HSL arrays.

Portanto:
- ou definir as cores ja em HSL,
- ou converter no loader antes de chamar `setColors`.

### Riscos

| Risco | Prob | Mitigacao |
|---|---|---|
| Formato oficial diverge do loader real | Alta | adaptar ao `loadPreset` ja existente |
| Cores em RGB quebram render CPU | Alta | usar HSL ou conversao explicita |
| Preset tenta alterar settings que o app ainda nao carrega | Media | em V1, setar `numColors` e `numParticles` pelo loader oficial |

### Criterio de aceite

- usuario escolhe um cenario oficial e o canvas responde corretamente
- sistema opera com 4 clusters estaveis
- defaults do simulador passam a refletir o modo eleitoral

---

## FASE 3 - VOCABULARIO SOCIAL + NOMES DE SEGMENTO
**Estimativa realista: 2h a 4h**

### Objetivo

Eliminar a camada mental "cor 1 / species / particle" e substituir por leitura estrategica.

### Correcao importante do plano anterior

Hoje `RulesMatrix.vue`, `MinMatrix.vue` e `MaxMatrix.vue` **nao tem header textual**, apenas bolinhas.
Entao "importar `CLUSTER_NAMES`" nao basta.

### Solucao recomendada

1. Criar `SegmentLegend.vue`.
2. Exibir nomes curtos acima/ao lado da matriz.
3. Manter bolinhas de cor para leitura rapida.
4. Em telas pequenas, usar abreviacoes:
   - Base
   - Campo
   - Mercado
   - Alheio

### Mapa de traducao principal

| Termo atual | Termo eleitoral |
|---|---|
| Particle | Eleitor |
| Species / Color | Segmento |
| Force | Afinidade |
| Repel | Rejeicao |
| Friction | Inercia social |
| Min Radius | Espaco pessoal |
| Max Radius | Alcance de influencia |
| Preset | Cenario |
| World Settings | Configuracao do territorio |
| Physics Settings | Dinamica social |

### Criterio de aceite

- matriz pode ser lida sem conhecer o codigo
- usuario entende qual segmento e qual
- UI principal deixa de depender de termos tecnicos em ingles

---

## FASE 4 - METRICAS LITE
**Estimativa realista: 2h a 3h**

### Objetivo

Entregar leitura estrategica util sem prometer pseudo-precisao.

### V1: o que entra

- indice de captura por cluster,
- distribuicao atual por cluster,
- volatilidade media,
- coesao interna,
- proximidade ao stakeholder principal, quando existir.

### O que NAO entra ainda

- "7.240 votos / 10.000" como numero exato,
- score calibrado contra dados historicos reais,
- comparador temporal complexo.

### Regra de produto

Em V1, usar linguagem como:
- "indice de captura",
- "forca no Campo",
- "estabilidade da Base",
- "pressao no Mercado".

Se quiser numero de votos depois, isso entra numa fase de calibracao.

### Arquivo novo

```text
components/particle-life/MetricsPanel.vue
```

### Performance

- recalcular a cada `30 ticks`,
- nunca recalcular por frame,
- cachear ultimo snapshot.

### Criterio de aceite

- painel mostra leitura util em tempo real
- nao ha queda perceptivel de FPS
- metricas ajudam a interpretar o movimento do canvas

---

## FASE 5 - EVENTOS TEMPORARIOS
**Estimativa realista: 3h a 5h**

### Objetivo

Simular perturbacoes de campanha sem destruir o estado base do cenario.

### Correcao de arquitetura

O plano anterior aplicava evento alterando `rulesMatrix` e depois "voltando".
Isso e fragil porque:
- conflita com edicao manual,
- conflita com outros eventos,
- mistura estado base e estado temporario.

### Arquitetura correta para V1.1

Manter:
- `baseRulesMatrix`
- `activeEventDelta`
- `effectiveRulesMatrix = base + delta`

Se o usuario editar a matriz durante evento:
- ou bloqueia a edicao,
- ou aplica na base e recompila a efetiva.

### Modelo minimo

```typescript
activeEventId: string | null
activeEventTicksRemaining: number
activeEventIntensity: number
activeEventDeltaRules: number[][]
```

### Primeira entrega

- 1 evento ativo por vez
- duracao configuravel
- fade-out simples
- log visual curto no painel

### Nao entra na primeira entrega

- timeline arrastavel,
- stacking de multiplos eventos,
- simulacao calendario completa.

### Criterio de aceite

- ativar evento altera a dinamica
- terminar evento devolve o sistema ao baseline
- usuario nao perde a matriz original

---

## FASE 6 - STAKEHOLDERS BASICOS
**Estimativa realista: 3h a 6h**

### Objetivo

Adicionar atores politicos visiveis sem quebrar o motor.

### Correcao do plano anterior

Stakeholder autonomo com IA propria e legal, mas e custo alto cedo demais.
Primeira versao melhor:

- stakeholder fixo ou draggable,
- com raio de influencia,
- afetando particulas proximas,
- sem receber fisica completa das particulas.

### V1.1 recomendado

`Stakeholder`:
- `id`
- `nome`
- `tipo`
- `ativo`
- `x`, `y`
- `color`
- `radius`
- `affinityByCluster`

### Render

- circulo maior,
- borda clara,
- nome curto,
- halo transluscido opcional.

### Guardrails

- limite de 3 a 5 stakeholders ativos no CPU em V1.1,
- labels curtas,
- mostrar halo so quando selecionado ou hover, se poluir demais.

### Criterio de aceite

- stakeholder fica legivel
- influencia e perceptivel
- visual nao degrada o canvas

---

## FASE 7 - 10 CLUSTERS, TIMELINE E MODO AVANCADO
**Estimativa realista: 6h a 12h**

Esta fase fica fora da V1.

### So entra depois de tudo abaixo estar verde

- V1 entregue,
- CPU estavel,
- 4 clusters validos,
- metricas uteis,
- eventos sem regressao,
- stakeholders basicos funcionando.

### Motivo

O salto de 4 para 10 clusters aumenta:
- complexidade visual,
- ambiguidade semantica,
- volume de labels,
- custo de tuning,
- custo cognitivo do usuario.

### Regras para esta fase

- matriz 10x10 so com UI dedicada,
- mobile pode ficar com legenda lateral colapsada,
- numeros default continuam baixos,
- modo 10 clusters deve ser explicitamente "detalhado/avancado".

---

## 8. MAPA DE ARQUIVOS - O QUE TOCAR E EM QUE ORDEM

### Core obrigatorio

```text
pages/particle-life.vue
components/particle-life/ParticleLifeCpu.vue
components/particle-life/PresetPanel.vue
components/particle-life/MatrixSettings.vue
components/particle-life/RulesMatrix.vue
components/particle-life/MinMatrix.vue
components/particle-life/MaxMatrix.vue
components/SidebarLeft.vue
stores/particleLifeStore.ts
constants/index.ts
nuxt.config.ts
assets/scss/main.scss
```

### Novos arquivos recomendados

```text
types/electoral.ts
constants/electoral.public.ts
constants/electoralScenarios.ts
components/particle-life/SegmentLegend.vue
components/particle-life/MetricsPanel.vue
components/particle-life/EventPanel.vue
components/particle-life/StakeholderPanel.vue
```

### So depois, se necessario

```text
server/api/*
server/utils/*
```

Usar camada server so se houver decisao de deploy privado ou auth.

---

## 9. REGISTRO DE RISCOS REAIS

| ID | Risco | Prob | Impacto | Mitigacao |
|---|---|---|---|---|
| R1 | GPU continuar default e desalinhar produto | Alta | Alto | Fase 0: CPU default |
| R2 | Dados sensiveis vazarem no bundle | Alta | Muito alto | separar `public-safe` de `private`; nao shippar inteligencia interna |
| R3 | Type debt travar a evolucao | Alta | Alto | typecheck verde antes de feature |
| R4 | Cores eleitorais em formato errado no CPU | Alta | Medio | HSL ou conversao no loader |
| R5 | Matrix UI sem nomes ficar incompreensivel | Alta | Alto | legenda + labels curtas |
| R6 | Eventos corromperem matriz base | Media | Alto | delta temporario sobre baseline |
| R7 | Stakeholders poluirem o canvas | Alta | Medio | limitar ativos, labels curtas, halo opcional |
| R8 | Sidebar/header colidirem por layout fixo | Media | Medio | revisar offsets de `SidebarLeft.vue` |
| R9 | Metricas venderem falsa precisao | Media | Alto | usar indices antes de votos estimados |
| R10 | 10 clusters cedo demais degradarem UX | Alta | Medio | adiar para fase avancada |
| R11 | Deploy publico com stack node desnecessaria | Media | Medio | decidir cedo entre `generate` e `build` |
| R12 | Deploy privado exigir auth inexistente | Media | Alto | tratar como projeto separado ou V2 |

---

## 10. GATES DE QUALIDADE

### Gate A - Baseline

- `npm run build` OK
- `npm run typecheck` OK
- pagina abre em CPU
- metadados de marca atualizados

### Gate B - V1 visual

- PT-BR no fluxo principal
- 4 clusters carregam
- cenarios oficiais funcionam
- nomes de segmentos legiveis
- sem ingles residual importante

### Gate C - V1 funcional

- metricas lite estaveis
- FPS aceitavel com 1000 particulas
- sidebar usavel em desktop e notebook
- smoke test manual:
  - abrir pagina
  - trocar cenario
  - editar matriz
  - pausar/retomar
  - zoom
  - screenshot

### Gate D - V1.1 inteligencia

- evento liga e desliga sem corromper baseline
- stakeholder influencia sem travar o loop
- metricas reagem ao evento

---

## 11. ESTRATEGIA DE DEPLOY

Esta decisao muda a arquitetura. Precisa ser tomada antes de embutir dados eleitorais.

### Opcao A - Deploy publico / showcase

Usar:
- `npm run generate` ou prerender estatico equivalente

Pode conter:
- labels,
- clusters,
- cenarios public-safe,
- metricas genericas.

Nao pode conter:
- notas internas,
- leitura sensivel de concorrentes,
- estrategia confidencial textual,
- dados individuais.

### Opcao B - Deploy privado / ferramenta interna

Usar:
- `npm run build` com `node-server`

Pode futuramente conter:
- auth,
- API server-side,
- dados internos nao expostos no bundle,
- experimentos sensiveis.

### Recomendacao

Se o objetivo imediato e botar algo no ar rapido:
- entregar **V1 publica sanitizada**.

Se o objetivo e uso estrategico real:
- planejar **V2 privada** separadamente.

---

## 12. ORDEM DE EXECUCAO OTIMA

```text
FASE 0  Baseline tecnico e seguranca
  -> build verde
  -> typecheck verde
  -> CPU default
  -> metadados INTEIA

FASE 1  PT-BR + rebranding + limpeza de onboarding
  -> produto com cara de INTEIA

FASE 2  4 clusters + cenarios oficiais
  -> primeira versao eleitoral real

FASE 3  vocabulario social + nomes + legenda
  -> leitura estrategica clara

FASE 4  metricas lite
  -> interpretacao util

GATE V1
  -> demo forte, clara, estavel

FASE 5  eventos temporarios
FASE 6  stakeholders basicos

GATE V1.1
  -> inteligencia acionavel

FASE 7  10 clusters + timeline + comparador + privado
  -> modo avancado
```

---

## 13. ESTIMATIVA DE TEMPO REVISADA

### V1

- Fase 0: 2h a 4h
- Fase 1: 3h a 5h
- Fase 2: 3h a 5h
- Fase 3: 2h a 4h
- Fase 4: 2h a 3h

**Total V1 realista: 12h a 21h**

### V1.1

- Fase 5: 3h a 5h
- Fase 6: 3h a 6h

**Total adicional V1.1: 6h a 11h**

### V2

- Fase 7: 6h a 12h+

**Projeto completo realista: 18h a 33h+**

O numero anterior de 8.5h era agressivo demais para o estado real do codigo.

---

## 14. DEFINICAO DE PRONTO

O fork so pode ser considerado "bom de verdade" quando:

- o fluxo principal esta todo em portugues,
- abre em CPU e funciona sem surpresas,
- 4 clusters estrategicos carregam corretamente,
- cenarios oficiais funcionam,
- a matriz e legivel por nomes, nao por "color/species",
- metricas ajudam a interpretar,
- build e typecheck estao verdes,
- nenhuma inteligencia sensivel foi exposta sem querer,
- o produto parece uma ferramenta eleitoral, nao um simulador generico renomeado.

---

## 15. RESUMO EXECUTIVO

O melhor plano nao e o mais ambicioso no papel.
E o que entrega primeiro um **simulador eleitoral confiavel, legivel e seguro**, e so depois adiciona sofisticacao.

A sequencia correta e:

1. consertar a base,
2. assumir CPU como default real,
3. traduzir e rebrandear,
4. entregar 4 clusters + cenarios oficiais,
5. dar nomes e leitura,
6. colocar metricas,
7. so depois entrar em eventos e stakeholders,
8. deixar 10 clusters, timeline e modo privado para a fase avancada.

Essa e a rota de menor risco e maior valor.

---

*INTEIA - Igor Morais Vasconcelos - 2026-03-21*
*Fork base: github.com/igormorais123/SandboxScience*
*"Adaptar com criterio e melhor que improvisar com pressa."*
