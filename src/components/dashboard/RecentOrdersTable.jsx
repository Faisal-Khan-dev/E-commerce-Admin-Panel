import { Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "../../lib/dayjs";
import TableCard from "./TableCard";
import StatusBadge from "./StatusBadge";

const RecentOrdersTable = ({ orders = [] }) => {
    const navigate = useNavigate();

    return (
        <TableCard
            title="Recent Orders"
            buttonText="View All"
            handleClick={() => navigate("/orders")}
            data={orders}
            emptyText="No orders found yet"
            renderRow={(order) => (
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    sx={{
                        py: 2.5,
                        borderBottom: "1px dashed var(--border-color)",
                        "&:last-child": { borderBottom: 0 },
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            noWrap
                            sx={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                mb: 0.5,
                            }}
                        >
                            {order.customer?.name || "Guest Customer"}
                        </Typography>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "var(--text-secondary)",
                                    fontFamily: "monospace",
                                    opacity: 0.8
                                }}
                            >
                                #{order.orderNo}
                            </Typography>
                            <Box
                                sx={{
                                    width: 3,
                                    height: 3,
                                    borderRadius: "50%",
                                    bgcolor: "var(--text-secondary)",
                                    opacity: 0.5
                                }}
                            />
                            <Typography sx={{ fontSize: 11, color: "var(--text-secondary)", opacity: 0.8 }}>
                                {dayjs(order.createdAt).format("DD MMM, hh:mm A")}
                            </Typography>
                        </Stack>
                    </Box>
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap",
                            textAlign: "right",
                            minWidth: "fit-content"
                        }}
                    >
                        Rs. {order.grandTotal.toLocaleString()}
                    </Typography>
                    <Box
                        sx={{ minWidth: 100, display: "flex", justifyContent: "flex-end" }}
                    >
                        <StatusBadge status={order.status} />
                    </Box>
                </Stack>
            )}
        />
    );
};

export default RecentOrdersTable;