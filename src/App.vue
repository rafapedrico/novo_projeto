<template>
  <router-view />
</template>

<script setup>
</script>

<style>
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-body);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>