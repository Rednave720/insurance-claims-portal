const API_BASE_URL = 'http://localhost:8080'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`)
  }

  return data
}

export function getUsers() {
  return request('/api/users')
}

export function getClaims() {
  return request('/api/claims')
}

export function createClaim(claim) {
  return request('/api/claims', {
    method: 'POST',
    body: JSON.stringify(claim),
  })
}

export function getClaimById(claimId) {
  return request(`/api/claims/${claimId}`)
}

export function updateClaimStatus(claimId, statusUpdate) {
  return request(`/api/claims/${claimId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusUpdate),
  })
}

export function getClaimHistory(claimId) {
  return request(`/api/claims/${claimId}/history`)
}

export function getClaimDocuments(claimId) {
  return request(`/api/claims/${claimId}/documents`)
}

export function getDashboardSummary() {
  return request('/api/dashboard/summary')
}
