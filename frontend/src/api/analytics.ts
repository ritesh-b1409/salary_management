import { apiClient } from "./client";
import type { AnalyticsFilters, AnalyticsSummary } from "../types";

export async function fetchAnalyticsSummary(
  filters: AnalyticsFilters,
): Promise<AnalyticsSummary> {
  const { data } = await apiClient.get<AnalyticsSummary>("/analytics/summary", {
    params: filters,
  });
  return data;
}
