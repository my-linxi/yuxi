<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CASES } from '../data/cases'
const route = useRoute()
const router = useRouter()
const current = computed(() => CASES.find((item) => item.caseId === route.params.caseId))
const index = computed(() => CASES.findIndex((item) => item.caseId === route.params.caseId))
const field = ref('surfacePressure')
const previewLayers = [
  { id: 'reference', name: '参考值' },
  { id: 'prediction', name: '预测值' },
  { id: 'absoluteError', name: '绝对误差' }
]
watch(() => route.params.caseId, () => { if (!current.value) router.replace('/404') }, { immediate: true })
</script>

<template>
  <main v-if="current">
    <div class="page-top container"><RouterLink to="/cases" class="text-link">← 返回案例库</RouterLink><div class="eyebrow top-space">CASE DETAILS</div><div class="title-row"><h1>{{ current.name }}</h1><span class="level-badge" :class="`level-${current.level}`">{{ current.levelText }}</span></div><p>{{ current.description }}</p></div>
    <section class="container section compact-top"><div class="toolbar-row"><h2>三层数据预览</h2><label class="field-inline">预览物理场 <select v-model="field"><option value="surfacePressure">近壁面压力 (kPa)</option><option value="speed">合速度 (m/s)</option></select></label></div><div class="preview-grid"><article v-for="layer in previewLayers" :key="layer.id" class="preview-card"><h3>{{ layer.name }}</h3><div class="preview-image"><div class="preview-pipe"></div><span>该 {{ field === 'speed' ? '合速度' : '近壁面压力' }} 预览图待数据组接入</span></div><p class="muted small">此区域为占位，不代表真实论文流场图。</p></article></div></section>
    <section class="container section compact-top"><div class="metric-summary"><div class="metric-box"><span>压力 relative L2</span><strong>{{ current.metrics.pressureRelativeL2.toFixed(3) }}</strong></div><div class="metric-box"><span>速度 relative L2</span><strong>{{ current.metrics.speedRelativeL2.toFixed(3) }}</strong></div><div class="metric-box"><span>案例定位</span><strong class="smaller">{{ current.levelText }}</strong></div></div><div v-if="current.caseId === '0072'" class="notice warning">Case 0072 用于展示困难工况与模型局限性，不能将其表现泛化至所有工况。</div><div class="notice">所有误差指标均来自参考论文 main.pdf；页面未执行真实 CFD 或模型训练。</div></section>
    <section class="container section compact-top"><div class="detail-actions"><RouterLink v-if="index > 0" class="btn btn-secondary" :to="`/cases/${CASES[index - 1].caseId}`">← 上一个案例</RouterLink><span v-else></span><RouterLink class="btn btn-primary" :to="{ path: '/simulation', query: { case: current.caseId } }">使用此案例开始演示 →</RouterLink><RouterLink v-if="index < CASES.length - 1" class="btn btn-secondary" :to="`/cases/${CASES[index + 1].caseId}`">下一个案例 →</RouterLink><span v-else></span></div></section>
  </main>
</template>
