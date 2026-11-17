<script setup>
import { RouterLink } from 'vue-router'

defineProps({ caseInfo: { type: Object, required: true } })
</script>

<template>
  <article class="case-card">
    <div class="case-visual" aria-label="预览图待接入">
      <div class="case-visual-grid"></div>
      <div class="case-visual-pipe"></div>
      <span class="case-preview-note">论文预览图待接入 · 非真实流场</span>
    </div>
    <div class="case-content">
      <div class="case-heading">
        <h3>{{ caseInfo.name }}</h3>
        <span class="level-badge" :class="`level-${caseInfo.level}`">{{ caseInfo.levelText }}</span>
      </div>
      <p class="muted">{{ caseInfo.description }}</p>
      <div class="metric-pair">
        <div><small>压力 relative L2</small><strong>{{ caseInfo.metrics.pressureRelativeL2.toFixed(3) }}</strong></div>
        <div><small>速度 relative L2</small><strong>{{ caseInfo.metrics.speedRelativeL2.toFixed(3) }}</strong></div>
      </div>
      <div class="card-actions">
        <RouterLink class="btn btn-secondary" :to="`/cases/${caseInfo.caseId}`">查看详情</RouterLink>
        <RouterLink class="btn btn-primary" :to="{ path: '/simulation', query: { case: caseInfo.caseId } }">用此案例演示</RouterLink>
      </div>
      <small class="source-hint">参考论文数据 · {{ caseInfo.source }}</small>
    </div>
  </article>
</template>
