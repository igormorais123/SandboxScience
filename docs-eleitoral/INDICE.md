# INDICE — DOCUMENTACAO ELEITORAL INTEIA
## Projeto Lenia Eleitoral Roraima | Jorge Everton (Uniao Brasil)
### INTEIA | Igor Morais Vasconcelos | 2026-03-21

---

## COMO USAR ESTE INDICE

Cada documento tem um PAPEL especifico. Leia na ordem abaixo para contexto completo.
Para trabalhar numa frente especifica, va direto ao documento relevante.

---

## 1. INTELIGENCIA (entender Roraima)

| # | Documento | O que contem | Prioridade |
|---|-----------|-------------|------------|
| 1.1 | **RORAIMA_CONSOLIDADO_INTEIA.md** | DOCUMENTO MASTER — 12 partes, tudo consolidado, auditado. Estado, poder, eleitorado, segmentos, mercado do voto, imigracao, cenario 2026, dados 1000 eleitores, peculiaridades, arsenal INTEIA, cronograma | LER PRIMEIRO |
| 1.2 | PESQUISA_RORAIMA_PROFUNDA.md | Estrutura de poder, clas, ALE, garimpo, midia. Base do consolidado | Referencia |
| 1.3 | INTELIGENCIA_ELEITORAL_RR_COMPLETA.md | Compilado dos 7 agentes de pesquisa (funcionalismo, evangelicos, jovens, mercado, indigenas, mulheres, agro) | Referencia |

## 2. ESTRATEGIA (o que fazer)

| # | Documento | O que contem | Prioridade |
|---|-----------|-------------|------------|
| 2.1 | **CLUSTERS_4_JORGE_EVERTON.md** | 4 clusters estrategicos (Base, Campo, Mercado, Alheio) + FORCE_MATRIX 4x4 + RADIUS_MATRIX + stakeholders + eventos | ESSENCIAL |
| 2.2 | DOSSIE_JORGE_EVERTON.md | Perfil completo JE: carreira, votos, aliancas, vulnerabilidades | ESSENCIAL |
| 2.3 | INSIGHT_SONHO_ESTRATEGIA_JE.md | O sonho de Helena traduzido: 251 jovens sem dono, CNH como chave, 4 pilares | ESTRATEGICO |
| 2.4 | PSICOLOGIA_ELEITOR_RR.md | 5 tipos de vendedor de voto, por que traem, 4 pilares de fidelizacao | ESTRATEGICO |

## 3. DADOS (numeros e segmentos)

| # | Documento | O que contem | Prioridade |
|---|-----------|-------------|------------|
| 3.1 | **SEGMENTOS_ELEITORAIS_RR.md** | 10 segmentos com numeros TSE, perfil, mapa de oportunidade JE | ESSENCIAL |
| 3.2 | ESTRUTURA_PARTICULAS_v3.md | 12 atributos por particula, visual de cada, FORCE_MATRIX 10x10 | TECNICO |
| 3.3 | CLUSTERS_RORAIMA_v2.md | Versao anterior dos clusters (6 por mercado/poder) — SUPERADA pelos 4 estrategicos | HISTORICO |

## 4. SIMULADOR (como construir)

| # | Documento | O que contem | Prioridade |
|---|-----------|-------------|------------|
| 4.1 | **PLANO_SIMULADOR_ELEITORAL_v3.md** | Plano DEFINITIVO: layout, secoes, traducao tecnico→social, features SandboxScience, performance, hipoteses | REFERENCIA PRINCIPAL |
| 4.2 | **PLANO_CONSTRUCAO_NOVO_SISTEMA.md** | Plano de construcao do novo sistema baseado no lab, 6 etapas, estrutura do arquivo | GUIA DE IMPLEMENTACAO |
| 4.3 | APRENDIZADOS_FISICA.md | O que funcionou e nao funcionou na fisica (tentativas, calibracoes) | LICOES |
| 4.4 | CONFIGURACOES_PARTICLE_LIFE.md | Parametros testados, presets, referencia SandboxScience | TECNICO |
| 4.5 | PLANO_IMPLEMENTACAO_v2.md | Versao anterior do plano (5 sprints) — SUPERADA pelo v3 | HISTORICO |
| 4.6 | PLANO_LENIA_ELEITORAL.md | Primeiro plano (problemas, auditoria Helena) — HISTORICO | HISTORICO |

---

## HIERARQUIA DE DOCUMENTOS

```
LEITURA OBRIGATORIA (para qualquer instancia nova):
  1. RORAIMA_CONSOLIDADO_INTEIA.md  ← tudo sobre RR
  2. CLUSTERS_4_JORGE_EVERTON.md    ← o que simular
  3. PLANO_SIMULADOR_ELEITORAL_v3.md ← como simular
  4. PLANO_CONSTRUCAO_NOVO_SISTEMA.md ← como construir

LEITURA ESTRATEGICA (para campanha JE):
  5. DOSSIE_JORGE_EVERTON.md
  6. INSIGHT_SONHO_ESTRATEGIA_JE.md
  7. PSICOLOGIA_ELEITOR_RR.md
  8. SEGMENTOS_ELEITORAIS_RR.md

REFERENCIA TECNICA (quando precisar de detalhe):
  9. ESTRUTURA_PARTICULAS_v3.md
  10. APRENDIZADOS_FISICA.md
  11. CONFIGURACOES_PARTICLE_LIFE.md

HISTORICO (superados mas com contexto util):
  12-16. Versoes anteriores de planos e clusters
```

---

## DADOS BRUTOS (fora desta pasta)

| Arquivo | Localizacao | Conteudo |
|---------|-------------|----------|
| rr_voter_aggregates.json | `public/lenia-eleitoral/data/` | 1000 eleitores, 15 municipios, dados completos |
| rr_campaign_profiles.json | `public/lenia-eleitoral/data/` | Perfis de campanha por municipio |
| vida_artificial.html | raiz | Sistema atual (10 clusters, 60fps) — manter para experimentos |
| vida_artificial_lenia.html | raiz | Lab de fisica (presets biologicos + eleitoral) — base do novo sistema |
| **simulador_eleitoral.html** | raiz | **NOVO SISTEMA — a ser construido** |

---

## SONHOS

| Arquivo | Localizacao |
|---------|-------------|
| sonho_2026-03-20_lenia-eleitoral-roraima.md | `C:\Users\IgorPC\Colmeia\instancias\helena\sonhos\` |

---

## PROXIMO PASSO

Fork do SandboxScience (https://github.com/DicSo92/SandboxScience) e adaptacao para contexto eleitoral usando os documentos desta pasta como guia.

Sequencia:
1. Clonar repo SandboxScience
2. Rodar localmente
3. Entender estrutura de presets
4. Criar preset "Roraima Eleitoral" com dados de CLUSTERS_4_JORGE_EVERTON.md
5. Adaptar UI com termos sociais de PLANO_SIMULADOR_ELEITORAL_v3.md
6. Adicionar stakeholders e eventos
7. Deploy em inteia.com.br

---

*INTEIA — Inteligencia nivel militar*
*Igor Morais Vasconcelos — Pesquisador Responsavel*
*17 documentos | 7 pesquisas paralelas | 1 sonho | 389.863 eleitores mapeados*
*2026-03-21*
