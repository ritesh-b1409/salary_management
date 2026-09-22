import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, Button, Grid, MenuItem, Stack, TextField } from "@mui/material";
import { employeeFormSchema, type EmployeeFormValues } from "./schema";
import type { EmployeeFormInput } from "../../types";

const STATUS_OPTIONS: { value: EmployeeFormValues["employment_status"]; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "on_leave", label: "On leave" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
];

interface EmployeeFormProps {
  defaultValues?: Partial<EmployeeFormValues>;
  onSubmit: (values: EmployeeFormInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  topLevelError?: string | null;
  submitLabel?: string;
  serverFieldErrors?: Record<string, string>;
}

export function EmployeeForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  topLevelError,
  submitLabel = "Save",
  serverFieldErrors,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      country: "",
      role: "",
      employment_status: "active",
      hire_date: "",
      currency: "USD",
      ...defaultValues,
    },
  });

  const fieldError = (field: keyof EmployeeFormValues) =>
    errors[field]?.message ?? serverFieldErrors?.[field];

  return (
    <Stack
      component="form"
      noValidate
      spacing={2}
      onSubmit={handleSubmit((values) => onSubmit(values))}
    >
      {topLevelError && (
        <Alert severity="error" role="alert">
          {topLevelError}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Full name"
            fullWidth
            error={!!fieldError("name")}
            helperText={fieldError("name")}
            {...register("name")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            error={!!fieldError("email")}
            helperText={fieldError("email")}
            {...register("email")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Department"
            fullWidth
            error={!!fieldError("department")}
            helperText={fieldError("department")}
            {...register("department")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Country"
            fullWidth
            error={!!fieldError("country")}
            helperText={fieldError("country")}
            {...register("country")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Role"
            fullWidth
            error={!!fieldError("role")}
            helperText={fieldError("role")}
            {...register("role")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Employment status"
            fullWidth
            error={!!fieldError("employment_status")}
            helperText={fieldError("employment_status")}
            defaultValue={defaultValues?.employment_status ?? "active"}
            {...register("employment_status")}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Hire date"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!fieldError("hire_date")}
            helperText={fieldError("hire_date")}
            {...register("hire_date")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Currency (ISO code)"
            fullWidth
            error={!!fieldError("currency")}
            helperText={fieldError("currency") ?? "e.g. USD, EUR, INR"}
            {...register("currency")}
          />
        </Grid>
        {defaultValues?.current_salary === undefined && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Starting salary"
              type="number"
              fullWidth
              inputProps={{ min: 0, step: "0.01" }}
              error={!!fieldError("current_salary")}
              helperText={fieldError("current_salary")}
              {...register("current_salary", { valueAsNumber: true })}
            />
          </Grid>
        )}
      </Grid>

      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="text" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
