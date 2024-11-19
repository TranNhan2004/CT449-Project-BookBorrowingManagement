<template>
  <div id="my-app">
    <AppHeader/>
    
    <div class="container mt-4">
      <router-view />
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/partials/AppHeader.vue';
import AppFooter from './components/partials/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
};
</script>

<style>
@import "./assets/css/styles.css";
</style>
