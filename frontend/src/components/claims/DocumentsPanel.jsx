import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useState } from 'react'
import { formatDateTime, formatDocumentType } from '../../claimDisplay'
import { EmptyState } from '../ui/EmptyState'
import { MainCard } from '../ui/MainCard'

export function DocumentsPanel({ documents, onAddDocument, showForm = false, submitting }) {
  return (
    <MainCard
      title="Supporting Documents"
      subtitle="Metadata-only document tracking for the MVP."
      contentSx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {showForm && <DocumentMetadataForm onAddDocument={onAddDocument} submitting={submitting} />}
      <DocumentList documents={documents} />
    </MainCard>
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
        icon={<InsertDriveFileIcon color="primary" />}
        title="No documents yet"
        message="Supporting documents will appear here as metadata records. Real file upload is intentionally out of scope for this MVP."
      />
    )
  }

  return (
    <Stack spacing={1.25}>
      {documents.map((document) => (
        <Paper key={document.id} variant="outlined" sx={{ p: 2, bgcolor: '#ffffff' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: 'primary.light',
                color: 'primary.dark',
              }}
            >
              <InsertDriveFileIcon />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography fontWeight={800}>{document.fileName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDocumentType(document.documentType)} · Uploaded {formatDateTime(document.uploadedAt)}
              </Typography>
              {document.fileUrl && (
                <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                  {document.fileUrl}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}
