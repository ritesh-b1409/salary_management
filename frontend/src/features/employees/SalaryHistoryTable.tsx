import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { SalaryHistoryEntry } from "../../types";
import { formatCurrency, formatDate, formatPercentChange } from "../../hooks/formatters";
import { EmptyState } from "../../components/StateViews";

interface SalaryHistoryTableProps {
  history: SalaryHistoryEntry[];
}

export function SalaryHistoryTable({ history }: SalaryHistoryTableProps) {
  if (history.length === 0) {
    return <EmptyState title="No salary history yet" description="Changes will appear here." />;
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime(),
  );

  return (
    <TableContainer>
      <Table aria-label="Salary history" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Effective date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>% change</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Changed by</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((entry, index) => {
            const previous = sorted[index + 1];
            return (
              <TableRow key={entry.id}>
                <TableCell>{formatDate(entry.effective_date)}</TableCell>
                <TableCell>{formatCurrency(entry.amount, entry.currency)}</TableCell>
                <TableCell>
                  {previous ? (
                    formatPercentChange(previous.amount, entry.amount)
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{entry.reason}</TableCell>
                <TableCell>{entry.changed_by}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
