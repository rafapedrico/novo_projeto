import { reactive } from 'vue'

const STORAGE_KEY = 'intellink_mes_state'

/* ------------------------------------------------------------------ */
/*   Embedded / External injection helpers                            */
/* ------------------------------------------------------------------ */

/**
 * Tenta obter dados injetados externamente.
 * Fontes consultadas (em ordem de precedência):
 *   1. window.__INTELLINK_PROPS__  –  setado pelo sistema hospedeiro (iframe)
 *   2. Parâmetros da URL           –  ?usuarioLogado__nome=...&opAtiva__numero=...
 *   3. window.name (JSON)          –  alternativa para ambientes restritos
 *
 * Retorna um objeto com { usuarioLogado, opAtiva } ou null se nada for
 * encontrado.
 */
function getExternalContext() {
  // 1 – Propriedades injetadas pelo pai via window
  if (window.__INTELLINK_PROPS__) {
    const p = window.__INTELLINK_PROPS__
    if (p.usuarioLogado || p.opAtiva) {
      return {
        usuarioLogado: p.usuarioLogado ?? null,
        opAtiva: p.opAtiva ?? null
      }
    }
  }

  // 2 – Parâmetros da URL (convenção: "prop__campo")
  try {
    const params = new URLSearchParams(window.location.search)
    const hasEmbed = params.has('embed') || params.has('usuarioLogado__nome')
    if (hasEmbed) {
      const ext = { usuarioLogado: {}, opAtiva: {} }
      ext.usuarioLogado.nome  = params.get('usuarioLogado__nome')   ?? ''
      ext.usuarioLogado.perfil = params.get('usuarioLogado__perfil') ?? ''
      ext.usuarioLogado.nivel  = params.get('usuarioLogado__nivel')  ?? ''
      ext.opAtiva.numero   = params.get('opAtiva__numero')   ?? ''
      ext.opAtiva.cliente  = params.get('opAtiva__cliente')  ?? ''
      ext.opAtiva.pcItem   = params.get('opAtiva__pcItem')   ?? ''
      ext.opAtiva.desenho  = params.get('opAtiva__desenho')  ?? ''
      ext.opAtiva.revisao  = params.get('opAtiva__revisao')  ?? ''
      ext.opAtiva.qtdPecas = Number(params.get('opAtiva__qtdPecas')) || 0
      return ext
    }
  } catch (_) { /* URLSearchParams indisponível – ignorar */ }

  // 3 – window.name (JSON)
  try {
    if (window.name && window.name.startsWith('{')) {
      const parsed = JSON.parse(window.name)
      if (parsed.usuarioLogado || parsed.opAtiva) {
        return {
          usuarioLogado: parsed.usuarioLogado ?? null,
          opAtiva: parsed.opAtiva ?? null
        }
      }
    }
  } catch (_) { /* window.name não é JSON válido – ignorar */ }

  return null
}

/* ------------------------------------------------------------------ */
/*   Estado reativo                                                    */
/* ------------------------------------------------------------------ */

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    // ignore
  }
  return null
}

const saved = loadFromStorage()
const external = getExternalContext()

export const store = reactive({
  /* ---------- Dados injetados externamente (embedded) ---------- */
  embedded: !!external,

  /* ---------- Usuário logado ---------- */
  usuarioLogado: {
    nome:   external?.usuarioLogado?.nome   ?? saved?.usuarioLogado?.nome   ?? '',
    perfil: external?.usuarioLogado?.perfil ?? saved?.usuarioLogado?.perfil ?? '',
    nivel:  external?.usuarioLogado?.nivel  ?? saved?.usuarioLogado?.nivel  ?? ''
  },

  /* ---------- OP ativa ---------- */
  opAtiva: {
    numero:   external?.opAtiva?.numero   ?? saved?.opAtiva?.numero   ?? '',
    cliente:  external?.opAtiva?.cliente  ?? saved?.opAtiva?.cliente  ?? '',
    pcItem:   external?.opAtiva?.pcItem   ?? saved?.opAtiva?.pcItem   ?? '',
    desenho:  external?.opAtiva?.desenho  ?? saved?.opAtiva?.desenho  ?? '',
    revisao:  external?.opAtiva?.revisao  ?? saved?.opAtiva?.revisao  ?? '',
    qtdPecas: external?.opAtiva?.qtdPecas ?? saved?.opAtiva?.qtdPecas ?? 0
  },

  /* ---------- Características / medições ---------- */
  caracteristicas: saved?.caracteristicas ?? [],

  /* ---------- RNC ---------- */
  rncPendente:          saved?.rncPendente          ?? null,
  rncStatus:            saved?.rncStatus            ?? '',
  rncAssinaturaAnalise:   saved?.rncAssinaturaAnalise   ?? null,
  rncAssinaturaExecucao:  saved?.rncAssinaturaExecucao  ?? null,
  rncAssinaturaValidacao: saved?.rncAssinaturaValidacao ?? null,

  /* ---------- Tema ---------- */
  temaAtual: saved?.temaAtual ?? 'modo-escuro',

  /* ---------- Payload de exportação (preenchido ao finalizar) ---------- */
  payloadExportacao: null
})

/* ------------------------------------------------------------------ */
/*   Persistência local                                               */
/* ------------------------------------------------------------------ */

export function salvarStore() {
  // Não persistir quando estiver em modo embedded (os dados vêm de fora)
  if (store.embedded) return

  try {
    const data = {
      usuarioLogado: { ...store.usuarioLogado },
      opAtiva: { ...store.opAtiva },
      caracteristicas: store.caracteristicas.map(c => ({
        ...c,
        valoresPecas: c.valoresPecas ? { ...c.valoresPecas } : {}
      })),
      rncPendente: store.rncPendente ? { ...store.rncPendente } : null,
      rncStatus: store.rncStatus,
      rncAssinaturaAnalise: store.rncAssinaturaAnalise,
      rncAssinaturaExecucao: store.rncAssinaturaExecucao,
      rncAssinaturaValidacao: store.rncAssinaturaValidacao,
      temaAtual: store.temaAtual
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    // ignore
  }
}

/* ------------------------------------------------------------------ */
/*   Geração do payload de exportação (para API central)              */
/* ------------------------------------------------------------------ */

/**
 * Monta o objeto `payloadExportacao` com o resumo de todas as medições
 * do lote atual. Deve ser chamado no momento em que o lote é encerrado
 * (ex.: dentro da FinalizadoView ou de uma action de finalização).
 *
 * O objeto gerado fica disponível em `store.payloadExportacao` e também
 * é retornado para quem chamar a função.
 */
export function gerarPayloadExportacao() {
  const caracteristicas = store.caracteristicas
  const totalPecas = store.opAtiva.qtdPecas || 0

  // --- Totais por peça ---
  function isPecaAprovada(pecaNum) {
    if (!caracteristicas || caracteristicas.length === 0) return false
    let temMedida = false
    for (const cota of caracteristicas) {
      const valStr = cota.valoresPecas?.[pecaNum]
      if (!valStr) return false
      temMedida = true
      const valNum = parseFloat(valStr.replace(',', '.'))
      if (isNaN(valNum) || valNum < cota.min || valNum > cota.max) return false
    }
    return temMedida
  }

  function isPecaReprovada(pecaNum) {
    if (!caracteristicas || caracteristicas.length === 0) return false
    for (const cota of caracteristicas) {
      const valStr = cota.valoresPecas?.[pecaNum]
      if (valStr) {
        const valNum = parseFloat(valStr.replace(',', '.'))
        if (!isNaN(valNum) && (valNum < cota.min || valNum > cota.max)) return true
      }
    }
    return false
  }

  let pecasAprovadas = 0
  let pecasReprovadas = 0
  let totalMedicoes = 0
  let pecasNaoMedidas = 0

  for (let p = 1; p <= totalPecas; p++) {
    if (isPecaAprovada(p)) pecasAprovadas++
    else if (isPecaReprovada(p)) pecasReprovadas++
    else pecasNaoMedidas++

    for (const cota of caracteristicas) {
      if (cota.valoresPecas?.[p]) totalMedicoes++
    }
  }

  const taxaAprovacao = totalPecas > 0
    ? Number(((pecasAprovadas / totalPecas) * 100).toFixed(2))
    : 0

  // --- Detalhamento por característica ---
  const cotasDetalhadas = caracteristicas.map(cota => {
    const valores = []
    for (let p = 1; p <= totalPecas; p++) {
      const raw = cota.valoresPecas?.[p]
      if (raw) {
        const valNum = parseFloat(raw.replace(',', '.'))
        valores.push({
          peca: p,
          valor: valNum,
          conforme: !isNaN(valNum) && valNum >= cota.min && valNum <= cota.max
        })
      }
    }
    return {
      codigo:       cota.codigo     ?? cota.caracteristica ?? '',
      descricao:    cota.descricao  ?? '',
      toleranciaMin: cota.min,
      toleranciaMax: cota.max,
      valores
    }
  })

  const payload = {
    metadados: {
      sistema:           'INTELLINK-MES',
      modulo:            'ControleDeQualidade',
      versao:            '2.5.1',
      geradoEm:          new Date().toISOString(),
      origem:            store.embedded ? 'embedded' : 'standalone'
    },
    lote: {
      numeroOP:    store.opAtiva.numero,
      cliente:     store.opAtiva.cliente,
      pcItem:      store.opAtiva.pcItem,
      desenho:     store.opAtiva.desenho,
      revisao:     store.opAtiva.revisao,
      qtdPecas:    totalPecas,
      inspetor:    store.usuarioLogado.nome
    },
    resumo: {
      totalPecas,
      pecasAprovadas,
      pecasReprovadas,
      pecasNaoMedidas,
      totalMedicoes,
      totalCotas: caracteristicas.length,
      taxaAprovacao
    },
    cotas: cotasDetalhadas
  }

  store.payloadExportacao = payload
  return payload
}

/**
 * Força a reinicialização dos dados do usuário / OP a partir de uma fonte
 * externa. Útil se o sistema hospedeiro quiser atualizar o contexto sem
 * recarregar a página.
 */
export function aplicarContextoExterno({ usuarioLogado, opAtiva } = {}) {
  if (usuarioLogado) {
    Object.assign(store.usuarioLogado, {
      nome:   usuarioLogado.nome   ?? store.usuarioLogado.nome,
      perfil: usuarioLogado.perfil ?? store.usuarioLogado.perfil,
      nivel:  usuarioLogado.nivel  ?? store.usuarioLogado.nivel
    })
  }
  if (opAtiva) {
    Object.assign(store.opAtiva, {
      numero:   opAtiva.numero   ?? store.opAtiva.numero,
      cliente:  opAtiva.cliente  ?? store.opAtiva.cliente,
      pcItem:   opAtiva.pcItem   ?? store.opAtiva.pcItem,
      desenho:  opAtiva.desenho  ?? store.opAtiva.desenho,
      revisao:  opAtiva.revisao  ?? store.opAtiva.revisao,
      qtdPecas: Number.isFinite(opAtiva.qtdPecas) ? opAtiva.qtdPecas : store.opAtiva.qtdPecas
    })
  }
  store.embedded = true
  salvarStore()
}