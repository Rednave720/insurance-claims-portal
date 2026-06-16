import { Paper, Stack, Typography } from '@mui/material'

export function EmptyState({ title, message, icon }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        bgcolor: '#fbfcfd',
        borderStyle: 'dashed',
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Stack spacing={1.25} sx={{ alignItems: 'center' }}>
        {icon}
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 540 }}>
          {message}
        </Typography>
      </Stack>
    </Paper>
  )
}
