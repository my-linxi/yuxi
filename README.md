# FlowViz 业务页面补全包（Vue 3 + Vue Router）

此包是基于《代码规范.pdf》《基于流体仿真数据的三维 Web 可视化交互平台 PRD.pdf》整理的**前端联调版本**，用于补全缺失的页面文件。使用前请先备份自己已有的代码。

## 目录与复制

将本压缩包的 `src/` 内文件复制到现有项目 `/home/chen/yuxi/src/`：
- `src/App.vue` **将覆盖原文件**，负责统一导航、页脚和 `<RouterView/>`。
- `src/pages/` 中的 7 个页面文件与原路由名称对应。
- `src/data/cases.js` 是从 PRD 提取的三个案例和聚合指标；`parameterSchema` 是**专供 UI 联调的无物理意义占位结构**，绝非论文物理参数。
- `src/services/demoCaseService.js` 提供本地页面数据和短暂加载演示，**不创建真实 taskId**。
- `src/styles/flowviz.css` 由 `App.vue` 引入，不要求修改 `main.js`。


```bash
cd /home/.../yuxi
npm install vue-router@4
npm run dev
```

## 页面清单

- 首页：`/`
- 项目介绍：`/project`
- 案例库：`/cases`
- 案例详情：`/cases/0415`, `/cases/0577`, `/cases/0072`
- 参数配置：`/simulation?case=0415`
- 关于我们：`/about`
- 404：`/404`

## 与其他组员集成

1. 数据组给出正式案例 JSON 后，将 `caseInfo.parameterSchema` 中的演示占位参数替换为真实 JSON 中 `presets` 和 `fields` 的字段结构；不要自行造数据。改动字段前应先与团队确认接口契约。
2. Mock 组提供 `submitSimulation()` 后，在 `SimulationPage.vue` 替换 `submitSimulationPreview()`；创建成功后通过 `router.push('/tasks/' + taskId)` 跳转；任务状态页与结果页交给其他组员维护。
3. Three.js 组提供 `FlowScene.vue` 后，将 `HomePage.vue` 内 `hero-preview` 占位区域换成接收 props 的三维组件。
4. 数据组提供论文授权预览图后，将 `CaseCard.vue` 和 `CaseDetailPage.vue` 的装饰性占位区域替换成真实案例图；严禁将占位图当作真实流场。
5. 当前主导航中的“历史记录（待接入）”为不可点击提示，等历史组完成 `/history` 再改为实际路由。

## 质量说明

- 所有标为“参考论文”的指标都来自 PRD V1.0，不是团队计算结果。
- 当前 0–10 演示滑块的数值**不是**任何流体工况参数，且它们来自单独标记的 UI-only schema；它们只用于联调校验、重置及加载动画。
- 成功弹窗只确认前端表单和加载交互，不表示任务已创建或仿真成功。
- 首版主要适配电脑端；小屏可查看静态内容。
