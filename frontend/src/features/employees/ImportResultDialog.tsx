import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import type { ImportResult } from "../../types";

interface ImportResultDialogProps {
  result: ImportResult | null;
  error: string | null;
  onClose: () => void;
}

export function ImportResultDialog({ result, error, onClose }: ImportResultDialogProps) {
  const open = !!result || !!error;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import results</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {result && (
          <Stack spacing={2}>
            <Alert severity={result.failed > 0 ? "warning" : "success"}>
              {result.created} row{result.created === 1 ? "" : "s"} created,{" "}
              {result.failed} failed.
            </Alert>
            {result.errors.length > 0 && (
              <List dense>
                {result.errors.map((rowError, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemText
                      primary={`Row ${rowError.row}`}
                      secondary={rowError.message}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
