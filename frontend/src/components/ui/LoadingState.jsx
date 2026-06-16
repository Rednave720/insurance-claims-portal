import { CircularProgress, Paper, Stack, Typography } from '@mui/material'

export function LoadingState({ message }) {
  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography>{message}</Typography>
      </Stack>
    </Paper>
  )
}
