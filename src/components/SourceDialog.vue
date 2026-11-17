<script setup>
import { onMounted, onUnmounted } from 'vue'
import { DATA_DISCLAIMER } from '../data/cases'
const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])
function onKeydown(event) { if (props.open && event.key === 'Escape') emit('close') }
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
    <section class="modal-panel" role="dialog" aria-modal="true" aria-label="数据来源说明">
      <div class="modal-head"><h2>数据来源说明</h2><button class="icon-button" aria-label="关闭弹窗" @click="$emit('close')">×</button></div>
      <p>{{ DATA_DISCLAIMER }}</p>
      <p class="muted">参考文献：Geometry-Conditioned Anchored-Branched Transformers for Three-Dimensional Pipe-Flow Surrogate Modeling；来源文件：main.pdf。</p>
      <p class="muted">指标约定：RMSE、MAE、R² 和 relative L2 均应结合物理场与数据范围解读；聚合结果不代表单个案例的独立精度。</p>
      <div class="right"><button class="btn btn-primary" @click="$emit('close')">我知道了</button></div>
    </section>
  </div>
</template>
