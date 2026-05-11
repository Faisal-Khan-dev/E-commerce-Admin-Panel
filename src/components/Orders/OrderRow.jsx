import { TableRow, TableCell, Avatar, Typography, Stack, Chip, Select, MenuItem, Box } from "@mui/material";
import dayjs from "../../lib/dayjs";
import { getStatusColor } from "../../utils/statusChip";

const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

const OrderRow = ({ order, onStatusChange, onViewDetails, isUpdating }) => {
    const shippingStatus = order.shipping?.status || "processing";
    const statusColor = getStatusColor(shippingStatus);
    const customerName = `${order.customerInfo?.firstName || ""} ${order.customerInfo?.lastName || ""}`.trim() || "Unknown";
    const customerEmail = order.customerInfo?.email || "No email";
    const totalItems = order.orderItems?.length || 0;
    const orderNo = order.orderNo || "N/A"; // Use orderNo field

    return (
        <TableRow
            onClick={() => onViewDetails(order)}
            sx={{
                cursor: "pointer",
                "&:last-child td": { border: 0 },
                "&:hover": {
                    bgcolor: "rgba(38, 99, 235, 0.04)",
                },
                transition: "background-color 0.15s ease",
            }}
        >
            {/* Order ID */}
            <TableCell
                sx={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    fontSize: 14,
                }}
            >
                {orderNo}
            </TableCell>

            {/* Date */}
            <TableCell sx={{ color: "var(--text-secondary)", fontSize: 12 }}>
                {dayjs(order.createdAt).format("MMM DD, YYYY - hh:mm A")}
            </TableCell>

            {/* Customer */}
            <TableCell>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${customerName}&backgroundColor=dbf1fc&textColor=2663eb&fontSize=38`}
                        sx={{ width: 32, height: 32 }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: 12 }}>
                        {customerName}
                        <p style={{ margin: 0, fontSize: 10, color: "var(--text-secondary)" }}>{customerEmail}</p>
                    </Typography>
                </Stack>
            </TableCell>

            {/* Total Amount */}
            <TableCell>
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "var(--color-primary)",
                            fontSize: 12,
                        }}
                    >
                        Rs. {order.totalAmount?.toLocaleString()}
                    </Typography>
                    <Typography
                        sx={{
                            color: "var(--text-secondary)",
                            fontSize: 10,
                            fontWeight: 500,
                            opacity: 0.8
                        }}
                    >
                        {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </Typography>
                </Box>
            </TableCell>

            {/* Shipping Status */}
            <TableCell>
                <Chip
                    label={shippingStatus.charAt(0).toUpperCase() + shippingStatus.slice(1)}
                    size="small"
                    sx={{
                        bgcolor: statusColor.bg,
                        color: statusColor.text,
                        fontWeight: 600,
                        fontSize: 12,
                        height: 26,
                        borderRadius: 1.5,
                    }}
                />
            </TableCell>

            <TableCell onClick={(e) => e.stopPropagation()}>
                {shippingStatus !== "cancelled" ? (
                    <Select
                        size="small"
                        value={shippingStatus}
                        disabled={isUpdating}
                        onChange={(e) =>
                            onStatusChange(order._id, e.target.value)
                        }
                        variant="outlined"
                        sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            minWidth: 105,
                            height: 28,
                            borderRadius: 1.5,
                            bgcolor: "var(--bg-page)",
                            "& .MuiSelect-select": { py: 0.5 },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--border-color)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--color-primary)",
                            },
                        }}
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <MenuItem key={s} value={s} sx={{ fontSize: 12, fontWeight: 500 }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    <Typography
                        variant="caption"
                        sx={{
                            color: "var(--text-secondary)",
                            fontSize: 10,
                            fontWeight: 600,
                            px: 1
                        }}>
                        Locked
                    </Typography>
                )}
            </TableCell>
        </TableRow>
    );
};

export default OrderRow;