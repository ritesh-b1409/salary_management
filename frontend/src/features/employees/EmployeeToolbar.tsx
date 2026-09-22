import { useRef, useState } from "react";
import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import type { EmploymentStatus } from "../../types";

const STATUS_OPTIONS: { value: EmploymentStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "on_leave", label: "On leave" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
];

interface EmployeeToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  country: string;
  onCountryChange: (value: string) => void;
  status: EmploymentStatus | "";
  onStatusChange: (value: EmploymentStatus | "") => void;
  onImport: (file: File) => void;
  onExport: () => void;
  isImporting: boolean;
  isExporting: boolean;
}

export function EmployeeToolbar({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  country,
  onCountryChange,
  status,
  onStatusChange,
  onImport,
  onExport,
  isImporting,
  isExporting,
}: EmployeeToolbarProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState(search);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems={{ md: "center" }}
      sx={{ mb: 2 }}
      flexWrap="wrap"
      useFlexGap
    >
      <TextField
        label="Search by name or employee ID"
        size="small"
        sx={{ minWidth: 240 }}
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          onSearchChange(e.target.value);
        }}
      />
      <TextField
        label="Department"
        size="small"
        sx={{ minWidth: 160 }}
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
      />
      <TextField
        label="Country"
        size="small"
        sx={{ minWidth: 160 }}
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
      />
      <TextField
        select
        label="Status"
        size="small"
        sx={{ minWidth: 160 }}
        value={status}
        onChange={(e) => onStatusChange(e.target.value as EmploymentStatus | "")}
      >
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" spacing={1} sx={{ ml: { md: "auto" } }}>
        <Tooltip title="Import employees from CSV">
          <span>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              disabled={isImporting}
              onClick={() => fileInputRef.current?.click()}
            >
              {isImporting ? "Importing…" : "Import"}
            </Button>
          </span>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = "";
          }}
        />
        <Tooltip title="Export current view as CSV">
          <span>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              disabled={isExporting}
              onClick={onExport}
            >
              Export
            </Button>
          </span>
        </Tooltip>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/employees/new")}
        >
          Add employee
        </Button>
      </Stack>
    </Stack>
  );
}
