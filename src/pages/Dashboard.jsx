import { Box, Chip, Stack, Typography } from "@mui/material";
import { SyncLoader } from "react-spinners";
import { FaChartLine, FaCheckCircle, FaShippingFast, FaWallet } from "react-icons/fa";

import ChartCard from "../components/dashboard/ChartCard";
import StatsGrid from "../components/dashboard/StatsGrid";
import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 20 }}>
        <SyncLoader color="var(--color-primary)" size={10} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid var(--border-color)",
          bgcolor: "var(--bg-surface)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--text-primary)" }}>
          Failed to load dashboard statistics
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "var(--text-secondary)" }}>
          {error.message || "The dashboard API is not responding with valid data."}
        </Typography>
      </Box>
    );
  }

  const {
    metrics = {},
    graphData = [],
    message,
  } = data || {};

  const totalOrders = metrics.totalOrders || 0;
  const deliveredOrders = metrics.totalDeliveredOrders || 0;
  const confirmedOrders = metrics.totalConfirmedOrders || 0;
  const shippedOrders = metrics.totalShippedOrders || 0;
  const totalReceivedAmount = metrics.totalReceivedAmount || 0;
  const totalShippedAmount = metrics.totalShippedAmount || 0;
  const deliveryRate = totalOrders ? Math.round((deliveredOrders / totalOrders) * 100) : 0;
  const latestPoint = graphData[graphData.length - 1] || {};

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          border: "1px solid var(--border-color)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), color-mix(in srgb, var(--color-info) 8%, transparent))",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: "var(--color-primary)",
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mt: 0.75,
                fontWeight: 800,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Order Performance Overview
            </Typography>
            <Typography sx={{ mt: 1, color: "var(--text-secondary)", maxWidth: 760 }}>
              Live analytics from the order dashboard API. Use this page to monitor order flow,
              revenue, and fulfillment performance.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.25} flexWrap="wrap">
            <Chip
              icon={<FaChartLine />}
              label={`${graphData.length} periods`}
              sx={{ bgcolor: "var(--bg-surface)", fontWeight: 700 }}
            />
            <Chip
              icon={<FaCheckCircle />}
              label={`${deliveryRate}% delivered`}
              sx={{ bgcolor: "var(--bg-surface)", fontWeight: 700 }}
            />
            <Chip
              icon={<FaShippingFast />}
              label={`${shippedOrders} shipped`}
              sx={{ bgcolor: "var(--bg-surface)", fontWeight: 700 }}
            />
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 2.5 }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 3,
              bgcolor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              minWidth: 180,
            }}
          >
            <Typography sx={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
              Delivered Revenue
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 0.5, color: "var(--text-primary)" }}>
              Rs. {totalReceivedAmount.toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 3,
              bgcolor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              minWidth: 180,
            }}
          >
            <Typography sx={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
              Shipped Amount
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 0.5, color: "var(--text-primary)" }}>
              Rs. {totalShippedAmount.toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 3,
              bgcolor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              minWidth: 180,
            }}
          >
            <Typography sx={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
              Latest Period
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 0.5, color: "var(--text-primary)" }}>
              {latestPoint.label || "N/A"}
            </Typography>
          </Box>
        </Stack>
        {message && (
          <Typography sx={{ mt: 2, fontSize: 12, color: "var(--text-secondary)" }}>
            {message}
          </Typography>
        )}
      </Box>

      <StatsGrid metrics={metrics} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.6fr 0.8fr" },
          gap: 3,
        }}
      >
        <ChartCard
          title="Order Momentum"
          subtitle="Monthly performance"
          data={graphData}
          xAxisKey="label"
          series={[
            { dataKey: "totalOrders", name: "Total Orders", color: "var(--color-primary)" },
            { dataKey: "deliveredOrders", name: "Delivered Orders", color: "var(--color-success)" },
            { dataKey: "deliveredAmount", name: "Delivered Amount", color: "#f59e0b" },
          ]}
        />

        <Box
          sx={{
            bgcolor: "var(--bg-surface)",
            borderRadius: 3,
            border: "1px solid var(--border-color)",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
            Quick Insights
          </Typography>

          <Box sx={{ display: "grid", gap: 1.5 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--bg-page)", border: "1px solid var(--border-color)" }}>
              <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>Total Orders</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                {totalOrders.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--bg-page)", border: "1px solid var(--border-color)" }}>
              <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>Confirmed Orders</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                {confirmedOrders.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--bg-page)", border: "1px solid var(--border-color)" }}>
              <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>Delivered Orders</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                {deliveredOrders.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;