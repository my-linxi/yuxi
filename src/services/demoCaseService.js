import { CASES } from '../data/cases'

// Local-only page integration adapter; replace with the team's services/ Mock implementations.
export async function getCases() {
  return CASES
}

export async function getCase(caseId) {
  const item = CASES.find((entry) => entry.caseId === String(caseId))
  if (!item) throw new Error('CASE_NOT_FOUND')
  return item
}

export async function submitSimulationPreview(payload) {
  // This validates UI flow only. No task ID is created and no CFD is run.
  await new Promise((resolve) => setTimeout(resolve, 750))
  return { demoOnly: true, payload }
}
