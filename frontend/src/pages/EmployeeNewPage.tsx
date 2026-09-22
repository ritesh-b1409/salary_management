import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EmployeeForm } from "../features/employees/EmployeeForm";
import { useCreateEmployee } from "../features/employees/queries";
import { normalizeApiError } from "../api/client";

export function EmployeeNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateEmployee();

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h5" component="h1" fontWeight={600} sx={{ mb: 3 }}>
        Add employee
      </Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <EmployeeForm
          submitLabel="Create employee"
          isSubmitting={createMutation.isPending}
          topLevelError={
            createMutation.isError ? normalizeApiError(createMutation.error).message : null
          }
          serverFieldErrors={
            createMutation.isError ? normalizeApiError(createMutation.error).fieldErrors : undefined
          }
          onCancel={() => navigate("/employees")}
          onSubmit={(values) => {
            createMutation.mutate(values, {
              onSuccess: (employee) => navigate(`/employees/${employee.id}`),
            });
          }}
        />
      </Paper>
    </Box>
  );
}
