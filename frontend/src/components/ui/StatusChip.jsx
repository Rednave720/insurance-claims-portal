import { Chip } from '@mui/material'
import { statusColors, statusLabels } from '../../claimDisplay'

export function StatusChip({ status, size = 'small', variant = 'filled' }) {
  return (
    <Chip
      size={size}
      variant={variant}
      color={statusColors[status] || 'default'}
      label={statusLabels[status] || status}
      sx={{
        ...(variant === 'filled' && {
          bgcolor: (theme) => theme.palette[statusColors[status]]?.light,
          color: (theme) => theme.palette[statusColors[status]]?.dark,
        }),
      }}
    />
  )
}
