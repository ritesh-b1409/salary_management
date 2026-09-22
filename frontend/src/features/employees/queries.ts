import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  fetchEmployee,
  fetchEmployees,
  importEmployees,
  updateEmployee,
  updateSalary,
} from "../../api/employees";
import type { EmployeeFormInput, EmployeeListParams, SalaryUpdateInput } from "../../types";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params: EmployeeListParams) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: number | string) => [...employeeKeys.details(), id] as const,
};

export function useEmployees(params: EmployeeListParams) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => fetchEmployees(params),
    placeholderData: keepPreviousData,
  });
}

export function useEmployee(id: number | string | undefined) {
  return useQuery({
    queryKey: employeeKeys.detail(id ?? ""),
    queryFn: () => fetchEmployee(id as number | string),
    enabled: id !== undefined,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeeFormInput) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useUpdateEmployee(id: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<EmployeeFormInput>) => updateEmployee(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(employeeKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useUpdateSalary(id: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SalaryUpdateInput) => updateSalary(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(employeeKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useImportEmployees() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => importEmployees(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}
