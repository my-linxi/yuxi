<script setup>
import { DATA_DISCLAIMER } from '../data/cases'
const responsibilities = [
  ['产品与架构', '产品需求、路由方案、数据契约和模块接口'],
  ['业务页面', '首页、项目介绍、案例展示、配置表单与页面样式'],
  ['Mock 与交互', '任务提交、状态切换、异常反馈和本地历史'],
  ['三维可视化', '点云渲染、物理场切换、视角交互与导出'],
  ['测试与文档', '测试用例、问题跟踪、使用说明与演示材料']
]
</script>

<template>
  <main>
    <div class="page-top container"><div class="eyebrow">ABOUT US</div><h1>关于我们</h1><p>一个围绕流体仿真数据展示展开的多模块前端协作项目。</p></div>
    <section class="section container compact-top"><h2>项目简介</h2><p>我们将参考论文中的管道流场实验样例整理为适合浏览器展示的案例，结合 Vue 3、Mock 接口与 Three.js，实现从案例选择到三维结果浏览的演示流程。</p><h2 class="top-space">团队分工</h2><div class="feature-grid"><article v-for="item in responsibilities" :key="item[0]" class="feature-card"><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></article></div></section>
    <section class="section section-soft"><div class="container"><h2>技术与成果</h2><div class="split-layout"><div class="info-panel"><h3>前端技术栈</h3><p>Vue 3 / Vue Router / Vite / Three.js / Mock API / 静态 JSON</p></div><div class="info-panel"><h3>阶段性成果</h3><p>需求文档、前端页面、案例展示、演示流程和相关测试文档；最终成果以团队实际验收为准。</p></div></div></div></section>
    <section class="section container"><div class="callout"><div><h2>数据使用说明与致谢</h2><p>{{ DATA_DISCLAIMER }}</p><p>参考论文：Geometry-Conditioned Anchored-Branched Transformers for Three-Dimensional Pipe-Flow Surrogate Modeling（来源文件：main.pdf）。</p></div><RouterLink to="/project" class="btn btn-secondary">了解技术路线</RouterLink></div></section>
  </main>
</template>
