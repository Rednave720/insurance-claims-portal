import { Box, Paper, Stack, Typography } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import { formatDateTime, statusLabels } from '../../claimDisplay'
import { EmptyState } from '../ui/EmptyState'
import { MainCard } from '../ui/MainCard'
import { StatusChip } from '../ui/StatusChip'

export function HistoryPanel({ history }) {
  return (
    <MainCard title="Claim History" subtitle="Audit trail of claim status movement.">
      <HistoryList history={history} />
    </MainCard>
  )
}

function HistoryList({ history }) {
  if (history.length === 0) {
    return (
      <EmptyState
        icon={<HistoryIcon color="primary" />}
        title="No history yet"
        message="Status updates will appear here as the claim moves through review."
      />
    )
  }

  return (
    <Stack spacing={1.5}>
      {history.map((event) => (
        <Paper
          key={event.id}
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: '#ffffff',
            borderLeft: 4,
            borderLeftColor: 'primary.main',
          }}
        >
          <Stack spacing={1}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
              {event.previousStatus && (
                <>
                  <StatusChip status={event.previousStatus} variant="outlined" />
                  <Typography variant="body2" color="text.secondary">
                    to
                  </Typography>
                </>
              )}
              <StatusChip status={event.newStatus} />
            </Stack>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {event.changedBy} · {formatDateTime(event.createdAt)}
              </Typography>
              {event.note && <Typography sx={{ mt: 0.75 }}>{event.note}</Typography>}
              {!event.note && (
                <Typography sx={{ mt: 0.75 }} color="text.secondary">
                  Status changed to {statusLabels[event.newStatus] || event.newStatus}.
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}
