import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Employee, EmployeeListParams } from "../../types";
import { formatCurrency, formatDate } from "../../hooks/formatters";

interface Column {
  id: NonNullable<EmployeeListParams["sort"]>;
  label: string;
  sortable: boolean;
}

const COLUMNS: Column[] = [
  { id: "name", label: "Name", sortable: true },
  { id: "department", label: "Department", sortable: true },
  { id: "country", label: "Country", sortable: true },
  { id: "current_salary", label: "Current salary", sortable: true },
];

const STATUS_COLORS: Record<string, "success" | "default" | "warning" | "error"> = {
  active: "success",
  on_leave: "warning",
  inactive: "default",
  terminated: "error",
};

interface EmployeeTableProps {
  employees: Employee[];
  sort: EmployeeListParams["sort"];
  order: EmployeeListParams["order"];
  onSortChange: (sort: NonNullable<EmployeeListParams["sort"]>) => void;
}

export function EmployeeTable({ employees, sort, order, onSortChange }: EmployeeTableProps) {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table aria-label="Employee list" size="medium">
        <TableHead>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableCell key={column.id} sortDirection={sort === column.id ? order : false}>
                {column.sortable ? (
                  <TableSortLabel
                    active={sort === column.id}
                    direction={sort === column.id ? order : "asc"}
                    onClick={() => onSortChange(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last raise</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              hover
              tabIndex={0}
              onClick={() => navigate(`/employees/${employee.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/employees/${employee.id}`);
              }}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.country}</TableCell>
              <TableCell>{formatCurrency(employee.current_salary, employee.currency)}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={employee.employment_status.replace("_", " ")}
                  color={STATUS_COLORS[employee.employment_status] ?? "default"}
                />
              </TableCell>
              <TableCell>{formatDate(employee.last_raise_date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
