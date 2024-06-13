<template>
  <HelloWorld msg="Welcome to Your Vue.js App" />

</template>

<script>

import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
@font-face {
  font-family: 'Futura PT bold';
  src: url('@/assets/fonts/futura-pt-bold.ttf');
  src: local('@/assets/fonts/futura-pt-bold.ttf'), local('Futura PT bold'),
    url('@/assets/fonts/futura-pt-bold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: 'Futura PT light';
  src: url('@/assets/fonts/futura-pt-light.ttf');
  src: local('@/assets/fonts/futura-pt-light.ttf'), local('Futura PT light'),
    url('@/assets/fonts/futura-pt-light.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

#app {

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-style: normal;
}
</style>
