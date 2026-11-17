<script setup>
import { ref } from 'vue'
import SourceDialog from './SourceDialog.vue'
const sourceDialogOpen = ref(false)
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>FlowViz · 三维流场可视化演示</strong><p>静态数据 + Mock 流程，不运行真实 CFD 或模型推理。</p></div>
      <div class="footer-right"><span>建议使用 Chrome / Edge 电脑端浏览器</span><button type="button" class="link-button" @click="sourceDialogOpen = true">查看数据来源</button></div>
    </div>
    <SourceDialog :open="sourceDialogOpen" @close="sourceDialogOpen = false" />
  </footer>
</template>
