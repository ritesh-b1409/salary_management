import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/testUtils";
import { EmployeeForm } from "./EmployeeForm";

describe("EmployeeForm", () => {
  it("blocks submission and shows an error when salary is not positive", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(<EmployeeForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), "New Hire");
    await user.type(screen.getByLabelText(/^email$/i), "new.hire@example.com");
    await user.type(screen.getByLabelText(/department/i), "Engineering");
    await user.type(screen.getByLabelText(/country/i), "United States");
    await user.type(screen.getByLabelText(/role/i), "Software Engineer");
    await user.type(screen.getByLabelText(/hire date/i), "2026-01-01");
    await user.clear(screen.getByLabelText(/starting salary/i));
    await user.type(screen.getByLabelText(/starting salary/i), "-500");

    await user.click(screen.getByRole("button", { name: /create employee|save/i }));

    expect(await screen.findByText(/salary must be greater than 0/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits when all fields are valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(<EmployeeForm onSubmit={onSubmit} submitLabel="Create employee" />);

    await user.type(screen.getByLabelText(/full name/i), "New Hire");
    await user.type(screen.getByLabelText(/^email$/i), "new.hire@example.com");
    await user.type(screen.getByLabelText(/department/i), "Engineering");
    await user.type(screen.getByLabelText(/country/i), "United States");
    await user.type(screen.getByLabelText(/role/i), "Software Engineer");
    await user.type(screen.getByLabelText(/hire date/i), "2026-01-01");
    await user.type(screen.getByLabelText(/starting salary/i), "95000");

    await user.click(screen.getByRole("button", { name: /create employee/i }));

    expect(await screen.findByRole("button", { name: /create employee/i })).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      name: "New Hire",
      current_salary: 95000,
    });
  });
});
