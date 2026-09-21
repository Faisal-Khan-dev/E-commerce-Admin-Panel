import React, { useState } from "react";
import { Box, Chip, Stack, Typography, TextField, Button } from "@mui/material";
import { SyncLoader } from "react-spinners";
import { FaChartLine, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import ChartCard from "../components/dashboard/ChartCard";
import StatsGrid from "../components/dashboard/StatsGrid";
import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const { data, isLoading, error } = useDashboard(selectedMonth);

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
  const completedOrders = metrics.totalCompletedOrders || metrics.totalDeliveredOrders || 0;
  const cancelledOrders = metrics.totalCancelledOrders || 0;
  const returnedOrders = metrics.totalReturnedOrders || 0;
  const processingAmount = metrics.processingAmount || 0;
  const totalRevenue = metrics.totalRevenue || metrics.totalReceivedAmount || 0;

  const completionRate = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Dashboard Banner Header */}
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
              Order & Revenue Analytics
            </Typography>
            <Typography sx={{ mt: 1, color: "var(--text-secondary)", maxWidth: 760 }}>
              {selectedMonth
                ? `Showing performance analytics for selected month: ${selectedMonth}`
                : "System-wide order flow, processing amounts, and total completed revenue."}
            </Typography>
          </Box>

          {/* Month Calendar Selector & Reset */}
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" gap={1}>
            <TextField
              type="month"
              size="small"
              label="Select Month Filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                bgcolor: "var(--bg-surface)",
                borderRadius: 2,
                minWidth: 180,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border-color)" },
              }}
            />
            {selectedMonth && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<FaTimesCircle />}
                onClick={() => setSelectedMonth("")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  height: 40,
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                All Months
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Highlights Bar */}
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
              Completed Revenue
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 0.5, color: "#059669" }}>
              Rs. {totalRevenue.toLocaleString()}
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
              Processing Amount
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 0.5, color: "#d97706" }}>
              Rs. {processingAmount.toLocaleString()}
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
              Completion Rate
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, mt: 0.5, color: "var(--color-primary)" }}>
              {completionRate}%
            </Typography>
          </Box>
        </Stack>
        {message && (
          <Typography sx={{ mt: 2, fontSize: 12, color: "var(--text-secondary)" }}>
            {message}
          </Typography>
        )}
      </Box>

      {/* 6 Metric Cards */}
      <StatsGrid metrics={metrics} />

      {/* Chart & Insights */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.6fr 0.8fr" },
          gap: 3,
        }}
      >
        <ChartCard
          title={selectedMonth ? `Daily Performance (${selectedMonth})` : "12-Month Performance Trend"}
          subtitle={selectedMonth ? "Daily breakdown for selected month" : "Monthly trend for current year"}
          data={graphData}
          xAxisKey="label"
          series={[
            { dataKey: "totalOrders", name: "Total Orders", color: "var(--color-primary)" },
            { dataKey: "completedOrders", name: "Completed Orders", color: "#16a34a" },
            { dataKey: "revenue", name: "Revenue (PKR)", color: "#059669" },
            { dataKey: "processingAmount", name: "Processing (PKR)", color: "#f59e0b" },
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
            Breakdown Insights
          </Typography>

          <Box sx={{ display: "grid", gap: 1.5 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--bg-page)", border: "1px solid var(--border-color)" }}>
              <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>Total Orders</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
                {totalOrders.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--bg-page)", border: "1px solid var(--border-color)" }}>
              <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>Completed Orders</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>
                {completedOrders.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "var(--bg-page)", border: "1px solid var(--border-color)" }}>
              <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>Cancelled & Returned</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#ef4444" }}>
                {(cancelledOrders + returnedOrders).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
