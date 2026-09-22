import { apiClient } from "./client";
import type {
  Employee,
  EmployeeDetail,
  EmployeeFormInput,
  EmployeeListParams,
  ImportResult,
  PaginatedResponse,
  SalaryHistoryEntry,
  SalaryUpdateInput,
} from "../types";

export async function fetchEmployees(
  params: EmployeeListParams,
): Promise<PaginatedResponse<Employee>> {
  const { data } = await apiClient.get<PaginatedResponse<Employee>>("/employees", {
    params,
  });
  return data;
}

export async function fetchEmployee(id: number | string): Promise<EmployeeDetail> {
  const { data } = await apiClient.get<EmployeeDetail>(`/employees/${id}`);
  return data;
}

export async function createEmployee(payload: EmployeeFormInput): Promise<EmployeeDetail> {
  const { data } = await apiClient.post<EmployeeDetail>("/employees", payload);
  return data;
}

export async function updateEmployee(
  id: number | string,
  payload: Partial<EmployeeFormInput>,
): Promise<EmployeeDetail> {
  const { data } = await apiClient.patch<EmployeeDetail>(`/employees/${id}`, payload);
  return data;
}

export async function deleteEmployee(id: number | string): Promise<void> {
  await apiClient.delete(`/employees/${id}`);
}

export async function fetchSalaryHistory(
  id: number | string,
): Promise<SalaryHistoryEntry[]> {
  const { data } = await apiClient.get<SalaryHistoryEntry[]>(
    `/employees/${id}/salary_history`,
  );
  return data;
}

export async function updateSalary(
  id: number | string,
  payload: SalaryUpdateInput,
): Promise<EmployeeDetail> {
  const { data } = await apiClient.patch<EmployeeDetail>(
    `/employees/${id}/salary`,
    payload,
  );
  return data;
}

export async function importEmployees(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<ImportResult>("/employees/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export function buildExportUrl(params: EmployeeListParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return `/employees/export.csv${query ? `?${query}` : ""}`;
}

export async function exportEmployees(params: EmployeeListParams): Promise<Blob> {
  const { data } = await apiClient.get(buildExportUrl(params), {
    responseType: "blob",
  });
  return data;
}
