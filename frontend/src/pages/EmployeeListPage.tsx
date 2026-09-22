import { useMemo, useState } from "react";
import { Box, Paper, TablePagination, Typography } from "@mui/material";
import { useEmployees, useImportEmployees } from "../features/employees/queries";
import { EmployeeToolbar } from "../features/employees/EmployeeToolbar";
import { EmployeeTable } from "../features/employees/EmployeeTable";
import { ImportResultDialog } from "../features/employees/ImportResultDialog";
import { EmptyState, ErrorState, TableSkeleton } from "../components/StateViews";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { exportEmployees } from "../api/employees";
import { normalizeApiError } from "../api/client";
import type { EmployeeListParams, EmploymentStatus, ImportResult } from "../types";

export function EmployeeListPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<EmploymentStatus | "">("");
  const [sort, setSort] = useState<NonNullable<EmployeeListParams["sort"]>>("name");
  const [order, setOrder] = useState<NonNullable<EmployeeListParams["order"]>>("asc");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [isExporting, setIsExporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 350);
  const debouncedDepartment = useDebouncedValue(department, 350);
  const debouncedCountry = useDebouncedValue(country, 350);

  const params: EmployeeListParams = useMemo(
    () => ({
      page: page + 1,
      per_page: perPage,
      search: debouncedSearch || undefined,
      department: debouncedDepartment || undefined,
      country: debouncedCountry || undefined,
      employment_status: status || undefined,
      sort,
      order,
    }),
    [page, perPage, debouncedSearch, debouncedDepartment, debouncedCountry, status, sort, order],
  );

  const { data, isLoading, isError, error, refetch } = useEmployees(params);
  const importMutation = useImportEmployees();

  const handleSortChange = (nextSort: NonNullable<EmployeeListParams["sort"]>) => {
    if (nextSort === sort) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(nextSort);
      setOrder("asc");
    }
    setPage(0);
  };

  const resetToFirstPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(0);
  };

  const handleImport = (file: File) => {
    setImportError(null);
    importMutation.mutate(file, {
      onSuccess: (result) => setImportResult(result),
      onError: (err) => setImportError(normalizeApiError(err).message),
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportEmployees(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "employees.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" fontWeight={600} sx={{ mb: 3 }}>
        Employees
      </Typography>

      <EmployeeToolbar
        search={search}
        onSearchChange={resetToFirstPage(setSearch)}
        department={department}
        onDepartmentChange={resetToFirstPage(setDepartment)}
        country={country}
        onCountryChange={resetToFirstPage(setCountry)}
        status={status}
        onStatusChange={resetToFirstPage(setStatus)}
        onImport={handleImport}
        onExport={handleExport}
        isImporting={importMutation.isPending}
        isExporting={isExporting}
      />

      <Paper variant="outlined">
        {isLoading && <TableSkeleton />}

        {isError && (
          <ErrorState message={normalizeApiError(error).message || "Failed to load employees."} />
        )}

        {!isLoading && !isError && data && data.data.length === 0 && (
          <EmptyState
            title="No employees match these filters"
            description="Try adjusting your search or filters."
          />
        )}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <>
            <EmployeeTable
              employees={data.data}
              sort={sort}
              order={order}
              onSortChange={handleSortChange}
            />
            <TablePagination
              component="div"
              count={data.meta.total}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={perPage}
              onRowsPerPageChange={(e) => {
                setPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </>
        )}
      </Paper>

      <ImportResultDialog
        result={importResult}
        error={importError}
        onClose={() => {
          setImportResult(null);
          setImportError(null);
          refetch();
        }}
      />
    </Box>
  );
}
