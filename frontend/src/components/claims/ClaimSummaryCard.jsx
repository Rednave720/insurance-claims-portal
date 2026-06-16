import { Box, Divider, Stack, Typography } from '@mui/material'
import { formatClaimType, formatDate, formatDateTime } from '../../claimDisplay'
import { MainCard } from '../ui/MainCard'
import { StatusChip } from '../ui/StatusChip'

export function ClaimSummaryCard({ claim, title = 'Claim Summary' }) {
  return (
    <MainCard title={title}>
      <Stack spacing={2.25}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3">{claim.claimNumber}</Typography>
            <Typography color="text.secondary">
              {formatClaimType(claim.claimType)} claim submitted by {claim.claimantName}
            </Typography>
          </Box>
          <Box>
            <StatusChip status={claim.status} />
          </Box>
        </Stack>
        <Divider />
        <Typography>{claim.description}</Typography>
        <Divider />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          <MetaBlock label="Incident Date" value={formatDate(claim.incidentDate)} />
          <MetaBlock label="Submitted" value={formatDateTime(claim.submittedAt)} />
          <MetaBlock label="Last Updated" value={formatDateTime(claim.updatedAt)} />
        </Box>
      </Stack>
    </MainCard>
  )
}

export function MetaRow({ label, value }) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ fontWeight: 800, textAlign: 'right' }}>{value}</Box>
    </Stack>
  )
}

function MetaBlock({ label, value }) {
  return (
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc' }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography fontWeight={800}>{value}</Typography>
    </Box>
  )
}
