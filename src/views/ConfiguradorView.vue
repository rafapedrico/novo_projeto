<template>
  <div class="config-wrapper">
    <nav class="top-nav">
      <div class="nav-left">
        <span class="nav-brand">⚙ INTELLINK MES</span>
        <span class="nav-separator">|</span>
        <span class="nav-title">Configurador de Blueprint</span>
      </div>
      <div class="nav-right">
        <span class="nav-user">{{ store.usuarioLogado.nome }}</span>
        <router-link to="/inspecao" class="nav-btn">Inspeção</router-link>
        <router-link to="/rnc" class="nav-btn">RNC</router-link>
        <router-link to="/finalizado" class="nav-btn">Finalizado</router-link>
        <button @click="handleLogout" class="nav-btn logout-btn">Sair</button>
      </div>
    </nav>

    <div class="config-content">
      <div class="splitter-container">
        <div class="split-panel left-panel">
          <div class="panel-header">
            <h2>📐 Blueprint Técnico</h2>
            <span class="badge">PDF Simulado</span>
          </div>
          <div class="blueprint-canvas">
            <svg viewBox="0 0 800 600" class="blueprint-svg">
              <!-- Grid lines -->
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.08)" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="800" height="600" fill="url(#grid)" />

              <!-- Technical drawing: Disc brake 350mm -->
              <!-- Outer circle -->
              <circle cx="400" cy="300" r="200" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.7" />
              <circle cx="400" cy="300" r="120" fill="none" stroke="#3b82f6" stroke-width="1.5" opacity="0.5" stroke-dasharray="4,4" />
              <circle cx="400" cy="300" r="40" fill="none" stroke="#3b82f6" stroke-width="1.5" opacity="0.6" />

              <!-- Bolt holes -->
              <circle cx="400" cy="220" r="8" fill="none" stroke="#60a5fa" stroke-width="1.5" />
              <circle cx="475" cy="265" r="8" fill="none" stroke="#60a5fa" stroke-width="1.5" />
              <circle cx="455" cy="350" r="8" fill="none" stroke="#60a5fa" stroke-width="1.5" />
              <circle cx="345" cy="350" r="8" fill="none" stroke="#60a5fa" stroke-width="1.5" />
              <circle cx="325" cy="265" r="8" fill="none" stroke="#60a5fa" stroke-width="1.5" />

              <!-- Dimension lines -->
              <line x1="400" y1="100" x2="600" y2="100" stroke="#facc15" stroke-width="1" stroke-dasharray="2,3" />
              <text x="480" y="95" fill="#facc15" font-size="12" text-anchor="middle">Ø350mm</text>

              <line x1="620" y1="300" x2="620" y2="240" stroke="#facc15" stroke-width="1" stroke-dasharray="2,3" />
              <text x="635" y="275" fill="#facc15" font-size="10">30mm</text>

              <!-- Cross section detail -->
              <rect x="50" y="420" width="200" height="80" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.6" rx="4" />
              <text x="150" y="415" fill="#60a5fa" font-size="10" text-anchor="middle">Corte A-A</text>
              <line x1="150" y1="420" x2="150" y2="500" stroke="#60a5fa" stroke-width="0.5" stroke-dasharray="1,2" />

              <!-- Annotations -->
              <text x="620" y="420" fill="#60a5fa" font-size="9">Material: Aço SAE 1045</text>
              <text x="620" y="440" fill="#60a5fa" font-size="9">Tratamento: Têmpera + Revenimento</text>
              <text x="620" y="460" fill="#60a5fa" font-size="9">Dureza: 42-48 HRC</text>
              <text x="620" y="480" fill="#60a5fa" font-size="9">Acabamento: Retífica final</text>

              <!-- Title block -->
              <rect x="550" y="520" width="250" height="80" fill="rgba(59,130,246,0.05)" stroke="#3b82f6" stroke-width="0.5" rx="2" />
              <text x="560" y="540" fill="#e8edf5" font-size="10" font-weight="bold">DISCO DE FREIO AÇO 350MM</text>
              <text x="560" y="558" fill="#8892a8" font-size="9">ESC: 1:2 | UNID: mm</text>
              <text x="560" y="575" fill="#8892a8" font-size="9">REV: 03 | DATA: 2024-06</text>
              <text x="560" y="592" fill="#8892a8" font-size="9">APROV: RAFAEL_PEDRICO</text>
            </svg>
          </div>
        </div>
        <div class="split-divider"></div>
        <div class="split-panel right-panel">
          <div class="panel-header">
            <h2>⚙ Parâmetros do Blueprint</h2>
          </div>
          <div class="params-list">
            <div class="param-item">
              <label>Diâmetro Externo (mm)</label>
              <input type="number" value="350" disabled />
            </div>
            <div class="param-item">
              <label>Diâmetro Interno (mm)</label>
              <input type="number" value="140" disabled />
            </div>
            <div class="param-item">
              <label>Espessura (mm)</label>
              <input type="number" value="30" disabled />
            </div>
            <div class="param-item">
              <label>Tolerância Geral (mm)</label>
              <input type="text" value="±0.1" disabled />
            </div>
            <div class="param-item">
              <label>Quantidade Furos</label>
              <input type="number" value="5" disabled />
            </div>
            <div class="param-item">
              <label>Raio do Chanfro (mm)</label>
              <input type="number" value="2.5" disabled />
            </div>
            <div class="param-item">
              <label>Acabamento Superficial (Ra)</label>
              <input type="text" value="0.8 µm" disabled />
            </div>
          </div>
          <div class="params-actions">
            <button class="action-btn success" @click="handleValidarOP">✓ Validar OP</button>
            <button class="action-btn secondary">Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { store } from '../store.js'

const router = useRouter()

function handleLogout() {
  store.usuarioLogado.nome = ''
  store.usuarioLogado.perfil = ''
  store.usuarioLogado.nivel = ''
  router.push('/')
}

function handleValidarOP() {
  store.opAtiva.numero = 'OP-2024-0042'
  store.opAtiva.cliente = 'ITT Bombas Goulds'
  store.opAtiva.pcItem = 'DISCO DE FREIO 350MM'
  store.opAtiva.desenho = 'FB-13315 - 2249'
  store.opAtiva.revisao = '2'
  store.opAtiva.qtdPecas = 150

  store.caracteristicas = [
    {
      id: 1,
      cota: 'Diametro Externo',
      valorNominal: 350,
      toleranciaSup: 0.1,
      toleranciaInf: -0.1,
      medicao: null
    },
    {
      id: 2,
      cota: 'Diametro Interno',
      valorNominal: 140,
      toleranciaSup: 0.05,
      toleranciaInf: -0.05,
      medicao: null
    },
    {
      id: 3,
      cota: 'Espessura',
      valorNominal: 30,
      toleranciaSup: 0.1,
      toleranciaInf: -0.1,
      medicao: null
    },
    {
      id: 4,
      cota: 'Furo 1 - Posição',
      valorNominal: 80,
      toleranciaSup: 0.2,
      toleranciaInf: -0.2,
      medicao: null
    },
    {
      id: 5,
      cota: 'Furo 2 - Posição',
      valorNominal: 80,
      toleranciaSup: 0.2,
      toleranciaInf: -0.2,
      medicao: null
    },
    {
      id: 6,
      cota: 'Furo 3 - Posição',
      valorNominal: 80,
      toleranciaSup: 0.2,
      toleranciaInf: -0.2,
      medicao: null
    },
    {
      id: 7,
      cota: 'Furo 4 - Posição',
      valorNominal: 80,
      toleranciaSup: 0.2,
      toleranciaInf: -0.2,
      medicao: null
    },
    {
      id: 8,
      cota: 'Furo 5 - Posição',
      valorNominal: 80,
      toleranciaSup: 0.2,
      toleranciaInf: -0.2,
      medicao: null
    },
    {
      id: 9,
      cota: 'Raio do Chanfro',
      valorNominal: 2.5,
      toleranciaSup: 0.1,
      toleranciaInf: -0.1,
      medicao: null
    },
    {
      id: 10,
      cota: 'Acabamento Superficial Ra',
      valorNominal: 0.8,
      toleranciaSup: 0.2,
      toleranciaInf: -0.2,
      medicao: null
    }
  ]
}
</script>

<style scoped>
:root {
  --bg-body: #0f1219;
  --bg-card: #1a1f2e;
  --text-primary: #e8edf5;
  --text-secondary: #8892a8;
  --accent: #3b82f6;
  --border-color: #2a3040;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.config-wrapper {
  min-height: 100vh;
  background: var(--bg-body);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text-primary);
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-brand {
  font-weight: 700;
  font-size: 15px;
  color: var(--accent);
  letter-spacing: 0.5px;
}

.nav-separator {
  color: var(--border-color);
}

.nav-title {
  color: var(--text-secondary);
  font-size: 14px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-user {
  color: var(--text-secondary);
  font-size: 13px;
  margin-right: 8px;
}

.nav-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.nav-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.logout-btn {
  border-color: #ef4444;
  color: #ef4444;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.config-content {
  height: calc(100vh - 52px);
}

.splitter-container {
  display: flex;
  height: 100%;
}

.split-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.left-panel {
  flex: 1.5;
}

.right-panel {
  flex: 1;
}

.split-divider {
  width: 4px;
  background: var(--border-color);
  cursor: col-resize;
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.panel-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.blueprint-canvas {
  flex: 1;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blueprint-svg {
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 120px);
  background: #0d1117;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.params-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.param-item label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.param-item input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--border-color);
  background: #0d1117;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  cursor: not-allowed;
  opacity: 0.8;
}

.params-actions {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background: var(--accent);
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.success {
  background: #22c55e;
  color: white;
}

.action-btn.success:hover {
  background: #16a34a;
}

.action-btn.secondary {
  background: transparent;
  border: 1.5px solid var(--border-color);
  color: var(--text-secondary);
}

.action-btn.secondary:hover {
  border-color: var(--text-secondary);
}
</style>