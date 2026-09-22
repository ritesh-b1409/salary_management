import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsSummary } from "../../api/analytics";
import type { AnalyticsFilters } from "../../types";

export function useAnalyticsSummary(filters: AnalyticsFilters) {
  return useQuery({
    queryKey: ["analytics", "summary", filters],
    queryFn: () => fetchAnalyticsSummary(filters),
  });
}
