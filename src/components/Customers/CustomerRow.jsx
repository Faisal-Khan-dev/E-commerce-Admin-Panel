import { TableRow, TableCell, Avatar, Typography, Stack, Box, Switch, Chip, IconButton } from "@mui/material";
import dayjs from "../../lib/dayjs";
import { useUpdateCustomer } from "../../hooks/useCustomer";
import { toast } from "react-hot-toast";

const CustomerRow = ({ customer }) => {
    const { mutate: updateCustomer, isPending } = useUpdateCustomer();

    const handleBlockToggle = () => {
        updateCustomer({ id: customer._id, data: { isActive: !customer.isActive } }, {
            onSuccess: () => toast.success("Updated."),
            onError: () => toast.error("Failed to update.")
        });
    };

    return (
        <TableRow
            sx={{
                "&:last-child td": { border: 0 },
                "&:hover": { bgcolor: "color-mix(in srgb, var(--color-primary) 3%, transparent)" },
                transition: "background-color 0.15s ease",
            }}
        >
            {/* Customer */}
            <TableCell>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}&backgroundColor=dbf1fc&textColor=2663eb&fontSize=38`}
                        sx={{
                            width: 40,
                            height: 40,
                        }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                            {customer.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
                            Joined {dayjs(customer.createdAt).format("MMM DD, YYYY")}
                        </Typography>
                    </Box>
                </Stack>
            </TableCell>

            {/* Email */}
            <TableCell>
                <Typography sx={{ fontSize: 14, color: "var(--text-primary)" }}>
                    {customer.email}
                </Typography>
            </TableCell>

            {/* Status */}
            <TableCell>
                <Chip
                    label={customer.isActive ? "Active" : "Blocked"}
                    size="small"
                    sx={{
                        fontWeight: 600,
                        fontSize: 12,
                        bgcolor: customer.isActive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: customer.isActive ? "#16a34a" : "#dc2626",
                        border: `1px solid ${customer.isActive ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                    }}
                />
            </TableCell>

            {/* Action - Block Toggle */}
            <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Switch
                        checked={!customer.isActive}
                        onChange={handleBlockToggle}
                        disabled={isPending}
                        color="error"
                        size="small"
                    />
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: !customer.isActive ? "error.main" : "text.secondary"
                        }}
                    >
                        {!customer.isActive ? "Blocked" : "Block"}
                    </Typography>
                </Stack>
            </TableCell>
        </TableRow>
    );
};

export default CustomerRow;