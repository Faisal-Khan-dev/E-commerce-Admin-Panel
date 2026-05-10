import { Box } from "@mui/material";
import { SyncLoader } from "react-spinners";

import PieCard from "../components/dashboard/PieCard";
import ChartCard from "../components/dashboard/ChartCard";
import StatsGrid from "../components/dashboard/StatsGrid";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import LowStockTable from "../components/dashboard/LowStockTable";
import useDashboard from "../hooks/useDashboard";
import { toast } from "react-hot-toast";

function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 20 }}>
        <SyncLoader color="var(--color-primary)" size={10} />
      </Box>
    );
  }

  if (error) return toast.error(error.message || "Failed to load dashboard statistics.");

  const {
    totalSales = 0,
    deliveredOrders = 0,
    totalProducts = 0,
    monthlyRevenue = [],
    orderStatusBreakdown = {},
    recentOrders = [],
    lowStockProducts = [],
  } = data || {};

  return (
    <Box sx={{ width: "100%" }}>
      {/* Stats Grid */}
      <StatsGrid
        totalSales={totalSales}
        deliveredOrders={deliveredOrders}
        totalProducts={totalProducts}
      />

      {/* Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
          mt: 3,
        }}
      >
        <ChartCard
          title="Revenue Trends"
          subtitle="Monthly Performance"
          data={monthlyRevenue}
        />
        <PieCard title="Distribution by Status" breakdown={orderStatusBreakdown} />
      </Box>

      {/* Tables Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
          mt: 3,
        }}
      >
        <RecentOrdersTable orders={recentOrders} />
        <LowStockTable products={lowStockProducts} />
      </Box>
    </Box>
  );
}

export default Dashboard;