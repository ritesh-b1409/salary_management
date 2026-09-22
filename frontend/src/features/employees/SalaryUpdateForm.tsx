import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, Button, Grid, Stack, TextField } from "@mui/material";
import { salaryUpdateSchema, type SalaryUpdateValues } from "./schema";
import type { SalaryUpdateInput } from "../../types";

interface SalaryUpdateFormProps {
  onSubmit: (values: SalaryUpdateInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  topLevelError?: string | null;
  serverFieldErrors?: Record<string, string>;
}

export function SalaryUpdateForm({
  onSubmit,
  onCancel,
  isSubmitting,
  topLevelError,
  serverFieldErrors,
}: SalaryUpdateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalaryUpdateValues>({
    resolver: zodResolver(salaryUpdateSchema),
    defaultValues: { amount: undefined, effective_date: "", reason: "" },
  });

  const fieldError = (field: keyof SalaryUpdateValues) =>
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
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="New amount"
            type="number"
            fullWidth
            inputProps={{ min: 0, step: "0.01" }}
            error={!!fieldError("amount")}
            helperText={fieldError("amount")}
            {...register("amount", { valueAsNumber: true })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Effective date"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!fieldError("effective_date")}
            helperText={fieldError("effective_date")}
            {...register("effective_date")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Reason"
            fullWidth
            error={!!fieldError("reason")}
            helperText={fieldError("reason")}
            {...register("reason")}
          />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Record salary change"}
        </Button>
        <Button variant="text" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}
