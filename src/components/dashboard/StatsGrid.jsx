import { Box } from "@mui/material";
import { MdCurrencyRupee } from "react-icons/md";
import { FaTruck, FaBoxOpen } from "react-icons/fa";
import CustomCard from "./DashboardCard";

const StatsGrid = ({ totalSales, deliveredOrders, totalProducts }) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                },
                gap: 3,
            }}
        >
            <CustomCard
                title="Total Revenue"
                subtitle="Net sales from delivered orders"
                value={`Rs. ${totalSales.toLocaleString()}`}
                iconBg="color-mix(in srgb, var(--color-primary) 10%, transparent)"
                iconColor="var(--color-primary)"
                icon={<MdCurrencyRupee size={22} />}
            />

            <CustomCard
                title="Orders Completed"
                subtitle="Successfully delivered packages"
                value={deliveredOrders}
                iconBg="color-mix(in srgb, var(--color-success) 10%, transparent)"
                iconColor="var(--color-success)"
                icon={<FaTruck size={20} />}
            />

            <CustomCard
                title="Inventory Size"
                subtitle="Total active products"
                value={totalProducts}
                iconBg="color-mix(in srgb, var(--color-info) 10%, transparent)"
                iconColor="var(--color-info)"
                icon={<FaBoxOpen size={20} />}
            />
        </Box>
    );
};

export default StatsGrid;