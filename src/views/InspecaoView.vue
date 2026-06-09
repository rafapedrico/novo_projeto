<template>
  <div class="app" :class="[store.temaAtual]">
    
    <div v-if="!store.usuarioLogado.nome" class="full-screen-login-gate animate-fade">
      <div class="login-card-central">
        <div class="logo">INTELLINK</div>
        <div class="sublogo">INDUSTRIAL MES</div>
        
        <h3>Controle de Qualidade & Rastreabilidade</h3>
        <p>Insira suas credenciais operacionais para liberar o posto de inspeção.</p>

        <div class="login-field-group">
          <label>Usuário do Inspetor</label>
          <input v-model="inputUsuario" placeholder="Ex: RAFAEL_PEDRICO" @keyup.enter="login" />
        </div>

        <div class="login-field-group">
          <label>Senha Biométrica / Numérica</label>
          <input v-model="inputSenha" type="password" placeholder="••••" @keyup.enter="login" />
        </div>

        <button class="btn-primary" @click="login">AUTENTICAR POSTO DE TRABALHO</button>
        
        <div v-if="loginStatusMsg" class="alerta block-alert alerta-erro">
          {{ loginStatusMsg }}
        </div>
        
        <div class="hint-dev-tag">💡 Homologado para testes: <strong>RAFAEL_PEDRICO</strong> | Senha: <strong>12345</strong></div>
      </div>
    </div>

    <div v-else-if="!planoConfigurado" class="full-viewport-plano animate-fade">
      
      <header class="plano-top-bar">
        <div class="plano-top-left">
          <div class="user-pill-top">👤 Inspetor Ativo: <strong>{{ store.usuarioLogado.nome }}</strong></div>
        </div>
        <div class="plano-top-right">
          <button @click="alternarTema" class="btn-theme-toggle-top-plano">
            <span v-if="store.temaAtual === 'modo-escuro'">☀️ MODO CLARO</span>
            <span v-else>🌙 MODO ESCURO</span>
          </button>
          <button class="btn-yellow" @click="voltarAoDashboard" style="margin-left: 10px;">◀ VOLTAR PARA O DASHBOARD</button>
        </div>
      </header>

      <div class="plano-workspace-grid">
        <div class="plano-config-panel">
          <h3>📋 CONFIGURAÇÃO DETALHADA DO PLANO DE MEDIÇÃO</h3>
          <p class="section-subtitle">A validação da OP é obrigatória para liberar a nitidez e visualização técnica dos dados.</p>

          <div class="op-search-block">
            <label style="font-weight: 800;">Informe o Número da Ordem de Produção (OP):</label>
            <div class="search-row">
              <input type="text" v-model="opDigitada" placeholder="Ex: Digite qualquer número de OP para validar" />
              <button class="btn-primary" @click="validarOrdemProduçao" style="margin: 0; width: auto; padding: 0 20px;">VALIDAR OP</button>
            </div>
            <div v-if="opMsgValidacao" class="op-status-feedback" :class="opStatusClasse">
              {{ opMsgValidacao }}
            </div>
          </div>

          <div class="plano-fields-form" :class="{ 'fields-disabled-lock-state': !opLiberada }">
            
            <div class="inline-fields-row purple-group-view">
              <div>
                <label>Número do Desenho Técnico (Fixo Engenharia):</label>
                <input type="text" :value="planoDesenho" class="input-readonly-lock" disabled />
              </div>
              <div>
                <label>Revisão da Engenharia (Fixo Engenharia):</label>
                <input type="text" :value="planoRevisao" class="input-readonly-lock" disabled />
              </div>
            </div>

            <div class="inline-fields-row purple-group-view">
              <div>
                <label>Quantidade do Lote (Fixo PCP):</label>
                <input type="number" :value="planoQtdPecas" class="input-readonly-lock" disabled />
              </div>
              <div>
                <label>Tags dos Instrumentos Coordenados:</label>
                <input type="text" :value="instrumentosRastreados" class="input-readonly-lock" disabled />
              </div>
            </div>

            <div class="cotas-manager-section matrix-layout">
              <div class="cotas-manager-header">
                <h4>📋 Padrão de Cotas Cadastradas para o Desenho</h4>
                <div class="cotas-crud-actions">
                  <button class="btn-action-mini success" @click="adicionarCotaAoPlano">+ Add Cota</button>
                  <button class="btn-action-mini" @click="limparTodasCotas">Limpar Tudo</button>
                </div>
              </div>

              <div class="matrix-table-wrapper">
                <table class="matrix-table fixed-layout-table">
                  <thead>
                    <tr>
                      <th class="col-index">#</th>
                      <th class="col-nome-especificado">MEDIDA ESPECIFICADA</th>
                      <th class="col-limites-min">MÍN</th>
                      <th class="col-limites-max">MÁX</th>
                      <th v-for="pecaNum in planoQtdPecas" :key="pecaNum" class="col-peca-dinamica">
                        PEÇA {{ pecaNum }}
                      </th>
                      <th class="col-actions">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(cota, idx) in caracteristicas" :key="idx">
                      <td class="cell-index">
                        <span class="cota-index-tag">#{{ idx + 1 }}</span>
                      </td>
                      <td class="cell-nome-especificado">
                        <input type="text" v-model="cota.nome" placeholder="Ex: Ø 49,20" class="input-matrix-nome" />
                      </td>
                      <td class="cell-limites-min">
                        <input type="number" step="0.001" v-model.number="cota.min" placeholder="0.000" class="input-matrix-tol" />
                      </td>
                      <td class="cell-limites-max">
                        <input type="number" step="0.001" v-model.number="cota.max" placeholder="0.000" class="input-matrix-tol" />
                      </td>
                      <td v-for="pecaNum in planoQtdPecas" :key="pecaNum" class="cell-peca-dinamica locked-cell-state">
                        <input 
                          type="text" 
                          placeholder="Real" 
                          class="input-peca-medida-real transparent-input disabled-view field-flush-edge"
                          :value="cota.valoresPecas[pecaNum] || ''"
                          disabled
                        />
                      </td>
                      <td class="cell-actions">
                        <button class="btn-delete-cota-row" @click="removerCotaDoPlano(idx)">✕</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="footer-launch-panel-only">
              <button class="btn-green btn-launch-inspection tall-btn-start" :disabled="caracteristicas.length === 0" @click="planoConfigurado = true">
                🚀 CONFIAR CRITÉRIOS E IR PARA BANCO DE INSPEÇÃO
              </button>
            </div>

          </div>
        </div>

        <div class="plano-pdf-splitter" :style="{ width: pdfSplitterWidth + 'px' }">
          <div class="splitter-resize-bar">
            <span class="resize-label">◀ ARRASTE PARA REDIMENSIONAR TELA DIVIDIDA DO PDF ▶</span>
            <input type="range" min="350" max="950" v-model="pdfSplitterWidth" class="slider-splitter" />
          </div>

          <div class="pdf-zoom-controls" v-if="opLiberada">
            <button @click="ajustarZoom(0.15)" title="Aumentar Zoom">🔍 +</button>
            <button @click="ajustarZoom(-0.15)" title="Diminuir Zoom">🔍 -</button>
            <button @click="resetarInteratividade" title="Resetar Visualização">🔄</button>
          </div>

          <div 
            class="pdf-viewer-canvas" 
            @mousedown="iniciarArrasto" 
            @mousemove="executarArrasto" 
            @mouseup="finalizarArrasto"
            @mouseleave="finalizarArrasto"
            :class="{ 'dragging-active': estaArrastando }"
          >
            <div v-if="!opLiberada" class="pdf-placeholder-msg text-lock-bold">
              🔒 Visualização bloqueada. Valide uma OP válida para carregar o blueprint mecânico.
            </div>
            <div v-else class="pdf-mock-rendered animate-fade">
              <div class="pdf-page-header">📄 {{ planoDesenho }}_Rev{{ planoRevisao }}.pdf</div>
              <div class="pdf-graphic-blueprint-view">
                <div class="industrial-drawing-circle"></div>
                <div class="industrial-drawing-axis"></div>
                <div class="industrial-drawing-axis-v"></div>
                <div class="measurement-line-indicator top-cota">12,65 / 12,70</div>
                <div class="measurement-line-indicator center-cota">Ø 49,20 / 49,22</div>
                <div class="measurement-line-indicator bottom-cota">Ø 56,45 / 56,48</div>
              </div>
              <div class="pdf-page-footer">Página 1 de 3 — Escala 1:1</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="dynamic-system-content animate-fade space-padding">
      
      <section class="header text-upscale-200">
        <div>
          <div class="tab-navigation-header">
            <h1 class="tab-label-ativa massive-headline-title">RELATÓRIO DE INSPEÇÃO EM EXECUÇÃO</h1>
          </div>
            <small class="breadcrumb-txt massive-subtext">OP: <strong>{{ store.opAtiva.numero }}</strong> | Chave de Engenharia: <strong>{{ store.opAtiva.desenho }} (Rev. {{ store.opAtiva.revisao }})</strong></small>
        </div>

        <div class="header-right-controls">
          <button @click="alternarTema" class="btn-theme-toggle-top-massive">
            <span v-if="store.temaAtual === 'modo-escuro'">☀️ MODO CLARO</span>
            <span v-else>🌙 MODO ESCURO</span>
          </button>
          <span class="status-voice-badge massive-badge-text">Inspetor: <strong>{{ store.usuarioLogado.nome }}</strong> <span class="dot-green">●</span></span>
        </div>
      </section>

      <section class="card grid-info massive-grid-info">
        <div class="info-box-massive">
          <small>ORDEM DE PRODUÇÃO</small>
          <strong class="text-accent-massive">{{ store.opAtiva.numero }}</strong>
        </div>
        <div class="info-box-massive">
          <small>CLIENTE</small>
          <span class="truncated-text-massive">{{ store.opAtiva.cliente }}</span>
        </div>
        <div class="info-box-massive">
          <small>PC / ITEM Nº</small>
          <span>{{ store.opAtiva.pcItem }}</span>
        </div>
        <div class="info-box-massive">
          <small>LOTE TOTAL</small>
          <span>01</span>
        </div>
        <div class="info-box-massive">
          <small>QUANTIDADE PLANO</small>
          <span>{{ store.opAtiva.qtdPecas }} pçs</span>
        </div>
        <div class="info-box-massive">
          <small>PROCESSO ATUAL</small>
          <span class="badge-process-blue-massive">INSPEÇÃO</span>
        </div>
      </section>

      <section class="top-widgets-row layout-simetria-perfeita centered-yellow-belt">
        
        <div class="card spec-mid-block-active-panel layout-left-action-panel">
          <div class="header-internal-inline-panel">
            <div class="left-action-confirm-wrapper">
              <button class="btn-green btn-huge-confirm-industrial" @click="confirmarValor">✓ CONFIRMAR MEDIDA</button>
            </div>

            <div class="left-headline-info-active-cota" style="margin-left: 20px; flex: 1;">
              <small class="mini-label-gray">COTA ATIVA EXIGIDA</small>
              <div class="active-cota-headline">
                <span class="badge-number-blue-large">#{{ caracteristicaAtual }}</span>
                <strong class="val-blue-text-large">{{ caracteristicas[caracteristicaAtual - 1]?.nome || 'Cota não definida' }}</strong>
              </div>
              <div class="limits-horizontal-badges-large">
                <div class="limit-badge-pill-large">MÍN: <strong>{{ caracteristicas[caracteristicaAtual - 1]?.min.toFixed(3) }} mm</strong></div>
                <div class="limit-badge-pill-large">MÁX: <strong>{{ caracteristicas[caracteristicaAtual - 1]?.max.toFixed(3) }} mm</strong></div>
                <div class="limit-badge-pill-large highlight-pill-large">PEÇA: <span class="active-peca-badge-inline-large">{{ String(pecaAtual).padStart(3, '0') }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card dpad-control-center-card massive-dpad-box-200">
          <div class="dpad-container-giant-200">
            <button class="dpad-btn-giant-200 arrow-up" @click="moverFocoMatriz('cima')" title="Cota Anterior">▲</button>
            <div class="dpad-row-middle-giant-200">
              <button class="dpad-btn-giant-200 arrow-left" @click="moverFocoMatriz('esquerda')" title="Peça Anterior">◀</button>
              <div class="dpad-center-hub-giant-200">NÚCLEO</div>
              <button class="dpad-btn-giant-200 arrow-right" @click="moverFocoMatriz('direita')" title="Próxima Peça">▶</button>
            </div>
            <button class="dpad-btn-giant-200 arrow-down" @click="moverFocoMatriz('baixo')" title="Próxima Cota">▼</button>
          </div>
        </div>

        <div class="card dynamic-right-unified-panel-centered">
          
          <div class="blue-microphone-wrapper-box-circular-massive">
            <button class="btn-blue-circular-mic-massive" :class="{ 'mic-recording-active': gravandoVoz }" @click="iniciarVoz" title="Clique para Ditado por Voz">
              🎙️
            </button>
            <span class="mic-under-label-massive">VOZ ATIVA</span>
            <div v-if="ultimoValor !== null" class="mic-real-time-feedback-value">
              <strong>{{ formatarNumero(ultimoValor) }}</strong>
            </div>
          </div>

          <div class="graphic-box-mini pizza-chart-box upscale-150-chart-massive">
            <h3>ANÁLISE DE CONFORMIDADE</h3>
            <div class="canvas-holder grid-upscale-holder-150">
              <canvas id="graficoDonutOriginal" width="160" height="160"></canvas>
            </div>
            <span class="chart-legend-mini-text-massive">Lote: {{ planoQtdPecas }} Fatias</span>
          </div>

        </div>
      </section>

      <section class="full-width-matrix-area">
        <div class="card active-inspection-matrix-block fully-stretched-matrix">
          <h4>📋 Matriz de Preenchimento do Lote Activo</h4>
          <div class="matrix-table-wrapper scrollable-matrix-view">
            <table class="matrix-table fixed-layout-table">
              <thead>
                <tr>
                  <th class="col-index-200">#</th>
                  <th class="col-nome-especificado-200">MEDIDA FIXA</th>
                  <th class="col-limites-min-200">MÍN</th>
                  <th class="col-limites-max-200">MÁX</th>
                  <th v-for="pecaNum in planoQtdPecas" :key="pecaNum" class="col-peca-dinamica-200">
                    PEÇA {{ pecaNum }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cota, idx) in caracteristicas" :key="idx" :class="{ 'row-highlighted': caracteristicaAtual === idx + 1 }">
                  <td class="cell-index">
                    <span class="cota-index-tag-200">#{{ idx + 1 }}</span>
                  </td>
                  <td class="cell-nome-especificado font-bold-fixed text-truncate-fixed-200">{{ cota.nome }}</td>
                  <td class="cell-limites-min text-center-fixed-200">{{ cota.min.toFixed(3) }}</td>
                  <td class="cell-limites-max text-center-fixed-200">{{ cota.max.toFixed(3) }}</td>
                  
                  <td v-for="pecaNum in planoQtdPecas" :key="pecaNum" class="cell-peca-dinamica tight-cell-200" :class="{ 'active-collecting-cell': pecaAtual === pecaNum && caracteristicaAtual === idx + 1 }">
                    <input 
                      type="text" 
                      placeholder="Real" 
                      class="input-peca-medida-real-agigantado-200 transparent-input field-flush-edge"
                      :class="{ 'medida-rejeitada-alerta': verificarMedidaForaDeTolerancia(cota, cota.valoresPecas[pecaNum]) }"
                      v-model="cota.valoresPecas[pecaNum]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="card footer-actions-massive-block-expanded-100">
        <button class="btn-light-giant-full" @click="abrirAlerta('Anexos')">📎 ANEXOS OPERACIONAIS</button>
        <button class="btn-light-giant-full" @click="abrirAlerta('Desenho')">📄 VISUALIZAR DESENHO</button>
        <button class="btn-light-giant-full" @click="voltarParaEditarPlano" style="background: rgba(6, 79, 214, 0.08); font-weight: 900; color: #064fd6;">📋 PLANO DE INSPEÇÃO</button>
        <button class="btn-light-giant-full" @click="abrirRnc">❌ RNC / NÃO CONFORMIDADES</button>
        <button class="btn-green-giant-full" @click="$router.push('/finalizado')">✍️ SALVAR E BAIXAR RELATÓRIO DO LOTE</button>
        <button class="btn-red-giant-full" @click="cancelarInspeçao">✕ CANCELAR</button>
      </section>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store.js'

const router = useRouter()

const planoConfigurado = ref(false)
const opLiberada = ref(false)
const planoHistoricoRecuperado = ref(false)
const pdfSplitterWidth = ref(440)

const zoomAtual = ref(1.0)
const panX = ref(0)
const panY = ref(0)
const estaArrastando = ref(false)
let mouseStartX = 0
let mouseStartY = 0

const instrumentosRastreados = ref('P2470705 / M2030215 / P6030601 / C2660618')
const estrategiaColeta = ref('horizontal')
const opMsgValidacao = ref('')
const opStatusClasse = ref('')
const loginStatusMsg = ref('')
const inputUsuario = ref('')
const inputSenha = ref('')
const opDigitada = ref('')

function enrichCaracteristicasFromStore() {
  store.caracteristicas.forEach(item => {
    if (!item.valoresPecas) {
      item.valoresPecas = {}
    }
    item.min = parseFloat((item.valorNominal + item.toleranciaInf).toFixed(3))
    item.max = parseFloat((item.valorNominal + item.toleranciaSup).toFixed(3))
    item.nome = item.nome || item.cota
  })
}

const planoDesenho = computed(() => store.opAtiva.desenho || 'Aguardando OP...')
const planoRevisao = computed(() => store.opAtiva.revisao || '0')
const planoQtdPecas = computed(() => store.opAtiva.qtdPecas)
const usuarioLogado = computed(() => store.usuarioLogado.nome)
const operadorAtivo = computed(() => store.usuarioLogado.nome || '---')
const caracteristicas = computed({
  get: () => store.caracteristicas,
  set: (val) => { store.caracteristicas = val }
})

const pecaAtual = ref(1)
const caracteristicaAtual = ref(1)
const ultimoValor = ref(null)
const confiancaVoz = ref(98)
const gravandoVoz = ref(false)
const alertaMsg = ref('')
const alertaClasse = ref('')
const medicoes = ref([])

const totalOk = computed(() => {
  let pecasAprovadas = 0
  for (let p = 1; p <= planoQtdPecas.value; p++) {
    let pecaOk = true; let temMedida = false
    caracteristicas.value.forEach(cota => {
      const valStr = cota.valoresPecas[p]
      if (valStr) { temMedida = true; if (verificarMedidaForaDeTolerancia(cota, valStr)) pecaOk = false }
      else { pecaOk = false }
    })
    if (pecaOk && temMedida) pecasAprovadas++
  }
  return pecasAprovadas
})

const totalReprovado = computed(() => {
  let pecasRejeitadas = 0
  for (let p = 1; p <= planoQtdPecas.value; p++) {
    let pecaRejeitada = false
    caracteristicas.value.forEach(cota => {
      const valStr = cota.valoresPecas[p]
      if (valStr && verificarMedidaForaDeTolerancia(cota, valStr)) pecaRejeitada = true
    })
    if (pecaRejeitada) pecasRejeitadas++
  }
  return pecasRejeitadas
})

const verificarMedidaForaDeTolerancia = (cota, valorRealString) => {
  if (!valorRealString) return false
  const valorNumerico = parseFloat(valorRealString.replace(',', '.'))
  if (isNaN(valorNumerico)) return false
  return valorNumerico < cota.min || valorNumerico > cota.max
}

const moverFocoMatriz = (direcao) => {
  if (direcao === 'cima' && caracteristicaAtual.value > 1) {
    caracteristicaAtual.value--
  } else if (direcao === 'baixo' && caracteristicaAtual.value < caracteristicas.value.length) {
    caracteristicaAtual.value++
  } else if (direcao === 'esquerda' && pecaAtual.value > 1) {
    pecaAtual.value--
  } else if (direcao === 'direita' && pecaAtual.value < planoQtdPecas.value) {
    pecaAtual.value++
  }
  ultimoValor.value = null; alertaMsg.value = ''
}

const ajustarZoom = (fator) => { zoomAtual.value = Math.max(0.4, Math.min(3.0, zoomAtual.value + fator)) }
const resetarInteratividade = () => { zoomAtual.value = 1.0; panX.value = 0; panY.value = 0 }

const iniciarArrasto = (e) => {
  if (!opLiberada.value) return
  estaArrastando.value = true; mouseStartX = e.clientX - panX.value; mouseStartY = e.clientY - panY.value
}
const executarArrasto = (e) => {
  if (!estaArrastando.value) return
  panX.value = e.clientX - mouseStartX; panY.value = e.clientY - mouseStartY
}
const finalizarArrasto = () => { estaArrastando.value = false }

const login = () => {
  if (inputUsuario.value.trim() === 'RAFAEL_PEDRICO' && inputSenha.value.trim() === '12345') {
    store.usuarioLogado.nome = 'RAFAEL_PEDRICO'
    store.usuarioLogado.perfil = 'Inspetor'
    store.usuarioLogado.nivel = 1
    loginStatusMsg.value = ''
  } else {
    loginStatusMsg.value = 'Usuário ou senha incorretos.'
  }
}

const voltarAoDashboard = () => {
  router.push('/')
}

const logout = () => {
  store.usuarioLogado.nome = ''
  store.usuarioLogado.perfil = ''
  store.usuarioLogado.nivel = ''
  store.opAtiva.numero = ''
  store.opAtiva.cliente = ''
  store.opAtiva.pcItem = ''
  store.opAtiva.desenho = ''
  store.opAtiva.revisao = ''
  store.opAtiva.qtdPecas = 0
  store.caracteristicas = []
  planoConfigurado.value = false; opLiberada.value = false
  opDigitada.value = ''; opMsgValidacao.value = ''; medicoes.value = []; resetarInteratividade()
}

const validarOrdemProduçao = () => {
  if (opDigitada.value.trim() !== '') {
    opLiberada.value = true; opMsgValidacao.value = '✓ ORDEM DE PRODUÇÃO AUTORIZADA E SINCRONIZADA PELO PCP'; opStatusClasse.value = 'op-sucesso'
    buscarPlanoPorDesenhoERevisao()
  } else {
    opLiberada.value = false; opMsgValidacao.value = 'INSPEÇÃO REJEITADA: DIGITE UMA ORDEM ATIVA'; opStatusClasse.value = 'op-erro'
  }
}

const buscarPlanoPorDesenhoERevisao = () => {
  enrichCaracteristicasFromStore()
  store.caracteristicas.forEach(item => {
    if (!item.valoresPecas) {
      item.valoresPecas = {}
    }
  })
  planoHistoricoRecuperado.value = true
}

const adicionarCotaAoPlano = () => {
  store.caracteristicas.push({ id: Date.now(), cota: 'Nova Cota Exigida', nome: 'Nova Cota Exigida', valorNominal: 0, toleranciaSup: 0, toleranciaInf: 0, min: 0.0, max: 0.0, medicao: null, valoresPecas: {} })
}
const removerCotaDoPlano = (index) => { store.caracteristicas.splice(index, 1) }
const limparTodasCotas = () => { store.caracteristicas = [] }

const voltarParaEditarPlano = () => {
  planoConfigurado.value = false
}

const confirmarValor = () => {
  if (ultimoValor.value === null) return
  const originalCota = caracteristicas.value[caracteristicaAtual.value - 1]
  if (!originalCota) return
  
  originalCota.valoresPecas[pecaAtual.value] = ultimoValor.value.toFixed(3).replace('.', ',')
  const status = ultimoValor.value >= originalCota.min && ultimoValor.value <= originalCota.max ? 'OK' : 'REPR.'
  medicoes.value.unshift({ peca: String(pecaAtual.value).padStart(3, '0'), caracteristica: originalCota.nome, valor: formatarNumero(ultimoValor.value), status })
  if (status === 'REPR.') {
    store.rncPendente = {
      op: store.opAtiva.numero,
      cota: originalCota.nome,
      valor: ultimoValor.value,
      peca: pecaAtual.value,
      min: originalCota.min,
      max: originalCota.max
    }
  }
  proximaMedicao()
}

const proximaMedicao = () => {
  ultimoValor.value = null; alertaMsg.value = ''
  if (estrategiaColeta.value === 'horizontal') {
    pecaAtual.value++
    if (pecaAtual.value > planoQtdPecas.value) { pecaAtual.value = 1; caracteristicaAtual.value++ }
  } else {
    caracteristicaAtual.value++
    if (caracteristicaAtual.value > caracteristicas.value.length) { caracteristicaAtual.value = 1; pecaAtual.value++ }
  }
  if (pecaAtual.value > planoQtdPecas.value) pecaAtual.value = planoQtdPecas.value
  if (caracteristicaAtual.value > caracteristicas.value.length) { alert('Lote concluído!'); caracteristicaAtual.value = caracteristicas.value.length }
}

const pecaAnterior = () => { if (pecaAtual.value > 1) pecaAtual.value-- }
const proximaPeca = () => { if (pecaAtual.value < planoQtdPecas.value) pecaAtual.value++ }

const digitarManual = () => {
  const valor = prompt('Digite a medida real coletada:')
  if (!valor) return
  const num = parseFloat(valor.replace(',', '.'))
  if (!isNaN(num)) { 
    ultimoValor.value = num; validarLimitesTolerancia(num)
    const originalCota = store.caracteristicas[caracteristicaAtual.value - 1]
    if (originalCota) { originalCota.valoresPecas[pecaAtual.value] = num.toFixed(3).replace('.', ',') }
  }
}

const iniciarVoz = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return alert('Reconhecimento de voz não suportado.')
  const recognition = new SpeechRecognition(); recognition.lang = 'pt-BR'; gravandoVoz.value = true; recognition.start()
  recognition.onresult = (event) => {
    gravandoVoz.value = false; const texto = event.results[0][0].transcript.toLowerCase()
    const valor = filtrarTextoParaNumero(texto)
    if (valor !== null) { 
      ultimoValor.value = valor; validarLimitesTolerancia(valor)
      const originalCota = store.caracteristicas[caracteristicaAtual.value - 1]
      if (originalCota) { originalCota.valoresPecas[pecaAtual.value] = valor.toFixed(3).replace('.', ',') }
    }
  }
  recognition.onerror = () => { gravandoVoz.value = false }
}

const filtrarTextoParaNumero = (texto) => { texto = texto.replace('vírgula', '.').replace('ponto', '.').replace(',', '.'); const match = texto.match(/\d+(\.\d+)?/); return match ? parseFloat(match[0]) : null }
const validarLimitesTolerancia = (valor) => { const currentCota = caracteristicas.value[caracteristicaAtual.value - 1]; if (!currentCota) return; if (valor >= currentCota.min && valor <= currentCota.max) { alertaMsg.value = '✓ Dentro dos limites.'; alertaClasse.value = 'alerta-ok' } else { alertaMsg.value = '⚠️ Fora de tolerância!'; alertaClasse.value = 'alerta-erro' } }
const formatarNumero = (val) => val.toFixed(3).replace('.', ',')
const alternarTema = () => { store.temaAtual = store.temaAtual === 'modo-claro' ? 'modo-escuro' : 'modo-claro' }
const abrirAlerta = (msg) => alert(`Módulo: ${msg}`)
const cancelarInspecao = () => { if (confirm('Deseja cancelar?')) logout() }

const abrirRnc = () => {
  router.push('/rnc')
}

const desenharDonutGrafico = () => {
  const canvas = document.getElementById('graficoDonutOriginal')
  if (!canvas) return
  const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, 160, 160)
  const totalPecas = planoQtdPecas.value
  const sliceAngle = (2 * Math.PI) / totalPecas
  
  for (let p = 1; p <= totalPecas; p++) {
    let pecaOk = true; let temMedida = false
    caracteristicas.value.forEach(cota => {
      const valStr = cota.valoresPecas[p]
      if (valStr) { temMedida = true; if (verificarMedidaForaDeTolerancia(cota, valStr)) pecaOk = false }
      else { pecaOk = false }
    })
    
    const startAngle = (p - 1) * sliceAngle - Math.PI / 2
    const endAngle = p * sliceAngle - Math.PI / 2
    
    ctx.beginPath(); ctx.moveTo(80, 80); ctx.arc(80, 80, 76, startAngle, endAngle)
    if (temMedida && pecaOk) { ctx.fillStyle = '#16a34a' }
    else if (temMedida && !pecaOk) { ctx.fillStyle = '#dc2626' }
    else { ctx.fillStyle = '#e2e8f0' }
    ctx.fill(); ctx.lineWidth = 0.5; ctx.strokeStyle = store.temaAtual === 'modo-escuro' ? '#161f30' : '#ffffff'; ctx.stroke()
  }
  ctx.beginPath(); ctx.arc(80, 80, 48, 0, Math.PI * 2); ctx.fillStyle = store.temaAtual === 'modo-escuro' ? '#161f30' : '#ffffff'; ctx.fill()
}

watch([() => store.caracteristicas, () => store.temaAtual, planoConfigurado], () => { if (planoConfigurado.value) setTimeout(desenharDonutGrafico, 40) }, { deep: true })
</script>

<style scoped>
.modo-claro {
  --bg-body: #f6f9fd; --bg-card: #ffffff; --borda-color: #dbe5f2; --texto-main: #061a44; --bg-input: #ffffff;
  --bg-header: #ffffff; --text-muted: #64748b; --bg-matrix-header: rgba(6, 79, 214, 0.04);
  --voice-box-bg: #f4f7ff; --voice-box-border: #cbdcff; --voice-box-text: #061a44;
}
.modo-escuro {
  --bg-body: #0b0f19; --bg-card: #161f30; --borda-color: #24324a; --texto-main: #f8fafc; --bg-input: #0f172a;
  --bg-header: #111827; --text-muted: #94a3b8; --bg-matrix-header: rgba(6, 79, 214, 0.15);
  --voice-box-bg: #1e293b; --voice-box-border: #334155; --voice-box-text: #f8fafc;
}

.app {
  display: flex; flex-direction: column; min-height: 100vh; max-height: 100vh; overflow: hidden; background-color: var(--bg-body); color: var(--texto-main); font-family: Arial, sans-serif; transition: all 0.25s;
}
.card { background: var(--bg-card); border: 1px solid var(--borda-color); border-radius: 16px; }

.fields-disabled-lock-state { opacity: 0.12 !important; filter: blur(2px); pointer-events: none !important; user-select: none; }
.purple-group-view input.input-readonly-lock { background: rgba(147, 51, 234, 0.04) !important; border-color: rgba(147, 51, 234, 0.2) !important; color: var(--texto-main) !important; font-weight: 800; cursor: not-allowed; }

.full-screen-login-gate { position: fixed; inset: 0; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.login-card-central { background: white; border: 1px solid #cbd5e1; border-radius: 20px; padding: 40px; width: 440px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); text-align: left; color: #061a44; }
.logo { font-size: 42px; font-weight: 900; color: #064fd6; letter-spacing: -2px; text-align: center; }
.sublogo { letter-spacing: 5px; font-weight: 700; margin-bottom: 30px; text-align: center; font-size: 12px; color: #64748b; }

button { border: 0; border-radius: 10px; padding: 14px 18px; cursor: pointer; font-weight: 800; }
.btn-primary { background: #064fd6; color: white; width: 100%; margin-top: 14px; font-size: 14px; }
.btn-green { background: #16a34a; color: white; }
.btn-red { background: #dc2626; color: white; }
.btn-yellow { background: #eab308; color: #0f172a; font-weight: 900; }
.btn-light { background: var(--bg-card); border: 1px solid var(--borda-color); color: var(--texto-main); }
.btn-theme-toggle-top-plano { background: rgba(6, 79, 214, 0.1); color: #064fd6; border: 1px solid rgba(6, 79, 214, 0.2); font-weight: 800; font-size: 12px; border-radius: 6px; padding: 8px 14px; }

/* CONFIG ESTÁGIO 2 */
.full-viewport-plano { display: flex; flex-direction: column; width: 100vw; height: 100vh; overflow: hidden; background-color: var(--bg-body); }
.plano-top-bar { height: 60px; background: var(--bg-header); border-bottom: 1px solid var(--borda-color); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; flex-shrink: 0; }
.user-pill-top { background: rgba(0,0,0,0.04); color: var(--texto-main); padding: 8px 16px; border-radius: 30px; font-size: 14px; font-weight: 700; }
.plano-workspace-grid { display: flex; flex: 1; height: calc(100vh - 60px); overflow: hidden; }
.plano-config-panel { flex: 1; padding: 16px; overflow-y: auto; text-align: left; display: flex; flex-direction: column; gap: 10px; height: 100%; }
.search-row { display: flex; gap: 10px; margin-top: 4px; }
.search-row input { margin: 0; flex: 1; padding: 10px; border-radius: 6px; border: 1px solid var(--borda-color); background: var(--bg-input); color: var(--texto-main); font-weight: 900; font-size: 14px; }
.inline-fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.inline-fields-row input { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--borda-color); background: var(--bg-input); color: var(--texto-main); }
.inline-fields-row label { font-size: 11px; font-weight: 700; display: block; margin-bottom: 2px; color: var(--texto-main); }

.cotas-manager-section.matrix-layout { border: 1px solid var(--borda-color); background: var(--bg-card); border-radius: 12px; padding: 12px; flex: 1; display: flex; flex-direction: column; min-height: 180px; }
.matrix-table-wrapper { flex: 1; overflow-x: auto; overflow-y: auto; border: 1px solid var(--borda-color); border-radius: 8px; }
.matrix-table { width: 100%; border-collapse: collapse; text-align: left; }

.fixed-layout-table { table-layout: fixed !important; width: max-content !important; }
.matrix-table th { background: var(--bg-matrix-header); color: var(--texto-main); font-size: 11px; font-weight: 800; padding: 14px 10px; border-bottom: 2px solid var(--borda-color); white-space: nowrap; }

/* ⚡ REQUISITO 1: CABEÇALHOS GERAIS DE CONFORMIDADE DA MATRIX REDIMENSIONADOS */
.col-index-200 { width: 45px !important; min-width: 45px !important; max-width: 45px !important; text-align: center; }
.col-nome-especificado-200 { width: 185px !important; min-width: 185px !important; max-width: 185px !important; } 
.col-limites-min-200, .col-limites-max-200 { width: 85px !important; min-width: 85px !important; max-width: 85px !important; text-align: center; } 
.col-peca-dinamica-200 { width: 165px !important; min-width: 165px !important; max-width: 165px !important; text-align: center; background: rgba(0,0,0,0.005); border-left: 1px solid var(--borda-color); }

.matrix-table td { border-bottom: 1px solid var(--borda-color); vertical-align: middle; background-color: var(--bg-card); color: var(--texto-main); box-sizing: border-box; }
.cota-index-tag-200 { font-size: 14px; font-weight: 900; background: rgba(0,0,0,0.04); color: var(--texto-main); padding: 5px 6px; border-radius: 4px; }

.input-matrix-nome { width: 100%; padding: 10px; font-size: 12px; font-weight: 700; border: 1px solid var(--borda-color); border-radius: 6px; background: var(--bg-input); color: var(--texto-main); box-sizing: border-box; }
.input-matrix-tol { width: 100%; padding: 10px 4px; font-size: 11px; border: 1px solid var(--borda-color); border-radius: 6px; text-align: center; background: var(--bg-input); color: var(--texto-main); box-sizing: border-box; }

/* ⚡ REQUISITO 4: CAMPOS DE PREENCHIMENTO E LETRAS INTERNAS AMPLIADOS EM 200% COM TRAVAMENTO ABSOLUTO */
.matrix-table tbody td {
  padding: 24px 10px !important; 
}
.input-peca-medida-real-agigantado-200 { 
  width: 145px !important; /* Largura ideal esticada */
  min-width: 145px !important;
  max-width: 145px !important;
  height: 64px !important;  /* Altura mecânica dobrada (200%) */
  padding: 6px; 
  font-size: 26px !important; /* Números gigantescos em 200% para evitar fadiga visual */
  font-weight: 900; 
  border: 2px solid var(--borda-color); 
  border-radius: 10px; 
  text-align: center; 
}
.transparent-input { background: transparent !important; color: var(--texto-main) !important; }
.field-flush-edge { box-sizing: border-box; margin: 0 auto; display: block; }
.tight-cell-200 { padding: 8px 6px !important; }
.text-truncate-fixed-200 { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 16px; }
.text-center-fixed-200 { text-align: center; font-size: 16px; color: var(--text-muted); font-family: monospace; font-weight: 700; }

.medida-rejeitada-alerta { color: #dc2626 !important; font-weight: 900 !important; border-color: #ef4444 !important; background: rgba(220, 38, 38, 0.05) !important; }
.disabled-view { color: rgba(0,0,0,0.2) !important; border-style: dashed !important; cursor: not-allowed; opacity: 0.4; }

.unlocked-factory-state:focus { border-color: #064fd6 !important; background: var(--bg-input) !important; outline: none; }
.font-bold-fixed { font-weight: 800; font-size: 14px; color: var(--texto-main); }
.row-highlighted td { background-color: rgba(6, 79, 214, 0.03) !important; }
.active-collecting-cell { background-color: rgba(6, 79, 214, 0.02) !important; }
.active-collecting-cell input { border: 3px solid #064fd6 !important; background: var(--bg-input) !important; box-shadow: 0 0 14px rgba(6, 79, 214, 0.35); }

/* VISUAL DA INTERFACE EM INSPEÇÃO */
.space-padding { 
  padding: 16px; display: flex; flex-direction: column; gap: 12px; background-color: var(--bg-body); height: 100vh; max-height: 100vh; box-sizing: border-box; overflow: hidden; 
}

/* ⚡ REQUISITO 1: TEXTOS OPERACIONAIS E TITULOS AMPLIADOS EM 200% (Circulo Vermelho Superior) */
.massive-headline-title { font-size: 34px !important; font-weight: 900; letter-spacing: -1px; }
.massive-subtext { font-size: 16px !important; font-weight: 700; color: var(--text-muted); }
.btn-theme-toggle-top-massive { padding: 10px 20px; font-size: 13px; font-weight: 800; border-radius: 8px; background: rgba(0,0,0,0.03); color: var(--texto-main); }
.massive-badge-text { padding: 10px 20px; font-size: 16px !important; font-weight: 800; background: rgba(6, 79, 214, 0.05); border-radius: 8px; color: #064fd6; }

/* ⚡ REQUISITO 1: CARD DE INFORMAÇÕES GERAIS AMPLIADO EM 200% (Circulo Vermelho Médio) */
.massive-grid-info { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; padding: 16px !important; flex-shrink: 0; }
.info-box-massive { border-right: 1px solid var(--borda-color); padding: 4px 12px; text-align: left; }
.info-box-massive:last-child { border-right: none; }
.info-box-massive small { display: block; color: var(--text-muted); font-weight: 800; font-size: 12px; margin-bottom: 4px; letter-spacing: 0.5px; }
.info-box-massive span { font-size: 18px !important; font-weight: 900; color: var(--texto-main); }
.text-accent-massive { font-size: 22px !important; font-weight: 900; color: #064fd6; }
.truncated-text-massive { font-size: 16px !important; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.badge-process-blue-massive { background: #064fd6; color: white; padding: 4px 10px; border-radius: 6px; font-size: 14px !important; font-weight: 900; }

/* 🟡 REQUISITO 3: TRILHA DE DESTAQUE TOTALMENTE CENTRALIZADA COM GRID EQUILIBRADO */
.top-widgets-row.layout-simetria-perfeita.centered-yellow-belt {
  display: grid;
  grid-template-columns: 1fr 240px 1.5fr; /* Abertura precisa para acomodar o D-Pad ampliado */
  gap: 16px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}

.spec-mid-block-active-panel.layout-left-action-panel {
  background: var(--bg-card); border: 1px solid var(--borda-color); border-radius: 16px; padding: 14px; height: 145px; display: flex; align-items: center;
}
.header-internal-inline-panel { display: flex; align-items: center; justify-content: flex-start; width: 100%; }
.left-action-confirm-wrapper { flex-shrink: 0; }
.btn-huge-confirm-industrial {
  height: 76px !important; padding: 0 24px !important; font-size: 15px !important; font-weight: 900 !important; border-radius: 12px !important;
  background: #16a34a; color: white; box-shadow: 0 4px 16px rgba(22, 163, 74, 0.35); transition: all 0.2s;
}
.btn-huge-confirm-industrial:hover { background: #15803d; transform: translateY(-1px); }

.mini-label-gray { font-size: 11px; font-weight: 800; color: var(--text-muted); }
.badge-number-blue-large { background: rgba(6, 79, 214, 0.1); color: #064fd6; padding: 4px 10px; border-radius: 6px; font-weight: 900; font-size: 16px; }
.val-blue-text-large { font-size: 24px; font-weight: 900; color: var(--texto-main); }
.limits-horizontal-badges-large { display: flex; gap: 8px; margin-top: 4px; }
.limit-badge-pill-large { background: var(--bg-body); border: 1px solid var(--borda-color); padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; color: var(--texto-main); }
.limit-badge-pill-large strong { color: #064fd6; font-family: monospace; font-size: 13px; }
.highlight-pill-large { border-color: #064fd6; background: rgba(6, 79, 214, 0.02); }
.active-peca-badge-inline-large { font-weight: 900; color: #064fd6; font-size: 14px; font-family: monospace; }

/* 🕹️ REQUISITO 1: TECLADO DIRECIONAL RE-AMPLIADO EM 200% (MASSIVO) */
.dpad-control-center-card.massive-dpad-box-200 {
  display: flex; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--borda-color); padding: 8px; height: 145px; box-sizing: border-box;
}
.dpad-container-giant-200 {
  display: flex; flex-direction: column; align-items: center;
  width: 220px; /* ⚡ Largura esticada em 200% */
}
.dpad-row-middle-giant-200 { display: flex; align-items: center; justify-content: space-between; width: 100%; margin: 3px 0; }
.dpad-btn-giant-200 {
  width: 68px; /* ⚡ Tamanho massivo de botão duplo para toque robusto */
  height: 52px;
  padding: 0; background: #1e293b; color: #ffffff; border: 2px solid #475569; border-radius: 12px; font-size: 20px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.35); transition: all 0.08s ease;
}
.dpad-btn-giant-200:active { background: #064fd6; transform: scale(0.92); }
.modo-claro .dpad-btn-giant-200 { background: #f1f5f9; color: #1e293b; border-color: #cbd5e1; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.modo-claro .dpad-btn-giant-200:active { background: #064fd6; color: white; }
.dpad-center-hub-giant-200 { font-size: 11px; font-weight: 900; color: var(--text-muted); letter-spacing: 0.5px; text-align: center; width: 60px; }

/* 🔄 CONFIGURAÇÃO DA DIREITA: PAINEL UNIFICADO */
.dynamic-right-unified-panel-centered {
  display: grid;
  grid-template-columns: 120px 1fr; 
  gap: 14px; background: var(--bg-card); border: 1px solid var(--borda-color); border-radius: 16px; padding: 10px 16px; align-items: center; height: 145px; box-sizing: border-box;
}

/* 🎙️ REQUISITO 3: BOTÃO DE MICROFONE CIRCULAR PURO AGIGANTADO EM 300% ANCORADO */
.blue-microphone-wrapper-box-circular-massive {
  display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;
}
.btn-blue-circular-mic-massive {
  width: 76px; /* ⚡ Diâmetro massivo expandido em 300% em relação ao formato padrão */
  height: 76px;
  background: #064fd6; color: white; border: none; border-radius: 50%; font-size: 32px; /* Ícone interno imponente */
  display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(6, 79, 214, 0.35); transition: all 0.15s;
}
.btn-blue-circular-mic-massive:hover { background: #0043c2; transform: scale(1.04); }
.btn-blue-circular-mic-massive.mic-recording-active { background: #dc2626 !important; box-shadow: 0 6px 24px rgba(220, 38, 38, 0.45); }
.mic-under-label-massive { margin-top: 6px; font-size: 10px; font-weight: 900; color: var(--text-muted); letter-spacing: 0.5px; }
.mic-real-time-feedback-value { position: absolute; bottom: -20px; font-size: 12px; font-weight: 900; color: #16a34a; font-family: monospace; }

/* 📊 REQUISITO 2: GRÁFICO DE PIZZA AMPLIFICADO EM 150% DO TAMANHO ORIGINAL */
.graphic-box-mini.pizza-chart-box.upscale-150-chart-massive {
  border-left: 1px solid var(--borda-color); padding: 0 0 0 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%;
}
.graphic-box-mini.pizza-chart-box.upscale-150-chart-massive h3 { font-size: 9px; font-weight: 900; color: var(--text-muted); margin: 0 0 4px 0; text-align: center; }
.canvas-holder.grid-upscale-holder-150 {
  display: flex; justify-content: center; align-items: center;
  width: 115px; 
  height: 115px; /* ⚡ Carga dimensional re-calibrada em 150% estável */
}
.chart-legend-mini-text-massive { font-size: 9px; color: var(--text-muted); font-weight: 700; margin-top: 4px; }

/* ÁREA DA MATRIZ MATRICIAL DE FLUXO GLOBAL */
.Layout-com-voz-lateral { display: flex; flex-direction: column; gap: 14px; flex: 1; overflow: hidden; height: calc(100vh - 340px); }
.full-width-matrix-area { width: 100%; flex: 1; overflow: hidden; display: flex; }
.active-inspection-matrix-block { background: var(--bg-card); border: 1px solid var(--borda-color); border-radius: 16px; padding: 12px; flex: 1; display: flex; flex-direction: column; overflow: hidden; width: 100%; }
.active-inspection-matrix-block h4 { margin: 0 0 6px 0; text-align: left; font-size: 12px; font-weight: 800; color: var(--text-muted); }

.scrollable-matrix-view {
  flex: 1; max-height: calc(100vh - 460px) !important; overflow-y: auto !important; overflow-x: auto !important; border: 1px solid var(--borda-color); border-radius: 8px; box-sizing: border-box; width: 100%;
}
.scrollable-matrix-view::-webkit-scrollbar { width: 10px; height: 10px; }
.scrollable-matrix-view::-webkit-scrollbar-track { background: var(--bg-body); }
.scrollable-matrix-view::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; border: 2px solid var(--bg-body); }

/* ⚡ REQUISITO 4: BOTÕES INFERIORES EXPANDIDOS PARA COBRIR TODO O ESPAÇO DA BASE */
.footer-actions-massive-block-expanded-100 {
  background: var(--bg-card); border: 1px solid var(--borda-color); border-radius: 16px; 
  padding: 16px 20px; /* Expansão física de encaixe */
  flex-shrink: 0; margin-top: auto; 
  display: grid; 
  grid-template-columns: 1fr 1fr 1.3fr 1.3fr 1.8fr 1fr; /* Blocado em 100% de largura */
  gap: 16px; width: 100%; box-sizing: border-box;
}
.footer-actions-massive-block-expanded-100 button {
  width: 100%;
  height: 56px; /* Botões agigantados e imponentes */
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-light-giant-full { background: var(--bg-body); color: var(--texto-main); border: 1px solid var(--borda-color) !important; }
.btn-light-giant-full:hover { background: rgba(0,0,0,0.04); }
.btn-green-giant-full { background: #16a34a; color: white; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25); }
.btn-green-giant-full:hover { background: #15803d; }
.btn-red-giant-full { background: #dc2626; color: white; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25); }
.btn-red-giant-full:hover { background: #b91c1c; }

.alerta { padding: 4px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center; }
.alerta-ok { background: #dcfce7; color: #166534; }
.alerta-erro { background: #fee2e2; color: #991b1b; }

.animate-fade { animation: fIn 0.2s ease; }
@keyframes fIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
</style>