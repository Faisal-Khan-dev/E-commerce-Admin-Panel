import { useEffect } from "react";
import { Box, Button, Card, Stack, TextField, MenuItem, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useGetSingleCustomer, useUpdateCustomer } from "../hooks/useCustomer";

const EditCustomer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: customerData, isLoading: isFetching } = useGetSingleCustomer(id);
    const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            role: "user"
        }
    });

    // Populate form with customer data when it loads
    useEffect(() => {
        if (customerData?.user) {
            reset({
                firstName: customerData.user.firstName || "",
                lastName: customerData.user.lastName || "",
                email: customerData.user.email || "",
                phone: customerData.user.phone || "",
                address: customerData.user.address || "",
                city: customerData.user.city || "",
                postalCode: customerData.user.postalCode || "",
                role: customerData.user.role || "user"
            });
        }
    }, [customerData, reset]);

    const onSubmit = (data) => {
        updateCustomer(
            { id, data },
            {
                onSuccess: () => {
                    toast.success("User updated successfully");
                    navigate("/customers");
                },
                onError: (error) => {
                    toast.error(error.response?.data?.message || "Failed to update user");
                }
            }
        );
    };

    if (isFetching) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", maxWidth: 700, mx: "auto" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 3 }}>
                Edit Customer
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
                                    disabled
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
                                disabled={isUpdating}
                                sx={{ textTransform: "none", fontWeight: 600 }}
                            >
                                {isUpdating ? "Updating..." : "Update Customer"}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/customers")}
                                disabled={isUpdating}
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

export default EditCustomer;
