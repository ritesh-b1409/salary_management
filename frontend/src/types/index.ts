export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type EmploymentStatus = "active" | "inactive" | "on_leave" | "terminated";

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  country: string;
  role: string;
  employment_status: EmploymentStatus;
  hire_date: string;
  current_salary: number;
  currency: string;
  last_raise_date: string | null;
}

export interface SalaryHistoryEntry {
  id: number;
  effective_date: string;
  amount: number;
  currency: string;
  reason: string;
  changed_by: string;
}

export interface EmployeeDetail extends Employee {
  salary_history: SalaryHistoryEntry[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  errors: ApiFieldError[];
}

export interface EmployeeListParams {
  page?: number;
  per_page?: number;
  search?: string;
  department?: string;
  country?: string;
  employment_status?: EmploymentStatus | "";
  sort?: "name" | "department" | "country" | "current_salary";
  order?: "asc" | "desc";
}

export interface EmployeeFormInput {
  name: string;
  email: string;
  department: string;
  country: string;
  role: string;
  employment_status: EmploymentStatus;
  hire_date: string;
  currency: string;
  current_salary?: number;
}

export interface SalaryUpdateInput {
  amount: number;
  effective_date: string;
  reason: string;
}

export interface AnalyticsFilters {
  department?: string;
  country?: string;
}

export interface DepartmentBreakdown {
  department: string;
  avg_salary: number;
  headcount: number;
}

export interface CountryBreakdown {
  country: string;
  avg_salary: number;
  headcount: number;
}

export interface SalaryDistributionBucket {
  bucket_start: number;
  bucket_end: number;
  count: number;
}

export interface AnalyticsSummary {
  avg_salary: number;
  median_salary: number;
  total_payroll: number;
  headcount: number;
  by_department: DepartmentBreakdown[];
  by_country: CountryBreakdown[];
  /**
   * Assumption: the API contract given did not describe a histogram field.
   * We assume the summary endpoint also returns pre-bucketed salary counts
   * here, since shipping 10k raw salaries to the client to bucket ourselves
   * would defeat server-side pagination. See README "Assumptions".
   */
  salary_distribution: SalaryDistributionBucket[];
}

export interface ImportResultRow {
  row: number;
  message: string;
}

export interface ImportResult {
  created: number;
  failed: number;
  errors: ImportResultRow[];
}
