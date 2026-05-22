import { Box } from "@mui/material";
import { FaCheckCircle, FaClipboardList, FaMoneyBillWave, FaTruck } from "react-icons/fa";
import CustomCard from "./DashboardCard";

const StatsGrid = ({ metrics = {} }) => {
    const {
        totalOrders = 0,
        totalConfirmedOrders = 0,
        totalReceivedAmount = 0,
        totalDeliveredOrders = 0,
        totalShippedOrders = 0,
        totalShippedAmount = 0,
    } = metrics;

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 3,
            }}
        >
            <CustomCard
                title="Total Orders"
                subtitle="All active orders in the system"
                value={totalOrders.toLocaleString()}
                iconBg="color-mix(in srgb, var(--color-primary) 10%, transparent)"
                iconColor="var(--color-primary)"
                icon={<FaClipboardList size={18} />}
            />

            <CustomCard
                title="Confirmed Orders"
                subtitle="Orders approved for fulfillment"
                value={totalConfirmedOrders.toLocaleString()}
                iconBg="color-mix(in srgb, var(--color-info) 10%, transparent)"
                iconColor="var(--color-info)"
                icon={<FaCheckCircle size={18} />}
            />

            <CustomCard
                title="Delivered Revenue"
                subtitle="Total amount received from delivered orders"
                value={`Rs. ${totalReceivedAmount.toLocaleString()}`}
                iconBg="color-mix(in srgb, var(--color-success) 10%, transparent)"
                iconColor="var(--color-success)"
                icon={<FaMoneyBillWave size={18} />}
            />

            <CustomCard
                title="Shipped Orders"
                subtitle="Orders that have left the warehouse"
                value={totalShippedOrders.toLocaleString()}
                iconBg="color-mix(in srgb, #8b5cf6 10%, transparent)"
                iconColor="#7c3aed"
                icon={<FaTruck size={18} />}
            />
        </Box>
    );
};

export default StatsGrid;