<script setup>
import { REFERENCE_METRICS, DATA_DISCLAIMER } from '../data/cases'
const steps = [
  ['01', '整理静态实验数据', '使用参考资料中可核验的数据及可视化素材。'],
  ['02', 'Mock 任务演示', '模拟选择参数、创建任务和等待结果，不执行实际求解。'],
  ['03', 'Three.js 点云展示', '由独立可视化模块提供旋转、缩放与颜色图例。'],
  ['04', '导出与历史回看', '由结果和历史模块提供截图、数据导出及本地记录。']
]
</script>

<template>
  <main>
    <div class="page-top container"><div class="eyebrow">ABOUT THE PROJECT</div><h1>项目介绍</h1><p>将参考论文中离线实验得到的管道流场结果组织成一个可浏览、可比较、可交互的网页演示平台。</p></div>
    <section class="section container split-layout"><div><h2>为什么做这个项目？</h2><p>传统流体仿真结果通常依赖专门工具查看，不便于快速讲解与分享。本平台以浏览器作为交互入口，通过典型案例、参数配置和三维可视化，展示研究数据的主要特点。</p><p>目标用户包括指导教师、答辩评委、学生及流体仿真相关研究人员。</p></div><div class="info-panel"><h3>首版技术方案</h3><div class="stack-tag">Vue 3 · 前端页面和状态</div><div class="stack-tag">Three.js · 三维点云场景</div><div class="stack-tag">Mock API · 模拟任务流程</div><div class="stack-tag">Static JSON · 参考案例数据</div></div></section>
    <section class="section section-soft"><div class="container"><div class="section-heading"><div><div class="eyebrow">IMPLEMENTATION</div><h2>实现路线</h2></div></div><div class="steps-grid"><article v-for="step in steps" :key="step[0]" class="step-card"><span>{{ step[0] }}</span><h3>{{ step[1] }}</h3><p>{{ step[2] }}</p></article></div></div></section>
    <section class="section container"><h2>参考论文聚合指标</h2><p class="muted">以下为 PRD 引用的最终 dual-expert 聚合指标，来自参考论文，非本项目训练结果；不代表任何单个案例的精度。</p><div class="table-scroll"><table class="data-table"><thead><tr><th>物理场</th><th>单位</th><th>RMSE</th><th>MAE</th><th>R²</th></tr></thead><tbody><tr v-for="m in REFERENCE_METRICS" :key="m.label"><td>{{ m.label }}</td><td>{{ m.unit }}</td><td>{{ m.rmse.toFixed(3) }}</td><td>{{ m.mae.toFixed(3) }}</td><td>{{ m.r2.toFixed(3) }}</td></tr></tbody></table></div><p class="muted small">提示：RMSE 为均方根误差，MAE 为平均绝对误差，R² 为决定系数；这些值需要结合物理场和数据集理解。</p></section>
    <section class="section container"><div class="callout"><div><h2>项目范围与数据声明</h2><p>{{ DATA_DISCLAIMER }}</p><p>不运行真实 CFD、不训练 AB-UPT、不提供账号和数据库；不支持上传 CAD 或自定义数据集。</p></div><RouterLink to="/cases" class="btn btn-primary">查看案例 →</RouterLink></div></section>
  </main>
</template>
