import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import RefreshIcon from '@mui/icons-material/Refresh'

export function PortalShell({
  activeScreen,
  children,
  navItems,
  onChangeRole,
  onNavigate,
  onRefresh,
  role,
}) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ bgcolor: '#ffffff', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: 78, gap: 2, px: { xs: 2, md: 3 } }}>
          <Avatar variant="rounded" sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
            <AssignmentTurnedInIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h3" component="h1">
              Insurance Claims Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enterprise claims intake, review, status tracking, and audit visibility
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh}>
            Refresh
          </Button>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="role-switcher-label">Role</InputLabel>
            <Select
              labelId="role-switcher-label"
              label="Role"
              value={role}
              onChange={(event) => onChangeRole(event.target.value)}
            >
              <MenuItem value="CLAIMANT">Claimant/User</MenuItem>
              <MenuItem value="ADMIN">Admin/Reviewer</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '264px 1fr' },
          gap: 2.5,
          px: { xs: 1.5, md: 2.5 },
          pb: 3,
          pt: '98px',
        }}
      >
        <Paper
          component="nav"
          sx={{
            alignSelf: 'start',
            border: '1px solid',
            borderColor: 'divider',
            p: 2,
            position: { md: 'sticky' },
            top: { md: 98 },
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                WORKSPACE
              </Typography>
              <Typography variant="h4">{role === 'ADMIN' ? 'Claims Review' : 'Claimant Portal'}</Typography>
            </Box>
            <Stack spacing={0.75}>
              {navItems.map((item) => {
                const selected = activeScreen === item
                const Icon = item.includes('Dashboard') ? DashboardIcon : DescriptionIcon

                return (
                  <Button
                    key={item}
                    disableRipple
                    fullWidth
                    variant={selected ? 'contained' : 'text'}
                    onClick={() => onNavigate(item)}
                    startIcon={<Icon />}
                    sx={{
                      justifyContent: 'flex-start',
                      whiteSpace: 'nowrap',
                      py: 1.1,
                      px: 1.5,
                      color: selected ? '#ffffff' : 'text.primary',
                    }}
                  >
                    {item}
                  </Button>
                )
              })}
            </Stack>
            <Chip
              label={role === 'ADMIN' ? 'Admin reviewer mode' : 'Claimant self-service mode'}
              color={role === 'ADMIN' ? 'secondary' : 'primary'}
              variant="outlined"
            />
          </Stack>
        </Paper>

        <Box component="main" sx={{ minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
