import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'

export function MainCard({ title, subtitle, action, children, contentSx = {}, sx = {} }) {
  return (
    <Card sx={sx}>
      {title && (
        <>
          <CardHeader
            action={action}
            title={<Typography variant="h4">{title}</Typography>}
            subheader={subtitle}
            sx={{ px: 3, py: 2.25 }}
          />
          <Divider />
        </>
      )}
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 }, ...contentSx }}>{children}</CardContent>
    </Card>
  )
}
