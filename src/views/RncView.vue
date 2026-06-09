<template>
  <div class="rnc-page">
    <header class="top-header">
      <div class="brand">
        <div class="logo">INTEL<span>LINK</span></div>
        <small>SISTEMA DE GESTÃO INDUSTRIAL</small>
      </div>

      <div class="center-brand">UsiNar</div>

      <div class="user-area">
        <div class="notification">🔔<span>3</span></div>
        <div class="avatar">RP</div>
        <div>
          <strong>{{ usuarioAtual.nome }}</strong>
          <small>{{ usuarioAtual.perfil }}</small>
        </div>
        <button class="btn-logout" @click="logoutRestrito">⌄</button>
      </div>
    </header>

    <section class="page-title-row">
      <div>
        <h1>RNC / NÃO CONFORMIDADE <span>NOVA</span></h1>
        <p>Qualidade › RNC / Não Conformidades › Nova RNC</p>
      </div>

      <div class="top-actions">
        <button class="btn-outline" @click="salvarRascunho">Salvar Rascunho</button>
        <button class="btn-outline-danger" @click="cancelarRnc">Cancelar</button>
        <button class="btn-primary" @click="registrarRnc">Registrar RNC</button>
      </div>
    </section>

    <main class="layout">
      <section class="left-column">
        <div class="card">
          <h2>INFORMAÇÕES GERAIS</h2>

          <div class="grid-info">
            <div class="field locked">
              <label>Nº DA RNC</label>
              <input v-model="rnc.numero" disabled />
            </div>

            <div class="field locked">
              <label>DATA / HORA</label>
              <input v-model="rnc.dataHora" disabled />
            </div>

            <div class="field locked">
              <label>RESPONSÁVEL (ABERTURA)</label>
              <input v-model="rnc.responsavelAbertura" disabled />
            </div>

            <div class="field">
              <label>SETOR</label>
              <input v-model="rnc.setor" disabled />
            </div>

            <div class="field status">
              <label>STATUS</label>
              <input v-model="rnc.status" disabled />
            </div>

            <div class="field">
              <label>ORDEM DE PRODUÇÃO</label>
              <input v-model="rnc.op" disabled />
            </div>

            <div class="field locked">
              <label>PC / ITEM Nº</label>
              <input v-model="rnc.pcItem" disabled />
            </div>

            <div class="field">
              <label>PEÇA / LOTE</label>
              <input v-model="rnc.pecaLote" disabled />
            </div>

            <div class="field">
              <label>INSTRUMENTO UTILIZADO</label>
              <input v-model="rnc.instrumento" disabled />
            </div>

            <div class="field">
              <label>PROCESSO</label>
              <input v-model="rnc.processo" disabled />
            </div>

            <div class="field locked">
              <label>MÁQUINA / LOCAL</label>
              <input v-model="rnc.maquinaLocal" disabled />
            </div>
          </div>
        </div>

        <div class="card" :class="{ 'disabled-lock-state': usuarioAtual.nivel !== 1 }">
          <h2>1. DESCRIÇÃO DA NÃO CONFORMIDADE</h2>

          <div class="field textarea-field">
            <label>Descrição detalhada</label>
            <textarea v-model="rnc.descricao" maxlength="1000" :disabled="usuarioAtual.nivel !== 1"></textarea>
            <small>{{ rnc.descricao.length }}/1000</small>
          </div>
        </div>

        <div class="card" :class="{ 'disabled-lock-state': usuarioAtual.nivel !== 2 }">
          <div class="section-header">
            <h2>2. CLASSIFICAÇÃO (NÍVEL 2 - QUALIDADE)</h2>

            <button class="restricted-btn" @click="abrirModalLoginQualidade">
              🔒 ÁREA RESTRITA OPERACIONAL
            </button>
          </div>

          <div class="grid-classificacao">
            <div class="field locked">
              <label>TIPO DE NÃO CONFORMIDADE</label>
              <input v-model="rnc.tipo" :disabled="usuarioAtual.nivel !== 2" />
            </div>

            <div class="field locked">
              <label>SEVERIDADE</label>
              <select v-model="rnc.severidade" :disabled="usuarioAtual.nivel !== 2">
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
              </select>
            </div>

            <div class="field locked">
              <label>ORIGEM PROVÁVEL</label>
              <input v-model="rnc.origemProvavel" :disabled="usuarioAtual.nivel !== 2" />
            </div>

            <div class="field locked">
              <label>DETECÇÃO</label>
              <input v-model="rnc.deteccao" :disabled="usuarioAtual.nivel !== 2" />
            </div>

            <div class="field locked wide">
              <label>CAUSA PROVÁVEL</label>
              <textarea v-model="rnc.causaProvavel" maxlength="500" :disabled="usuarioAtual.nivel !== 2"></textarea>
              <small>{{ rnc.causaProvavel.length }}/500</small>
            </div>

            <div class="field locked wide">
              <label>AÇÃO IMEDIATA</label>
              <textarea v-model="rnc.acaoImediata" maxlength="500" :disabled="usuarioAtual.nivel !== 2"></textarea>
              <small>{{ rnc.acaoImediata.length }}/500</small>
            </div>
          </div>
        </div>

        <div class="card" :class="{ 'disabled-lock-state': usuarioAtual.nivel !== 2 && usuarioAtual.nivel !== 3 }">
          <h2>3. ANÁLISE E TRATAMENTO</h2>
          <p class="locked-note">
            🔒 Campos editáveis somente por perfis autorizados de acordo com a etapa do fluxo.
          </p>

          <div class="grid-tratamento">
            <div class="field locked">
              <label>AÇÃO CORRETIVA</label>
              <textarea v-model="rnc.acaoCorretiva" maxlength="500" :disabled="usuarioAtual.nivel !== 2"></textarea>
              <small>{{ rnc.acaoCorretiva.length }}/500</small>
            </div>

            <div class="field locked">
              <label>AÇÃO PREVENTIVA</label>
              <textarea v-model="rnc.acaoPreventiva" maxlength="500" :disabled="usuarioAtual.nivel !== 2"></textarea>
              <small>{{ rnc.acaoPreventiva.length }}/500</small>
            </div>

            <div class="field locked">
              <label>RESPONSÁVEL PELA AÇÃO</label>
              <input v-model="rnc.responsavelAcao" :disabled="usuarioAtual.nivel !== 2" />
            </div>

            <div class="field locked">
              <label>PRAZO</label>
              <input type="date" v-model="rnc.prazo" :disabled="usuarioAtual.nivel !== 2" />
            </div>
          </div>
        </div>
      </section>

      <aside class="right-column">
        <div class="card">
          <h2>PEÇA / MEDIÇÃO RELACIONADA</h2>

          <div class="drawing-box">
            <div class="mock-drawing">
              <div class="part"></div>
              <span class="dim top">12,8</span>
              <span class="dim left">Ø12,65 ±0,05</span>
              <span class="dim right">18,899</span>
            </div>

            <div class="measurement-data">
              <label>Característica:</label>
              <strong>Ø 12,65 ± 0,05</strong>

              <label>Valor Medido:</label>
              <strong class="red">12,72</strong>

              <label>Peça:</label>
              <strong>001 de 100</strong>
            </div>
          </div>

          <button class="btn-full" @click="$router.push('/inspecao')">Ver Relatório de Inspeção</button>
        </div>

        <div class="card">
          <h2>EVIDÊNCIAS</h2>

          <div class="evidence-grid">
            <div v-for="(evidencia, index) in evidencias" :key="index" class="evidence">
              <img :src="evidencia" />
              <button @click="removerEvidencia(index)">×</button>
            </div>
          </div>

          <button class="btn-dashed" @click="adicionarEvidencia">＋ Adicionar arquivos</button>
          <small class="format-note">Formatos aceitos: JPG, PNG, PDF, MP4 (Máx. 20MB)</small>
        </div>

        <div class="card">
          <h2>FLUXO / APROVAÇÕES</h2>

          <div class="flow">
            <div v-for="etapa in fluxoEtapas" :key="etapa.etapa" class="flow-item">
              <div class="circle" :class="etapa.status"></div>
              <div>
                <strong>{{ etapa.etapa }}</strong>
                <small>{{ etapa.detalhe }}</small>
              </div>
              <span :class="etapa.status">{{ etapa.badge }}</span>
            </div>
          </div>
        </div>

        <div class="card approval-card">
          <p>Para aprovar ou reprovar esta RNC, utilize uma das opções abaixo.</p>
          <small>Apenas usuários autorizados podem realizar esta ação. 🔒</small>

          <div class="approval-actions">
            <button class="approve" :disabled="usuarioAtual.nivel < 2" @click="executarAvancoFluxo('APROVAR')">✓ Confirmar Próxima Etapa</button>
            <button class="reject" :disabled="usuarioAtual.nivel < 2" @click="executarAvancoFluxo('REPROVAR')">✕ Reprovar / Cancelar RNC</button>
          </div>

          <p class="info-note">ⓘ Ao selecionar uma opção, o fluxo será atualizado automaticamente.</p>
        </div>
      </aside>
    </main>

    <div v-if="modalLoginQualidade" class="modal-overlay">
      <div class="modal">
        <h2>🔒 AUTENTICAÇÃO DE SEGURANÇA</h2>
        <p>Informe o login do perfil responsável (QUALIDADE_01, PRODUCAO_01, COORD_QUALIDADE) para chavear o nível de acesso.</p>

        <div class="field">
          <label>Usuário</label>
          <input v-model="loginQualidade.usuario" placeholder="Ex: QUALIDADE_01" />
        </div>

        <div class="field">
          <label>Senha</label>
          <input v-model="loginQualidade.senha" type="password" placeholder="Senha" />
        </div>

        <div v-if="loginErro" class="login-error">{{ loginErro }}</div>

        <div class="modal-actions">
          <button class="btn-outline" @click="modalLoginQualidade = false">Cancelar</button>
          <button class="btn-primary" @click="autenticarSetorRestrito">Autenticar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const modalLoginQualidade = ref(false)
const loginErro = ref('')

const PERFIS_SISTEMA = {
  INSPETOR: { nivel: 1, role: 'Inspetor' },
  QUALIDADE: { nivel: 2, role: 'Analista da Qualidade' },
  PRODUCAO: { nivel: 3, role: 'Líder de Produção' },
  GESTOR: { nivel: 4, role: 'Coordenador da Qualidade' }
}

const usuarioAtual = ref({
  nome: 'RAFAEL_PEDRICO',
  perfil: 'Inspetor',
  nivel: 1
})

const loginQualidade = ref({ usuario: '', senha: '' })

const rnc = ref({
  numero: 'RNC-000245',
  dataHora: '16/03/2026 14:35',
  responsavelAbertura: 'RAFAEL_PEDRICO',
  setor: 'Qualidade',
  status: 'ABERTA',
  op: '12345678',
  pcItem: 'R90182-9',
  pecaLote: '001',
  instrumento: 'Paquímetro Digital 150mm',
  processo: 'Usinagem CNC',
  maquinaLocal: 'Centro de Usinagem 01',
  descricao: 'Furo Ø 12,65 medido com 12,72, acima do limite superior de tolerância.',
  tipo: 'Dimensional',
  severidade: 'Alta',
  origemProvavel: 'Processo',
  deteccao: 'Inspeção',
  causaProvavel: 'Desgaste da ferramenta / Paquímetro incorreto',
  acaoImediata: 'Peças segregadas, ajuste de ferramenta e revisão de parâmetros.',
  acaoCorretiva: 'Ajustar ferramenta e parâmetros de usinagem.',
  acaoPreventiva: 'Reforçar checklist de setup e monitorar primeira peça.',
  responsavelAcao: 'Programador CNC',
  prazo: '2026-03-20',
  assinaturaAbertura: 'RAFAEL_PEDRICO - 16/03/2026 14:35',
  assinaturaAnalise: null,
  assinaturaExecucao: null,
  assinaturaValidacao: null
})

const fluxoEtapas = computed(() => [
  { etapa: 'Abertura da RNC', detalhe: rnc.value.assinaturaAbertura, status: 'concluido', badge: 'ABERTA' },
  { etapa: 'Análise & Definição de Ações', detalhe: rnc.value.assinaturaAnalise || 'Aguardando Analista da Qualidade', status: rnc.value.status === 'ABERTA' ? 'pendente' : (rnc.value.status === 'EM ANÁLISE' ? 'andamento' : 'concluido'), badge: rnc.value.status === 'ABERTA' ? 'PENDENTE' : rnc.value.status },
  { etapa: 'Execução do Plano de Ação', detalhe: rnc.value.assinaturaExecucao || 'Aguardando Chão de Fábrica / Produção', status: ['ABERTA', 'EM ANÁLISE', 'AÇÃO DEFINIDA'].includes(rnc.value.status) ? 'pendente' : (rnc.value.status === 'AÇÃO EXECUTADA' ? 'andamento' : 'concluido'), badge: ['ABERTA', 'EM ANÁLISE', 'AÇÃO DEFINIDA'].includes(rnc.value.status) ? 'PENDENTE' : rnc.value.status },
  { etapa: 'Encerramento & Validação de Eficácia', detalhe: rnc.value.assinaturaValidacao || 'Aguardando Gestor da Qualidade', status: rnc.value.status === 'ENCERRADA' ? 'concluido' : (rnc.value.status === 'AGUARDANDO VALIDAÇÃO' ? 'andamento' : 'pendente'), badge: rnc.value.status === 'ENCERRADA' ? 'ENCERRADA' : 'PENDENTE' }
])

const abrirModalLoginQualidade = () => {
  modalLoginQualidade.value = true
  loginErro.value = ''
}

const autenticarSetorRestrito = () => {
  const user = loginQualidade.value.usuario.trim().toUpperCase()
  const password = loginQualidade.value.senha.trim()

  if (password !== '12345') {
    loginErro.value = 'Senha operacional incorreta.'
    return
  }

  if (user === 'QUALIDADE_01') {
    usuarioAtual.value = { nome: user, perfil: PERFIS_SISTEMA.QUALIDADE.role, nivel: 2 }
    if (rnc.value.status === 'ABERTA') rnc.value.status = 'EM ANÁLISE'
    modalLoginQualidade.value = false
  } else if (user === 'PRODUCAO_01') {
    if (['ABERTA', 'EM ANÁLISE'].includes(rnc.value.status)) {
      loginErro.value = 'Produção não pode intervir antes do plano da Qualidade.'
      return
    }
    usuarioAtual.value = { nome: user, perfil: PERFIS_SISTEMA.PRODUCAO.role, nivel: 3 }
    modalLoginQualidade.value = false
  } else if (user === 'COORD_QUALIDADE') {
    if (rnc.value.status !== 'AGUARDANDO VALIDAÇÃO') {
      loginErro.value = 'O Coordenador só valida após execução da Produção.'
      return
    }
    usuarioAtual.value = { nome: user, perfil: PERFIS_SISTEMA.GESTOR.role, nivel: 4 }
    modalLoginQualidade.value = false
  } else {
    loginErro.value = 'Usuário sem permissões industriais elevadas.'
  }
}

const executarAvancoFluxo = (acao) => {
  const dataAtual = new Date().toLocaleString('pt-BR')
  if (acao === 'REPROVAR') {
    rnc.value.status = 'REPROVADA'
    alert('RNC Reprovada e cancelada.')
    router.push('/inspecao')
    return
  }

  if (usuarioAtual.value.nivel === 2) {
    rnc.value.status = 'AÇÃO DEFINIDA'
    rnc.value.assinaturaAnalise = `${usuarioAtual.value.nome} - ${dataAtual}`
    alert('Ações definidas. Posto chaveado para aguardar execução da Produção.')
  } else if (usuarioAtual.value.nivel === 3) {
    rnc.value.status = 'AGUARDANDO VALIDAÇÃO'
    rnc.value.assinaturaExecucao = `${usuarioAtual.value.nome} - ${dataAtual}`
    alert('Execução apontada. Chaveado para validação do Coordenador.')
  } else if (usuarioAtual.value.nivel === 4) {
    rnc.value.status = 'ENCERRADA'
    rnc.value.assinaturaValidacao = `${usuarioAtual.value.nome} - ${dataAtual}`
    alert('RNC validada e Encerrada com sucesso para Auditoria!')
  }
}

const logoutRestrito = () => {
  usuarioAtual.value = { nome: 'RAFAEL_PEDRICO', perfil: 'Inspetor', nivel: 1 }
  alert('Perfil resetado para Inspetor.')
}

const salvarRascunho = () => alert('Rascunho salvo no banco MES.')
const cancelarRnc = () => router.push('/inspecao')
const registrarRnc = () => { rnc.value.status = 'ABERTA'; alert('RNC Postada!') }

const evidencias = ref([
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300',
  'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=300'
])
const removerEvidencia = (index) => evidencias.value.splice(index, 1)
const adicionarEvidencia = () => alert('Upload simulado.')
</script>

<style scoped>
.rnc-page { min-height: 100vh; background: #f4f6fb; color: #111827; font-family: Arial, sans-serif; padding: 14px; box-sizing: border-box; }
.top-header { height: 72px; background: #ffffff; border: 1px solid #d7dde8; border-radius: 14px; display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; padding: 0 22px; }
.logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
.logo span { color: #064fd6; }
.brand small { font-size: 10px; font-weight: 800; color: #64748b; }
.center-brand { text-align: center; font-size: 32px; font-weight: 900; color: #064fd6; }
.user-area { display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
.user-area small { display: block; color: #64748b; font-size: 11px; font-weight: 700; }
.notification { position: relative; font-size: 20px; }
.notification span { position: absolute; top: -8px; right: -10px; background: #ef4444; color: white; border-radius: 999px; font-size: 10px; padding: 2px 5px; font-weight: 900; }
.avatar { width: 38px; height: 38px; background: #064fd6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; }
.btn-logout { background: #eef2ff; border: 1px solid #c7d2fe; color: #064fd6; border-radius: 8px; padding: 7px 10px; font-weight: 900; cursor: pointer; }
.page-title-row { margin-top: 14px; background: #ffffff; border: 1px solid #d7dde8; border-radius: 14px; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; }
.page-title-row h1 { margin: 0; font-size: 26px; font-weight: 900; }
.page-title-row h1 span { background: #dbeafe; color: #064fd6; padding: 6px 12px; border-radius: 999px; font-size: 13px; vertical-align: middle; }
.page-title-row p { margin: 6px 0 0; color: #64748b; font-weight: 700; }
.top-actions { display: flex; gap: 10px; }
button { border: 0; border-radius: 9px; padding: 12px 16px; font-weight: 900; cursor: pointer; }
.btn-primary { background: #064fd6; color: white; }
.btn-outline { background: white; color: #111827; border: 1px solid #cbd5e1; }
.btn-outline-danger { background: white; color: #dc2626; border: 1px solid #fecaca; }
.layout { margin-top: 14px; display: grid; grid-template-columns: minmax(0, 1.45fr) 420px; gap: 14px; align-items: start; }
.left-column,
.right-column { display: flex; flex-direction: column; gap: 14px; }
.card { background: #ffffff; border: 1px solid #d7dde8; border-radius: 14px; padding: 18px; }
.card h2 { margin: 0 0 14px; font-size: 16px; font-weight: 900; color: #111827; }
.grid-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.grid-classificacao { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.grid-tratamento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 11px; font-weight: 900; color: #475569; }
.field input, .field select, .field textarea { width: 100%; border: 1px solid #cbd5e1; background: #ffffff; color: #111827; border-radius: 9px; padding: 12px; font-size: 14px; font-weight: 800; box-sizing: border-box; }
.field textarea { resize: vertical; min-height: 96px; font-family: Arial, sans-serif; }
.field small { text-align: right; color: #64748b; font-weight: 700; }
.field input:disabled, .field select:disabled, .field textarea:disabled { background: #f1f5f9; color: #334155; cursor: not-allowed; }
.locked label::after { content: "  🔒"; color: #64748b; }
.status input { background: #dcfce7 !important; color: #166534 !important; }
.textarea-field textarea { min-height: 128px; }
.wide { grid-column: span 2; }
.section-header { display: flex; align-items: center; justify-content: space-between; }
.restricted-btn { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-size: 11px; }
.locked-note { background: #f8fafc; border: 1px dashed #cbd5e1; color: #475569; padding: 12px; border-radius: 9px; font-weight: 800; }
.drawing-box { border: 1px solid #d7dde8; border-radius: 12px; overflow: hidden; background: #f8fafc; }
.mock-drawing { height: 220px; background: #ffffff; position: relative; display: flex; align-items: center; justify-content: center; }
.part { width: 120px; height: 90px; border: 5px solid #1f2937; border-radius: 14px; position: relative; }
.part::before { content: ""; position: absolute; width: 42px; height: 42px; border: 4px solid #1f2937; border-radius: 50%; left: 35px; top: 20px; }
.dim { position: absolute; background: #ffffff; border: 1px solid #94a3b8; color: #111827; padding: 4px 8px; border-radius: 5px; font-size: 12px; font-weight: 900; }
.dim.top { top: 26px; }
.dim.left { left: 24px; top: 98px; color: #dc2626; }
.dim.right { right: 30px; bottom: 56px; }
.measurement-data { padding: 14px; display: grid; grid-template-columns: 1fr; gap: 6px; }
.measurement-data label { font-size: 11px; color: #64748b; font-weight: 900; }
.measurement-data strong { font-size: 18px; }
.red { color: #dc2626; }
.btn-full { width: 100%; margin-top: 14px; background: #064fd6; color: white; }
.evidence-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.evidence { position: relative; height: 96px; border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1; background: #e2e8f0; }
.evidence img { width: 100%; height: 100%; object-fit: cover; }
.evidence button { position: absolute; right: 6px; top: 6px; width: 26px; height: 26px; padding: 0; background: #ffffff; color: #dc2626; border-radius: 50%; }
.btn-dashed { width: 100%; margin-top: 12px; background: #ffffff; color: #064fd6; border: 2px dashed #93c5fd; }
.format-note { margin-top: 8px; display: block; color: #64748b; font-weight: 700; }
.flow { display: flex; flex-direction: column; gap: 14px; }
.flow-item { display: grid; grid-template-columns: 18px 1fr auto; gap: 10px; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
.flow-item:last-child { border-bottom: none; padding-bottom: 0; }
.flow-item strong { display: block; font-size: 14px; }
.flow-item small { display: block; color: #64748b; font-weight: 700; }
.circle { width: 14px; height: 14px; border-radius: 50%; background: #cbd5e1; }
.concluido { color: #16a34a; }
.circle.concluido { background: #16a34a; }
.pendente { color: #64748b; }
.circle.pendente { background: #cbd5e1; }
.andamento { color: #064fd6; }
.circle.andamento { background: #064fd6; }
.reprovado { color: #dc2626; }
.circle.reprovado { background: #dc2626; }
.flow-item span { font-size: 11px; font-weight: 900; }
.approval-card { background: #fff7ed; border-color: #fed7aa; }
.approval-card p { margin: 0 0 8px; font-weight: 800; }
.approval-card small { display: block; color: #9a3412; font-weight: 800; }
.approval-actions { margin-top: 14px; display: grid; grid-template-columns: 1fr; gap: 10px; }
.approval-actions button { width: 100%; color: white; }
.approve { background: #16a34a; }
.reject { background: #dc2626; }
.approval-actions button:disabled { background: #cbd5e1; cursor: not-allowed; }
.info-note { margin-top: 12px !important; color: #92400e; font-size: 13px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.65); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal { width: 420px; background: #ffffff; border-radius: 16px; padding: 26px; box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35); }
.modal h2 { margin: 0 0 8px; font-size: 22px; }
.modal p { color: #475569; font-weight: 700; }
.modal-actions { margin-top: 18px; display: flex; justify-content: flex-end; gap: 10px; }
.login-error { margin-top: 10px; background: #fee2e2; color: #991b1b; border-radius: 8px; padding: 10px; font-weight: 900; font-size: 13px; }

/* CSS Extra para o travamento de Auditoria visual */
.disabled-lock-state {
  opacity: 0.5;
  pointer-events: none;
  background-color: #f8fafc;
  border-left: 4px solid #94a3b8 !important;
}
</style>