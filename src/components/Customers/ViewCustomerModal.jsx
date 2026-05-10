import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Box,
    Typography,
    Grid,
    Chip,
    Avatar,
    Divider,
    CircularProgress
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { useGetSingleCustomer } from "../../hooks/useCustomer";

const ViewCustomerModal = ({ open, onClose, customerId }) => {
    const { data: customerData, isLoading } = useGetSingleCustomer(customerId);
    const customer = customerData?.user;

    // Generate initials from firstName and lastName
    const initials = customer
        ? `${customer.firstName?.charAt(0) || ""}${customer.lastName?.charAt(0) || ""}`.toUpperCase()
        : "";

    // Generate consistent light color for avatar based on email
    const getAvatarColor = (email) => {
        const colors = [
            { bg: "rgba(59, 130, 246, 0.15)", text: "#1e40af" },      // Blue
            { bg: "rgba(139, 92, 246, 0.15)", text: "#6d28d9" },      // Purple
            { bg: "rgba(236, 72, 153, 0.15)", text: "#be123c" },      // Pink
            { bg: "rgba(34, 197, 94, 0.15)", text: "#15803d" },       // Green
            { bg: "rgba(249, 115, 22, 0.15)", text: "#92400e" },      // Orange
            { bg: "rgba(14, 165, 233, 0.15)", text: "#0c4a6e" },      // Sky
            { bg: "rgba(168, 85, 247, 0.15)", text: "#581c87" },      // Fuchsia
            { bg: "rgba(59, 130, 246, 0.15)", text: "#1e40af" },      // Cyan
        ];

        const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const avatarColor = customer ? getAvatarColor(customer.email) : {};

    const InfoRow = ({ label, value }) => (
        <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
            <Typography
                sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    minWidth: 120,
                    textTransform: "uppercase",
                    letterSpacing: 0.5
                }}
            >
                {label}
            </Typography>
            <Typography
                sx={{
                    fontSize: 14,
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    flex: 1,
                    wordBreak: "break-word"
                }}
            >
                {value || "—"}
            </Typography>
        </Stack>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px"
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px",
                    borderBottom: "1px solid var(--border-color)"
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontSize: 16
                    }}
                >
                    Customer Details
                </Typography>
                <Button
                    onClick={onClose}
                    sx={{
                        minWidth: "auto",
                        p: 0.5,
                        color: "var(--text-secondary)",
                        "&:hover": { color: "var(--text-primary)" }
                    }}
                >
                    <MdClose size={20} />
                </Button>
            </DialogTitle>

            <DialogContent sx={{ padding: "24px" }}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                        <CircularProgress />
                    </Box>
                ) : customer ? (
                    <Stack spacing={3}>
                        {/* Header with Avatar */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2, borderBottom: "1px solid var(--border-color)" }}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    bgcolor: avatarColor.bg,
                                    color: avatarColor.text,
                                    fontWeight: 700,
                                    fontSize: 20,
                                    border: `2px solid ${avatarColor.text}30`
                                }}
                            >
                                {initials}
                            </Avatar>
                            <Stack>
                                <Typography
                                    sx={{
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: "var(--text-primary)"
                                    }}
                                >
                                    {customer.firstName} {customer.lastName}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "var(--text-secondary)",
                                        fontWeight: 500
                                    }}
                                >
                                    {customer.email}
                                </Typography>
                            </Stack>
                        </Box>

                        {/* Personal Information */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "var(--color-primary)",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.8,
                                    mb: 2
                                }}
                            >
                                Personal Information
                            </Typography>
                            <InfoRow label="First Name" value={customer.firstName} />
                            <InfoRow label="Last Name" value={customer.lastName} />
                            <InfoRow label="Email" value={customer.email} />
                            <InfoRow label="Phone" value={customer.phone} />
                        </Box>

                        <Divider sx={{ borderColor: "var(--border-color)" }} />

                        {/* Address Information */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "var(--color-primary)",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.8,
                                    mb: 2
                                }}
                            >
                                Address Information
                            </Typography>
                            <InfoRow label="Address" value={customer.address} />
                            <InfoRow label="City" value={customer.city} />
                            <InfoRow label="Postal Code" value={customer.postalCode} />
                        </Box>

                        <Divider sx={{ borderColor: "var(--border-color)" }} />

                        {/* Account Status */}
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "var(--color-primary)",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.8,
                                    mb: 2
                                }}
                            >
                                Account Status
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "var(--text-secondary)",
                                            textTransform: "uppercase",
                                            letterSpacing: 0.5,
                                            minWidth: 120
                                        }}
                                    >
                                        Role
                                    </Typography>
                                    <Chip
                                        label={customer.role?.charAt(0).toUpperCase() + customer.role?.slice(1) || "User"}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 12,
                                            bgcolor: customer.role === "admin" ? "rgba(59, 130, 246, 0.12)" : "rgba(107, 114, 128, 0.12)",
                                            color: customer.role === "admin" ? "#1e40af" : "#374151",
                                            border: `1px solid ${customer.role === "admin" ? "rgba(59, 130, 246, 0.3)" : "rgba(107, 114, 128, 0.3)"}`,
                                            textTransform: "capitalize"
                                        }}
                                    />
                                </Stack>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "var(--text-secondary)",
                                            textTransform: "uppercase",
                                            letterSpacing: 0.5,
                                            minWidth: 120
                                        }}
                                    >
                                        Status
                                    </Typography>
                                    <Chip
                                        label={customer.isActive ? "Active" : "Blocked"}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 12,
                                            bgcolor: customer.isActive ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                                            color: customer.isActive ? "#166534" : "#991b1b",
                                            border: `1px solid ${customer.isActive ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Metadata */}
                        <Box sx={{ bgcolor: "var(--bg-page)", p: 2, borderRadius: "8px", mt: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "var(--text-secondary)",
                                    mb: 1.5
                                }}
                            >
                                Created: {new Date(customer.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </Typography>
                        </Box>
                    </Stack>
                ) : (
                    <Typography sx={{ textAlign: "center", color: "var(--text-secondary)" }}>
                        No customer data found
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ padding: "16px 24px", borderTop: "1px solid var(--border-color)" }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        minWidth: 100
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewCustomerModal;
