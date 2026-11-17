<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import './styles/flowviz.css'
</script>

<template>
  <SiteHeader />
  <RouterView />
  <SiteFooter />
  <footer class="egg-footer"></footer>
</template>
<footer class="egg-footer"> </footer>