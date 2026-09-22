import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteEmployee,
  useEmployee,
  useUpdateEmployee,
  useUpdateSalary,
} from "../features/employees/queries";
import { EmployeeForm } from "../features/employees/EmployeeForm";
import { SalaryUpdateForm } from "../features/employees/SalaryUpdateForm";
import { SalaryHistoryTable } from "../features/employees/SalaryHistoryTable";
import { ErrorState, LoadingState } from "../components/StateViews";
import { normalizeApiError } from "../api/client";
import { formatCurrency, formatDate } from "../hooks/formatters";

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employee, isLoading, isError, error } = useEmployee(id);
  const updateEmployeeMutation = useUpdateEmployee(id!);
  const updateSalaryMutation = useUpdateSalary(id!);
  const deleteMutation = useDeleteEmployee();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingSalary, setIsAddingSalary] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading) return <LoadingState label="Loading employee…" />;
  if (isError || !employee) {
    return <ErrorState message={normalizeApiError(error).message || "Employee not found."} />;
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          {employee.name}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={() => setIsEditingProfile(true)}
          >
            Edit profile
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            variant="outlined"
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Profile
            </Typography>
            <Stack spacing={1.5}>
              <DetailRow label="Email" value={employee.email} />
              <DetailRow label="Department" value={employee.department} />
              <DetailRow label="Country" value={employee.country} />
              <DetailRow label="Role" value={employee.role} />
              <DetailRow
                label="Status"
                value={<Chip size="small" label={employee.employment_status.replace("_", " ")} />}
              />
              <DetailRow label="Hire date" value={formatDate(employee.hire_date)} />
              <Divider sx={{ my: 1 }} />
              <DetailRow
                label="Current salary"
                value={
                  <Typography variant="h6" fontWeight={600}>
                    {formatCurrency(employee.current_salary, employee.currency)}
                  </Typography>
                }
              />
              <DetailRow label="Last raise" value={formatDate(employee.last_raise_date)} />
            </Stack>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => setIsAddingSalary(true)}
            >
              Record salary change
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Salary history
            </Typography>
            <SalaryHistoryTable history={employee.salary_history} />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={isEditingProfile} onClose={() => setIsEditingProfile(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit employee</DialogTitle>
        <DialogContent>
          <EmployeeForm
            defaultValues={{
              name: employee.name,
              email: employee.email,
              department: employee.department,
              country: employee.country,
              role: employee.role,
              employment_status: employee.employment_status,
              hire_date: employee.hire_date,
              currency: employee.currency,
              current_salary: employee.current_salary,
            }}
            submitLabel="Save changes"
            isSubmitting={updateEmployeeMutation.isPending}
            topLevelError={
              updateEmployeeMutation.isError
                ? normalizeApiError(updateEmployeeMutation.error).message
                : null
            }
            serverFieldErrors={
              updateEmployeeMutation.isError
                ? normalizeApiError(updateEmployeeMutation.error).fieldErrors
                : undefined
            }
            onCancel={() => setIsEditingProfile(false)}
            onSubmit={(values) => {
              updateEmployeeMutation.mutate(values, {
                onSuccess: () => setIsEditingProfile(false),
              });
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingSalary} onClose={() => setIsAddingSalary(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record salary change</DialogTitle>
        <DialogContent>
          <SalaryUpdateForm
            isSubmitting={updateSalaryMutation.isPending}
            topLevelError={
              updateSalaryMutation.isError
                ? normalizeApiError(updateSalaryMutation.error).message
                : null
            }
            serverFieldErrors={
              updateSalaryMutation.isError
                ? normalizeApiError(updateSalaryMutation.error).fieldErrors
                : undefined
            }
            onCancel={() => setIsAddingSalary(false)}
            onSubmit={(values) => {
              updateSalaryMutation.mutate(values, {
                onSuccess: () => setIsAddingSalary(false),
              });
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>Delete {employee.name}?</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>This action cannot be undone.</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              color="error"
              variant="contained"
              disabled={deleteMutation.isPending}
              onClick={() => {
                deleteMutation.mutate(id!, {
                  onSuccess: () => navigate("/employees"),
                });
              }}
            >
              Delete
            </Button>
            <Button variant="text" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography component="div" textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
}
