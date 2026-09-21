import React from "react";
import { Typography, Box, Stack } from "@mui/material";

function CustomCard({
  title,
  value,
  subtitle = "Real-time stats",
  icon,
  iconBg = "rgba(59, 130, 246, 0.12)",
  iconColor = "#3b82f6",
  accentColor,
}) {
  const borderTopColor = accentColor || iconColor;

  return (
    <Box
      sx={{
        bgcolor: "var(--bg-surface)",
        borderRadius: 3,
        border: "1px solid var(--border-color)",
        borderTop: `3.5px solid ${borderTopColor}`,
        p: 2.5,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.08)",
          borderColor: "var(--border-color)",
        },
      }}
    >
      {/* Background Accent Glow */}
      <Box
        sx={{
          position: "absolute",
          top: -24,
          right: -24,
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: iconBg,
          opacity: 0.35,
          pointerEvents: "none",
          filter: "blur(16px)",
        }}
      />

      {/* Header Row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Typography
          sx={{
            fontWeight: 700,
            color: "var(--text-secondary)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            bgcolor: iconBg,
            color: iconColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0 4px 12px ${iconBg}`,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Stack>

      {/* Main Metric Value */}
      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: { xs: 20, md: 22, lg: 24 },
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
            lineHeight: 1.1,
            letterSpacing: -0.5,
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 1,
            color: "var(--text-secondary)",
            fontSize: 11,
            fontWeight: 500,
            display: "inline-block",
            bgcolor: "var(--bg-page)",
            px: 1,
            py: 0.2,
            borderRadius: 1,
            border: "1px solid var(--border-color)",
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

export default CustomCard;
