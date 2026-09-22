import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { login as loginRequest } from "../api/auth";
import { normalizeApiError } from "../api/client";
import { useAuth } from "../features/auth/AuthContext";
import { loginSchema, type LoginFormValues } from "../features/auth/schema";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state?: { from?: Location } };
  const [topLevelError, setTopLevelError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.token, data.user);
      const redirectTo = location.state?.from?.pathname ?? "/employees";
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      const { fieldErrors, message, status } = normalizeApiError(error);
      if (Object.keys(fieldErrors).length) {
        for (const [field, msg] of Object.entries(fieldErrors)) {
          if (field === "email" || field === "password") {
            setError(field, { message: msg });
          }
        }
      }
      setTopLevelError(
        status === 401 ? "Invalid email or password." : message || "Login failed.",
      );
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setTopLevelError(null);
    mutation.mutate(values);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        px: 2,
      }}
    >
      <Paper variant="outlined" sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
          Salary Management
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Sign in to manage employee salaries
        </Typography>

        {topLevelError && (
          <Alert severity="error" role="alert" sx={{ mb: 2 }}>
            {topLevelError}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
