import { http, HttpResponse } from "msw";
import type { Employee, EmployeeDetail, PaginatedResponse } from "../types";

const API_BASE_URL = "http://localhost:3000/api/v1";

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Ada Lovelace",
    email: "ada@example.com",
    department: "Engineering",
    country: "United Kingdom",
    role: "Principal Engineer",
    employment_status: "active",
    hire_date: "2019-03-01",
    current_salary: 145000,
    currency: "GBP",
    last_raise_date: "2025-01-15",
  },
  {
    id: 2,
    name: "Grace Hopper",
    email: "grace@example.com",
    department: "Engineering",
    country: "United States",
    role: "Engineering Director",
    employment_status: "active",
    hire_date: "2015-06-12",
    current_salary: 210000,
    currency: "USD",
    last_raise_date: "2024-11-01",
  },
];

export const mockEmployeeDetail: EmployeeDetail = {
  ...mockEmployees[0],
  salary_history: [
    {
      id: 1,
      effective_date: "2023-01-15",
      amount: 130000,
      currency: "GBP",
      reason: "Annual review",
      changed_by: "HR Manager",
    },
    {
      id: 2,
      effective_date: "2025-01-15",
      amount: 145000,
      currency: "GBP",
      reason: "Promotion",
      changed_by: "HR Manager",
    },
  ],
};

export const handlers = [
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === "hr@example.com" && body.password === "password123") {
      return HttpResponse.json({
        token: "mock-jwt-token",
        user: { id: 1, name: "Pat HR", email: body.email },
      });
    }
    return HttpResponse.json(
      { errors: [{ field: "", message: "Invalid email or password" }] },
      { status: 401 },
    );
  }),

  http.get(`${API_BASE_URL}/employees`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    let data = mockEmployees;
    if (search) {
      data = data.filter((e) => e.name.toLowerCase().includes(search));
    }
    const response: PaginatedResponse<Employee> = {
      data,
      meta: { total: data.length, page: 1, per_page: 25, total_pages: 1 },
    };
    return HttpResponse.json(response);
  }),

  http.get(`${API_BASE_URL}/employees/:id`, ({ params }) => {
    if (String(params.id) === "1") {
      return HttpResponse.json(mockEmployeeDetail);
    }
    return HttpResponse.json({ errors: [{ field: "", message: "Not found" }] }, { status: 404 });
  }),
];
