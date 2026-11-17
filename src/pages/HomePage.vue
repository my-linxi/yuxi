<script setup>
import { CASES, DATA_DISCLAIMER } from '../data/cases'
import CaseCard from '../components/CaseCard.vue'
const features = [
  { number: '01', title: '参数化演示流程', desc: '选择案例并配置演示参数，预留 Mock 任务接口。' },
  { number: '02', title: '交互式三维点云', desc: '后续对接 Three.js 场景，浏览管道流场的空间分布。' },
  { number: '03', title: '多物理场对比', desc: '支持参考值、预测值与绝对误差的展示流程。' },
  { number: '04', title: '结果导出与回看', desc: '结果模块接入后，可进行截图、数据导出与历史查看。' }
]
</script>

<template>
  <main>
    <section class="hero-section">
      <div class="container hero-layout">
        <div>
          <div class="eyebrow">RESEARCH DATA · WEB VISUALIZATION</div>
          <h1>让复杂的<span class="gradient-text">三维流场数据</span><br>变得直观、可交互</h1>
          <p class="hero-lead">基于既有流体仿真数据的 Web 可视化演示平台。通过案例浏览、参数配置与三维结果展示，帮助理解管道流场中的压力与速度信息。</p>
          <div class="hero-actions"><RouterLink to="/simulation" class="btn btn-primary btn-lg">开始仿真演示 →</RouterLink><RouterLink to="/cases" class="btn btn-secondary btn-lg">浏览典型案例</RouterLink></div>
          <div class="hero-tags"><span>Vue 3</span><span>Three.js</span><span>Mock API</span><span>静态 JSON</span></div>
        </div>
        <div class="hero-preview">
          <div class="preview-toolbar"><span class="status-dot"></span> Case 0415 · 主视觉区域</div>
          <div class="preview-canvas">
            <div class="preview-rings"></div><div class="preview-pipe"></div>
            <div class="preview-placeholder">Three.js 点云预览待集成<br><small>当前为装饰性占位示意，非实际计算图像</small></div>
          </div>
          <div class="preview-footer"><span>近壁面压力 / 合速度</span><span>来源：main.pdf</span></div>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="section-heading"><div><div class="eyebrow">CAPABILITIES</div><h2>核心能力</h2></div><p>以清晰、可验证的业务流程连接数据与三维表现。</p></div>
      <div class="feature-grid"><article v-for="f in features" :key="f.number" class="feature-card"><span class="feature-number">{{ f.number }}</span><h3>{{ f.title }}</h3><p>{{ f.desc }}</p></article></div>
    </section>

    <section class="section section-soft"><div class="container">
      <div class="section-heading"><div><div class="eyebrow">CASE LIBRARY</div><h2>三个典型案例</h2></div><RouterLink class="text-link" to="/cases">进入案例库 →</RouterLink></div>
      <div class="case-grid"><CaseCard v-for="caseInfo in CASES" :key="caseInfo.caseId" :case-info="caseInfo" /></div>
    </div></section>

    <section class="section container"><div class="callout"><div><div class="eyebrow">DATA TRANSPARENCY</div><h2>清晰的数据来源与实现边界</h2><p>{{ DATA_DISCLAIMER }}</p></div><RouterLink class="btn btn-secondary" to="/project">了解项目详情</RouterLink></div></section>
  </main>
</template>
