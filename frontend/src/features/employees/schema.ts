import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  department: z.string().min(1, "Department is required"),
  country: z.string().min(1, "Country is required"),
  role: z.string().min(1, "Role is required"),
  employment_status: z.enum(["active", "inactive", "on_leave", "terminated"]),
  hire_date: z.string().min(1, "Hire date is required"),
  currency: z.string().min(1, "Currency is required"),
  current_salary: z
    .number({ message: "Salary must be a number" })
    .positive("Salary must be greater than 0")
    .optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export const salaryUpdateSchema = z.object({
  amount: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  effective_date: z
    .string()
    .min(1, "Effective date is required")
    .refine((value) => value >= todayIsoDate(), {
      message: "Effective date cannot be in the past",
    }),
  reason: z.string().min(1, "Reason is required"),
});

export type SalaryUpdateValues = z.infer<typeof salaryUpdateSchema>;
