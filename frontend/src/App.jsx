import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import SearchIcon from '@mui/icons-material/Search'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useState } from 'react'

const navByRole = {
  CLAIMANT: ['Submit Claim', 'My Claims', 'Claim Details'],
  ADMIN: ['Admin Dashboard', 'Claims Review Table', 'Admin Claim Detail'],
}

const seededClaims = [
  {
    id: 1,
    claimNumber: 'CLM-1001',
    claimantName: 'Jordan Taylor',
    claimType: 'AUTO',
    status: 'SUBMITTED',
    incidentDate: '2026-06-10',
    submittedAt: '2026-06-13',
    description: 'Rear-end collision while stopped at a traffic light.',
  },
]

const statusColors = {
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  DENIED: 'error',
  CLOSED: 'default',
}

function App() {
  const [role, setRole] = useState('CLAIMANT')
  const [activeScreen, setActiveScreen] = useState('Submit Claim')
  const visibleNav = navByRole[role]

  const changeRole = (nextRole) => {
    setRole(nextRole)
    setActiveScreen(navByRole[nextRole][0])
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f6f8fb' }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #dde3ea' }}>
        <Toolbar sx={{ gap: 2 }}>
          <AssignmentTurnedInIcon color="primary" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h1">Insurance Claims Portal</Typography>
            <Typography variant="body2" color="text.secondary">MVP enterprise claims workflow</Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="role-switcher-label">Role</InputLabel>
            <Select
              labelId="role-switcher-label"
              label="Role"
              value={role}
              onChange={(event) => changeRole(event.target.value)}
            >
              <MenuItem value="CLAIMANT">Claimant/User</MenuItem>
              <MenuItem value="ADMIN">Admin/Reviewer</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper variant="outlined" sx={{ p: 1 }}>
              <Stack spacing={1}>
                {visibleNav.map((item) => (
                  <Button
                    key={item}
                    fullWidth
                    variant={activeScreen === item ? 'contained' : 'text'}
                    onClick={() => setActiveScreen(item)}
                    startIcon={item.includes('Dashboard') ? <DashboardIcon /> : <DescriptionIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack spacing={3}>
              <ScreenHeader activeScreen={activeScreen} role={role} />
              {activeScreen === 'Submit Claim' && <SubmitClaimScreen />}
              {activeScreen === 'My Claims' && <MyClaimsScreen />}
              {activeScreen === 'Claim Details' && <ClaimDetailsScreen />}
              {activeScreen === 'Admin Dashboard' && <AdminDashboardScreen />}
              {activeScreen === 'Claims Review Table' && <ClaimsReviewTableScreen />}
              {activeScreen === 'Admin Claim Detail' && <AdminClaimDetailScreen />}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

function ScreenHeader({ activeScreen, role }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h2">{activeScreen}</Typography>
          <Typography color="text.secondary">
            {role === 'CLAIMANT'
              ? 'Claimant self-service view for submission and status tracking.'
              : 'Claims operations view for review, filtering, and status updates.'}
          </Typography>
        </Box>
        <Chip label={role} color={role === 'ADMIN' ? 'secondary' : 'primary'} />
      </Stack>
    </Paper>
  )
}

function SubmitClaimScreen() {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Claim type" value="AUTO" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Incident date" type="date" defaultValue="2026-06-10" InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={5} label="Description" defaultValue="Rear-end collision while stopped at a traffic light." />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" startIcon={<AssignmentTurnedInIcon />}>Submit Claim</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

function MyClaimsScreen() {
  return <ClaimsTable admin={false} />
}

function ClaimDetailsScreen() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">CLM-1001</Typography>
                <Chip label="SUBMITTED" color="info" />
              </Stack>
              <Typography color="text.secondary">AUTO claim submitted by Jordan Taylor</Typography>
              <Divider />
              <Typography>{seededClaims[0].description}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Documents & History</Typography>
              <Button variant="outlined" startIcon={<UploadFileIcon />}>Add Document Metadata</Button>
              <Typography variant="body2" color="text.secondary">Claim submitted by Jordan Taylor.</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

function AdminDashboardScreen() {
  const metrics = [
    ['Total Claims', 1],
    ['Submitted', 1],
    ['Under Review', 0],
    ['Approved', 0],
  ]

  return (
    <Grid container spacing={2}>
      {metrics.map(([label, value]) => (
        <Grid item xs={12} sm={6} md={3} key={label}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">{label}</Typography>
              <Typography variant="h4">{value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

function ClaimsReviewTableScreen() {
  return (
    <Stack spacing={2}>
      <TextField fullWidth label="Search claims" placeholder="Search by claim number, claimant, or status" InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }} />
      <ClaimsTable admin />
    </Stack>
  )
}

function AdminClaimDetailScreen() {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">CLM-1001</Typography>
            <Typography color="text.secondary">Review claim and update workflow status.</Typography>
          </Box>
          <Chip label="SUBMITTED" color="info" />
        </Stack>
        <FormControl fullWidth>
          <InputLabel id="status-label">New status</InputLabel>
          <Select labelId="status-label" label="New status" defaultValue="UNDER_REVIEW">
            <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="DENIED">Denied</MenuItem>
            <MenuItem value="CLOSED">Closed</MenuItem>
          </Select>
        </FormControl>
        <TextField multiline minRows={4} label="Reviewer note" defaultValue="Initial review started. Waiting for supporting repair estimate." />
        <Button variant="contained" startIcon={<FactCheckIcon />}>Update Status</Button>
      </Stack>
    </Paper>
  )
}

function ClaimsTable({ admin }) {
  return (
    <Paper variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Claim</TableCell>
            {admin && <TableCell>Claimant</TableCell>}
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Incident Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seededClaims.map((claim) => (
            <TableRow key={claim.id} hover>
              <TableCell>{claim.claimNumber}</TableCell>
              {admin && <TableCell>{claim.claimantName}</TableCell>}
              <TableCell>{claim.claimType}</TableCell>
              <TableCell><Chip size="small" label={claim.status} color={statusColors[claim.status]} /></TableCell>
              <TableCell>{claim.incidentDate}</TableCell>
              <TableCell align="right"><Button size="small">Open</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default App
