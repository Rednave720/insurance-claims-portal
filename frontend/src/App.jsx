import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
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
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useEffect, useMemo, useState } from 'react'
import {
  createClaim,
  getClaimById,
  getClaimHistory,
  getClaims,
  getDashboardSummary,
  getUsers,
  updateClaimStatus,
} from './services/api'

const navByRole = {
  CLAIMANT: ['Submit Claim', 'My Claims', 'Claim Details'],
  ADMIN: ['Admin Dashboard', 'Claims Review Table', 'Admin Claim Detail'],
}

const statusColors = {
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  NEEDS_INFO: 'warning',
  APPROVED: 'success',
  DENIED: 'error',
  CLOSED: 'default',
}

const statusLabels = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  NEEDS_INFO: 'Needs Info',
  APPROVED: 'Approved',
  DENIED: 'Denied',
  CLOSED: 'Closed',
}

const statusOptions = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'NEEDS_INFO',
  'APPROVED',
  'DENIED',
  'CLOSED',
]

function App() {
  const [role, setRole] = useState('CLAIMANT')
  const [activeScreen, setActiveScreen] = useState('Submit Claim')
  const [users, setUsers] = useState([])
  const [claims, setClaims] = useState([])
  const [dashboardSummary, setDashboardSummary] = useState(null)
  const [selectedClaimId, setSelectedClaimId] = useState(null)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [claimHistory, setClaimHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const claimantUser = users.find((user) => user.role === 'CLAIMANT')
  const adminUser = users.find((user) => user.role === 'ADMIN')
  const visibleNav = navByRole[role]

  const claimantClaims = useMemo(() => {
    if (!claimantUser) {
      return []
    }

    return claims.filter((claim) => claim.claimantId === claimantUser.id)
  }, [claims, claimantUser])

  const loadOverviewData = async (preferredClaimId = selectedClaimId) => {
    setError('')
    setLoading(true)

    try {
      const [usersData, claimsData, summaryData] = await Promise.all([
        getUsers(),
        getClaims(),
        getDashboardSummary(),
      ])

      setUsers(usersData)
      setClaims(claimsData)
      setDashboardSummary(summaryData)

      if (preferredClaimId) {
        setSelectedClaimId(preferredClaimId)
      } else if (claimsData.length > 0) {
        setSelectedClaimId(claimsData[0].id)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOverviewData()
    // loadOverviewData reads current component state for initial selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSelectedClaimDetails = async (claimId) => {
    if (!claimId) {
      setSelectedClaim(null)
      setClaimHistory([])
      return
    }

    setDetailsLoading(true)
    setError('')

    try {
      const [claimData, historyData] = await Promise.all([
        getClaimById(claimId),
        getClaimHistory(claimId),
      ])

      setSelectedClaim(claimData)
      setClaimHistory(historyData)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setDetailsLoading(false)
    }
  }

  useEffect(() => {
    loadSelectedClaimDetails(selectedClaimId)
  }, [selectedClaimId])

  const changeRole = (nextRole) => {
    setRole(nextRole)
    setActiveScreen(navByRole[nextRole][0])
  }

  const handleOpenClaim = (claimId, targetScreen) => {
    setSelectedClaimId(claimId)
    setActiveScreen(targetScreen)
  }

  const handleSubmitClaim = async (formValues) => {
    if (!claimantUser) {
      setError('No seeded claimant user was found. Check the backend seed data.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const newClaim = await createClaim({
        claimantId: claimantUser.id,
        claimType: formValues.claimType,
        incidentDate: formValues.incidentDate,
        description: formValues.description,
      })

      setSuccessMessage(`Claim ${newClaim.claimNumber} was submitted successfully.`)
      setSelectedClaimId(newClaim.id)
      setActiveScreen('Claim Details')
      await loadOverviewData(newClaim.id)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (statusUpdate) => {
    if (!selectedClaim || !adminUser) {
      return
    }

    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const updatedClaim = await updateClaimStatus(selectedClaim.id, {
        changedBy: adminUser.id,
        newStatus: statusUpdate.newStatus,
        note: statusUpdate.note,
      })

      setSuccessMessage(`Claim ${updatedClaim.claimNumber} was updated to ${statusLabels[updatedClaim.status]}.`)
      setSelectedClaimId(updatedClaim.id)
      await loadOverviewData(updatedClaim.id)
      await loadSelectedClaimDetails(updatedClaim.id)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
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
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadOverviewData}>
            Refresh
          </Button>
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '220px 1fr' },
            gap: 3,
          }}
        >
          <Box>
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
          </Box>

          <Box>
            <Stack spacing={3}>
              <ScreenHeader activeScreen={activeScreen} role={role} />
              {error && <Alert severity="error">{error}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
              {loading ? (
                <LoadingState message="Loading live claims data..." />
              ) : (
                <>
                  {activeScreen === 'Submit Claim' && (
                    <SubmitClaimScreen onSubmitClaim={handleSubmitClaim} submitting={submitting} />
                  )}
                  {activeScreen === 'My Claims' && (
                    <MyClaimsScreen claims={claimantClaims} onOpenClaim={handleOpenClaim} />
                  )}
                  {activeScreen === 'Claim Details' && (
                    <ClaimDetailsScreen claim={selectedClaim} history={claimHistory} loading={detailsLoading} />
                  )}
                  {activeScreen === 'Admin Dashboard' && (
                    <AdminDashboardScreen summary={dashboardSummary} />
                  )}
                  {activeScreen === 'Claims Review Table' && (
                    <ClaimsReviewTableScreen claims={claims} onOpenClaim={handleOpenClaim} />
                  )}
                  {activeScreen === 'Admin Claim Detail' && (
                    <AdminClaimDetailScreen
                      claim={selectedClaim}
                      history={claimHistory}
                      loading={detailsLoading}
                      onUpdateStatus={handleUpdateStatus}
                      submitting={submitting}
                    />
                  )}
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

function ScreenHeader({ activeScreen, role }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
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

function LoadingState({ message }) {
  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography>{message}</Typography>
      </Stack>
    </Paper>
  )
}

function EmptyState({ title, message }) {
  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{message}</Typography>
    </Paper>
  )
}

function SubmitClaimScreen({ onSubmitClaim, submitting }) {
  const [claimType, setClaimType] = useState('AUTO')
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmitClaim({ claimType, incidentDate, description })
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 760 }} component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth required>
            <InputLabel id="claim-type-label">Claim type</InputLabel>
            <Select
              labelId="claim-type-label"
              label="Claim type"
              value={claimType}
              onChange={(event) => setClaimType(event.target.value)}
            >
              <MenuItem value="AUTO">Auto</MenuItem>
              <MenuItem value="PROPERTY">Property</MenuItem>
              <MenuItem value="HEALTH">Health</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            required
            label="Incident date"
            type="date"
            value={incidentDate}
            onChange={(event) => setIncidentDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
        <TextField
          fullWidth
          required
          multiline
          minRows={5}
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Briefly describe what happened and any immediate details the claims team should know."
        />
        <Box>
          <Button type="submit" variant="contained" startIcon={<AssignmentTurnedInIcon />} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}

function MyClaimsScreen({ claims, onOpenClaim }) {
  return (
    <ClaimsTable
      admin={false}
      claims={claims}
      emptyTitle="No claims yet"
      emptyMessage="Submit your first claim to see status tracking here."
      onOpenClaim={(claimId) => onOpenClaim(claimId, 'Claim Details')}
    />
  )
}

function ClaimDetailsScreen({ claim, history, loading }) {
  if (loading) {
    return <LoadingState message="Loading claim details..." />
  }

  if (!claim) {
    return <EmptyState title="No claim selected" message="Open a claim from My Claims to see details and history." />
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 7fr) minmax(280px, 5fr)' },
        gap: 3,
      }}
    >
      <Box>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" sx={{ alignItems: 'center' }}>
                <Typography variant="h6">{claim.claimNumber}</Typography>
                <Chip label={statusLabels[claim.status]} color={statusColors[claim.status]} />
              </Stack>
              <Typography color="text.secondary">
                {claim.claimType} claim submitted by {claim.claimantName}
              </Typography>
              <Divider />
              <Typography>{claim.description}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <Box>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Documents & History</Typography>
              <Button variant="outlined" startIcon={<UploadFileIcon />}>Add Document Metadata</Button>
              <HistoryList history={history} />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

function AdminDashboardScreen({ summary }) {
  const metrics = [
    ['Total Claims', summary?.totalClaims ?? 0],
    ['Submitted', summary?.submittedClaims ?? 0],
    ['Under Review', summary?.underReviewClaims ?? 0],
    ['Approved', summary?.approvedClaims ?? 0],
    ['Denied', summary?.deniedClaims ?? 0],
    ['Closed', summary?.closedClaims ?? 0],
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {metrics.map(([label, value]) => (
        <Box key={label}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">{label}</Typography>
              <Typography variant="h4">{value}</Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  )
}

function ClaimsReviewTableScreen({ claims, onOpenClaim }) {
  const [search, setSearch] = useState('')
  const normalizedSearch = search.trim().toLowerCase()
  const filteredClaims = claims.filter((claim) => {
    if (!normalizedSearch) {
      return true
    }

    return [
      claim.claimNumber,
      claim.claimantName,
      claim.claimType,
      claim.status,
    ].some((value) => value.toLowerCase().includes(normalizedSearch))
  })

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Search claims"
        placeholder="Search by claim number, claimant, or status"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
      />
      <ClaimsTable
        admin
        claims={filteredClaims}
        emptyTitle="No matching claims"
        emptyMessage="Adjust the search terms or refresh the data."
        onOpenClaim={(claimId) => onOpenClaim(claimId, 'Admin Claim Detail')}
      />
    </Stack>
  )
}

function AdminClaimDetailScreen({ claim, history, loading, onUpdateStatus, submitting }) {
  const [newStatus, setNewStatus] = useState('UNDER_REVIEW')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (claim) {
      setNewStatus(getDefaultNextStatus(claim.status))
      setNote('')
    }
  }, [claim])

  if (loading) {
    return <LoadingState message="Loading admin claim detail..." />
  }

  if (!claim) {
    return <EmptyState title="No claim selected" message="Open a claim from the review table to update its status." />
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onUpdateStatus({ newStatus, note })
  }

  const noteRequired = newStatus === 'NEEDS_INFO' || newStatus === 'DENIED'
  const isSameStatus = newStatus === claim.status
  const isClosed = claim.status === 'CLOSED'
  const isSubmittedRollback = newStatus === 'SUBMITTED' && claim.status !== 'SUBMITTED'
  const isMissingRequiredNote = noteRequired && note.trim().length === 0
  const updateDisabled = submitting || isClosed || isSameStatus || isSubmittedRollback || isMissingRequiredNote

  return (
    <Paper variant="outlined" sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 280px' },
            gap: 3,
          }}
        >
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" sx={{ gap: 2 }}>
              <Box>
                <Typography variant="h6">{claim.claimNumber}</Typography>
                <Typography color="text.secondary">
                  {claim.claimantName} · {claim.claimType} · {claim.incidentDate}
                </Typography>
              </Box>
              <Chip label={statusLabels[claim.status]} color={statusColors[claim.status]} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }} />
            </Stack>
            <Typography>{claim.description}</Typography>
          </Stack>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" color="text.secondary">Current Status</Typography>
              <Stack spacing={1}>
                <Chip label={statusLabels[claim.status]} color={statusColors[claim.status]} />
                <Typography variant="body2" color="text.secondary">
                  Status updates create a claim history entry for traceability.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Divider />

        {isClosed && (
          <Alert severity="info">This claim is closed. Further status updates are intentionally disabled for the MVP.</Alert>
        )}

        <FormControl fullWidth disabled={isClosed}>
          <InputLabel id="status-label">New status</InputLabel>
          <Select
            labelId="status-label"
            label="New status"
            value={newStatus}
            onChange={(event) => setNewStatus(event.target.value)}
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status}
                value={status}
                disabled={status === claim.status || (status === 'SUBMITTED' && claim.status !== 'SUBMITTED')}
              >
                {statusLabels[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required={noteRequired}
          multiline
          minRows={4}
          label="Reviewer note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add a short reason for this status update."
          error={isMissingRequiredNote}
          helperText={noteRequired ? 'A reviewer note is required for Needs Info and Denied updates.' : 'Optional note for internal claim history.'}
          disabled={isClosed}
        />
        <Button type="submit" variant="contained" startIcon={<FactCheckIcon />} disabled={updateDisabled}>
          {submitting ? 'Updating...' : 'Update Status'}
        </Button>
        <Divider />
        <Typography variant="h6">Claim History</Typography>
        <HistoryList history={history} />
      </Stack>
    </Paper>
  )
}

function HistoryList({ history }) {
  if (history.length === 0) {
    return <EmptyState title="No history yet" message="Status updates will appear here as the claim moves through review." />
  }

  return (
    <Stack spacing={1}>
      {history.map((event) => (
        <Paper key={event.id} variant="outlined" sx={{ p: 2, borderLeft: 4, borderLeftColor: 'primary.main' }}>
          <Stack spacing={1}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
              {event.previousStatus && (
                <>
                  <Chip size="small" label={statusLabels[event.previousStatus] || event.previousStatus} color={statusColors[event.previousStatus]} variant="outlined" />
                  <Typography variant="body2" color="text.secondary">to</Typography>
                </>
              )}
              <Chip size="small" label={statusLabels[event.newStatus] || event.newStatus} color={statusColors[event.newStatus]} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {event.changedBy} · {new Date(event.createdAt).toLocaleString()}
            </Typography>
            {event.note && <Typography variant="body2">{event.note}</Typography>}
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}

function getDefaultNextStatus(currentStatus) {
  if (currentStatus === 'SUBMITTED') {
    return 'UNDER_REVIEW'
  }

  if (currentStatus === 'CLOSED') {
    return 'CLOSED'
  }

  return currentStatus
}

function ClaimsTable({ admin, claims, emptyTitle, emptyMessage, onOpenClaim }) {
  if (claims.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

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
          {claims.map((claim) => (
            <TableRow key={claim.id} hover>
              <TableCell>{claim.claimNumber}</TableCell>
              {admin && <TableCell>{claim.claimantName}</TableCell>}
              <TableCell>{claim.claimType}</TableCell>
              <TableCell>
                <Chip size="small" label={statusLabels[claim.status]} color={statusColors[claim.status]} />
              </TableCell>
              <TableCell>{claim.incidentDate}</TableCell>
              <TableCell align="right">
                <Button size="small" onClick={() => onOpenClaim(claim.id)}>Open</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default App
