import { Box, Typography } from "@mui/material";
import { FaBoxOpen, FaCheckCircle, FaClipboardList, FaShippingFast, FaTimesCircle, FaTruck, FaUndo, FaClock } from "react-icons/fa";

const CARD_META = {
  total: {
    title: "Total Orders",
    subtitle: "All active orders",
    icon: <FaClipboardList size={18} />,
    iconBg: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
    iconColor: "var(--color-primary)",
  },
  processing: {
    title: "Processing",
    subtitle: "Orders waiting to move forward",
    icon: <FaClock size={18} />,
    iconBg: "color-mix(in srgb, #f59e0b 12%, transparent)",
    iconColor: "#d97706",
  },
  confirmed: {
    title: "Confirmed",
    subtitle: "Orders approved for fulfillment",
    icon: <FaCheckCircle size={18} />,
    iconBg: "color-mix(in srgb, #0ea5e9 12%, transparent)",
    iconColor: "#0284c7",
  },
  shipped: {
    title: "Shipped",
    subtitle: "Orders already dispatched",
    icon: <FaShippingFast size={18} />,
    iconBg: "color-mix(in srgb, #8b5cf6 12%, transparent)",
    iconColor: "#7c3aed",
  },
  out_for_delivery: {
    title: "Out for Delivery",
    subtitle: "On the way to the customer",
    icon: <FaTruck size={18} />,
    iconBg: "color-mix(in srgb, #14b8a6 12%, transparent)",
    iconColor: "#0f766e",
  },
  delivered: {
    title: "Delivered",
    subtitle: "Successfully completed orders",
    icon: <FaBoxOpen size={18} />,
    iconBg: "color-mix(in srgb, #16a34a 12%, transparent)",
    iconColor: "#15803d",
  },
  cancelled: {
    title: "Cancelled",
    subtitle: "Orders stopped before completion",
    icon: <FaTimesCircle size={18} />,
    iconBg: "color-mix(in srgb, #ef4444 12%, transparent)",
    iconColor: "#dc2626",
  },
  returned: {
    title: "Returned",
    subtitle: "Orders sent back after delivery",
    icon: <FaUndo size={18} />,
    iconBg: "color-mix(in srgb, #64748b 12%, transparent)",
    iconColor: "#475569",
  },
};

const formatLabel = (key) =>
  key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const OrderStatsCards = ({ cards = {} }) => {
  const cardEntries = Object.entries(cards || {}).filter(([, value]) => typeof value === "number");

  if (cardEntries.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {cardEntries.map(([key, value]) => {
        const meta = CARD_META[key] || {};

        return (
          <Box
            key={key}
            sx={{
              bgcolor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              borderRadius: 3,
              p: 2,
              minHeight: 112,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: "color-mix(in srgb, var(--color-primary) 28%, var(--border-color))",
                boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)" }}>
                {meta.title || formatLabel(key)}
              </Typography>

              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  bgcolor: meta.iconBg || "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                  color: meta.iconColor || "var(--color-primary)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                {meta.icon || <FaClipboardList size={18} />}
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                  fontFamily: "var(--font-heading)",
                }}
              >
                {value.toLocaleString()}
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 12, color: "var(--text-secondary)" }}>
                {meta.subtitle || "Order summary"}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default OrderStatsCards;