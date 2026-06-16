import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DescriptionIcon from '@mui/icons-material/Description'
import { formatClaimType, formatDate } from '../../claimDisplay'
import { EmptyState } from '../ui/EmptyState'
import { StatusChip } from '../ui/StatusChip'

export function ClaimsTable({ admin, claims, emptyTitle, emptyMessage, onOpenClaim }) {
  if (claims.length === 0) {
    return <EmptyState icon={<DescriptionIcon color="primary" />} title={emptyTitle} message={emptyMessage} />
  }

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
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
            <TableRow key={claim.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell>
                <Typography fontWeight={800}>{claim.claimNumber}</Typography>
              </TableCell>
              {admin && <TableCell>{claim.claimantName}</TableCell>}
              <TableCell>{formatClaimType(claim.claimType)}</TableCell>
              <TableCell>
                <StatusChip status={claim.status} />
              </TableCell>
              <TableCell>{formatDate(claim.incidentDate)}</TableCell>
              <TableCell align="right">
                <Button size="small" variant="outlined" endIcon={<ChevronRightIcon />} onClick={() => onOpenClaim(claim.id)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
