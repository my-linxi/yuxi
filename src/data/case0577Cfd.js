const sources = {
  surfacePressure: ['surface-pressure.json', 'kPa'],
  speed: ['volume-speed.json', 'm/s'],
  ux: ['volume-speed.json', 'm/s'],
  uy: ['volume-speed.json', 'm/s'],
  uz: ['volume-speed.json', 'm/s'],
}
const requests = new Map()

export function loadCase0577Field(field) {
  return loadPointField('0577', 'case-0577', 'reference', field)
}

export const syntheticCaseId = 'synthetic-pipe-000'

export function isSyntheticDemo(query) {
  return !query?.case || (query.demo === syntheticCaseId && query.case !== '0577')
}

export function loadSyntheticField(field) {
  return loadPointField(syntheticCaseId, syntheticCaseId, 'synthetic', field)
}

async function loadPointField(caseId, directory, layer, field) {
  if (!Object.hasOwn(sources, field)) return null
  const [filename, unit] = sources[field]
  const base = import.meta.env?.BASE_URL ?? '/'
  const url = `${base}cfd/${directory}/${layer}/${filename}`
  if (!requests.has(url)) {
    // Publish only the exported JSON files under public/cfd. The archive stays outside the app.
    requests.set(url, fetch(url).then(async (response) => {
      if (response.status === 404 || response.headers.get('content-type')?.includes('text/html')) return null
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json()
    }).catch((error) => {
      requests.delete(url)
      throw error
    }))
  }
  const data = await requests.get(url)
  if (!data) {
    requests.delete(url)
    return null
  }
  if (data.caseId !== caseId || data.layer !== layer || data.coordinateUnit !== 'm' || !data.source) {
    throw new Error(`Invalid ${caseId} dataset metadata`)
  }
  const series = data.fields?.[field]
  if (!series && ['ux', 'uy', 'uz'].includes(field)) return null
  const positions = data.positions
  const values = series?.values
  if (series?.unit !== unit || !Array.isArray(values) || !values.length ||
      !Array.isArray(positions) || positions.length !== values.length * 3 ||
      !positions.every(Number.isFinite) || !values.every(Number.isFinite)) {
    throw new Error(`Invalid ${caseId} samples`)
  }

  const lower = [Infinity, Infinity, Infinity]
  const upper = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < positions.length; i++) {
    const axis = i % 3
    lower[axis] = Math.min(lower[axis], positions[i])
    upper[axis] = Math.max(upper[axis], positions[i])
  }
  const center = lower.map((value, axis) => (value + upper[axis]) / 2)
  const span = Math.max(...upper.map((value, axis) => value - lower[axis])) || 1
  const displayPositions = Float32Array.from(positions, (value, i) => (value - center[i % 3]) * 7.4 / span)
  let min = Infinity
  let max = -Infinity
  for (const value of values) {
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  return { positions, displayPositions, values, unit, min, max }
}
