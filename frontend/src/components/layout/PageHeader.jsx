import { Box, Chip, Paper, Stack, Typography } from '@mui/material'

export function PageHeader({ activeScreen, role }) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h2" component="h2">
            {activeScreen}
          </Typography>
          <Typography color="text.secondary">
            {role === 'CLAIMANT'
              ? 'Claimant self-service view for submission, status tracking, and document metadata.'
              : 'Claims operations view for review queues, status updates, and audit history.'}
          </Typography>
        </Box>
        <Chip label={role} color={role === 'ADMIN' ? 'secondary' : 'primary'} />
      </Stack>
    </Paper>
  )
}
