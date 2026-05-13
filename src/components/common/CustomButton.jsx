import { Button, CircularProgress } from "@mui/material";

function CustomButton({
  children,
  label,
  onClick,
  variant = "contained",
  bgColor = "var(--color-primary)",
  color = "#fff",
  rounded = 2,
  type = "submit",
  fullWidth = false,
  width,
  height = 40,
  fontSize = 14,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  sx = {},
  border,
  className

}) {
  return (
    <Button
      className={className}
      type={type}
      border={border}
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      sx={{
        backgroundColor: bgColor,
        color,
        borderRadius: rounded,
        width,
        height: `${height}px`,
        fontSize: `${fontSize}px`,
        textTransform: "none",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.15)",
        cursor: disabled || loading ? "not-allowed" : "pointer",

        "&.Mui-disabled": {
          backgroundColor: bgColor + " !important",
          color: color + " !important",
          opacity: 0.7,
          cursor: "not-allowed !important",
        },

        ...sx,
      }}
    >
      {loading ? <CircularProgress size={22} color="inherit" /> : (label || children)}
    </Button>
  );
}

export default CustomButton;
