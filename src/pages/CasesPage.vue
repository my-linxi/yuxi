<script setup>
import { computed, ref } from 'vue'
import { CASES } from '../data/cases'
import CaseCard from '../components/CaseCard.vue'
const keyword = ref('')
const level = ref('all')
const sort = ref('recommended')
const filteredCases = computed(() => {
  const query = keyword.value.toLowerCase().replace(/\s+/g, '').replace(/^case/, '')
  const matching = CASES.filter((item) =>
    (level.value === 'all' || level.value === item.level) &&
    (!query || item.caseId.includes(query))
  )
  if (sort.value === 'pressure') return [...matching].sort((a, b) => a.metrics.pressureRelativeL2 - b.metrics.pressureRelativeL2)
  if (sort.value === 'speed') return [...matching].sort((a, b) => a.metrics.speedRelativeL2 - b.metrics.speedRelativeL2)
  return matching
})
function resetFilters() { keyword.value = ''; level.value = 'all'; sort.value = 'recommended' }
</script>

<template>
  <main>
    <div class="page-top container"><div class="eyebrow">CASE LIBRARY</div><h1>典型案例库</h1><p>三组来自参考文献的代表案例，覆盖低、中、高误差情形。下方指标均为论文数据，非本平台算法产出。</p></div>
    <section class="container section compact-top">
      <div class="filter-bar"><label class="filter-field">搜索案例编号<input v-model="keyword" type="search" placeholder="0415 或 Case 0415" /></label><label class="filter-field">误差水平<select v-model="level"><option value="all">全部</option><option value="low">低误差</option><option value="medium">中等误差</option><option value="high">高误差</option></select></label><label class="filter-field">排序方式<select v-model="sort"><option value="recommended">推荐顺序</option><option value="pressure">压力误差从低到高</option><option value="speed">速度误差从低到高</option></select></label><div class="filter-count">共 {{ filteredCases.length }} 个案例</div></div>
      <div v-if="filteredCases.length" class="case-grid"><CaseCard v-for="caseInfo in filteredCases" :key="caseInfo.caseId" :case-info="caseInfo" /></div>
      <div v-else class="empty-state"><h3>没有找到匹配案例</h3><p>试试其他案例编号或调整误差等级。</p><button class="btn btn-primary" @click="resetFilters">清除筛选</button></div>
    </section>
  </main>
</template>
