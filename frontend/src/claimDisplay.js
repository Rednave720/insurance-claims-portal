export const statusColors = {
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  NEEDS_INFO: 'secondary',
  APPROVED: 'success',
  DENIED: 'error',
  CLOSED: 'default',
}

export const statusLabels = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  NEEDS_INFO: 'Needs Info',
  APPROVED: 'Approved',
  DENIED: 'Denied',
  CLOSED: 'Closed',
}

export const statusOptions = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'NEEDS_INFO',
  'APPROVED',
  'DENIED',
  'CLOSED',
]

export const metricColors = {
  'Total Claims': 'primary.main',
  Submitted: 'info.main',
  'Under Review': 'warning.main',
  'Needs Info': 'secondary.main',
  Approved: 'success.main',
  Denied: 'error.main',
}

export function formatDocumentType(documentType) {
  return documentType
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

export function formatClaimType(claimType) {
  return claimType.charAt(0) + claimType.slice(1).toLowerCase()
}

export function formatDate(dateValue) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(dateTimeValue) {
  return new Date(dateTimeValue).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function getDefaultNextStatus(currentStatus) {
  if (currentStatus === 'SUBMITTED') {
    return 'UNDER_REVIEW'
  }

  if (currentStatus === 'CLOSED') {
    return 'CLOSED'
  }

  return currentStatus
}
