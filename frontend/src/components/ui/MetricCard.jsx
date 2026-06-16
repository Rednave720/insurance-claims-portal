import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material'

export function MetricCard({ label, value, color = 'primary.main', icon }) {
  return (
    <Card sx={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 46,
              height: 46,
              bgcolor: color,
              color: '#ffffff',
              boxShadow: '0 10px 24px rgba(33, 150, 243, 0.18)',
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h1" sx={{ fontSize: '2rem', lineHeight: 1.15 }}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
