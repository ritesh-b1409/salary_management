import { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useAnalyticsSummary } from "../features/analytics/queries";
import { AnalyticsFiltersBar } from "../features/analytics/AnalyticsFiltersBar";
import { SalaryByDimensionChart } from "../features/analytics/SalaryByDimensionChart";
import { SalaryDistributionChart } from "../features/analytics/SalaryDistributionChart";
import { StatTile } from "../components/StatTile";
import { ErrorState, LoadingState } from "../components/StateViews";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { formatCurrency } from "../hooks/formatters";
import { normalizeApiError } from "../api/client";

export function AnalyticsPage() {
  const [department, setDepartment] = useState("");
  const [country, setCountry] = useState("");
  const debouncedDepartment = useDebouncedValue(department, 350);
  const debouncedCountry = useDebouncedValue(country, 350);

  const filters = useMemo(
    () => ({
      department: debouncedDepartment || undefined,
      country: debouncedCountry || undefined,
    }),
    [debouncedDepartment, debouncedCountry],
  );

  const { data, isLoading, isError, error } = useAnalyticsSummary(filters);

  return (
    <Box>
      <Typography variant="h5" component="h1" fontWeight={600} sx={{ mb: 3 }}>
        Analytics
      </Typography>

      <AnalyticsFiltersBar
        department={department}
        onDepartmentChange={setDepartment}
        country={country}
        onCountryChange={setCountry}
      />

      {isLoading && <LoadingState label="Loading analytics…" />}
      {isError && (
        <ErrorState message={normalizeApiError(error).message || "Failed to load analytics."} />
      )}

      {!isLoading && !isError && data && (
        <Stack spacing={3}>
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={2}>
            <StatTile label="Headcount" value={data.headcount.toLocaleString("en-US")} />
            <StatTile label="Total payroll" value={formatCurrency(data.total_payroll, "USD")} />
            <StatTile label="Average salary" value={formatCurrency(data.avg_salary, "USD")} />
            <StatTile label="Median salary" value={formatCurrency(data.median_salary, "USD")} />
          </Stack>

          <SalaryByDimensionChart
            title="Average salary by department"
            data={data.by_department.map((d) => ({
              label: d.department,
              avg_salary: d.avg_salary,
              headcount: d.headcount,
            }))}
          />

          <SalaryByDimensionChart
            title="Average salary by country"
            data={data.by_country.map((c) => ({
              label: c.country,
              avg_salary: c.avg_salary,
              headcount: c.headcount,
            }))}
          />

          <SalaryDistributionChart buckets={data.salary_distribution} />
        </Stack>
      )}
    </Box>
  );
}
