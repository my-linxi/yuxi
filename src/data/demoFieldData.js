const GOLDEN_ANGLE = 0.61803398875

export function createDemoFieldData(count) {
  const positions = new Float32Array(count * 3)
  const fields = {
    speed: createLayers(count),
    pressure: createLayers(count),
  }

  for (let index = 0; index < count; index += 1) {
    const angle = ((index * GOLDEN_ANGLE) % 1) * Math.PI * 2
    const x = (((index * 0.754877666) % 1) - 0.5) * 7.4
    const radius = 0.67 + ((index * 0.569840291) % 1) * 0.1
    const y = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    positions.set([x, y, z], index * 3)

    writeLayers(fields.speed, index, 0.5 + 0.5 * Math.sin(x * 1.2 + angle * 2), x, angle)
    writeLayers(fields.pressure, index, 0.5 + 0.5 * Math.cos(x * 0.62) * Math.sin(angle * 3), x, angle)
  }

  return {
    schemaVersion: 1,
    source: 'generated-demo',
    disclaimer: '程序生成的交互示意数据，不代表真实仿真结果',
    positions,
    fields,
  }
}

function createLayers(count) {
  return {
    reference: new Float32Array(count),
    prediction: new Float32Array(count),
    error: new Float32Array(count),
  }
}

function writeLayers(layers, index, rawReference, x, angle) {
  const reference = clamp(rawReference)
  const error = 0.025 + 0.12 * Math.abs(Math.sin(x * 0.8 + angle))
  const prediction = clamp(reference + Math.sin(angle * 2) * error)
  layers.reference[index] = reference
  layers.prediction[index] = prediction
  layers.error[index] = Math.abs(prediction - reference)
}

function clamp(value) {
  return Math.max(0, Math.min(1, value))
}

// 真实 JSON 接入时只要转换成同样的 positions + fields 结构，Three.js 组件无需改动。
export function normalizeFieldData(data) {
  if (!data?.positions || !data?.fields) throw new Error('INVALID_FIELD_DATA')
  return {
    ...data,
    positions: data.positions instanceof Float32Array ? data.positions : new Float32Array(data.positions),
    fields: Object.fromEntries(Object.entries(data.fields).map(([field, layers]) => [field, {
      reference: layers.reference instanceof Float32Array ? layers.reference : new Float32Array(layers.reference),
      prediction: layers.prediction instanceof Float32Array ? layers.prediction : new Float32Array(layers.prediction),
      error: layers.error instanceof Float32Array ? layers.error : new Float32Array(layers.error),
    }])),
  }
}
