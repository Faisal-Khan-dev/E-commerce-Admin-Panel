import { Typography, Box } from "@mui/material";

function CustomCard({
  title,
  value,
  subtitle = "Real-time stats",
  icon,
  iconBg = "color-mix(in srgb, var(--color-primary) 10%, transparent)",
  iconColor = "var(--color-primary)",
}) {
  return (
    <Box
      sx={{
        bgcolor: "var(--bg-surface)",
        borderRadius: 3,
        border: "1px solid var(--border-color)",
        p: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "var(--text-secondary)",
            fontSize: 14,
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            bgcolor: iconBg,
            color: iconColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mt: 1.5,
          color: "var(--text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{ mt: 0.5, color: "var(--text-secondary)", display: "block" }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

export default CustomCard;