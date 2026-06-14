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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useEffect, useMemo, useState } from 'react'
import {
  addClaimDocument,
  createClaim,
  getClaimById,
  getClaimDocuments,
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
  NEEDS_INFO: 'secondary',
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

const metricColors = {
  'Total Claims': 'primary.main',
  Submitted: 'info.main',
  'Under Review': 'warning.main',
  'Needs Info': 'secondary.main',
  Approved: 'success.main',
  Denied: 'error.main',
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
  const [claimDocuments, setClaimDocuments] = useState([])
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
      setClaimDocuments([])
      return
    }

    setDetailsLoading(true)
    setError('')

    try {
      const [claimData, historyData, documentsData] = await Promise.all([
        getClaimById(claimId),
        getClaimHistory(claimId),
        getClaimDocuments(claimId),
      ])

      setSelectedClaim(claimData)
      setClaimHistory(historyData)
      setClaimDocuments(documentsData)
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

  const handleAddDocument = async (documentMetadata) => {
    if (!selectedClaim || !claimantUser) {
      return
    }

    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      await addClaimDocument(selectedClaim.id, {
        uploadedByUserId: claimantUser.id,
        fileName: documentMetadata.fileName,
        documentType: documentMetadata.documentType,
        fileUrl: documentMetadata.fileUrl,
      })

      setSuccessMessage('Document metadata was added to the claim.')
      await loadSelectedClaimDetails(selectedClaim.id)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #dde3ea', bgcolor: '#ffffff' }}>
        <Toolbar sx={{ gap: 2, minHeight: 72 }}>
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
            gap: 3,
          }}
        >
          <Box>
            <Paper variant="outlined" sx={{ p: 1, bgcolor: '#ffffff' }}>
              <Stack spacing={1}>
                {visibleNav.map((item) => (
                  <Button
                    key={item}
                    disableRipple
                    fullWidth
                    variant={activeScreen === item ? 'contained' : 'text'}
                    onClick={() => setActiveScreen(item)}
                    startIcon={item.includes('Dashboard') ? <DashboardIcon /> : <DescriptionIcon />}
                    sx={{ justifyContent: 'flex-start', whiteSpace: 'nowrap' }}
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
                    <ClaimDetailsScreen
                      claim={selectedClaim}
                      history={claimHistory}
                      documents={claimDocuments}
                      loading={detailsLoading}
                      onAddDocument={handleAddDocument}
                      submitting={submitting}
                    />
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
                      documents={claimDocuments}
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
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, bgcolor: '#ffffff' }}>
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
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        bgcolor: '#fbfcfd',
        borderStyle: 'dashed',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>{message}</Typography>
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
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, maxWidth: 860, bgcolor: '#ffffff' }} component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
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

function ClaimDetailsScreen({ claim, history, documents, loading, onAddDocument, submitting }) {
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
        <Card variant="outlined" sx={{ bgcolor: '#ffffff' }}>
          <CardContent>
            <Stack spacing={2.5}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">{claim.claimNumber}</Typography>
                <Chip label={statusLabels[claim.status]} color={statusColors[claim.status]} />
              </Stack>
              <Typography color="text.secondary">
                {formatClaimType(claim.claimType)} claim submitted by {claim.claimantName}
              </Typography>
              <Divider />
              <Typography>{claim.description}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <Box>
        <Card variant="outlined" sx={{ bgcolor: '#ffffff' }}>
          <CardContent>
            <Stack spacing={2.25}>
              <Typography variant="h6">Supporting Documents</Typography>
              <DocumentMetadataForm onAddDocument={onAddDocument} submitting={submitting} />
              <DocumentList documents={documents} />
              <Divider />
              <Typography variant="h6">Claim History</Typography>
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
    ['Needs Info', summary?.needsInfoClaims ?? 0],
    ['Approved', summary?.approvedClaims ?? 0],
    ['Denied', summary?.deniedClaims ?? 0],
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
          <Card variant="outlined" sx={{ height: '100%', borderTop: 4, borderTopColor: metricColors[label] ?? 'primary.main', bgcolor: '#ffffff' }}>
            <CardContent sx={{ p: 2.5 }}>
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
      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#ffffff' }}>
        <TextField
          fullWidth
          label="Search claims"
          placeholder="Search by claim number, claimant, or status"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
        />
      </Paper>
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

function AdminClaimDetailScreen({ claim, history, documents, loading, onUpdateStatus, submitting }) {
  const [newStatus, setNewStatus] = useState('UNDER_REVIEW')
  const [note, setNote] = useState('')
  const [noteTouched, setNoteTouched] = useState(false)

  useEffect(() => {
    if (claim) {
      setNewStatus(getDefaultNextStatus(claim.status))
      setNote('')
      setNoteTouched(false)
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
  const showMissingRequiredNote = isMissingRequiredNote && noteTouched
  const updateDisabled = submitting || isClosed || isSameStatus || isSubmittedRollback || isMissingRequiredNote

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, bgcolor: '#ffffff' }} component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 280px' },
            gap: 3,
          }}
        >
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{claim.claimNumber}</Typography>
                <Typography color="text.secondary">
                  {claim.claimantName} · {formatClaimType(claim.claimType)} · {formatDate(claim.incidentDate)}
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
            onChange={(event) => {
              setNewStatus(event.target.value)
              setNoteTouched(false)
            }}
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
          onBlur={() => setNoteTouched(true)}
          onChange={(event) => {
            setNote(event.target.value)
            if (event.target.value.trim().length > 0) {
              setNoteTouched(true)
            }
          }}
          placeholder="Add a short reason for this status update."
          error={showMissingRequiredNote}
          helperText={noteRequired ? 'A reviewer note is required for Needs Info and Denied updates.' : 'Optional note for internal claim history.'}
          disabled={isClosed}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button type="submit" variant="contained" startIcon={<FactCheckIcon />} disabled={updateDisabled}>
            {submitting ? 'Updating...' : 'Update Status'}
          </Button>
        </Box>
        <Divider />
        <Typography variant="h6">Supporting Documents</Typography>
        <DocumentList documents={documents} />
        <Divider />
        <Typography variant="h6">Claim History</Typography>
        <HistoryList history={history} />
      </Stack>
    </Paper>
  )
}

function DocumentMetadataForm({ onAddDocument, submitting }) {
  const [fileName, setFileName] = useState('')
  const [documentType, setDocumentType] = useState('PHOTO')
  const [fileUrl, setFileUrl] = useState('https://example.com/mock-claim-document')

  const handleSubmit = (event) => {
    event.preventDefault()
    onAddDocument({ fileName, documentType, fileUrl })
    setFileName('')
    setDocumentType('PHOTO')
    setFileUrl('https://example.com/mock-claim-document')
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fbfcfd' }} component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          required
          size="small"
          label="Document name"
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder="repair-estimate.pdf"
        />
        <FormControl fullWidth size="small" required>
          <InputLabel id="document-type-label">Document type</InputLabel>
          <Select
            labelId="document-type-label"
            label="Document type"
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
          >
            <MenuItem value="PHOTO">Photo</MenuItem>
            <MenuItem value="RECEIPT">Receipt</MenuItem>
            <MenuItem value="REPAIR_ESTIMATE">Repair Estimate</MenuItem>
            <MenuItem value="POLICE_REPORT">Police Report</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          required
          size="small"
          label="Mock file URL"
          value={fileUrl}
          onChange={(event) => setFileUrl(event.target.value)}
          helperText="Metadata record only for MVP demo."
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button type="submit" variant="outlined" startIcon={<UploadFileIcon />} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Metadata'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}

function DocumentList({ documents }) {
  if (documents.length === 0) {
    return (
      <EmptyState
        title="No documents yet"
        message="Supporting documents will appear here as metadata records. Real file upload is intentionally out of scope for this MVP."
      />
    )
  }

  return (
    <Stack spacing={1}>
      {documents.map((document) => (
        <Paper key={document.id} variant="outlined" sx={{ p: 2, bgcolor: '#ffffff' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
            <InsertDriveFileIcon color="primary" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography fontWeight={700}>{document.fileName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Uploaded {formatDateTime(document.uploadedAt)}
              </Typography>
              {document.fileUrl && (
                <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                  {document.fileUrl}
                </Typography>
              )}
            </Box>
            <Chip size="small" label={formatDocumentType(document.documentType)} variant="outlined" />
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}

function HistoryList({ history }) {
  if (history.length === 0) {
    return <EmptyState title="No history yet" message="Status updates will appear here as the claim moves through review." />
  }

  return (
    <Stack spacing={1}>
      {history.map((event) => (
        <Paper key={event.id} variant="outlined" sx={{ p: 2, borderLeft: 4, borderLeftColor: 'primary.main', bgcolor: '#ffffff' }}>
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
              {event.changedBy} · {formatDateTime(event.createdAt)}
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

function formatDocumentType(documentType) {
  return documentType
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

function formatClaimType(claimType) {
  return claimType.charAt(0) + claimType.slice(1).toLowerCase()
}

function formatDate(dateValue) {
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateTimeValue) {
  return new Date(dateTimeValue).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ClaimsTable({ admin, claims, emptyTitle, emptyMessage, onOpenClaim }) {
  if (claims.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: '#ffffff' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8fafc' }}>
            <TableCell sx={{ fontWeight: 700 }}>Claim</TableCell>
            {admin && <TableCell sx={{ fontWeight: 700 }}>Claimant</TableCell>}
            <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Incident Date</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id} hover>
              <TableCell>
                <Typography fontWeight={700}>{claim.claimNumber}</Typography>
              </TableCell>
              {admin && <TableCell>{claim.claimantName}</TableCell>}
              <TableCell>{formatClaimType(claim.claimType)}</TableCell>
              <TableCell>
                <Chip size="small" label={statusLabels[claim.status]} color={statusColors[claim.status]} />
              </TableCell>
              <TableCell>{formatDate(claim.incidentDate)}</TableCell>
              <TableCell align="right">
                <Button size="small" variant="outlined" endIcon={<ChevronRightIcon />} onClick={() => onOpenClaim(claim.id)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default App
