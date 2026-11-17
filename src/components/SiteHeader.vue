<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
const route = useRoute()
const scrolled = ref(false)
const navigation = [
  { label: '首页', to: '/' },
  { label: '项目介绍', to: '/project' },
  { label: '案例库', to: '/cases' },
  { label: '仿真演示', to: '/simulation' },
  { label: '关于我们', to: '/about' }
]
const isSimulation = computed(() => route.path === '/simulation')
function checkScroll() { scrolled.value = window.scrollY > 64 }
onMounted(() => { window.addEventListener('scroll', checkScroll, { passive: true }); checkScroll() })
onUnmounted(() => window.removeEventListener('scroll', checkScroll))
</script>

<template>
  <header class="site-header" :class="{ 'site-header-scrolled': scrolled }">
    <div class="container header-inner">
      <RouterLink class="brand" to="/" aria-label="返回首页"><span class="brand-symbol">≈</span><span>FlowViz <small>流场可视化平台</small></span></RouterLink>
      <nav class="main-nav" aria-label="主导航">
        <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" :class="{ active: item.to === '/' ? route.path === '/' : route.path.startsWith(item.to) }">{{ item.label }}</RouterLink>
        <span class="nav-disabled" title="由历史记录模块组员接入">历史记录（待接入）</span>
      </nav>
      <RouterLink v-if="!isSimulation" class="btn btn-primary header-cta" to="/simulation">开始演示</RouterLink>
    </div>
  </header>
</template>
