<template>
  <div class="app-finalizacao">
    <header class="top-header">
      <div class="brand">
        <div class="logo">INTEL<span>LINK</span></div>
        <div class="sublogo">INDUSTRIAL MES</div>
      </div>

      <div class="title-center">
        <div class="success-icon">✓</div>
        <div>
          <h1>LOTE FINALIZADO COM SUCESSO</h1>
          <p>RELATÓRIO RESUMO DA INSPEÇÃO DIMENSIONAL</p>
        </div>
      </div>

      <div class="right-area">
        <div class="inspector-box">
          <div class="user-icon">👤</div>
          <div>
            <small>Inspetor:</small>
            <strong>{{ store.usuarioLogado.nome || 'RAFAEL_PEDRICO' }}</strong>
          </div>
          <span class="green-dot"></span>
        </div>

        <div class="clock-box">
          <div class="clock-main">08:52:31</div>
          <div class="clock-date">08/06/2026 | DOMINGO</div>
        </div>
      </div>
    </header>

    <section class="info-strip">
      <div>
        <small>ORDEM DE PRODUÇÃO</small>
        <strong class="blue">{{ store.opAtiva.numero || '12345678' }}</strong>
      </div>
      <div>
        <small>CLIENTE</small>
        <strong>{{ store.opAtiva.cliente || 'ITT Bombas Goulds do Brasil LTDA.' }}</strong>
      </div>
      <div>
        <small>PC / ITEM Nº</small>
        <strong>{{ store.opAtiva.pcItem || 'R90182-9' }}</strong>
      </div>
      <div>
        <small>DESENHO / REVISÃO</small>
        <strong>{{ store.opAtiva.desenho || 'FB-13315 - 2249' }}<br />Rev. {{ store.opAtiva.revisao || '2' }}</strong>
      </div>
      <div>
        <small>LOTE TOTAL</small>
        <strong>01</strong>
      </div>
      <div>
        <small>QUANTIDADE PLANO</small>
        <strong class="blue">{{ store.opAtiva.qtdPecas || 150 }} peças</strong>
      </div>
      <div>
        <small>PROCESSO</small>
        <span class="process-badge">INSPEÇÃO</span>
      </div>
    </section>

    <main class="main-grid">
      <section class="panel">
        <h2>📋 RESUMO DO LOTE INSPECIONADO</h2>

        <div class="summary-grid">
          <div class="summary-card">
            <small>QUANTIDADE INSPECIONADA</small>
            <strong class="blue big">{{ totalPecas }}</strong>
            <span>peças</span>
            <div class="card-icon blue-soft">📋</div>
          </div>

          <div class="summary-card">
            <small>PEÇAS APROVADAS</small>
            <strong class="green big">{{ pecasAprovadas }}</strong>
            <span>peças</span>
            <div class="card-icon green-soft">✓</div>
          </div>

          <div class="summary-card">
            <small>PEÇAS REPROVADAS</small>
            <strong class="red big">{{ pecasReprovadas }}</strong>
            <span>peças</span>
            <div class="card-icon red-soft">✕</div>
          </div>

          <div class="summary-card">
            <small>TAXA DE APROVAÇÃO</small>
            <strong class="green big">{{ taxaAprovacao }}</strong>
            <span>do lote</span>
            <div class="chart-mini">↗</div>
          </div>

          <div class="summary-card">
            <small>TOTAL DE MEDIÇÕES</small>
            <strong class="dark big">{{ totalMedicoes }}</strong>
            <span>medições</span>
            <div class="card-icon blue-soft">◔</div>
          </div>

          <div class="summary-card">
            <small>COTAS INSPECIONADAS</small>
            <strong class="dark big">{{ totalCotas }}</strong>
            <span>características</span>
            <div class="card-icon purple-soft">📏</div>
          </div>
        </div>

        <div class="timeline">
          <div>
            <small>DATA DE INÍCIO</small>
            <strong>08/06/2026</strong>
            <span>08:35:12</span>
          </div>
          <div>
            <small>DATA DE TÉRMINO</small>
            <strong>08/06/2026</strong>
            <span>08:52:31</span>
          </div>
          <div>
            <small>DURAÇÃO TOTAL</small>
            <strong>00:17:19</strong>
            <span>hh:mm:ss</span>
          </div>
          <div>
            <small>INSPETOR RESPONSÁVEL</small>
            <strong>{{ store.usuarioLogado.nome || 'RAFAEL_PEDRICO' }}</strong>
          </div>
          <div>
            <small>STATUS DO LOTE</small>
            <strong class="green">CONCLUÍDO</strong>
          </div>
        </div>

        <div class="success-banner">
          <div>✓</div>
          <p>
            <strong>Lote enviado com sucesso para o banco de dados.</strong>
            <span>Todas as medições foram registradas e estão disponíveis para rastreabilidade e auditoria.</span>
          </p>
        </div>
      </section>

      <section class="panel">
        <h2>ANÁLISE DE CONFORMIDADE DO LOTE</h2>

        <div class="donut-area">
          <div class="donut" :style="{ background: donutGradient }">
            <div class="donut-center">
              <strong>{{ totalPecas }}</strong>
              <span>peças</span>
            </div>
          </div>

          <div class="legend">
            <div>
              <span class="dot green-bg"></span>
              <strong>Aprovadas</strong>
              <p>{{ pecasAprovadas }} peças ({{ (pecasAprovadas / totalPecas * 100 || 0).toFixed(2) }}%)</p>
            </div>
            <div>
              <span class="dot red-bg"></span>
              <strong>Reprovadas</strong>
              <p>{{ pecasReprovadas }} peças ({{ (pecasReprovadas / totalPecas * 100 || 0).toFixed(2) }}%)</p>
            </div>
          </div>
        </div>

        <div class="performance-box">
          <div class="trophy">🏆</div>
          <div>
            <h3>DESEMPENHO DO LOTE</h3>
            <p>O lote atingiu o índice de aprovação de <strong>{{ taxaAprovacao }}</strong>.</p>
            <p>Parabéns! O processo está dentro dos padrões de qualidade.</p>
          </div>
        </div>
      </section>
    </main>

    <section class="actions">
      <button>📄 BAIXAR RELATÓRIO PDF</button>
      <button>🖨️ IMPRIMIR RELATÓRIO</button>
      <button class="rnc" @click="$router.push('/rnc')">❌ ABRIR RNC NÃO CONFORMIDADES</button>
      <button>🗄️ VISUALIZAR DADOS DETALHADOS</button>
      <button>🔄 NOVA INSPEÇÃO OUTRO LOTE</button>
      <button class="dashboard" @click="$router.push('/inspecao')">⌂ VOLTAR PARA DASHBOARD</button>
    </section>

    <footer class="footer">
      <div>🔒 SISTEMA PROTEGIDO<br /><small>Acesso autorizado e monitorado</small></div>
      <div>🗄️ VERSÃO DO SISTEMA<br /><small>v2.5.1 | Build 2026.06.08</small></div>
      <div class="footer-logo">INTEL<span>LINK</span><br /><small>INDUSTRIAL MES</small></div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '../store.js'

const totalPecas = computed(() => store.opAtiva.qtdPecas || 0)

function isPecaAprovada(pecaNum) {
  const caracteristicas = store.caracteristicas
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
  const caracteristicas = store.caracteristicas
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

const pecasAprovadas = computed(() => {
  let count = 0
  for (let p = 1; p <= totalPecas.value; p++) {
    if (isPecaAprovada(p)) count++
  }
  return count
})

const pecasReprovadas = computed(() => {
  let count = 0
  for (let p = 1; p <= totalPecas.value; p++) {
    if (isPecaReprovada(p)) count++
  }
  return count
})

const totalCotas = computed(() => store.caracteristicas.length || 0)

const totalMedicoes = computed(() => {
  let count = 0
  for (const cota of store.caracteristicas) {
    for (let p = 1; p <= totalPecas.value; p++) {
      if (cota.valoresPecas?.[p]) count++
    }
  }
  return count
})

const taxaAprovacao = computed(() => {
  if (totalPecas.value === 0) return '0,00%'
  const pct = (pecasAprovadas.value / totalPecas.value) * 100
  return pct.toFixed(2).replace('.', ',') + '%'
})

const donutGradient = computed(() => {
  if (totalPecas.value === 0) return 'conic-gradient(#e2e8f0 0deg 360deg)'
  const aprovPct = pecasAprovadas.value / totalPecas.value
  const aprovDeg = aprovPct * 360
  return `conic-gradient(#0ba832 0deg ${aprovDeg}deg, #dc1f1f ${aprovDeg}deg 360deg)`
})
</script>

<style scoped>
.app-finalizacao {
  min-height: 100vh;
  background: #f5f8fd;
  color: #071735;
  font-family: Arial, sans-serif;
  padding: 8px;
  box-sizing: border-box;
}

.top-header {
  height: 100px;
  background: #ffffff;
  border: 1px solid #c8d4e5;
  border-radius: 14px 14px 0 0;
  display: grid;
  grid-template-columns: 260px 1fr 410px;
  align-items: center;
  padding: 0 30px;
}

.logo,
.footer-logo {
  font-size: 40px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -2px;
}

.logo span,
.footer-logo span {
  color: #064fd6;
}

.sublogo,
.footer-logo small {
  letter-spacing: 8px;
  font-size: 11px;
  font-weight: 700;
}

.title-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  text-align: center;
}

.success-icon {
  width: 54px;
  height: 54px;
  background: #109c2f;
  color: #fff;
  border-radius: 50%;
  font-size: 42px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-center h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
}

.title-center p {
  margin: 2px 0 0;
  color: #064fd6;
  font-size: 20px;
  font-weight: 900;
}

.right-area {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: flex-end;
}

.inspector-box,
.clock-box {
  border: 1px solid #b8c7dc;
  border-radius: 8px;
  background: #fff;
}

.inspector-box {
  height: 66px;
  width: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.inspector-box strong {
  display: block;
}

.user-icon {
  font-size: 30px;
}

.green-dot {
  width: 12px;
  height: 12px;
  background: #0ea52b;
  border-radius: 50%;
}

.clock-box {
  background: #031936;
  color: white;
  width: 190px;
  height: 66px;
  text-align: center;
  padding-top: 8px;
}

.clock-main {
  font-size: 32px;
  font-weight: 900;
}

.clock-date {
  font-size: 13px;
  font-weight: 800;
}

.info-strip {
  margin-top: 8px;
  background: white;
  border: 1px solid #c8d4e5;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1.1fr 1.4fr 1.1fr 1.3fr 0.8fr 1.1fr 1fr;
  min-height: 100px;
  align-items: center;
}

.info-strip div {
  text-align: center;
  border-right: 1px solid #d9e2ef;
}

.info-strip div:last-child {
  border-right: none;
}

small {
  display: block;
  font-size: 12px;
  font-weight: 900;
}

.info-strip strong {
  font-size: 24px;
  font-weight: 900;
}

.blue {
  color: #064fd6;
}

.green {
  color: #0b8d27;
}

.red {
  color: #c51f1f;
}

.process-badge {
  display: inline-block;
  background: #064fd6;
  color: white;
  padding: 12px 30px;
  border-radius: 7px;
  font-size: 22px;
  font-weight: 900;
}

.main-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: 20px;
}

.panel {
  background: white;
  border: 1px solid #c8d4e5;
  border-radius: 10px;
  padding: 18px;
}

.panel h2 {
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 900;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.summary-card {
  position: relative;
  border: 1px solid #c8d4e5;
  border-radius: 8px;
  min-height: 118px;
  padding: 20px 24px;
}

.big {
  display: block;
  font-size: 40px;
  font-weight: 900;
  line-height: 1;
}

.dark {
  color: #071735;
}

.card-icon {
  position: absolute;
  right: 22px;
  top: 42px;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blue-soft {
  background: #dbeafe;
  color: #064fd6;
}

.green-soft {
  background: #d9f7df;
  color: #0b8d27;
}

.red-soft {
  background: #ffe0e0;
  color: #c51f1f;
}

.purple-soft {
  background: #eadcff;
  color: #6d28d9;
}

.chart-mini {
  position: absolute;
  right: 34px;
  bottom: 26px;
  color: #0b8d27;
  font-size: 52px;
  font-weight: 900;
}

.timeline {
  margin-top: 20px;
  border: 1px solid #c8d4e5;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 15px;
}

.timeline div {
  border-right: 1px solid #d9e2ef;
  padding-left: 12px;
}

.timeline div:last-child {
  border-right: none;
}

.timeline strong {
  display: block;
  font-size: 18px;
}

.success-banner {
  margin-top: 14px;
  background: linear-gradient(90deg, #08912c, #008929);
  color: white;
  border-radius: 8px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.success-banner div {
  font-size: 42px;
}

.success-banner p {
  margin: 0;
}

.success-banner span {
  display: block;
  margin-top: 5px;
}

.donut-area {
  border: 1px solid #c8d4e5;
  border-radius: 8px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
}

.donut {
  width: 230px;
  height: 230px;
  border-radius: 50%;
  background: conic-gradient(#0ba832 0deg 341deg, #dc1f1f 341deg 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-center {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.donut-center strong {
  font-size: 42px;
  color: #0b8d27;
}

.donut-center span {
  font-weight: 800;
}

.legend div {
  margin: 22px 0;
}

.legend strong {
  font-size: 18px;
}

.legend p {
  margin: 4px 0 0 25px;
  font-size: 16px;
}

.dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
}

.green-bg {
  background: #0ba832;
}

.red-bg {
  background: #dc1f1f;
}

.performance-box {
  margin-top: 18px;
  border: 1px solid #91c99f;
  background: #effaf1;
  border-radius: 8px;
  padding: 22px;
  display: flex;
  gap: 22px;
  align-items: center;
}

.trophy {
  font-size: 54px;
}

.performance-box h3 {
  margin: 0 0 8px;
  color: #0b8d27;
  font-size: 22px;
}

.performance-box p {
  margin: 4px 0;
}

.actions {
  margin-top: 14px;
  background: white;
  border: 1px solid #c8d4e5;
  border-radius: 10px;
  padding: 18px;
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1.35fr 1.25fr 1.25fr 1.1fr;
  gap: 20px;
}

.actions button {
  height: 68px;
  border: 1px solid #c8d4e5;
  background: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  color: #071735;
}

.actions .dashboard {
  background: #031936;
  color: white;
}

.actions .rnc {
  color: #b91c1c;
}

.footer {
  margin-top: 10px;
  background: #031936;
  color: white;
  border-radius: 0 0 14px 14px;
  min-height: 74px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 0 38px;
}

.footer div {
  font-weight: 900;
}

.footer small {
  color: #cbd5e1;
  font-weight: 500;
}

.footer-logo {
  text-align: right;
  font-size: 34px;
}
</style>