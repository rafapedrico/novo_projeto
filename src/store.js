import { reactive } from 'vue'

const STORAGE_KEY = 'intellink_mes_state'

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

export const store = reactive({
  usuarioLogado: {
    nome: saved?.usuarioLogado?.nome ?? '',
    perfil: saved?.usuarioLogado?.perfil ?? '',
    nivel: saved?.usuarioLogado?.nivel ?? ''
  },
  opAtiva: {
    numero: saved?.opAtiva?.numero ?? '',
    cliente: saved?.opAtiva?.cliente ?? '',
    pcItem: saved?.opAtiva?.pcItem ?? '',
    desenho: saved?.opAtiva?.desenho ?? '',
    revisao: saved?.opAtiva?.revisao ?? '',
    qtdPecas: saved?.opAtiva?.qtdPecas ?? 0
  },
  caracteristicas: saved?.caracteristicas ?? [],
  rncPendente: saved?.rncPendente ?? null,
  rncStatus: saved?.rncStatus ?? '',
  rncAssinaturaAnalise: saved?.rncAssinaturaAnalise ?? null,
  rncAssinaturaExecucao: saved?.rncAssinaturaExecucao ?? null,
  rncAssinaturaValidacao: saved?.rncAssinaturaValidacao ?? null,
  temaAtual: saved?.temaAtual ?? 'modo-escuro'
})

export function salvarStore() {
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