import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import ArticleIcon from '@mui/icons-material/Article'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import SearchIcon from '@mui/icons-material/Search'
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
import {
  formatClaimType,
  formatDate,
  formatDateTime,
  getDefaultNextStatus,
  metricColors,
  statusLabels,
  statusOptions,
} from './claimDisplay'
import { ClaimSummaryCard, MetaRow } from './components/claims/ClaimSummaryCard'
import { ClaimsTable } from './components/claims/ClaimsTable'
import { DocumentsPanel } from './components/claims/DocumentsPanel'
import { HistoryPanel } from './components/claims/HistoryPanel'
import { PageHeader } from './components/layout/PageHeader'
import { PortalShell } from './components/layout/PortalShell'
import { EmptyState } from './components/ui/EmptyState'
import { LoadingState } from './components/ui/LoadingState'
import { MainCard } from './components/ui/MainCard'
import { MetricCard } from './components/ui/MetricCard'
import { StatusChip } from './components/ui/StatusChip'

const navByRole = {
  CLAIMANT: ['Submit Claim', 'My Claims', 'Claim Details'],
  ADMIN: ['Admin Dashboard', 'Claims Review Table', 'Admin Claim Detail'],
}

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
    setError('')
    setSuccessMessage('')
    setRole(nextRole)
    setActiveScreen(navByRole[nextRole][0])
  }

  const handleNavigate = (screen) => {
    setError('')
    setSuccessMessage('')
    setActiveScreen(screen)
  }

  const handleOpenClaim = (claimId, targetScreen) => {
    setError('')
    setSuccessMessage('')
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
    <PortalShell
      activeScreen={activeScreen}
      navItems={visibleNav}
      onChangeRole={changeRole}
      onNavigate={handleNavigate}
      onRefresh={loadOverviewData}
      role={role}
    >
      <Stack spacing={2.5}>
        <PageHeader activeScreen={activeScreen} role={role} />
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
            {activeScreen === 'Admin Dashboard' && <AdminDashboardScreen claims={claims} summary={dashboardSummary} />}
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
    </PortalShell>
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
    <MainCard
      title="New Claim Intake"
      subtitle="Capture the core claim details needed to start the workflow."
      sx={{ maxWidth: 900 }}
    >
      <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
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
        </Box>
        <TextField
          fullWidth
          required
          multiline
          minRows={6}
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
    </MainCard>
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
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.15fr) minmax(320px, 0.85fr)' },
        gap: 2.5,
      }}
    >
      <Stack spacing={2.5}>
        <ClaimSummaryCard claim={claim} />
        <HistoryPanel history={history} />
      </Stack>
      <DocumentsPanel documents={documents} onAddDocument={onAddDocument} showForm submitting={submitting} />
    </Box>
  )
}

function AdminDashboardScreen({ claims, summary }) {
  const metrics = [
    ['Total Claims', summary?.totalClaims ?? 0, <ArticleIcon />],
    ['Submitted', summary?.submittedClaims ?? 0, <AssignmentTurnedInIcon />],
    ['Under Review', summary?.underReviewClaims ?? 0, <HourglassTopIcon />],
    ['Needs Info', summary?.needsInfoClaims ?? 0, <HelpCenterOutlinedIcon />],
    ['Approved', summary?.approvedClaims ?? 0, <CheckCircleIcon />],
    ['Denied', summary?.deniedClaims ?? 0, <ReportProblemIcon />],
  ]
  const reviewQueuePreview = [...claims]
    .filter((claim) => claim.status !== 'CLOSED')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {metrics.map(([label, value, icon]) => (
          <MetricCard key={label} label={label} value={value} color={metricColors[label]} icon={icon} />
        ))}
      </Box>
      <ReviewQueuePreview claims={reviewQueuePreview} />
    </Stack>
  )
}

function ReviewQueuePreview({ claims }) {
  return (
    <MainCard title="Review Queue Preview" subtitle="Recent non-closed claims already loaded for admin review.">
      {claims.length === 0 ? (
        <EmptyState
          title="No active claims"
          message="Submitted and in-review claims will appear here when they need attention."
        />
      ) : (
        <Stack spacing={1.25}>
          {claims.map((claim) => (
            <Paper
              key={claim.id}
              variant="outlined"
              sx={{
                p: 2,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
                gap: 1.5,
                alignItems: 'center',
                bgcolor: '#ffffff',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={800}>{claim.claimNumber}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {claim.claimantName} · {formatClaimType(claim.claimType)} · Updated {formatDateTime(claim.updatedAt)}
                </Typography>
              </Box>
              <StatusChip status={claim.status} />
            </Paper>
          ))}
        </Stack>
      )}
    </MainCard>
  )
}

function ClaimsReviewTableScreen({ claims, onOpenClaim }) {
  const [search, setSearch] = useState('')
  const normalizedSearch = search.trim().toLowerCase()
  const filteredClaims = claims.filter((claim) => {
    if (!normalizedSearch) {
      return true
    }

    return [claim.claimNumber, claim.claimantName, claim.claimType, claim.status].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    )
  })

  return (
    <Stack spacing={2}>
      <MainCard
        title="Review Queue"
        subtitle="Search live claim records by claim number, claimant, type, or status."
      >
        <TextField
          fullWidth
          label="Search claims"
          placeholder="Search by claim number, claimant, or status"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
        />
      </MainCard>
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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.15fr) minmax(320px, 0.85fr)' },
        gap: 2.5,
      }}
    >
      <Stack spacing={2.5}>
        <ClaimSummaryCard claim={claim} title="Claim Review Summary" />
        <MainCard title="Status Update" subtitle="Change the claim status and record reviewer context.">
          <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
            {isClosed && (
              <Alert severity="info">
                This claim is closed. Further status updates are intentionally disabled for the MVP.
              </Alert>
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
              minRows={5}
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
              helperText={
                noteRequired
                  ? 'A reviewer note is required for Needs Info and Denied updates.'
                  : 'Optional note for internal claim history.'
              }
              disabled={isClosed}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button type="submit" variant="contained" startIcon={<FactCheckIcon />} disabled={updateDisabled}>
                {submitting ? 'Updating...' : 'Update Status'}
              </Button>
            </Box>
          </Stack>
        </MainCard>
        <HistoryPanel history={history} />
      </Stack>
      <Stack spacing={2.5}>
        <CurrentStatusCard claim={claim} />
        <DocumentsPanel documents={documents} />
      </Stack>
    </Box>
  )
}

function CurrentStatusCard({ claim }) {
  return (
    <MainCard title="Current Status" subtitle="Operational snapshot for the selected claim.">
      <Stack spacing={1.5}>
        <MetaRow label="Status" value={<StatusChip status={claim.status} />} />
        <Divider />
        <MetaRow label="Submitted" value={formatDateTime(claim.submittedAt)} />
        <MetaRow label="Last update" value={formatDateTime(claim.updatedAt)} />
        <MetaRow label="Claimant" value={claim.claimantName} />
        <MetaRow label="Claim type" value={formatClaimType(claim.claimType)} />
        <MetaRow label="Incident" value={formatDate(claim.incidentDate)} />
      </Stack>
    </MainCard>
  )
}

export default App
