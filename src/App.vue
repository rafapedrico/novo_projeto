<template>
  <div class="modulo-qualidade-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Reset básico para o subsistema rodar limpo dentro do iframe */
body, html, #app, .modulo-qualidade-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: sans-serif;
  background-color: #f5f6fa;
}
</style>