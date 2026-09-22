import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Paper, Typography } from "@mui/material";
import { CHART_COLORS } from "../../theme";
import { formatCurrency } from "../../hooks/formatters";
import { EmptyState } from "../../components/StateViews";

interface DimensionDatum {
  label: string;
  avg_salary: number;
  headcount: number;
}

interface SalaryByDimensionChartProps {
  title: string;
  data: DimensionDatum[];
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DimensionDatum }[];
}) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="body2" fontWeight={600}>
        {datum.label}
      </Typography>
      <Typography variant="body2">Avg salary: {formatCurrency(datum.avg_salary, "USD")}</Typography>
      <Typography variant="body2" color="text.secondary">
        {datum.headcount} employee{datum.headcount === 1 ? "" : "s"}
      </Typography>
    </Paper>
  );
}

export function SalaryByDimensionChart({ title, data }: SalaryByDimensionChartProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, height: 360 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        {title}
      </Typography>
      {data.length === 0 ? (
        <EmptyState title="No data for this selection" />
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: CHART_COLORS.textSecondary }}
              angle={-20}
              textAnchor="end"
              height={50}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: CHART_COLORS.textSecondary }}
              tickFormatter={(value: number) => formatCurrency(value, "USD")}
              width={90}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="avg_salary" fill={CHART_COLORS.series1} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
