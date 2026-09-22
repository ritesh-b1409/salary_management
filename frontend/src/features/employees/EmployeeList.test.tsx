import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/testUtils";
import { EmployeeListPage } from "../../pages/EmployeeListPage";

describe("EmployeeListPage", () => {
  it("renders employee rows from the mocked API", async () => {
    renderWithProviders(<EmployeeListPage />);

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
  });

  it("debounces the search input and filters results", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmployeeListPage />);

    await screen.findByText("Ada Lovelace");

    const searchInput = screen.getByLabelText(/search by name or employee id/i);
    await user.type(searchInput, "grace");

    // Immediately after typing the debounce has not fired yet.
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
  });

  it("shows an empty state when no employees match", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmployeeListPage />);

    await screen.findByText("Ada Lovelace");

    const searchInput = screen.getByLabelText(/search by name or employee id/i);
    await user.type(searchInput, "nonexistent employee");

    expect(await screen.findByText(/no employees match these filters/i)).toBeInTheDocument();
  });
});
