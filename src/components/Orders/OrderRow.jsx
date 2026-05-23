import { TableRow, TableCell, Avatar, Typography, Stack, Chip, Select, MenuItem, Box } from "@mui/material";
import dayjs from "../../lib/dayjs";
import { getStatusColor } from "../../utils/statusChip";
import { ORDER_STATUSES } from "../../constants";

const OrderRow = ({ order, onStatusChange, onViewDetails, isUpdating }) => {
    const orderStatus = order.status || "processing";
    const statusColor = getStatusColor(orderStatus);
    const customer = order.customerId || order.customerInfo || {};
    const customerName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown";
    const customerEmail = customer.email || "No email";
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
                    py: 2,
                    textAlign: "left",
                }}
            >
                {orderNo}
            </TableCell>

            {/* Customer */}
            <TableCell
                sx={{
                    py: 2,
                    textAlign: "left",
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${customerName}&backgroundColor=dbf1fc&textColor=2663eb&fontSize=38`}
                        sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: 12 }}>
                            {customerName}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "var(--text-secondary)", margin: 0 }}>
                            {customerEmail}
                        </Typography>
                    </Box>
                </Stack>
            </TableCell>

            {/* Date */}
            <TableCell
                sx={{
                    color: "var(--text-secondary)",
                    fontSize: 12,
                    py: 2,
                    textAlign: "center",
                }}
            >
                {dayjs(order.createdAt).format("MMM DD, YYYY")}
            </TableCell>

            {/* Total Amount */}
            <TableCell
                sx={{
                    py: 2,
                    textAlign: "right",
                    pr: 3,
                }}
            >
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
            <TableCell
                sx={{
                    py: 2,
                    textAlign: "center",
                }}
            >
                <Chip
                    label={orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1).replace(/_/g, ' ')}
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

            {/* Action */}
            <TableCell
                onClick={(e) => e.stopPropagation()}
                sx={{
                    py: 2,
                    textAlign: "center",
                }}
            >
                <Select
                    size="small"
                    value={orderStatus}
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
                    {ORDER_STATUSES.map((status) => (
                        <MenuItem key={status.value} value={status.value} sx={{ fontSize: 12, fontWeight: 500 }}>
                            {status.label}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
        </TableRow>
    );
};

export default OrderRow;