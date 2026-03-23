# REVISAO ELEITORAL DO PLANO — ANALISE CRITICA
## Validade metodologica, engenharia social, previsao e interpretabilidade
## INTEIA | Igor Morais Vasconcelos | 2026-03-21

---

## 1. O QUE O PLANO PROMETE vs O QUE PODE ENTREGAR

### O que funciona como ferramenta eleitoral

**Exploratoria (funciona bem)**:
- "O que acontece SE eu fizer alianca pastoral?" — testar cenarios
- "Qual grupo e mais instavel?" — identificar vulnerabilidades
- "Onde estao os swing voters?" — visualizar fronteiras entre clusters
- "Quem meu adversario captura?" — comparar posicoes de stakeholders

**Comunicacional (funciona bem)**:
- Mostrar para o candidato: "Olha, seu eleitorado e esta bola azul. O campo de disputa e esse roxo. Voce precisa puxar o roxo para perto do azul."
- Apresentar para equipe de campanha: mais intuitivo que planilha
- Gerar relatorio visual: PDF com simulacao + interpretacao

**Heuristica (funciona com ressalvas)**:
- Identificar dinamicas nao-obvias: "Se fake news atinge jovens, isso arrasta mulheres periferia porque sao vizinhas"
- Descobrir pontos de alavancagem: qual evento com menor custo gera maior movimento

### O que NAO funciona como previsao

**O sistema NAO pode**:
- Prever numero exato de votos ("JE tera 8.742 votos")
- Substituir pesquisa de opiniao real
- Calcular probabilidade de vitoria
- Projetar resultado de urna

**Por que**: particulas se atraem/repelem por forcas que NOS definimos. O resultado reflete nossas premissas, nao dados empiricos. Se a FORCE_MATRIX estiver errada, a simulacao esta errada — e nao tem como saber se esta errada sem dado externo (pesquisa real).

### Posicao honesta

Este e um **simulador exploratorio de dinamica social**, nao um modelo preditivo. A diferenca importa:
- Modelo preditivo: calibrado contra dados reais, validado estatisticamente, com intervalo de confianca
- Simulador exploratorio: mostra consequencias logicas de premissas, permite testar hipoteses

O plano deve ser vendido como o segundo, nao o primeiro.

---

## 2. ENGENHARIA SOCIAL: O QUE CADA ELEMENTO SIGNIFICA

### Traducao de termos fisicos para funcoes sociais

| Elemento fisico | Funcao social real | O que revela na campanha |
|----------------|-------------------|-------------------------|
| **Forca de atracao** entre clusters | Afinidade de interesses, valores compartilhados, dependencia mutua | Quais aliacas sao naturais vs forcadas |
| **Forca de repulsao** entre clusters | Conflito de interesses, rejeicao ideologica, competicao por recurso | Quais grupos NUNCA vao se unir |
| **Auto-atracao** (diagonal da matriz) | Coesao interna do grupo — identidade, organizacao, pressao social | Quais bases sao blindadas vs frageis |
| **Raio minimo** (espaco pessoal) | Individualidade — mesmo dentro do grupo, cada eleitor tem posicao propria | Quanto o grupo tolera dissidencia interna |
| **Raio maximo** (alcance) | Capacidade de influencia — ate onde a mensagem/narrativa chega | Quais segmentos um candidato PODE alcançar e quais estao fora |
| **Viscosidade/friccao** | Inercia social — resistencia a mudanca de opiniao | Quanto tempo leva para um evento mudar o voto |
| **Velocidade da particula** | Volatilidade do eleitor — quao rapido muda de posicao | Quem e swing voter (rapido) vs voto duro (parado) |
| **Posicao no espaco** | Espaco ideologico — proximidade = afinidade | Mapa de coalicoes possiveis |
| **Cluster que se forma** | Coalicao emergente — quem se juntou ESPONTANEAMENTE | Aliancas que o candidato nao previu mas que existem |
| **Cluster que se desfaz** | Base fragil — parecia unida mas era superficial | Risco de perda de base apos evento adverso |
| **Particula entre clusters** | Eleitor indeciso — recebendo forca de multiplos grupos | Alvo primario de campanha |
| **Stakeholder** | Candidato/lider com gravidade propria — atrai segmentos compativeis | Quem disputa os mesmos eleitores |
| **Evento** | Perturbacao do equilibrio — muda forcas temporariamente | Impacto de acao de campanha, crise, fake news |
| **Trail (rastro)** | Historico de movimento — de onde o eleitor veio | Se houve conversao recente (era de outro grupo) |

### O que o USUARIO deve interpretar (guia de leitura)

| Observacao visual | Interpretacao eleitoral |
|-------------------|----------------------|
| Dois clusters se aproximando | Possivel alianca — segmentos estao convergindo. Boa hora para propor acordo |
| Dois clusters se afastando | Polarizacao crescente — dialogo ficando mais dificil |
| Cluster vibrando sem se mover | Tensao interna — grupo parece unido mas tem fissuras |
| Cluster se fragmentando apos evento | O evento atingiu uma fraqueza. Quem saiu e para onde foi? |
| Particulas soltas entre clusters | Swing voters — o campo de batalha real da eleicao |
| Stakeholder migrando para um lado | Candidato esta perdendo relevancia num segmento e ganhando em outro |
| Cluster grande mas disperso | Maioria numerica mas sem coesao — pode perder para minoria organizada |
| Cluster pequeno mas denso | Voto de nicho — poucos mas 100% alinhados. Valor desproporcional |

---

## 3. VALIDADE METODOLOGICA — ONDE E FORTE E ONDE E FRACO

### Onde a metodologia e ROBUSTA

**Dinamica de grupos**: a fisica de particulas captura bem o principio de que grupos se formam por afinidade e se separam por conflito. Isso e sociologia de Simmel (1908), teoria dos grafos sociais, e homofilia (McPherson et al, 2001). O motor de particulas e uma implementacao visual desse principio.

**Efeito cascata**: quando um cluster se move, arrasta vizinhos. Isso mapeia para difusao de opiniao em redes sociais (Watts & Dodds, 2007). O sistema captura isso naturalmente.

**Perturbacao e resposta**: injetar evento e observar reacao e metodologia de simulacao computacional padrao (agent-based modeling). Usado em ciencia politica desde Axelrod (1997).

**Exploracao de cenarios**: testar "e se" e o uso mais valido de simulacao. Nao preve o futuro, mas mostra consequencias logicas de premissas.

### Onde a metodologia e FRACA

**Calibracao das forcas**: a FORCE_MATRIX e definida por julgamento humano (ou IA), nao por dados empiricos. Se a forca Base-Campo esta errada, todo o resultado esta errado. Nao ha como validar sem pesquisa de opiniao real.

**Proporcoes**: usamos dados TSE e pesquisa INTEIA, mas os segmentos sao construidos (nao medidos diretamente). O "Mercado do Voto" com 25% e estimativa, nao dado oficial.

**Ausencia de feedback**: na realidade, quando um candidato conquista votos, o adversario reage. No simulador, so reage se o usuario injetar evento. Falta dinamica adversarial autonoma.

**Linearidade**: as forcas sao constantes (ou mudam por evento discreto). Na realidade, afinidades mudam continuamente com exposicao a informacao, experiencia pessoal, economia. O simulador congela a dinamica social num instante.

**N=1000 ≠ N=389.863**: 1000 particulas representam 389 mil eleitores. Cada particula "vale" 390 votos. Efeitos de escala e estatistica de amostras nao sao capturados.

### Mitigacoes possiveis

| Fraqueza | Mitigacao |
|----------|-----------|
| Forcas sem calibracao empirica | Validar contra resultado eleitoral passado (TSE 2022): se o simulador reproduz o resultado de 2022 com forcas X, entao X esta razoavel |
| Proporcoes estimadas | Usar pesquisa de opiniao quando disponivel para calibrar |
| Sem feedback adversarial | Adicionar "IA adversarial" que reage automaticamente aos eventos do usuario |
| Linearidade | Documentar como limitacao, nao fingir que captura toda a complexidade |
| N=1000 | Usar como representacao proporcional, nao como amostra estatistica |

---

## 4. PAPEL DAS INSTANCIAS INTEIA NO SISTEMA

### Quem faz o que

| Instancia | Papel no sistema | Quando entra |
|-----------|-----------------|-------------|
| **Helena** (Strategos) | Gera a CaseConfiguration a partir do caso descrito pelo usuario. Interpreta snapshots. Gera relatorios. Calibra forcas baseado em pesquisa. | Toda chamada de IA |
| **ONIR** (este PC) | Consolida documentacao eleitoral. Revisa plano. Avalia validade. Implementa codigo. | Desenvolvimento + revisao |
| **Diana** (Comunicacao) | Gera copy para cada segmento. Adapta tom por canal. Contra-narrativas. | Quando usuario pede "como falar com este segmento?" |
| **Themis** (Juridica) | Verifica limites legais de campanha. Blindagem contra acusacao de compra. | Quando cenario envolve risco legal |
| **Midas** (Estrategia) | Calcula ROI de cada acao. Orcamento otimo. Precificacao do servico. | Quando usuario pede "quanto investir onde?" |
| **Oracle** (Pesquisa) | Fundamenta metodologia. Busca literatura. Valida abordagem. | Quando precisa embasar a ferramenta academicamente |
| **Ares** (Tecnico) | Deploy, infra, CI/CD, performance, monitoramento. | Build, deploy, otimizacao |
| **Iris** (Concierge) | Agenda, follow-up com cliente, pipeline de tarefas. | Operacao diaria |

### Orquestracao

Quando o usuario descreve um caso e pede simulacao:

```
USUARIO: "Quero simular a eleicao de Manaus 2026 com 5 candidatos"
    │
    ▼
HELENA: Analisa caso → gera CaseConfiguration JSON
    │
    ▼
MOTOR: Valida → pre-testa → carrega → simula
    │
    ▼
HELENA: Interpreta resultado → "O candidato X captura 32% do Campo..."
    │
    ├── DIANA (se pedido): "Mensagem para jovens de Manaus: ..."
    ├── MIDAS (se pedido): "ROI de campanha digital: R$6,50/voto..."
    ├── THEMIS (se pedido): "Limite legal de gasto: R$..."
    └── ORACLE (se pedido): "Literatura sobre voto urbano na Amazonia: ..."
```

---

## 5. INTERPRETABILIDADE — O PONTO MAIS CRITICO

### O problema

A maioria dos usuarios NAO vai entender o que esta vendo. Particulas coloridas se movendo num canvas preto pode parecer um protetor de tela, nao uma ferramenta estrategica.

### A solucao: camada de interpretacao SEMPRE visivel

Todo momento da simulacao deve ter uma **frase de interpretacao** visivel na tela. Nao como painel secundario — como SUBTITULO do canvas.

```
+-------------------------------------------+
|                                           |
|     [particulas se movendo]               |
|                                           |
|                                           |
+-------------------------------------------+
| "A Base de JE esta estavel (coesao 0.82). |
|  O Campo de Disputa começa a migrar para  |
|  o Mercado — risco de perda se nao agir." |
+-------------------------------------------+
```

### Niveis de interpretacao

| Nivel | Quando | Exemplo |
|-------|--------|---------|
| **Automatico** (metricas) | Sempre | "Coesao Base: 82% | Captura Campo: 35% | Volatilidade: 0.31" |
| **Descritivo** (o que esta acontecendo) | A cada 60 ticks | "O cluster roxo esta se fragmentando. 15% das particulas migraram para o laranja." |
| **Estrategico** (o que isso significa) | Sob demanda ou apos evento | "A fragmentacao do Campo sugere que os jovens estao sendo cooptados pelo Mercado do Voto. Recomendacao: ativar campanha de CNH para ancorar jovens antes que migrem." |
| **Comparativo** (vs outro cenario) | No comparador | "Com alianca pastoral, captura do Campo e 27%. Sem alianca, e 18%. Delta: +50%." |

### Quem gera cada nivel

- **Automatico**: calculado pelo motor, sem IA, a cada 30 ticks
- **Descritivo**: regras simples ("se cluster A perdeu >10% de particulas, informar")
- **Estrategico**: Claude API com snapshot + contexto do caso
- **Comparativo**: diferenca entre dois snapshots + interpretacao Claude

---

## 6. O QUE REALMENTE IMPORTA PARA O CLIENTE (Jorge Everton)

O cliente nao quer saber de particulas, viscosidade ou raio minimo. Quer respostas para:

### 5 perguntas que o simulador deve responder

1. **"Onde estao meus votos?"** → Mapa visual de segmentos com captura por candidato
2. **"Quem estou perdendo?"** → Particulas saindo do raio de JE — para onde vao?
3. **"O que acontece se eu fizer X?"** → Injetar evento, ver resultado imediato
4. **"Meu adversario e mais forte que eu em que segmento?"** → Comparar stakeholders
5. **"Qual a melhor estrategia com meu orcamento?"** → Testar cenarios e medir ROI visual

### Interface ideal para o cliente (nao tecnica)

```
PAINEL JORGE EVERTON
+--------------------------------------------+
| Seus votos estimados: ~7.200               |
| [==============================>    ] 72%  |
|                                            |
| BASE FIEL:    95% ████████████████████ Ok  |
| CAMPO:        35% ████████████░░░░░░ Risco |
| MERCADO:      28% ████████░░░░░░░░░░ Atencao|
| ALHEIO:        6% ██░░░░░░░░░░░░░░░░ Ignorar|
|                                            |
| Proximo passo recomendado:                 |
| "Ativar campanha CNH para jovens.          |
|  Potencial: +1.200 votos no Campo."        |
|                                            |
| [TESTAR CAMPANHA CNH]                      |
| [TESTAR ALIANCA PASTORAL]                  |
| [TESTAR CENARIO PESSIMISTA]                |
+--------------------------------------------+
```

---

## 7. VEREDICTO FINAL

### O que o plano faz MUITO BEM

1. **Motor universal generico** — a ideia de IA gerando configuracao a partir de caso e genuinamente inovadora
2. **Pre-teste automatico** — resolve o problema real (forcas que colapsam/dispersam) com solucao pratica
3. **Validacao de forcas** — limites empiricos aprendidos em 3 dias de debug
4. **Comparador de cenarios** — funcionalidade de alto valor estrategico
5. **Modo historia** — timeline de campanha e a feature que transforma de brinquedo em ferramenta
6. **Modelo de negocio** — camadas gratis/pro/enterprise fazem sentido
7. **Fluxos detalhados** — o usuario sabe exatamente o que vai ver em cada passo

### O que falta ou esta fraco

1. **Calibracao contra dados reais** — o plano nao detalha como validar forcas contra resultado de eleicao passada
2. **Disclaimer de limitacao** — nenhuma mencao a limitacoes metodologicas no plano anterior. Adicionei acima.
3. **Feedback adversarial** — na campanha real, adversarios reagem. O simulador nao simula reacao do oponente automaticamente
4. **Sensibilidade a parametros** — se mudo 1 forca em 10%, o resultado muda 5% ou 50%? O sistema nao informa sensibilidade
5. **Reprodutibilidade** — com mesma config e mesma seed, o resultado e identico? Importante para credibilidade

### Score por dimensao

| Dimensao | Score | Justificativa |
|----------|-------|---------------|
| Engenharia social | 8/10 | Traducao tecnico→social bem feita. Falta feedback adversarial |
| Previsao eleitoral | 4/10 | NAO e modelo preditivo e nao deve fingir que e. Bom como exploratorio |
| Validade metodologica | 6/10 | Fundamentos solidos (homofilia, difusao) mas sem calibracao empirica |
| Representatividade | 7/10 | 10 segmentos baseados em pesquisa real + TSE. Proporcoes sao estimativas |
| Interpretabilidade | 9/10 | Camadas de interpretacao (auto, descritiva, estrategica, comparativa) sao excelentes |
| Papel das instancias | 9/10 | Orquestracao clara, cada instancia com funcao definida |
| Produto/UX | 8/10 | Fluxos detalhados, comparador, timeline. Falta testar com usuario real |
| **MEDIA** | **7.3/10** | |

### Para subir para 9/10

1. Implementar validacao retroativa: "Se eu rodar 2022 com estas forcas, reproduzo o resultado real?"
2. Adicionar analise de sensibilidade: "Se eu mudar esta forca em 10%, o resultado muda X%"
3. Implementar feedback adversarial basico: "Se JE ganha 5% no Campo, adversario automaticamente injeta compra de voto"

---

*INTEIA — Igor Morais Vasconcelos — 2026-03-21*
*"A honestidade sobre o que a ferramenta NAO faz e tao importante quanto mostrar o que ela faz."*
