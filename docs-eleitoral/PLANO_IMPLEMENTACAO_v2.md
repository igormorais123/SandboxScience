# PLANO DE IMPLEMENTACAO v2 — LENIA ELEITORAL
## INTEIA | Igor Morais Vasconcelos | 2026-03-20

---

## ESTADO ATUAL DO SISTEMA

### O que ja funciona (outra instancia implementou):
- Fisica Sandbox-Science exata (funcao triangulo, friccao multiplicativa, bounce)
- Spatial hash para performance
- 5.000 particulas (multiplicador x5)
- Mundo W=600
- FORCE_MATRIX em escala C++ (x100)
- Presets e painel de fisica funcional
- Visual INTEIA (header, cores, fonte Inter)

### O que esta DESATUALIZADO (precisa atualizar com pesquisa):
- Clusters ainda sao os 6 antigos (Direita Urbana, Centro Pragmatico, etc.)
- Classificacao por regras if/else simples
- Dados de municipio sem enriquecimento
- Sem atributo de fidelidade
- Sem atributo de vulnerabilidade
- Sem atributo de dependencia do Estado
- Candidatos com perfis incompletos
- Eventos nao refletem a realidade de compra de voto
- Interpretacao automatica generica

---

## PLANO DE IMPLEMENTACAO EM 5 SPRINTS

### SPRINT 1: MIGRAR PARA 10 SEGMENTOS (prioridade maxima)
**Arquivo**: `ESTRUTURA_PARTICULAS_v3.md` tem tudo definido

Tarefas:
- [ ] Trocar `CLUSTERS` de 6 para 10 com cores, nomes e descricoes do doc v3
- [ ] Reescrever `classifyVoter()` com regras dos 10 segmentos e proporcoes corretas:
  - Funcionalismo: 108 | Comissionados: 38 | Evangelicos: 141 | Jovens: 251
  - Mercado: 128 | Indigena: 90 | Classe Media: 90 | Agro: 77 | Mulheres: 52 | Fronteira: 25
- [ ] Cada particula ganha novos atributos: `fidelidade`, `vulnerabilidade`, `dependenciaEstado`
- [ ] Gerar `FORCE_MATRIX[10][10]` e `RADIUS_MATRIX[10][10]` do doc v3 (escala C++ x100)
- [ ] Atualizar cores do doc v3:
  - Funcionalismo: #1a6b7a | Comissionados: #3a3a4a | Evangelicos: #d4a030
  - Jovens: #8855cc | Mercado: #cc7020 | Indigena: #cc2020
  - Classe Media: #2266cc | Agro: #33aa55 | Mulheres: #cc4488 | Fronteira: #1a5530
- [ ] Atualizar legenda dinamica para 10 segmentos
- [ ] Atualizar interpretacao automatica

### SPRINT 2: ATRIBUTOS VISUAIS (visual = dados)
**Arquivo**: `ESTRUTURA_PARTICULAS_v3.md` secao "Como cada atributo afeta a tela"

Tarefas:
- [ ] TAMANHO do ponto = engajamento (maior = mais engajado)
- [ ] OPACIDADE = fidelidade (solido = fiel, transparente = venda voto)
- [ ] BORDA = tolerancia (verde = tolerante, vermelha = intolerante)
- [ ] Novos modos de cor:
  - Fidelidade (transparente→solido)
  - Vulnerabilidade (verde→vermelho)
  - Dependencia do Estado (azul→laranja)
- [ ] Atualizar tooltip com todos os atributos

### SPRINT 3: CANDIDATOS REAIS COM FIDELIDADE
**Arquivos**: `DOSSIE_JORGE_EVERTON.md` + `SEGMENTOS_ELEITORAIS_RR.md`

Tarefas:
- [ ] Manter os 8 deputados ja implementados
- [ ] Adicionar atributo `fidelidade` por candidato-eleitor
  - Jorge Everton: alta fidelidade em Fronteira/Seguranca e Funcionalismo
  - Soldado Sampaio: alta fidelidade em Fronteira (PM)
  - Joilma Teodora: alta fidelidade em Mulheres Periferia
  - Eder Lourinho: alta fidelidade em Agro
- [ ] Candidato atrai mais forte eleitores com baixa fidelidade (compra voto)
- [ ] Candidato nao move eleitores com fidelidade > 0.7 de outro candidato
- [ ] Painel de candidatos mostra: votos fieis vs votos compraveis

### SPRINT 4: EVENTOS ELEITORAIS REAIS
**Arquivo**: `PSICOLOGIA_ELEITOR_RR.md` + pesquisa completa

Novos eventos:
- [ ] COMPRA DE VOTO — afeta fidelidade (-0.15), engajamento (+0.10). Mercado 3x, Jovens 1.5x
- [ ] SERVICO DO MANDATO (JE) — fidelidade sobe +0.15 em eleitores proximos
- [ ] GREVE SERVIDORES — funcionalismo engajamento +0.20, tolerancia -0.10
- [ ] ALIANCA PASTORAL — evangelicos se atraem 2x mais forte por 200 ticks
- [ ] OPERACAO PF — mercado do voto se dispersa (medo), engajamento cai
- [ ] CPI/ESCANDALO — engajamento geral +0.20, tolerancia -0.20, fidelidade -0.10
- [ ] CAMPANHA TIKTOK — jovens engajamento +0.15, orientacao muda +/-0.05
- [ ] CESTA/PROGRAMA SOCIAL — mercado atrai para maquina, fidelidade -0.05

Manter existentes: Fake News, Crise Saude, Garimpo, Imigracao, Prog Social

### SPRINT 5: DASHBOARD JORGE EVERTON
**Arquivo**: `SEGMENTOS_ELEITORAIS_RR.md` secao mapa de oportunidade

Tarefas:
- [ ] Painel exclusivo "CAMPANHA JE" no sidebar:
  - Votos estimados por segmento (tempo real)
  - Meta: barra de progresso 6.627 → 10.000
  - Segmentos forte/fraco/oportunidade
  - Eleitores fieis vs compraveis no raio de influencia
- [ ] Projecao: "Se eleicao fosse hoje, JE teria X votos"
- [ ] Simulacao de cenarios:
  - "JE faz alianca pastoral" → ativa evento → vê impacto
  - "JE lanca campanha TikTok CNH gratis" → vê jovens migrando
  - "Concorrente compra votos no Mercado" → vê impacto na base JE
- [ ] Botao "CENARIO OTIMISTA" — ativa todos eventos favoraveis em sequencia
- [ ] Botao "CENARIO PESSIMISTA" — ativa eventos adversos

---

## ARQUITETURA DE DADOS (nova particula)

```javascript
{
  // Posicao e movimento
  x, y, vx, vy,

  // Segmento (0-9)
  cluster,

  // Atributos eleitorais
  orient,           // 0-1 (esquerda-direita)
  engaj,            // 0-1 → afeta TAMANHO do ponto
  fidelidade,       // 0-1 → afeta OPACIDADE (novo)
  vulnerabilidade,  // 0-1 → modo de cor (novo)
  tolerancia,       // 0-1 → afeta BORDA (novo visual)
  dependenciaEstado,// 0-1 → modo de cor (novo)

  // Pautas
  proGar, proDem, antiImig, social, desinfo,

  // Origem
  mun, munIdx,

  // Candidato (novo)
  candidatoFiel,    // indice do candidato mais proximo (-1 = nenhum)
}
```

---

## FORCE_MATRIX 10x10 (escala C++ x100)

```javascript
const FORCE_MATRIX = [
//       Func  Comis Evang Jovem Merc  Indig CMed  Agro  MulPe Front
/*Func*/ [-30,  -35,   -5,   -5,  -10,    5,  -15,   -5,  -10,  -25],
/*Comi*/ [-35,  -45,    0,   -5,  -20,    5,   -5,    0,  -10,  -10],
/*Evan*/ [ -5,    0,  -40,  -10,    5,   15,  -25,  -15,  -15,  -10],
/*Jove*/ [ -5,   -5,  -10,  -15,  -15,    0,   -5,    0,  -10,   -5],
/*Merc*/ [-10,  -20,    5,  -15,   -8,   -5,   -5,  -10,  -25,    0],
/*Indi*/ [  5,    5,   15,    0,   -5,  -45,   25,   -5,    0,   10],
/*CMed*/ [-15,   -5,  -25,   -5,   -5,   25,  -35,  -15,   -5,  -20],
/*Agro*/ [ -5,    0,  -15,    0,  -10,   -5,  -15,  -30,   -5,  -10],
/*MulP*/ [-10,  -10,  -15,  -10,  -25,    0,   -5,   -5,  -20,    0],
/*Fron*/ [-25,  -10,  -10,   -5,    0,   10,  -20,  -10,    0,  -35],
];
```

---

## RADIUS_MATRIX 10x10

```javascript
const RADIUS_MATRIX = [
//       Func  Comis Evang Jovem Merc  Indig CMed  Agro  MulPe Front
/*Func*/ [ 70,  80,    90,   80,  100,   70,   90,   75,   85,   80],
/*Comi*/ [ 80,  60,    75,   70,  110,   65,   70,   65,   85,   70],
/*Evan*/ [ 90,  75,    80,   95,   85,   90,  100,   85,   90,   80],
/*Jove*/ [ 80,  70,    95,   75,   90,   70,   80,   65,   85,   70],
/*Merc*/ [100, 110,    85,   90,   70,   75,   80,   80,  100,   70],
/*Indi*/ [ 70,  65,    90,   70,   75,   65,  110,   70,   75,   85],
/*CMed*/ [ 90,  70,   100,   80,   80,  110,   75,   85,   75,   90],
/*Agro*/ [ 75,  65,    85,   65,   80,   70,   85,   70,   70,   75],
/*MulP*/ [ 85,  85,    90,   85,  100,   75,   75,   70,   75,   70],
/*Fron*/ [ 80,  70,    80,   70,   70,   85,   90,   75,   70,   65],
];
```

---

## PRIORIDADES

| Sprint | Impacto | Esforco | Quando |
|--------|---------|---------|--------|
| 1 (10 segmentos) | CRITICO | Alto | Primeiro |
| 2 (visuais) | Alto | Medio | Segundo |
| 3 (candidatos) | Alto | Medio | Terceiro |
| 4 (eventos) | Medio | Medio | Quarto |
| 5 (dashboard JE) | Alto | Alto | Quinto |

---

*INTEIA — Igor Morais Vasconcelos — 2026-03-20*
