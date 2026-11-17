<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CASES, FIELD_OPTIONS, LAYER_OPTIONS } from '../data/cases'
import { submitSimulationPreview } from '../services/demoCaseService'

const route = useRoute()
const router = useRouter()
const allowedIds = CASES.map((item) => item.caseId)
const initialId = allowedIds.includes(String(route.query.case)) ? String(route.query.case) : '0415'
const selectedCaseId = ref(initialId)
const selectedCase = computed(() => CASES.find((item) => item.caseId === selectedCaseId.value))
const schema = computed(() => selectedCase.value?.parameterSchema)
const fieldErrors = reactive({})
const message = ref('')
const toast = ref('')
const submitting = ref(false)
const showResetConfirm = ref(false)
const showPreviewSuccess = ref(false)
const form = reactive({
  presetId: '',
  parameters: {},
  field: 'surfacePressure',
  layer: 'prediction',
  quality: 'balanced',
  palette: 'viridis'
})

function defaultsForCurrentCase() {
  const currentSchema = schema.value
  form.presetId = currentSchema?.presets?.[0]?.id ?? ''
  form.parameters = Object.fromEntries((currentSchema?.fields ?? []).map((field) => [field.key, field.defaultValue]))
  form.field = 'surfacePressure'
  form.layer = 'prediction'
  form.quality = 'balanced'
  form.palette = 'viridis'
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])
  message.value = ''
}

watch(selectedCaseId, (caseId) => {
  defaultsForCurrentCase()
  router.replace({ path: '/simulation', query: { case: caseId } })
})
watch(() => route.query.case, (caseId) => {
  if (allowedIds.includes(String(caseId)) && selectedCaseId.value !== String(caseId)) selectedCaseId.value = String(caseId)
})
defaultsForCurrentCase()

const hasChanges = computed(() => {
  const s = schema.value
  return form.presetId !== (s?.presets?.[0]?.id ?? '') ||
    (s?.fields ?? []).some((f) => Number(form.parameters[f.key]) !== f.defaultValue) ||
    form.field !== 'surfacePressure' || form.layer !== 'prediction' ||
    form.quality !== 'balanced' || form.palette !== 'viridis'
})

function validateField(item) {
  const value = Number(form.parameters[item.key])
  if (form.parameters[item.key] === '' || !Number.isFinite(value)) {
    fieldErrors[item.key] = '请输入有效数字'
  } else if (value < item.min || value > item.max) {
    fieldErrors[item.key] = `请输入 ${item.min} 至 ${item.max}${item.unit || ''} 之间的数值`
  } else {
    delete fieldErrors[item.key]
  }
}

function snapToStep(item) {
  validateField(item)
  if (fieldErrors[item.key]) return
  const current = Number(form.parameters[item.key])
  const steps = Math.round((current - item.min) / item.step)
  const raw = item.min + steps * item.step
  const precision = (String(item.step).split('.')[1] || '').length
  const corrected = Math.max(item.min, Math.min(item.max, Number(raw.toFixed(precision))))
  if (Math.abs(current - corrected) > 1e-9) {
    form.parameters[item.key] = corrected
    toast.value = `${item.label}已按步长 ${item.step} 修正`
  }
}

function validate() {
  message.value = ''
  if (!allowedIds.includes(selectedCaseId.value)) message.value = '请选择有效案例。'
  if (!schema.value?.presets?.some((p) => p.id === form.presetId)) message.value = '请选择有效工况预设。'
  for (const item of schema.value?.fields ?? []) validateField(item)
  if (Object.keys(fieldErrors).length) message.value = '参数存在错误，请检查标红的输入框。'
  return !message.value
}

function requestReset() {
  if (!hasChanges.value) return defaultsForCurrentCase()
  showResetConfirm.value = true
}
function applyReset() { defaultsForCurrentCase(); showResetConfirm.value = false }
async function submit() {
  if (submitting.value || !validate()) return
  const payload = {
    caseId: selectedCaseId.value,
    presetId: form.presetId,
    parameters: { ...form.parameters },
    view: { field: form.field, layer: form.layer, quality: form.quality, palette: form.palette }
  }
  submitting.value = true
  try {
    await submitSimulationPreview(payload)
    showPreviewSuccess.value = true
  } catch (error) {
    message.value = error?.message || '任务创建失败，请检查连接后重试。'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main>
    <div class="page-top container"><div class="eyebrow">SIMULATION DEMO</div><h1>仿真演示配置</h1><p>选择案例与显示参数，完成前端交互校验。真正的 Mock 任务创建由对应模块接入。</p></div>
    <section class="container section compact-top">
      <div class="steps-line"><span class="step-current">① 配置参数</span><span>② 等待任务</span><span>③ 查看结果</span></div>
      <div class="simulation-grid">
        <form class="form-card" @submit.prevent="submit" novalidate>
          <div class="form-section"><h2>01 · 选择案例</h2><label class="form-field"><span>案例编号 <b class="required">*</b></span><select v-model="selectedCaseId" :disabled="submitting"><option v-for="c in CASES" :key="c.caseId" :value="c.caseId">{{ c.name }} · {{ c.levelText }}</option></select></label><p class="muted small">当前案例：{{ selectedCase.description }}</p></div>
          <div class="form-section"><h2>02 · 工况预设与演示参数</h2><label class="form-field"><span>工况预设 <b class="required">*</b></span><select v-model="form.presetId" :disabled="submitting"><option v-for="preset in schema?.presets || []" :key="preset.id" :value="preset.id">{{ preset.name }}</option></select></label>
            <div v-for="item in schema?.fields || []" :key="item.key" class="parameter-field"><div class="parameter-head"><label :for="item.key">{{ item.label }}</label><span>{{ item.min }} – {{ item.max }} {{ item.unit }}</span></div><div class="range-row"><input :id="item.key" v-model.number="form.parameters[item.key]" type="range" :min="item.min" :max="item.max" :step="item.step" :disabled="submitting" @change="validateField(item)"/><input v-model.number="form.parameters[item.key]" class="number-input" type="number" :min="item.min" :max="item.max" :step="item.step" :disabled="submitting" :aria-invalid="!!fieldErrors[item.key]" @blur="snapToStep(item)" /></div><p v-if="fieldErrors[item.key]" class="input-error">{{ fieldErrors[item.key] }}</p></div>
            <p v-if="!(schema?.fields?.length)" class="notice warning">该案例尚无参数 schema，请先让数据组提供相应字段。</p>
            <div v-if="schema?.demoOnly" class="notice warning">当前演示参数为纯 UI 联调占位（无物理意义），并非来自论文的真实工况参数；正式联调时必须替换为案例 JSON 的 parameterSchema。</div>
          </div>
          <div class="form-section"><h2>03 · 初始显示设置</h2><div class="two-columns"><label class="form-field"><span>初始物理场</span><select v-model="form.field" :disabled="submitting"><option v-for="f in FIELD_OPTIONS" :key="f.value" :value="f.value">{{ f.label }}（{{ f.unit }}）</option></select></label><label class="form-field"><span>初始数据层</span><select v-model="form.layer" :disabled="submitting"><option v-for="l in LAYER_OPTIONS" :key="l.value" :value="l.value">{{ l.label }}</option></select></label><label class="form-field"><span>点云质量</span><select v-model="form.quality" :disabled="submitting"><option value="fast">流畅</option><option value="balanced">均衡</option><option value="fine">精细</option></select></label><label class="form-field"><span>调色板</span><select v-model="form.palette" :disabled="submitting"><option value="viridis">Viridis</option><option value="turbo">Turbo</option><option value="coolwarm">Coolwarm</option></select></label></div></div>
          <div class="notice">当前为静态数据驱动的流程演示，提交参数不会触发真实 CFD 或模型计算。</div>
          <div v-if="message" class="notice error" role="alert">{{ message }}</div>
          <div v-if="toast" class="notice" role="status">{{ toast }} <button type="button" class="link-button" @click="toast = ''">关闭</button></div>
          <div class="form-actions"><button type="button" class="btn btn-secondary" :disabled="submitting" @click="requestReset">重置</button><button type="submit" class="btn btn-primary" :disabled="submitting"><span v-if="submitting" class="spinner"></span>{{ submitting ? '正在验证演示配置…' : '验证并模拟提交（联调模式）' }}</button></div>
        </form>
        <aside class="summary-card"><div class="eyebrow">SUMMARY</div><h2>参数摘要</h2><dl><dt>案例</dt><dd>{{ selectedCase.name }}</dd><dt>工况预设</dt><dd>{{ form.presetId || '未选择' }}</dd><template v-for="item in schema?.fields || []" :key="item.key"><dt>{{ item.label }}</dt><dd>{{ form.parameters[item.key] }} {{ item.unit }}</dd></template><dt>物理场</dt><dd>{{ FIELD_OPTIONS.find((f) => f.value === form.field)?.label }}</dd><dt>数据层</dt><dd>{{ LAYER_OPTIONS.find((f) => f.value === form.layer)?.label }}</dd><dt>质量</dt><dd>{{ form.quality }}</dd><dt>调色板</dt><dd>{{ form.palette }}</dd></dl><p class="muted small">来源：main.pdf · 任务服务待对接</p><RouterLink to="/cases" class="text-link">← 返回案例库</RouterLink></aside>
      </div>
    </section>
    <div v-if="showResetConfirm" class="modal-backdrop" @click.self="showResetConfirm = false"><section class="modal-panel" role="dialog" aria-modal="true" aria-label="重置确认"><h2>确定重置参数？</h2><p>当前案例已修改的参数将恢复默认值。</p><div class="right action-gap"><button class="btn btn-secondary" @click="showResetConfirm = false">取消</button><button class="btn btn-primary" @click="applyReset">确认重置</button></div></section></div>
    <div v-if="showPreviewSuccess" class="modal-backdrop" @click.self="showPreviewSuccess = false"><section class="modal-panel" role="dialog" aria-modal="true" aria-label="联调提示"><h2>表单验证通过</h2><p>已完成前端的加载动画和提交流程测试。当前为联调演示，不会生成 taskId，也不会运行真实仿真。</p><p class="muted">待 Mock 组提供 submitSimulation() 后，再替换预览调用并跳转到 /tasks/:taskId。</p><div class="right"><button class="btn btn-primary" @click="showPreviewSuccess = false">确认</button></div></section></div>
  </main>
</template>
