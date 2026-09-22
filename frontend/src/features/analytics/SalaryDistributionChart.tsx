import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Paper, Typography } from "@mui/material";
import { CHART_COLORS } from "../../theme";
import { formatCurrency } from "../../hooks/formatters";
import { EmptyState } from "../../components/StateViews";
import type { SalaryDistributionBucket } from "../../types";

interface SalaryDistributionChartProps {
  buckets: SalaryDistributionBucket[];
}

export function SalaryDistributionChart({ buckets }: SalaryDistributionChartProps) {
  const data = buckets.map((bucket) => ({
    label: `${formatCurrency(bucket.bucket_start, "USD")}–${formatCurrency(bucket.bucket_end, "USD")}`,
    count: bucket.count,
  }));

  return (
    <Paper variant="outlined" sx={{ p: 3, height: 360 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Salary distribution
      </Typography>
      {data.length === 0 ? (
        <EmptyState title="No salary data for this selection" />
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: CHART_COLORS.textSecondary }}
              angle={-30}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis tick={{ fontSize: 12, fill: CHART_COLORS.textSecondary }} allowDecimals={false} width={50} />
            <Tooltip
              formatter={(value) => [`${value} employees`, "Count"]}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="count" fill={CHART_COLORS.series2} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
