<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">⚙</div>
        <h1>INTELLINK MES</h1>
        <p class="subtitle">Sistema de Gestão Industrial</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="user">Usuário</label>
          <input
            id="user"
            v-model="username"
            type="text"
            placeholder="Digite seu usuário"
            autocomplete="off"
          />
        </div>
        <div class="input-group">
          <label for="pass">Senha</label>
          <input
            id="pass"
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
          />
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <button type="submit" class="login-btn">Acessar Sistema</button>
      </form>
      <div class="login-footer">
        <p>v2.4.0 — Ambiente Industrial</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store.js'

const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')

function handleLogin() {
  errorMsg.value = ''
  if (username.value === 'RAFAEL_PEDRICO' && password.value === '12345') {
    store.usuarioLogado.nome = username.value
    store.usuarioLogado.perfil = 'Inspetor'
    store.usuarioLogado.nivel = 1
    router.push('/inspecao')
  } else {
    errorMsg.value = 'Usuário ou senha inválidos. Tente RAFAEL_PEDRICO / 12345'
  }
}
</script>

<style scoped>
:root {
  --bg-body: #0f1219;
  --bg-card: #1a1f2e;
  --text-primary: #e8edf5;
  --text-secondary: #8892a8;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --border-color: #2a3040;
  --error-color: #ef4444;
}

.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-body);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.login-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.login-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  letter-spacing: 1px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-group input {
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid var(--border-color);
  background: #0d1117;
  color: var(--text-primary);
  font-size: 15px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.input-group input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-group input::placeholder {
  color: #4a5568;
}

.error-msg {
  color: var(--error-color);
  font-size: 13px;
  text-align: center;
  margin: 0;
}

.login-btn {
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: 4px;
}

.login-btn:hover {
  background: var(--accent-hover);
}

.login-btn:active {
  transform: scale(0.98);
}

.login-footer {
  text-align: center;
  margin-top: 28px;
}

.login-footer p {
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0;
}
</style>