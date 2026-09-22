import { Stack, TextField } from "@mui/material";

interface AnalyticsFiltersBarProps {
  department: string;
  onDepartmentChange: (value: string) => void;
  country: string;
  onCountryChange: (value: string) => void;
}

export function AnalyticsFiltersBar({
  department,
  onDepartmentChange,
  country,
  onCountryChange,
}: AnalyticsFiltersBarProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
      <TextField
        label="Department"
        size="small"
        sx={{ minWidth: 200 }}
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
      />
      <TextField
        label="Country"
        size="small"
        sx={{ minWidth: 200 }}
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
      />
    </Stack>
  );
}
