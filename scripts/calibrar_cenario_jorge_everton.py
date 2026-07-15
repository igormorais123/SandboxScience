"""
CENARIO PRE-ELEITORAL JORGE EVERTON — DEPUTADO ESTADUAL RR 2026
================================================================

Segmentos definidos pela DECISAO DE CAMPANHA de JE:
"Onde investir tempo, dinheiro e mensagem?"

Cada segmento responde: qual o comportamento desse grupo em relacao a JE?

FONTES:
  - Pesquisa INTEIA n=200 (pesquisa_completa_rr_2026.json)
  - Relatorio JE (relatorio_jorge_everton_rr_2026.tex)
  - Cross-tabs: genero, religiao, idade, territorio, orientacao politica
  - Consultoria Musk e Duda (insights estrategicos)
  - TSE 2022, Censo IBGE 2022

SEGMENTOS (8 grupos acionaveis):

1. BASE CONSOLIDADA JE (18%)
   Quem: Homens 35+, catolicos, centro-dir/direita, Boa Vista, servidores/policia
   JE tem: 39-47% nesse perfil. Certeza 8.2/10
   Acao: MANTER. Nao gastar recursos, so nutrir
   Fonte: cross-tab genero (39% masc), religiao (39% cat), ideologia (47% c-dir)

2. POTENCIAL CONVERTIVEL (20%)
   Quem: Ja consideram JE como 2a opcao. Conhecem, gostam, nao decidiram
   JE tem: 35% como 2a opcao (MAIOR de todos os candidatos)
   Acao: CONVERTER. Maior ROI da campanha. Presenca + mensagem direta
   Fonte: pesquisa 2a opcao (35%), potencial total 69%

3. EVANGELICOS SAMPAIO (14%)
   Quem: Evangelicos que votam Sampaio (42%). Bloco pastoral
   JE tem: APENAS 16% dos evangelicos. Gap de 26pp
   Acao: INFILTRAR. Buscar pastores aliados, nao atacar Sampaio
   Fonte: cross-tab religiao (JE 16%, Sampaio 42%), influencia pastor 25.5%

4. MULHERES BV (12%)
   Quem: Mulheres de Boa Vista, todas as idades
   JE tem: 30% (vs 39% homens). Gap de 9pp
   Catarina tem: 28% das mulheres
   Acao: CONQUISTAR. Agenda saude + educacao + protecao
   Fonte: cross-tab genero (30% fem), Catarina 28% fem

5. INTERIOR DISPUTADO (10%)
   Quem: Eleitorado do interior (35% do total), predominantemente rural
   JE tem: 28.8%. Neto Loureiro tem 26.1% (2.7pp, margem de erro)
   Acao: CONSOLIDAR. Presenca fisica, radio, saneamento/estrada
   Fonte: cross-tab territorio (JE 28.8%, Neto 26.1%)

6. JOVENS VOLATEIS (12%)
   Quem: 16-29 anos, urbanos, TikTok, decidem tarde
   JE tem: 32% (lidera mas fragil). Sampaio 23%, Catarina 21%
   Acao: ENGAJAR. WhatsApp + TikTok + primeiro emprego
   Fonte: cross-tab idade (32% em 16-29), mediana 26 anos

7. ADVERSARIOS IRREDUTIVEIS (8%)
   Quem: Base da esquerda (Catarina 94%), indigenas organizados (CIR)
   JE tem: 0% na esquerda pura, 14% centro-esquerda
   Acao: IGNORAR. Zero ROI, eleitor ideologico
   Fonte: cross-tab ideologia (esquerda 94% Catarina, 0% JE)

8. MERCADO DO VOTO (6%)
   Quem: Classes D/E vulneraveis, transacionais, sem lealdade
   JE tem: indeterminado (vendem para quem paga)
   Acao: MONITORAR. Nao comprar, mas nao perder para concorrente
   Fonte: pesquisa INTEIA (R$800/voto documentado), 50% classes D/E
"""

import json
import numpy as np

N = 8
NOMES = [
    "Base JE",           # 0
    "Convertivel",       # 1
    "Evang. Sampaio",    # 2
    "Mulheres BV",       # 3
    "Interior Disp.",    # 4
    "Jovens Volateis",   # 5
    "Adversarios",       # 6
    "Mercado Voto",      # 7
]

PROPORCOES = [0.18, 0.20, 0.14, 0.12, 0.10, 0.12, 0.08, 0.06]
# Soma = 1.00

CORES = [
    "#00ccff",  # Base JE: ciano (policia, confianca)
    "#44ee88",  # Convertivel: verde (crescimento, oportunidade)
    "#ffcc33",  # Evangelicos: amarelo (igreja)
    "#ff66aa",  # Mulheres BV: rosa
    "#ff9933",  # Interior: laranja (terra, rural)
    "#bb77ff",  # Jovens: roxo (digital, TikTok)
    "#ff4444",  # Adversarios: vermelho (nao investir)
    "#888888",  # Mercado: cinza (transacional, sem cor)
]

# ============================================================
# DADOS PARA CALIBRACAO
# ============================================================

# JE% em cada segmento (cross-tabs reais)
JE_PCT = {
    "Base JE":          0.45,  # Centro-dir 47%, homens cat 39%, media ~45%
    "Convertivel":      0.00,  # 2a opcao = JE. 1a opcao = outro candidato
    "Evang. Sampaio":   0.16,  # Cross-tab religiao: JE=16% entre evangelicos
    "Mulheres BV":      0.30,  # Cross-tab genero: JE=30% entre mulheres
    "Interior Disp.":   0.29,  # Cross-tab territorio: JE=28.8% interior
    "Jovens Volateis":  0.32,  # Cross-tab idade: JE=32% em 16-29
    "Adversarios":      0.03,  # Esquerda: JE=0%, centro-esq=14%. Media ~3%
    "Mercado Voto":     0.20,  # Estimativa: sem lealdade, quem paga mais
}

# SAMPAIO% em cada segmento
SAMPAIO_PCT = {
    "Base JE":          0.15,  # Direita mas JE domina
    "Convertivel":      0.25,  # 29% 2a opcao Sampaio = disputa direta com JE
    "Evang. Sampaio":   0.42,  # Domina evangelicos (42%)
    "Mulheres BV":      0.23,  # Cross-tab genero: 23% mulheres
    "Interior Disp.":   0.22,  # Cross-tab territorio: 21.6% interior
    "Jovens Volateis":  0.23,  # Cross-tab idade: 23% em 16-29
    "Adversarios":      0.00,  # Esquerda nao vota nele
    "Mercado Voto":     0.15,  # Compra parcial
}

# CATARINA% em cada segmento
CATARINA_PCT = {
    "Base JE":          0.05,
    "Convertivel":      0.10,
    "Evang. Sampaio":   0.21,  # 21% entre evangelicos
    "Mulheres BV":      0.28,  # 28% entre mulheres (forte!)
    "Interior Disp.":   0.19,
    "Jovens Volateis":  0.21,
    "Adversarios":      0.90,  # Domina esquerda (94%)
    "Mercado Voto":     0.10,
}

# Homogeneidade interna (quao uniforme o grupo vota)
HOMOGENEIDADE = {
    "Base JE":          0.85,  # Muito coeso — ja decidiram por JE, certeza 8.2/10
    "Convertivel":      0.30,  # Fragmentado — cada um vota em alguem diferente como 1a opcao
    "Evang. Sampaio":   0.75,  # Bloco pastoral forte (42% Sampaio, coesao por lideranca)
    "Mulheres BV":      0.35,  # Divididas: JE 30%, Catarina 28%, Sampaio 23%
    "Interior Disp.":   0.30,  # 4 candidatos dentro da margem. Muito disputado
    "Jovens Volateis":  0.20,  # Decidem tarde, fragmentados
    "Adversarios":      0.90,  # Bloco ideologico quase unanime (94% Catarina)
    "Mercado Voto":     0.10,  # Zero lealdade
}

# Nivel organizacional
ORGANIZACAO = {
    "Base JE":          0.70,  # Rede de cabos, policia, servidores — estrutura media-alta
    "Convertivel":      0.15,  # Nao sao organizados — sao dispersos por definicao
    "Evang. Sampaio":   0.90,  # Igreja = maquina organizacional perfeita
    "Mulheres BV":      0.25,  # Redes informais de vizinhanca
    "Interior Disp.":   0.40,  # Radio, sindicato rural, lider comunitario
    "Jovens Volateis":  0.10,  # Nenhuma organizacao formal
    "Adversarios":      0.70,  # CIR + partidos de esquerda (PT, PSOL) organizados
    "Mercado Voto":     0.20,  # Rede clandestina de intermediarios
}

# Alcance de influencia (0-1)
ALCANCE = {
    "Base JE":          0.50,  # Boca a boca, rede propria
    "Convertivel":      0.30,  # Passivos — nao propagam
    "Evang. Sampaio":   0.85,  # Pulpito + WhatsApp + radio evangelica = alcance maximo
    "Mulheres BV":      0.30,  # Vizinhanca, escola
    "Interior Disp.":   0.40,  # Radio + lider comunitario
    "Jovens Volateis":  0.70,  # TikTok + WhatsApp = alcance digital alto
    "Adversarios":      0.50,  # Redes sociais + CIR + universidade
    "Mercado Voto":     0.60,  # Intermediarios buscam alvos ativamente
}

# Posicao ideologica (0=esquerda, 1=direita)
IDEOLOGIA = {
    "Base JE":          0.75,  # Centro-dir/direita (47% + 39%)
    "Convertivel":      0.60,  # Moderados — consideram JE mas ainda nao decidiram
    "Evang. Sampaio":   0.80,  # Conservadores evangelicos
    "Mulheres BV":      0.50,  # Divididas entre JE(dir) e Catarina(esq)
    "Interior Disp.":   0.70,  # Conservador rural
    "Jovens Volateis":  0.50,  # Centro (divididos)
    "Adversarios":      0.15,  # Esquerda/centro-esquerda
    "Mercado Voto":     0.50,  # Sem ideologia
}

# ============================================================
# MATRIZ DE FORCAS — Perspectiva JE
# ============================================================
# Logica: como cada segmento se comporta em relacao aos outros
# do ponto de vista da DINAMICA ELEITORAL PRE-CAMPANHA
#
# Forca positiva = atracao (tendencia a convergir)
# Forca negativa = repulsao (tendencia a se afastar)

F = np.zeros((N, N), dtype=float)

# --- DIAGONAL (auto-coesao) ---
for i in range(N):
    F[i][i] = HOMOGENEIDADE[NOMES[i]] * ORGANIZACAO[NOMES[i]] * 100

# --- BASE JE (0) ---
# Base->Convertivel: ATRAI FORTE. JE quer puxar convertiveis para si.
# Dado: 35% ja consideram JE como 2a opcao. Afinidade existente.
F[0][1] = 55   # Base irradia confianca para convertiveis (boca a boca)
F[1][0] = 45   # Convertiveis sao atraidos pela base (prova social)

# Base->Evang.Sampaio: LEVE ATRACAO. Ambos sao de direita.
# Dado: JE=16% entre evangelicos. Existe afinidade ideologica mas barreira pastoral.
F[0][2] = 20   # Base JE tenta aproximar evangelicos (compartilham valores)
F[2][0] = 10   # Evangelicos sentem leve afinidade mas pastor manda em Sampaio

# Base->Mulheres: ATRACAO MODERADA. JE quer mulheres.
# Dado: JE=30% mulheres, gap de 9pp. Precisa fechar.
F[0][3] = 35   # Base JE (homens) tenta puxar mulheres (familia, vizinhos)
F[3][0] = 20   # Mulheres atraidas por agenda seguranca mas preferem Catarina

# Base->Interior: ATRACAO FORTE. Base urbana quer expandir para interior.
# Dado: JE=40.4% BV mas so 28.8% interior. Precisa projetar forca.
F[0][4] = 40   # Base urbana de JE atrai interior (lideranca, nome)
F[4][0] = 30   # Interior reconhece JE mas Neto Loureiro disputa (+2.7pp apenas)

# Base->Jovens: ATRACAO MODERADA. Jovens reconhecem JE.
# Dado: JE=32% entre 16-29 (lidera). Fragil.
F[0][5] = 25   # Base JE atrai jovens (seguranca como tema)
F[5][0] = 15   # Jovens sentem leve afinidade mas sao volateis

# Base->Adversarios: REPULSAO FORTE. Polarizacao ideologica.
# Dado: JE=0% na esquerda pura. Impossivel converter.
F[0][6] = -50  # Base JE repele adversarios (posicoes opostas)
F[6][0] = -55  # Adversarios rejeitam base conservadora de JE

# Base->Mercado: LEVE REPULSAO. Base de JE e de classe media/servidor.
# Dado: funcionalismo nao precisa de R$800 para votar.
F[0][7] = -15  # Base JE repele mercado (rejeicao moral)
F[7][0] = 5    # Mercado e neutro — vende para quem paga

# --- CONVERTIVEL (1) ---
# Convertivel->Evang: ATRACAO MODERADA. Convertiveis incluem evangelicos moderados.
F[1][2] = 25   # Convertiveis podem ser recrutados por pastores
F[2][1] = 30   # Evangelicos tentam recrutar convertiveis (culto, rede)

# Convertivel->Mulheres: ATRACAO. Convertiveis incluem mulheres indecisas.
F[1][3] = 30   # Convertiveis e mulheres compartilham indecisao
F[3][1] = 25   # Mulheres que consideram JE estao no pool convertivel

# Convertivel->Interior: ATRACAO. Convertiveis no interior existem.
F[1][4] = 20   # Dispersos mas simpaticos a JE
F[4][1] = 15   # Interior com convertiveis

# Convertivel->Jovens: ATRACAO MODERADA. Jovens sao naturalmente convertiveis.
F[1][5] = 35   # Convertiveis e jovens compartilham volatilidade
F[5][1] = 30   # Jovens sao convertiveis por natureza (decidem tarde)

# Convertivel->Adversarios: LEVE REPULSAO. Convertiveis nao sao de esquerda.
F[1][6] = -20  # Convertiveis de JE = centro-direita, nao querem esquerda
F[6][1] = -15  # Adversarios tentam puxar convertiveis (mas sao minoria)

# Convertivel->Mercado: VULNERAVEL. Convertiveis podem ser comprados.
F[1][7] = -25  # Convertiveis tentam evitar mercado (querem escolher por merito)
F[7][1] = 45   # Mercado CACA convertiveis (indecisos sao alvo facil)

# --- EVANGELICOS SAMPAIO (2) ---
# Evang->Mulheres: ATRACAO FORTE. Igrejas acolhem mulheres.
# Dado: Pesquisa INTEIA — mulheres perif. frequentam igrejas
F[2][3] = 45   # Evangelicos recrutam mulheres (culto, rede, cesta basica)
F[3][2] = 30   # Mulheres atraidas por acolhimento da igreja

# Evang->Interior: ATRACAO. Interior = evangelico + rural.
F[2][4] = 35   # Igrejas no interior sao centro social
F[4][2] = 30   # Interior frequenta igreja

# Evang->Jovens: ATRACAO. Culto jovem, musica.
# Dado: faixa 16-29 frequenta igrejas (recrutamento ativo)
F[2][5] = 30   # Evangelicos recrutam jovens ativamente
F[5][2] = 15   # Jovens vao a culto mas participacao e menor

# Evang->Adversarios: REPULSAO FORTE. Pauta costumes vs progressismo.
F[2][6] = -45  # Evangelicos rejeitam pauta progressista
F[6][2] = -40  # Esquerda rejeita conservadorismo evangelico

# Evang->Mercado: LEVE REPULSAO. "Voto e sagrado."
F[2][7] = -20  # Evangelicos rejeitam moralmente compra de voto
F[7][2] = -10  # Mercado evita bloco coeso (dificil comprar individualmente)

# --- MULHERES BV (3) ---
# Mulheres->Interior: NEUTRO. Pouca interacao.
F[3][4] = 5
F[4][3] = 5

# Mulheres->Jovens: ATRACAO. Solidariedade socioeconomica.
# Dado: ambos em classes D/E, periferia, vulneraveis
F[3][5] = 30   # Mulheres e jovens compartilham periferia
F[5][3] = 25   # Jovens convivem com maes/irmas

# Mulheres->Adversarios: LEVE ATRACAO. Catarina puxa mulheres.
# Dado: Catarina=28% entre mulheres (quase empata com JE=30%)
F[3][6] = 15   # Mulheres sentem afinidade com Catarina (representatividade)
F[6][3] = 25   # Adversarios (Catarina) PUXAM mulheres ativamente

# Mulheres->Mercado: REPULSAO. Medo de represalia.
# Dado: mulheres perif. citam "protecao" como prioridade
F[3][7] = -35  # Mulheres FOGEM do mercado
F[7][3] = 40   # Mercado CACA mulheres vulneraveis (2o alvo)

# --- INTERIOR DISPUTADO (4) ---
# Interior->Jovens: LEVE REPULSAO. Interior e velho, jovens sao urbanos.
F[4][5] = -10
F[5][4] = -15  # Jovens urbanos desconectados do interior

# Interior->Adversarios: REPULSAO. Interior conservador.
# Dado: interior RR = 80-85% Bolsonaro
F[4][6] = -35
F[6][4] = -25  # CIR atua no interior indigena, mas minoria

# Interior->Mercado: VULNERAVEL. Interior pobre, mercado atua.
F[4][7] = -20  # Interior tenta resistir
F[7][4] = 35   # Mercado opera forte no interior (municipios pequenos)

# --- JOVENS VOLATEIS (5) ---
# Jovens->Adversarios: LEVE ATRACAO. Jovens sao mais progressistas.
# Dado: JE=32% mas Catarina=21% + Sampaio=23%. Divididos.
F[5][6] = 10   # Alguns jovens simpatizam com esquerda
F[6][5] = 20   # Esquerda tenta recrutar jovens (universidade, redes)

# Jovens->Mercado: REPULSAO (fogem) mas sao CACADOS.
# Dado: corrupcao = tema 6 (26 mencoes). Jovens rejeitam.
F[5][7] = -40  # Jovens FOGEM do mercado
F[7][5] = 50   # Mercado CACA jovens (principal alvo, R$800)

# --- ADVERSARIOS (6) ---
# Adversarios->Mercado: LEVE REPULSAO. Base ideologica nao compra.
F[6][7] = -30  # Esquerda rejeita compra de voto moralmente
F[7][6] = -5   # Mercado ignora adversarios (bloco ideologico, nao compra)

# Clamp
F = np.clip(np.round(F), -95, 95).astype(int)

# ============================================================
# RAIOS
# ============================================================
COESAO = {}
for nome in NOMES:
    COESAO[nome] = HOMOGENEIDADE[nome] * ORGANIZACAO[nome]

minR = np.zeros((N, N), dtype=int)
maxR = np.zeros((N, N), dtype=int)

for i in range(N):
    for j in range(N):
        ci = COESAO[NOMES[i]]
        ai = ALCANCE[NOMES[i]]
        force = F[i][j] / 100.0

        if i == j:
            minR[i][j] = int(45 - ci * 25)
            maxR[i][j] = int(80 + ci * 30)
        else:
            minR[i][j] = int(np.clip(40 - force * 15, 20, 55))
            maxR[i][j] = int(np.clip(95 + ai * 40 + force * 15, 75, 155))

# ============================================================
# OUTPUT
# ============================================================

print("=" * 70)
print("CENARIO PRE-ELEITORAL JORGE EVERTON -- RR 2026")
print("=" * 70)

header = "            " + "".join(f"{n[:7]:>9}" for n in NOMES)
print(header)
for i in range(N):
    row = f"{NOMES[i]:>11} |"
    for j in range(N):
        row += f"{F[i][j]:>9}"
    print(row)

print()
print("DIAGONAL (auto-coesao):")
for i in range(N):
    h = HOMOGENEIDADE[NOMES[i]]
    o = ORGANIZACAO[NOMES[i]]
    print(f"  {NOMES[i]:>20}: H={h:.2f} x O={o:.2f} = {F[i][i]:+d}")

print()
print("JE% POR SEGMENTO:")
for nome in NOMES:
    print(f"  {nome:>20}: {JE_PCT[nome]*100:.0f}%")

# TypeScript output
print()
print("=" * 70)
print("TypeScript")
print("=" * 70)

print(f"\nconst SEGMENTOS_JE: ElectoralSegment[] = [")
for i in range(N):
    je_pct = int(JE_PCT[NOMES[i]] * 100)
    print(f"  {{ id: {i}, name: '{NOMES[i]}', shortName: '{NOMES[i][:5]}', description: 'JE={je_pct}%', proportion: {PROPORCOES[i]}, color: '{CORES[i]}', strategicAction: '...' }},")
print("]")

print(f"\nconst FORCE_JE_RAW = [")
for i in range(N):
    vals = ", ".join(f"{F[i][j]:>4}" for j in range(N))
    print(f"  [{vals}],  // {NOMES[i]}")
print("]")

print(f"\nconst MIN_RADIUS_JE = [")
for i in range(N):
    vals = ", ".join(f"{minR[i][j]:>3}" for j in range(N))
    print(f"  [{vals}],  // {NOMES[i]}")
print("]")

print(f"\nconst MAX_RADIUS_JE = [")
for i in range(N):
    vals = ", ".join(f"{maxR[i][j]:>3}" for j in range(N))
    print(f"  [{vals}],  // {NOMES[i]}")
print("]")

# Salvar JSON
output = {
    "cenario": "Pre-eleitoral Jorge Everton - Dep. Estadual RR 2026",
    "segmentos": [{"id": i, "nome": NOMES[i], "proporcao": PROPORCOES[i], "cor": CORES[i],
                   "je_pct": JE_PCT[NOMES[i]], "sampaio_pct": SAMPAIO_PCT[NOMES[i]],
                   "catarina_pct": CATARINA_PCT[NOMES[i]],
                   "homogeneidade": HOMOGENEIDADE[NOMES[i]],
                   "organizacao": ORGANIZACAO[NOMES[i]]} for i in range(N)],
    "matriz_forcas": F.tolist(),
    "min_radius": minR.tolist(),
    "max_radius": maxR.tolist(),
}
with open("C:/Users/IgorPC/projetos/projetos-claude/SandboxScience/scripts/cenario_jorge_everton_output.json", "w") as f:
    json.dump(output, f, indent=2)

print("\nDados salvos em cenario_jorge_everton_output.json")
