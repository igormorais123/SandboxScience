"""
CALIBRAÇÃO DA MATRIZ DE FORÇAS — MODELO DOCUMENTAL RR 2026
===========================================================

Metodologia: cada célula F[i][j] é estimada por 5 proxies mensuráveis,
ponderados conforme relevância para Roraima.

PROXIES:
  V = Alinhamento Eleitoral (-1 a +1)
      Fonte: TSE 2022 (Bolsonaro 76.08%), pesquisa INTEIA (n=200)
      Medida: correlação de voto entre os dois grupos

  G = Sobreposição Geográfica (0 a 1)
      Fonte: Censo 2022, distribuição municipal
      Medida: % de co-localização (ambos em BV, interior, terra indígena)

  E = Dependência Econômica (-1 a +1)
      Fonte: IBGE PIB 2023 (47.1% admin pública), estrutura ocupacional
      Medida: um grupo depende do outro? +1=depende, -1=compete

  S = Proximidade Social (-1 a +1)
      Fonte: pesquisa INTEIA (canais de influência), Censo religião
      Medida: frequência de interação social direta

  I = Alinhamento Ideológico (-1 a +1)
      Fonte: TSE 2022 por município, orientação política pesquisa INTEIA
      Medida: compartilham visão de mundo? (conservador/progressista, etc)

PESOS (calibrados para contexto RR):
  wV=0.30  Voto é o comportamento final, maior peso
  wG=0.15  Geografia importa (65% em BV, 46% terra indígena)
  wE=0.20  Economia domina (47.1% PIB público, 50% classes D/E)
  wS=0.15  Social captura igrejas (pastor=25.5% influência)
  wI=0.20  Ideologia forte (estado mais bolsonarista do Brasil)

FÓRMULA:
  F_raw[i][j] = wV*V + wG*G_adj + wE*E + wS*S + wI*I
  Onde G_adj = G * 2 - 1 (converte 0..1 para -1..+1)
  F_scaled = F_raw * 100 (escala -100 a +100)

DIAGONAL (auto-coesão):
  Usa proxy diferente: homogeneidade interna do grupo
  H = 1 - variância interna de voto
  F_diag = H * 100 * fator_organizacional

Cada valor abaixo tem referência documental.
"""

import json
import numpy as np

# ============================================================
# SEGMENTOS (proporções do Censo/TSE 2022)
# ============================================================
SEGMENTOS = [
    # id, nome, proporção, justificativa
    (0, "Funcionalismo",   0.108, "35.000 servidores / ~340.000 adultos. PIB 47.1% admin pública (IBGE 2023)"),
    (1, "Comissionados",   0.038, "~13.000 cargos de confiança (est. 10-15% do funcionalismo). Dado: RR tem maior razão comissionados/efetivos do Norte"),
    (2, "Evangélicos",     0.141, "Censo 2022: 35.0% evangélicos, mas nem todos votam em bloco. Pesquisa INTEIA: pastor influencia 25.5%. Fator bloco = 35% * 0.40 = 14.1%"),
    (3, "Jovens Urbanos",  0.251, "TSE 2022: 18-34 anos = 38.7% eleitorado. Urbanização 76.5%. Fator urbano-jovem = 38.7% * 0.65 = 25.1%"),
    (4, "Mercado do Voto", 0.128, "50% classes D/E, vulnerabilidade ~25%. Fator compra efetiva = 50% * 0.256 = 12.8%. Valor R$800/voto (documentado em RR)"),
    (5, "Indígena Org.",   0.090, "Censo 2022: 14.1% indígena (maior do Brasil), mas CIR organiza ~64%. Fator bloco = 14.1% * 0.64 = 9.0%"),
    (6, "Classe Média",    0.090, "Renda > 3 SM: ~12% da população. Fator urbano-político = 12% * 0.75 = 9.0%. Núcleo bolsonarista"),
    (7, "Interior Agro",   0.077, "Agropecuária cresceu 118.6% (IBGE 2019-2023). Pop rural 23.5%. Fator organizado = 23.5% * 0.33 = 7.7%"),
    (8, "Mulheres Perif.", 0.052, "Feminino 51.33% (TSE). Periferia BV: ~20% do eleitorado feminino. Fator vulnerável = 51.33% * 0.20 * 0.50 = 5.2%"),
    (9, "Fronteira/Seg.",  0.025, "PM+PC+PF+Bombeiro+Militar: ~8.000 efetivos / 340.000 adultos = 2.4%. Arredondado 2.5%"),
]

N = len(SEGMENTOS)
nomes = [s[1] for s in SEGMENTOS]

# ============================================================
# PROXY V: ALINHAMENTO ELEITORAL (-1 a +1)
# ============================================================
# Fonte: TSE 2022 (2o turno presidente), pesquisa INTEIA (n=200)
#
# Lógica: cada segmento tem um "vetor de voto" estimado.
# Correlação entre vetores = alinhamento.
#
# Bolsonaro% por segmento estimado (TSE 2022 + cross-tabs):
BOLSONARO_PCT = {
    "Funcionalismo":   0.78,  # Servidores estaduais alinham com governo Denarium (PP, aliado Bolsonaro). Dado: RR global 76%
    "Comissionados":   0.85,  # Comissionados de Denarium = governo bolsonarista. Lealdade por emprego
    "Evangélicos":     0.88,  # Pesquisa INTEIA: evangélicos = Sampaio (Republicanos, aliado Bolsonaro 42%). Bloco conservador
    "Jovens Urbanos":  0.62,  # Menos bolsonarista que média. Dado: faixa 18-24 tem menor adesão, mas RR é conservador
    "Mercado do Voto": 0.50,  # Transacional, sem ideologia. Vende para quem paga mais. Neutro
    "Indígena Org.":   0.18,  # Uiramutã (88% indígena) = 68% Lula. CIR anti-Bolsonaro por demarcação/Yanomami
    "Classe Média":    0.92,  # Núcleo bolsonarista convicto. RR = 76%, classe média ainda mais
    "Interior Agro":   0.84,  # Pro-garimpo, anti-demarcação, conservador rural. Interior = 80-85% Bolsonaro
    "Mulheres Perif.": 0.55,  # Divididas: Auxílio Brasil puxou para Bolsonaro, mas vulnerabilidade gera ambiguidade
    "Fronteira/Seg.":  0.90,  # PM/militar = base bolsonarista forte. Segurança pública = pauta central
}

# Calcular V[i][j] = 1 - 2*|bi - bj| (quanto mais próximos, mais alinhados)
V = np.zeros((N, N))
for i in range(N):
    for j in range(N):
        bi = BOLSONARO_PCT[nomes[i]]
        bj = BOLSONARO_PCT[nomes[j]]
        V[i][j] = 1 - 2 * abs(bi - bj)
        # Ajuste: se ambos > 0.75, boost de +0.15 (aliança dentro do campo bolsonarista)
        if bi > 0.75 and bj > 0.75:
            V[i][j] = min(1.0, V[i][j] + 0.15)
        # Se um < 0.30 e outro > 0.75, penalidade extra (polarização)
        if (bi < 0.30 and bj > 0.75) or (bj < 0.30 and bi > 0.75):
            V[i][j] = max(-1.0, V[i][j] - 0.20)

# ============================================================
# PROXY G: SOBREPOSIÇÃO GEOGRÁFICA (0 a 1)
# ============================================================
# Fonte: Censo 2022 — distribuição municipal
# Boa Vista = 65% da população. 15 municípios total.
# Terra indígena = 46% do território (mas não é urbano)
#
# Matriz de co-localização: % de ambos os grupos no mesmo espaço
# BV=capital, INT=interior, TI=terra indígena, MIL=áreas militares

# % de cada segmento em Boa Vista (estimado)
BV_PCT = {
    "Funcionalismo":   0.90,  # Palácio do governo, secretarias, tudo em BV
    "Comissionados":   0.95,  # Quase 100% em BV (cargos no governo estadual)
    "Evangélicos":     0.70,  # Igrejas em BV mas também no interior
    "Jovens Urbanos":  0.85,  # 76.5% urbanização, concentrado em BV
    "Mercado do Voto": 0.55,  # Opera em BV e interior (periferia + municípios)
    "Indígena Org.":   0.15,  # Maioria em TI (Raposa Serra do Sol, etc). Só 15% em BV
    "Classe Média":    0.92,  # Praticamente toda em BV (comércio, serviços)
    "Interior Agro":   0.10,  # Definição = interior. Rorainópolis, Caracaraí, etc
    "Mulheres Perif.": 0.80,  # Periferia de BV
    "Fronteira/Seg.":  0.60,  # PM em BV, mas PF/Exército na fronteira (Pacaraima, Normandia)
}

G = np.zeros((N, N))
for i in range(N):
    for j in range(N):
        bi = BV_PCT[nomes[i]]
        bj = BV_PCT[nomes[j]]
        # Co-localização = 1 - |diferença|. Se ambos em BV, alta sobreposição
        G[i][j] = 1 - abs(bi - bj)

# ============================================================
# PROXY E: DEPENDÊNCIA ECONÔMICA (-1 a +1)
# ============================================================
# Fonte: IBGE PIB 2023, estrutura ocupacional
# 47.1% PIB = admin pública. Maior dependência do Brasil.
# Quem depende de quem economicamente?

E = np.zeros((N, N))

# Dependências documentadas (valor, fonte):
DEPS_ECO = {
    # (de, para): valor, justificativa
    ("Comissionados", "Funcionalismo"): (0.7, "Comissionados dependem da máquina que efetivos operam"),
    ("Funcionalismo", "Comissionados"): (0.3, "Efetivos se beneficiam de comissionados que mantêm o governo"),
    ("Funcionalismo", "Fronteira/Seg."): (0.5, "PM/PC são servidores estaduais. Mesma folha de pagamento"),
    ("Fronteira/Seg.", "Funcionalismo"): (0.5, "Simetria: mesma estrutura estatal"),
    ("Comissionados", "Mercado do Voto"): (0.4, "Comissionados canalizam recursos para compra. Simbiose operacional"),
    ("Mercado do Voto", "Comissionados"): (0.3, "Mercado precisa de intermediários com acesso a recursos"),
    ("Mercado do Voto", "Jovens Urbanos"): (0.5, "Jovens D/E são o principal mercado. R$800/voto. Exploração econômica"),
    ("Jovens Urbanos", "Mercado do Voto"): (-0.6, "Jovens são explorados, não dependem. Relação predatória"),
    ("Mercado do Voto", "Mulheres Perif."): (0.5, "Mulheres periféricas = 2o alvo. Vulnerabilidade socioeconômica"),
    ("Mulheres Perif.", "Mercado do Voto"): (-0.5, "Relação predatória. Mulheres não se beneficiam"),
    ("Interior Agro", "Funcionalismo"): (0.3, "Agro depende de estradas, energia = investimento público"),
    ("Funcionalismo", "Interior Agro"): (0.2, "Arrecadação do agro financia folha pública. Agro +118.6%"),
    ("Mulheres Perif.", "Funcionalismo"): (0.4, "CRAS, saúde pública, educação = serviços do estado"),
    ("Mulheres Perif.", "Evangélicos"): (0.3, "Igrejas oferecem rede de apoio, cesta básica, acolhimento"),
    ("Evangélicos", "Mulheres Perif."): (0.2, "Igrejas recrutam mulheres periféricas como fiéis"),
    ("Indígena Org.", "Funcionalismo"): (-0.4, "Conflito: governo estadual anti-demarcação. FUNAI federal vs estado"),
    ("Funcionalismo", "Indígena Org."): (-0.3, "Estado quer terras. Indígenas bloqueiam 46% do território"),
    ("Indígena Org.", "Interior Agro"): (-0.6, "Competição direta por terra. Agro quer expandir em TI"),
    ("Interior Agro", "Indígena Org."): (-0.5, "Agro invade TI para gado/garimpo. Conflito documentado"),
    ("Classe Média", "Indígena Org."): (-0.5, "Classe média = anti-demarcação. Crise Yanomami 2023 = divisor"),
    ("Indígena Org.", "Classe Média"): (-0.5, "Reciprocidade: indígenas rejeitam pauta anti-demarcação"),
    ("Fronteira/Seg.", "Mercado do Voto"): (-0.4, "Polícia fiscaliza compra de voto. Antagonismo operacional"),
    ("Mercado do Voto", "Fronteira/Seg."): (-0.3, "Mercado evita zonas com presença policial forte"),
    ("Jovens Urbanos", "Funcionalismo"): (-0.2, "Jovens buscam emprego privado/informal, não concurso (imediatismo)"),
    ("Evangélicos", "Jovens Urbanos"): (0.3, "Igrejas recrutam jovens (música, culto jovem, redes)"),
    ("Jovens Urbanos", "Evangélicos"): (0.1, "Alguns jovens aderem, mas maioria é secular"),
    ("Classe Média", "Interior Agro"): (0.3, "Aliança econômica: agro abastece, classe média consome"),
    ("Interior Agro", "Classe Média"): (0.2, "Agro vende para BV, classe média compra"),
    ("Evangélicos", "Indígena Org."): (-0.5, "Missionários vs tradições. Conflito histórico documentado em TI"),
    ("Indígena Org.", "Evangélicos"): (-0.5, "Indígenas rejeitam evangelização forçada. Conflito bilateral"),
}

for (a, b), (val, _) in DEPS_ECO.items():
    i = nomes.index(a)
    j = nomes.index(b)
    E[i][j] = val

# ============================================================
# PROXY S: PROXIMIDADE SOCIAL (-1 a +1)
# ============================================================
# Fonte: pesquisa INTEIA (canais de influência), Censo religião
# Pastor 25.5%, Igreja 19.5%, Rádio 16%, WhatsApp 12%,
# Líder comunitário 9%, Liderança indígena 6.5%, Família 5.5%
#
# Interação social = frequência de contato direto entre grupos

S = np.zeros((N, N))

# Canal principal de cada grupo (estimado):
# Funcionalismo: sindicato, repartição (contato diário entre servidores)
# Comissionados: gabinete, reunião política (contato com políticos e funcionários)
# Evangélicos: igreja, culto (3x/semana = altíssima interação)
# Jovens: WhatsApp, TikTok (virtual, baixa presencial)
# Mercado: boca de urna, periferia (contato furtivo)
# Indígena: maloca, assembleia CIR (intenso mas isolado)
# Classe Média: comércio, clube, rede social (moderado)
# Agro: sindicato rural, feira, cooperativa (semanal)
# Mulheres Perif.: vizinhança, igreja, escola dos filhos (diário)
# Fronteira: quartel, delegacia (corporativo diário)

SOCIAL = {
    # Intra-grupo (frequência de interação entre membros)
    ("Funcionalismo", "Funcionalismo"): 0.7,    # Repartição diária
    ("Comissionados", "Comissionados"): 0.5,     # Gabinete, mas competem
    ("Evangélicos", "Evangélicos"): 0.9,         # Culto 3x/semana, célula, grupo de oração
    ("Jovens Urbanos", "Jovens Urbanos"): 0.3,   # Virtual, fragmentado (funk, gamer, igreja, nenhum)
    ("Mercado do Voto", "Mercado do Voto"): 0.2, # Transacional, sem lealdade
    ("Indígena Org.", "Indígena Org."): 0.85,    # Maloca, assembleia CIR, ritual
    ("Classe Média", "Classe Média"): 0.6,       # Clube, rede social, comércio
    ("Interior Agro", "Interior Agro"): 0.6,     # Cooperativa, sindicato, feira
    ("Mulheres Perif.", "Mulheres Perif."): 0.5, # Vizinhança, escola, fila de UBS
    ("Fronteira/Seg.", "Fronteira/Seg."): 0.8,   # Quartel, turno, esprit de corps

    # Inter-grupo (seleção das interações mais relevantes)
    ("Funcionalismo", "Comissionados"): 0.6,     # Trabalham juntos diariamente
    ("Comissionados", "Funcionalismo"): 0.6,
    ("Funcionalismo", "Fronteira/Seg."): 0.5,    # PM/PC = servidores. Interagem em reunião, sindicato
    ("Fronteira/Seg.", "Funcionalismo"): 0.5,
    ("Evangélicos", "Mulheres Perif."): 0.6,     # Igreja acolhe. Culto + cesta básica + rede
    ("Mulheres Perif.", "Evangélicos"): 0.5,     # Mulheres frequentam, mas nem todas ativas
    ("Evangélicos", "Jovens Urbanos"): 0.35,     # Culto jovem, música. Recrutamento ativo
    ("Jovens Urbanos", "Evangélicos"): 0.2,      # Jovens vão a culto mas participação é menor
    ("Evangélicos", "Interior Agro"): 0.4,       # Igrejas no interior são centro social
    ("Interior Agro", "Evangélicos"): 0.4,
    ("Evangélicos", "Classe Média"): 0.4,        # Igrejas de classe média (neopentecostal)
    ("Classe Média", "Evangélicos"): 0.4,
    ("Classe Média", "Fronteira/Seg."): 0.35,    # Militares são classe média em BV
    ("Fronteira/Seg.", "Classe Média"): 0.35,
    ("Comissionados", "Mercado do Voto"): 0.3,   # Intermediários de compra de voto
    ("Mercado do Voto", "Comissionados"): 0.3,
    ("Mercado do Voto", "Jovens Urbanos"): 0.2,  # Contato furtivo, periferia
    ("Jovens Urbanos", "Mercado do Voto"): -0.3, # Jovens evitam (corrupção = tema 6)
    ("Mercado do Voto", "Mulheres Perif."): 0.2, # Contato furtivo
    ("Mulheres Perif.", "Mercado do Voto"): -0.3,# Mulheres evitam (medo)
    ("Indígena Org.", "Evangélicos"): -0.5,      # Conflito missionário. Interação negativa
    ("Evangélicos", "Indígena Org."): -0.4,      # Evangélicos tentam converter, resistência
    ("Indígena Org.", "Classe Média"): -0.4,     # Antagonismo por demarcação. Não interagem
    ("Classe Média", "Indígena Org."): -0.4,
    ("Indígena Org.", "Interior Agro"): -0.5,    # Conflito territorial direto
    ("Interior Agro", "Indígena Org."): -0.4,
    ("Indígena Org.", "Fronteira/Seg."): -0.3,   # Operações em TI. Tensão
    ("Fronteira/Seg.", "Indígena Org."): -0.3,
    ("Mulheres Perif.", "Jovens Urbanos"): 0.3,  # Vizinhança, periferia, mesma condição
    ("Jovens Urbanos", "Mulheres Perif."): 0.3,
    ("Fronteira/Seg.", "Mercado do Voto"): -0.3, # Polícia vs compra de voto
    ("Mercado do Voto", "Fronteira/Seg."): -0.3,
    ("Classe Média", "Interior Agro"): 0.3,      # Comércio, feira, cadeia produtiva
    ("Interior Agro", "Classe Média"): 0.3,
    ("Funcionalismo", "Classe Média"): 0.3,      # Servidores = classe média em BV
    ("Classe Média", "Funcionalismo"): 0.3,
}

for (a, b), val in SOCIAL.items():
    i = nomes.index(a)
    j = nomes.index(b)
    S[i][j] = val

# ============================================================
# PROXY I: ALINHAMENTO IDEOLÓGICO (-1 a +1)
# ============================================================
# Fonte: pesquisa INTEIA — orientação política
# 500 direita, 180 centro-dir, 120 centro, 100 centro-esq, 100 esquerda
# = 68% direita/centro-direita
#
# Cada segmento tem uma posição ideológica estimada (0=esquerda, 1=direita)
IDEOLOGIA = {
    "Funcionalismo":   0.65,  # Direita moderada (governo Denarium = bolsonarista)
    "Comissionados":   0.75,  # Mais à direita (lealdade ao governo de direita)
    "Evangélicos":     0.80,  # Conservador forte (pauta costumes)
    "Jovens Urbanos":  0.50,  # Centro (divididos: alguns bolsonaristas, outros nem)
    "Mercado do Voto": 0.50,  # Sem ideologia (transacional). Centro por definição
    "Indígena Org.":   0.20,  # Centro-esquerda (demarcação, PT/PSOL em Uiramutã)
    "Classe Média":    0.88,  # Direita forte (núcleo bolsonarista, 92% Bolsonaro estimado)
    "Interior Agro":   0.78,  # Direita (anti-demarcação, pro-garimpo, conservador)
    "Mulheres Perif.": 0.45,  # Centro-esquerda leve (benefícios sociais, mas conservadoras)
    "Fronteira/Seg.":  0.85,  # Direita forte (militares, segurança, Bolsonaro)
}

I_mat = np.zeros((N, N))
for i in range(N):
    for j in range(N):
        ii = IDEOLOGIA[nomes[i]]
        ij = IDEOLOGIA[nomes[j]]
        I_mat[i][j] = 1 - 2 * abs(ii - ij)
        # Polarização extra: extremos opostos
        if (ii < 0.30 and ij > 0.75) or (ij < 0.30 and ii > 0.75):
            I_mat[i][j] = max(-1.0, I_mat[i][j] - 0.15)

# ============================================================
# AUTO-COESÃO (diagonal)
# ============================================================
# Usa homogeneidade interna + fator organizacional
# H = homogeneidade de voto (1 = todo mundo vota igual)
# O = nível organizacional (sindicato, CIR, igreja, etc)

HOMOGENEIDADE = {
    "Funcionalismo":   0.70,  # Maioria vota alinhado, mas há servidores de esquerda
    "Comissionados":   0.80,  # Muito alinhados (emprego depende do governo)
    "Evangélicos":     0.85,  # Pesquisa: 42% vota Sampaio (bloco forte mas não 100%)
    "Jovens Urbanos":  0.25,  # MUITO fragmentado. 4+ candidatos dividem. Volátil
    "Mercado do Voto": 0.15,  # Zero coesão. Cada um vende para um lado diferente
    "Indígena Org.":   0.90,  # Uiramutã 68% Lula. CIR organiza voto em bloco FORTE
    "Classe Média":    0.82,  # 92% Bolsonaro estimado. Bloco ideológico coeso
    "Interior Agro":   0.65,  # Ruralistas organizados, mas interior é disperso
    "Mulheres Perif.": 0.40,  # Divididas: conservadoras vs benefícios sociais
    "Fronteira/Seg.":  0.88,  # Corporativismo militar. Esprit de corps. Quase unânime
}

ORGANIZACAO = {
    "Funcionalismo":   0.80,  # Sindicatos fortes, ADERR, SESP, etc
    "Comissionados":   0.60,  # Organizados pelo chefe político, não por si mesmos
    "Evangélicos":     0.90,  # Igreja = máquina organizacional perfeita. Hierarquia clara
    "Jovens Urbanos":  0.15,  # Zero organização formal. Cada um por si
    "Mercado do Voto": 0.10,  # Descentralizado, clandestino, sem estrutura fixa
    "Indígena Org.":   0.90,  # CIR = organização centenária. Assembleia, caciques, coordenadores
    "Classe Média":    0.50,  # Associações comerciais, mas sem partido único
    "Interior Agro":   0.60,  # Sindicatos rurais, cooperativas, Embrapa
    "Mulheres Perif.": 0.30,  # Redes informais de vizinhança, pouca organização formal
    "Fronteira/Seg.":  0.85,  # Hierarquia militar. Organização por definição
}

# ============================================================
# CÁLCULO DA MATRIZ FINAL
# ============================================================

wV, wG, wE, wS, wI = 0.30, 0.15, 0.20, 0.15, 0.20

# Converter G de 0..1 para -1..+1
G_adj = G * 2 - 1

# Matriz de forças
F = np.zeros((N, N))
for i in range(N):
    for j in range(N):
        if i == j:
            # Diagonal: auto-coesão = homogeneidade * organização * 100
            F[i][j] = HOMOGENEIDADE[nomes[i]] * ORGANIZACAO[nomes[i]] * 100
        else:
            # Fora da diagonal: média ponderada dos proxies
            raw = (wV * V[i][j] +
                   wG * G_adj[i][j] +
                   wE * E[i][j] +
                   wS * S[i][j] +
                   wI * I_mat[i][j])
            F[i][j] = raw * 100

# Clamp a -95..+95 (reservar ±100 para valores extremos manuais)
F = np.clip(F, -95, 95)
F = np.round(F).astype(int)

# ============================================================
# RAIOS
# ============================================================
# minRadius: inversamente proporcional à coesão. Grupos coesos ficam mais perto.
# maxRadius: proporcional ao alcance de influência do grupo.
#
# Base: minR = 45 - coesão*20, maxR = 80 + alcance*40
# Ajustes por relação específica

ALCANCE = {
    "Funcionalismo":   0.5,  # Influência média (burocracia)
    "Comissionados":   0.6,  # Articuladores, alcance político
    "Evangélicos":     0.8,  # Igrejas em toda parte, missões, rádio
    "Jovens Urbanos":  0.7,  # WhatsApp, TikTok = alcance digital alto
    "Mercado do Voto": 0.9,  # Busca ativamente alvos em toda parte
    "Indígena Org.":   0.2,  # Muito isolado geograficamente. TI = 46% território mas longe
    "Classe Média":    0.5,  # BV-cêntrica
    "Interior Agro":   0.4,  # Rural, disperso
    "Mulheres Perif.": 0.3,  # Local, vizinhança
    "Fronteira/Seg.":  0.6,  # PM patrulha, alcance territorial
}

COESAO_NORM = {}
for nome in nomes:
    COESAO_NORM[nome] = HOMOGENEIDADE[nome] * ORGANIZACAO[nome]

minR = np.zeros((N, N), dtype=int)
maxR = np.zeros((N, N), dtype=int)

for i in range(N):
    for j in range(N):
        ci = COESAO_NORM[nomes[i]]
        cj = COESAO_NORM[nomes[j]]
        ai = ALCANCE[nomes[i]]
        aj = ALCANCE[nomes[j]]

        if i == j:
            # Auto: mais coeso = mais perto
            minR[i][j] = int(45 - ci * 25)
            maxR[i][j] = int(80 + ci * 30)
        else:
            # Inter: força positiva = mais perto, negativa = mais longe
            force = F[i][j] / 100.0
            # minRadius: base 40, reduz se atrai, aumenta se repele
            minR[i][j] = int(np.clip(40 - force * 15, 20, 55))
            # maxRadius: base 95, aumenta com alcance do ATOR (quem exerce a força)
            maxR[i][j] = int(np.clip(95 + ai * 40 + force * 15, 75, 155))

# ============================================================
# PARÂMETROS FÍSICOS
# ============================================================
# frictionFactor: atrito do sistema = inércia política
#   RR é conservador (76% Bolsonaro), pouca mudança rápida
#   Mas jovens (25%) são voláteis
#   Estimativa: 0.14 (moderado-alto, sistema estável com bolsões de volatilidade)
#
# forceFactor: intensidade das interações
#   RR tem política intensa (15 municípios, todos se conhecem, estado pequeno)
#   Estimativa: 1.0 (intensidade normal)
#
# numParticles: 5000 (proporcional aos 366.240 eleitores, ~1:73)

PHYSICS = {
    "species": 10,
    "numParticles": 5000,
    "frictionFactor": 0.14,  # Inércia alta = estado conservador, mudança lenta
    "forceFactor": 1.0,
}

# ============================================================
# OUTPUT
# ============================================================

print("=" * 70)
print("MATRIZ DE FORÇAS — MODELO DOCUMENTAL RR 2026")
print("=" * 70)
print()

# Cabeçalho
header = "         " + "".join(f"{n[:5]:>7}" for n in nomes)
print(header)
print("-" * len(header))

for i in range(N):
    row = f"{nomes[i][:8]:>8} |"
    for j in range(N):
        val = F[i][j]
        row += f"{val:>7}"
    print(row)

print()
print("=" * 70)
print("CONTRIBUIÇÃO DE CADA PROXY (exemplo: Evangélicos -> Indígena Org.)")
print("=" * 70)
ei, ej = 2, 5  # Evang -> Indig
print(f"  V (eleitoral):  {V[ei][ej]:+.3f} × {wV} = {V[ei][ej]*wV:+.3f}")
print(f"  G (geográfico): {G_adj[ei][ej]:+.3f} × {wG} = {G_adj[ei][ej]*wG:+.3f}")
print(f"  E (econômico):  {E[ei][ej]:+.3f} × {wE} = {E[ei][ej]*wE:+.3f}")
print(f"  S (social):     {S[ei][ej]:+.3f} × {wS} = {S[ei][ej]*wS:+.3f}")
print(f"  I (ideológico): {I_mat[ei][ej]:+.3f} × {wI} = {I_mat[ei][ej]*wI:+.3f}")
print(f"  TOTAL: {F[ei][ej]:+d}")

print()
print("=" * 70)
print("DIAGONAL (auto-coesão = Homogeneidade × Organização × 100)")
print("=" * 70)
for i in range(N):
    h = HOMOGENEIDADE[nomes[i]]
    o = ORGANIZACAO[nomes[i]]
    print(f"  {nomes[i]:>20}: H={h:.2f} × O={o:.2f} = {F[i][i]:+d}")

# Gerar JS
print()
print("=" * 70)
print("CÓDIGO TypeScript para electoralScenarios.ts")
print("=" * 70)
print()

print("const FORCE_10_CALIBRADO = [")
for i in range(N):
    vals = ", ".join(f"{F[i][j]:>4}" for j in range(N))
    print(f"  [{vals}],  // {nomes[i]}")
print("]")
print()

print("const MIN_RADIUS_10_CAL = [")
for i in range(N):
    vals = ", ".join(f"{minR[i][j]:>3}" for j in range(N))
    print(f"  [{vals}],  // {nomes[i]}")
print("]")
print()

print("const MAX_RADIUS_10_CAL = [")
for i in range(N):
    vals = ", ".join(f"{maxR[i][j]:>3}" for j in range(N))
    print(f"  [{vals}],  // {nomes[i]}")
print("]")
print()

print(f"settings: {{ species: {PHYSICS['species']}, numParticles: {PHYSICS['numParticles']}, frictionFactor: {PHYSICS['frictionFactor']}, forceFactor: {PHYSICS['forceFactor']} }}")

# Salvar dados completos
output = {
    "metodologia": {
        "proxies": ["V=alinhamento_eleitoral", "G=sobreposicao_geografica", "E=dependencia_economica", "S=proximidade_social", "I=alinhamento_ideologico"],
        "pesos": {"V": wV, "G": wG, "E": wE, "S": wS, "I": wI},
        "formula_off_diagonal": "F = (wV*V + wG*G_adj + wE*E + wS*S + wI*I) * 100",
        "formula_diagonal": "F = homogeneidade * organizacao * 100",
        "fontes": [
            "TSE 2022 — resultados por município (Bolsonaro 76.08%)",
            "Censo IBGE 2022 — população, religião, cor/raça, urbanização",
            "IBGE PIB 2023 — composição setorial (47.1% admin pública)",
            "Pesquisa INTEIA (n=200) — intenção de voto, influências, temas",
            "Relatório Jorge Everton — cross-tabs demográficos",
            "Dados demográficos RR 2026 (arquivo projeto)",
        ],
    },
    "segmentos": [{"id": s[0], "nome": s[1], "proporcao": s[2], "justificativa": s[3]} for s in SEGMENTOS],
    "proxies_por_segmento": {
        "bolsonaro_pct": BOLSONARO_PCT,
        "bv_pct": BV_PCT,
        "ideologia": IDEOLOGIA,
        "homogeneidade": HOMOGENEIDADE,
        "organizacao": ORGANIZACAO,
        "alcance": ALCANCE,
    },
    "matriz_forcas": F.tolist(),
    "min_radius": minR.tolist(),
    "max_radius": maxR.tolist(),
    "physics": PHYSICS,
}

with open("C:/Users/IgorPC/projetos/projetos-claude/SandboxScience/scripts/matriz_documental_output.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("\n✓ Dados completos salvos em matriz_documental_output.json")
