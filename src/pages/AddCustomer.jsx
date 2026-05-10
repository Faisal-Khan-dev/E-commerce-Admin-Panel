import { useState } from "react";
import { Box, Button, Card, Stack, TextField, MenuItem, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { createCustomer } from "../services/customer";

const AddCustomer = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            role: "user"
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            await createCustomer(data);
            toast.success("User added successfully");
            reset();
            navigate("/customers");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 700, mx: "auto" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 3 }}>
                Add New Customer
            </Typography>

            <Card sx={{ p: 3, bgcolor: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2.5}>
                        {/* First Name & Last Name Row */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{ required: "First name is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="First Name"
                                        placeholder="Enter first name"
                                        fullWidth
                                        size="small"
                                        error={!!error}
                                        helperText={error?.message}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                bgcolor: "var(--bg-page)",
                                                "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                            }
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{ required: "Last name is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Last Name"
                                        placeholder="Enter last name"
                                        fullWidth
                                        size="small"
                                        error={!!error}
                                        helperText={error?.message}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                bgcolor: "var(--bg-page)",
                                                "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Stack>

                        {/* Email */}
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    placeholder="Enter email"
                                    type="email"
                                    fullWidth
                                    size="small"
                                    error={!!error}
                                    helperText={error?.message}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "var(--bg-page)",
                                            "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                        }
                                    }}
                                />
                            )}
                        />

                        {/* Password */}
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            }}
                            render={({ field, fieldState: { error } }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    placeholder="Enter password"
                                    type="password"
                                    fullWidth
                                    size="small"
                                    error={!!error}
                                    helperText={error?.message}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "var(--bg-page)",
                                            "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                        }
                                    }}
                                />
                            )}
                        />

                        {/* Phone & City Row */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Phone"
                                        placeholder="Enter phone number"
                                        fullWidth
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                bgcolor: "var(--bg-page)",
                                                "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                            }
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="City"
                                        placeholder="Enter city"
                                        fullWidth
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                bgcolor: "var(--bg-page)",
                                                "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Stack>

                        {/* Address */}
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Address"
                                    placeholder="Enter address"
                                    fullWidth
                                    size="small"
                                    multiline
                                    rows={2}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "var(--bg-page)",
                                            "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                        }
                                    }}
                                />
                            )}
                        />

                        {/* Postal Code & Role Row */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Controller
                                name="postalCode"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Postal Code"
                                        placeholder="Enter postal code"
                                        fullWidth
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                bgcolor: "var(--bg-page)",
                                                "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                            }
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Role"
                                        select
                                        fullWidth
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                bgcolor: "var(--bg-page)",
                                                "&:hover fieldset": { borderColor: "var(--color-primary)" }
                                            }
                                        }}
                                    >
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Stack>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isLoading}
                                sx={{ textTransform: "none", fontWeight: 600 }}
                            >
                                {isLoading ? "Adding..." : "Add Customer"}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/customers")}
                                disabled={isLoading}
                                sx={{ textTransform: "none", fontWeight: 600 }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Card>
        </Box>
    );
};

export default AddCustomer;
