import { DeleteOutlined, SearchRounded } from '@mui/icons-material';
import {
  Alert, Box, CircularProgress, IconButton, InputAdornment, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Tooltip, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface ResourceColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface ResourceTableProps<T extends { id: number }> {
  rows: T[];
  columns: ResourceColumn<T>[];
  total: number;
  page: number;
  rowsPerPage: number;
  search: string;
  sortBy: keyof T;
  sortDirection: 'asc' | 'desc';
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (key: keyof T) => void;
  onDelete?: (row: T) => void;
}

export default function ResourceTable<T extends { id: number }>({
  rows, columns, total, page, rowsPerPage, search, sortBy, sortDirection, loading, error,
  onPageChange, onRowsPerPageChange, onSearchChange, onSortChange, onDelete,
}: ResourceTableProps<T>) {
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = window.setTimeout(() => onSearchChange(searchInput), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  return (
    <Paper className="page-enter-delay" sx={{ overflow: 'hidden', border: 1, borderColor: 'divider', transition: 'box-shadow 240ms ease, transform 240ms ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 16px 40px rgba(44, 52, 75, .1)' } }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, rgba(99,91,255,.04), transparent)' }}>
        <TextField
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search records..."
          size="small"
          sx={{ width: { xs: '100%', sm: 340 }, '& .MuiOutlinedInput-root': { transition: 'box-shadow 200ms ease, border-color 200ms ease', '&:hover': { borderColor: 'primary.light' }, '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(99, 91, 255, .12)' } } }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> } }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>{total} records</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mx: 2, mb: 2 }}>{error}</Alert>}
      <TableContainer>
        <Table>
          <TableHead><TableRow>{columns.map((column) => (
            <TableCell key={String(column.key)}>
              <TableSortLabel
                active={sortBy === column.key}
                direction={sortBy === column.key ? sortDirection : 'asc'}
                onClick={() => onSortChange(column.key)}
              >{column.label}</TableSortLabel>
            </TableCell>
          ))}{onDelete && <TableCell align="right">Actions</TableCell>}</TableRow></TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={columns.length + (onDelete ? 1 : 0)} align="center" sx={{ py: 6 }}><CircularProgress size={28} /></TableCell></TableRow>
              : rows.length === 0 ? <TableRow><TableCell colSpan={columns.length + (onDelete ? 1 : 0)} align="center" sx={{ py: 6 }}><Typography color="text.secondary">No records found</Typography></TableCell></TableRow>
              : rows.map((row, index) => <TableRow hover key={row.id} sx={{ animation: 'page-enter 420ms cubic-bezier(.2,.8,.2,1) both', animationDelay: `${index * 45}ms`, '&:hover td': { backgroundColor: 'rgba(99, 91, 255, .035)' } }}>{columns.map((column) => <TableCell key={String(column.key)}>{column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '—')}</TableCell>)}{onDelete && <TableCell align="right"><Tooltip title="Delete"><IconButton color="error" onClick={() => onDelete(row)} sx={{ transition: 'transform 180ms ease, background-color 180ms ease', '&:hover': { transform: 'rotate(-8deg) scale(1.12)' } }}><DeleteOutlined /></IconButton></Tooltip></TableCell>}</TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={total} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[5, 10, 25]} onPageChange={(_, nextPage) => onPageChange(nextPage)} onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))} />
    </Paper>
  );
}
