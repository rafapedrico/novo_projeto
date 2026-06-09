# 🏭 INTELLINK / UsiNar — Sistema de Gestão Industrial MES

> **Sistema de Controle de Qualidade & Rastreabilidade para Chão de Fábrica**  
> Versão 2.5.1 | Vue 3 + Vite

---

## 📁 1. Arquitetura do Sistema

O sistema segue o padrão **SPA (Single Page Application)** com estado global reativo centralizado.

```
novo_projeto/
├── src/
│   ├── store.js                  ← Estado global reativo (Vue reactive)
│   ├── App.vue                   ← Raiz: aplica tema + persiste dados
│   ├── main.js                   ← Bootstrap do Vue
│   ├── router/
│   │   └── index.js              ← Rotas das 5 telas
│   ├── views/
│   │   ├── LoginView.vue         ← Autenticação do inspetor
│   │   ├── ConfiguradorView.vue  ← Blueprint + Validação da OP
│   │   ├── InspecaoView.vue      ← Matriz de medição (núcleo)
│   │   ├── RncView.vue           ← RNC (4 níveis de aprovação)
│   │   └── FinalizadoView.vue    ← Relatório final do lote
│   └── style.css                 ← Estilos globais
├── public/                       ← Assets estáticos
├── package.json
├── vite.config.js
└── README.md
```

### Store Global (`src/store.js`)

O estado é centralizado com o `reactive()` nativo do Vue 3 e **persiste automaticamente no `localStorage`** com a função `salvarStore()`. Toda alteração no estado dispara um `watch` no `App.vue` que grava os dados no navegador, garantindo **recuperação total após F5 ou queda de energia**.

```javascript
export const store = reactive({
  usuarioLogado: { nome, perfil, nivel },
  opAtiva: { numero, cliente, pcItem, desenho, revisao, qtdPecas },
  caracteristicas: [ /* cotas + valoresPecas */ ],
  rncPendente: { op, cota, valor, peca, min, max },
  rncStatus: '',
  rncAssinaturaAnalise: null,
  rncAssinaturaExecucao: null,
  rncAssinaturaValidacao: null,
  temaAtual: 'modo-escuro'
})
```

---

## 🔐 2. Fluxo de Segurança e RNC (4 Níveis)

O sistema implementa uma **máquina de estados** com 5 etapas para abertura e encerramento de uma RNC (Relatório de Não Conformidade).

### Estados da RNC

```
ABERTA ──▶ EM ANÁLISE ──▶ AÇÃO DEFINIDA ──▶ AGUARDANDO VALIDAÇÃO ──▶ ENCERRADA
```

Cada transição de estado exige autenticação de um perfil específico, simulando o fluxo real de uma indústria:

| Etapa | Perfil | Usuário | Senha | Ação Liberada |
|-------|--------|---------|-------|---------------|
| 1. Abertura | Inspetor | `RAFAEL_PEDRICO` | `12345` | Abrir RNC, descrever NC |
| 2. Classificação | Analista da Qualidade | `QUALIDADE_01` | `12345` | Definir ações corretivas |
| 3. Execução | Líder de Produção | `PRODUCAO_01` | `12345` | Executar plano de ação |
| 4. Validação | Coordenador da Qualidade | `COORD_QUALIDADE` | `12345` | Validar e encerrar RNC |

> **Nota:** A Produção só pode agir APÓS a Qualidade definir as ações. O Coordenador só valida APÓS a Produção executar. O sistema bloqueia intervenções fora de ordem automaticamente.

### Bloqueios por Nível

- **Nível 1** (Inspetor): acesso apenas à Descrição da NC
- **Nível 2** (Qualidade): acesso à Classificação e Análise
- **Nível 3** (Produção): acesso à Execução do plano
- **Nível 4** (Coordenador): acesso à Validação/Encerramento

---

## ⚙️ 3. Recursos Industriais Implementados

### 💾 Persistência Anti-Apagão (LocalStorage)

- Toda alteração em `caracteristicas`, `opAtiva`, `usuarioLogado`, `rncPendente` e `temaAtual` é **salva automaticamente no `localStorage`** via `watch` profundo no `App.vue`.
- Ao carregar a página, o sistema **recupera o estado salvo** — incluindo todas as 150 medições da matriz.
- Isso protege contra:
  - ✅ Queda de energia no chão de fábrica
  - ✅ F5 acidental
  - ✅ Fechamento não intencional do navegador
  - ✅ Troca de turno sem perda de dados

### ⌨️ Atalhos de Teclado Industriais (D-PAD)

Na tela de inspeção (`InspecaoView`), o operador pode navegar pela matriz **sem usar o mouse**:

| Tecla | Ação |
|-------|------|
| `▲` (ArrowUp) | Cota anterior |
| `▼` (ArrowDown) | Próxima cota |
| `◀` (ArrowLeft) | Peça anterior |
| `▶` (ArrowRight) | Próxima peça |
| `Enter` | Confirmar medida |

Ideal para terminais com teclados numéricos/industriais.

### 🖨️ Impressão de Relatórios (@media print)

Na tela de finalização (`FinalizadoView`), os botões **"BAIXAR RELATÓRIO PDF"** e **"IMPRIMIR RELATÓRIO"** disparam `window.print()`.

O CSS `@media print` garante:
- ✅ Botões de ação ocultos
- ✅ Cores preservadas (donut, badges, banners)
- ✅ Layout limpo para assinatura física do inspetor

### 🌓 Tema Claro / Escuro Unificado

Alternância de tema sincronizada em **todas as 5 telas** através da variável `store.temaAtual`. Cada view reage instantaneamente à mudança via CSS scoped com classes `.modo-claro` / `.modo-escuro`.

---

## 🚀 4. Guia de Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+ (recomendado v20)
- npm v9+ ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/rafapedrico/novo_projeto.git
cd novo_projeto

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor será iniciado em `http://localhost:5173` (ou outra porta disponível).

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

---

## 🧪 Credenciais de Teste

| Usuário | Senha | Perfil |
|---------|-------|--------|
| `RAFAEL_PEDRICO` | `12345` | Inspetor |
| `QUALIDADE_01` | `12345` | Analista da Qualidade |
| `PRODUCAO_01` | `12345` | Líder de Produção |
| `COORD_QUALIDADE` | `12345` | Coordenador da Qualidade |

---

## ✨ Tecnologias

- **Vue 3** — Framework progressivo com Composition API (`<script setup>`)
- **Vite** — Build tool ultrarrápida
- **Vue Router** — Roteamento SPA
- **LocalStorage API** — Persistência de dados
- **CSS3** — Temas claro/escuro, @media print, variáveis CSS
- **Web Speech API** — Reconhecimento de voz para entrada de medições (opcional)

---

## 📄 Licença

Proprietário — Uso industrial controlado.

---

<p align="center">🔒 Sistema Protegido • Acesso autorizado e monitorado</p>
</write_to_file>
<task_progress>
- [x] Create src/store.js with reactive global state
- [x] Update LoginView.vue to use global store
- [x] Update ConfiguradorView.vue to use global store
- [x] Update InspecaoView.vue to use global store
- [x] Update RncView.vue to use global store
- [x] Update FinalizadoView.vue to use global store
- [x] Add LocalStorage persistence (save/load) in store.js
- [x] Centralize temaAtual in store.js
- [x] Update App.vue with theme binding + persistence watcher
- [x] Update InspecaoView.vue template references to store.temaAtual
- [x] Add window.print() + @media print CSS to FinalizadoView
- [x] Add keyboard shortcuts (Arrow keys + Enter) to InspecaoView
- [x] Add novoLote() cleanup function to FinalizadoView
- [x] Create professional README.md documentation
</task_progress>
</write_to_file>