import { useState } from "react";
import { TableRow, TableCell, Typography, Stack, Chip, Switch, Avatar, IconButton } from "@mui/material";
import { useUpdateCustomer, useDeleteCustomer } from "../../hooks/useCustomer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdVisibility, MdEdit, MdDeleteOutline } from "react-icons/md";
import ViewCustomerModal from "./ViewCustomerModal";

const CustomerRow = ({ customer }) => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const { mutate: updateCustomer, isPending } = useUpdateCustomer();
    const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

    const handleBlockToggle = () => {
        updateCustomer({ id: customer._id, data: { isActive: !customer.isActive } }, {
            onSuccess: () => toast.success("Updated."),
            onError: () => toast.error("Failed to update.")
        });
    };

    // Generate initials from firstName and lastName
    const initials = `${customer.firstName?.charAt(0) || ""}${customer.lastName?.charAt(0) || ""}`.toUpperCase();

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

    const avatarColor = getAvatarColor(customer.email);

    return (
        <TableRow
            sx={{
                borderBottom: "1px solid var(--border-color)",
                "&:last-child": {
                    borderBottom: "none"
                },
                "&:hover": {
                    bgcolor: "rgba(59, 130, 246, 0.02)",
                    transition: "background-color 0.2s ease"
                },
                transition: "background-color 0.2s ease",
            }}
        >
            {/* First Name with Avatar */}
            <TableCell sx={{ width: "14%", py: 2.5, px: 2.5, borderBottom: "inherit" }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: avatarColor.bg,
                            color: avatarColor.text,
                            fontWeight: 700,
                            fontSize: 14,
                            border: `1.5px solid ${avatarColor.text}20`
                        }}
                    >
                        {initials}
                    </Avatar>
                    <Typography sx={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500, letterSpacing: 0.3 }}>
                        {customer.firstName}
                    </Typography>
                </Stack>
            </TableCell>

            {/* Last Name */}
            <TableCell sx={{ width: "14%", py: 2.5, px: 2.5, borderBottom: "inherit" }}>
                <Typography sx={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500, letterSpacing: 0.3 }}>
                    {customer.lastName}
                </Typography>
            </TableCell>

            {/* Email */}
            <TableCell sx={{ width: "21%", py: 2.5, px: 2.5, borderBottom: "inherit" }}>
                <Typography sx={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 400, letterSpacing: 0.2 }}>
                    {customer.email}
                </Typography>
            </TableCell>

            {/* City */}
            <TableCell sx={{ width: "11%", py: 2.5, px: 2.5, borderBottom: "inherit" }}>
                <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 400, letterSpacing: 0.2 }}>
                    {customer.city || "—"}
                </Typography>
            </TableCell>

            {/* Role */}
            <TableCell sx={{ width: "11%", py: 2.5, px: 2.5, borderBottom: "inherit" }}>
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
            </TableCell>

            {/* Status */}
            <TableCell sx={{ width: "11%", py: 2.5, px: 2.5, borderBottom: "inherit" }}>
                <Switch
                    checked={customer.isActive}
                    onChange={handleBlockToggle}
                    disabled={isPending}
                    color={customer.isActive ? "success" : "error"}
                    size="small"
                />
            </TableCell>

            {/* Action - Icons */}
            <TableCell sx={{ width: "18%", py: 2.5, px: 2.5, borderBottom: "inherit" }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton
                        size="small"
                        onClick={() => setModalOpen(true)}
                        sx={{
                            color: "var(--text-secondary)",
                            "&:hover": {
                                color: "#3b82f6",
                                bgcolor: "rgba(59, 130, 246, 0.1)"
                            },
                            transition: "all 0.2s ease"
                        }}
                    >
                        <MdVisibility size={18} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => navigate(`/edit-customer/${customer._id}`)}
                        sx={{
                            color: "var(--text-secondary)",
                            "&:hover": {
                                color: "#f59e0b",
                                bgcolor: "rgba(245, 158, 11, 0.1)"
                            },
                            transition: "all 0.2s ease"
                        }}
                    >
                        <MdEdit size={18} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => {
                            if (window.confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) {
                                deleteCustomer(customer._id, {
                                    onSuccess: () => toast.success("Customer deleted."),
                                    onError: () => toast.error("Failed to delete.")
                                });
                            }
                        }}
                        disabled={isDeleting}
                        sx={{
                            color: "var(--text-secondary)",
                            "&:hover": {
                                color: "#ef4444",
                                bgcolor: "rgba(239, 68, 68, 0.1)"
                            },
                            transition: "all 0.2s ease"
                        }}
                    >
                        <MdDeleteOutline size={18} />
                    </IconButton>
                </Stack>
            </TableCell>

            <ViewCustomerModal 
                open={modalOpen} 
                onClose={() => setModalOpen(false)} 
                customerId={customer._id}
            />
        </TableRow>
    );
};

export default CustomerRow;