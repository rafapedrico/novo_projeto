import { reactive, computed } from 'vue'

const state = reactive({
  // Auth
  isAuthenticated: false,
  userName: '',
  userLevel: 1, // 1=Inspetor, 2=Analista, 3=Líder, 4=Coordenador

  // OP / Lote data
  opNumber: 'OP-2024-0042',
  productName: 'DISCO DE FREIO AÇO 350MM',
  totalPieces: 150,
  approvedPieces: 142,
  reprovedPieces: 8,

  // RNC state machine
  currentRncStage: 'ABERTA', // ABERTA -> EM ANALISE -> ACAO DEFINIDA -> AGUARDANDO VALIDACAO -> ENCERRADA
  rncNumber: 'RNC-001',
  rncDescription: 'Lascamento na borda do disco - lote OP-2024-0042',
  rncResponsible: '',
  rncRootCause: '',
  rncAction: '',
  rncValidationResult: '',
})

// RNC stage sequence and required level
const rncStages = [
  { key: 'ABERTA', label: 'Aberta', level: 1, field: 'rncDescription' },
  { key: 'EM ANALISE', label: 'Em Análise', level: 2, field: 'rncRootCause' },
  { key: 'ACAO DEFINIDA', label: 'Ação Definida', level: 3, field: 'rncAction' },
  { key: 'AGUARDANDO VALIDACAO', label: 'Aguardando Validação', level: 4, field: 'rncValidationResult' },
  { key: 'ENCERRADA', label: 'Encerrada', level: 0, field: '' },
]

export function useStore() {
  function login(user, pass) {
    if (user === 'RAFAEL_PEDRICO' && pass === '12345') {
      state.isAuthenticated = true
      state.userName = user
      state.userLevel = 4
      return true
    }
    return false
  }

  function logout() {
    state.isAuthenticated = false
    state.userName = ''
    state.userLevel = 1
  }

  function getStageIndex() {
    return rncStages.findIndex(s => s.key === state.currentRncStage)
  }

  function getStageInfo() {
    return rncStages.find(s => s.key === state.currentRncStage) || rncStages[0]
  }

  function getRequiredLevelForStage(stageKey) {
    const stage = rncStages.find(s => s.key === stageKey)
    return stage ? stage.level : 1
  }

  function advanceRncStage() {
    const idx = getStageIndex()
    if (idx < rncStages.length - 1) {
      state.currentRncStage = rncStages[idx + 1].key
    }
  }

  function revertRncStage() {
    const idx = getStageIndex()
    if (idx > 0) {
      state.currentRncStage = rncStages[idx - 1].key
    }
  }

  function canUserEditStage(stageKey) {
    const requiredLevel = getRequiredLevelForStage(stageKey)
    return state.userLevel >= requiredLevel
  }

  function getDonutData() {
    const total = state.approvedPieces + state.reprovedPieces
    return {
      approved: (state.approvedPieces / total) * 360,
      reproved: (state.reprovedPieces / total) * 360,
      approvedPercent: ((state.approvedPieces / total) * 100).toFixed(2),
      reprovedPercent: ((state.reprovedPieces / total) * 100).toFixed(2),
    }
  }

  return {
    state,
    rncStages,
    login,
    logout,
    getStageIndex,
    getStageInfo,
    getRequiredLevelForStage,
    advanceRncStage,
    revertRncStage,
    canUserEditStage,
    getDonutData,
  }
}