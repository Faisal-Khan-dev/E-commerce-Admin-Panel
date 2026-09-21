import React from "react";
import { Box } from "@mui/material";
import {
  FaCheckCircle,
  FaClipboardList,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUndo,
  FaHourglassHalf,
} from "react-icons/fa";
import CustomCard from "./DashboardCard";

const StatsGrid = ({ metrics = {} }) => {
  const {
    totalOrders = 0,
    totalProcessingOrders = metrics.totalConfirmedOrders || 0,
    totalCompletedOrders = metrics.totalDeliveredOrders || 0,
    totalCancelledOrders = 0,
  } = metrics;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2.5,
      }}
    >
      {/* Total Orders */}
      <CustomCard
        title="Total Orders"
        subtitle="All system orders"
        value={totalOrders.toLocaleString()}
        iconBg="rgba(59, 130, 246, 0.12)"
        iconColor="#3b82f6"
        accentColor="#3b82f6"
        icon={<FaClipboardList size={18} />}
      />

      {/* Processing Orders */}
      <CustomCard
        title="Processing Orders"
        subtitle="In-progress orders"
        value={totalProcessingOrders.toLocaleString()}
        iconBg="rgba(217, 119, 6, 0.12)"
        iconColor="#d97706"
        accentColor="#d97706"
        icon={<FaHourglassHalf size={18} />}
      />

      {/* Completed Orders */}
      <CustomCard
        title="Completed Orders"
        subtitle="Successfully fulfilled"
        value={totalCompletedOrders.toLocaleString()}
        iconBg="rgba(22, 163, 74, 0.12)"
        iconColor="#16a34a"
        accentColor="#16a34a"
        icon={<FaCheckCircle size={18} />}
      />

      {/* Cancelled Orders */}
      <CustomCard
        title="Cancelled Orders"
        subtitle="Cancelled orders"
        value={totalCancelledOrders.toLocaleString()}
        iconBg="rgba(239, 68, 68, 0.12)"
        iconColor="#ef4444"
        accentColor="#ef4444"
        icon={<FaTimesCircle size={18} />}
      />
    </Box>
  );
};

export default StatsGrid;
