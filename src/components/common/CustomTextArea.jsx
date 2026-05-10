import { TextField, FormHelperText, Box } from "@mui/material";

function CustomTextarea({
  placeholder,
  value,
  onChange,
  fullWidth = true,
  rows = 4,
  rounded = 2,
  padding,
  height = 100,
  background = "var(--bg-surface)",
  dir,
  disabled = false,
  error = false,
  helperText,
  borderColor = "var(--border-color)",
  focusBorderColor = "var(--color-primary)",
  sx = {},
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: sx?.flex || "unset" }}>
      <TextField
        dir={dir}
        variant="outlined"
        fullWidth={fullWidth}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={!!error}
        multiline
        rows={rows}
        sx={{
          borderRadius: rounded,

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#ef4444" : borderColor,
            borderWidth: "1px",
            transition: "all 0.2s ease",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: error
              ? "#ef4444"
              : "color-mix(in srgb, var(--color-primary) 40%, var(--border-color))",
          },

          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: (error ? "#ef4444" : focusBorderColor) + " !important",
            borderWidth: "1.5px !important",
            boxShadow: error
              ? "0 0 0 3px rgba(239, 68, 68, 0.12)"
              : "0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)",
          },

          "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--border-color)",
            opacity: 0.5,
          },

          "& .MuiOutlinedInput-root": {
            background,
            height: height === "100%" ? "100%" : `${height}px`,
            minHeight: height === "100%" ? "180px" : undefined,
            alignItems: "flex-start",
            borderRadius: 3,
            color: "var(--text-primary)",
            fontSize: "0.875rem",

            "& textarea": {
              padding: padding,
              resize: "none",
              "&::placeholder": {
                color: "var(--text-secondary)",
                opacity: 0.7,
              },
            },
          },
          ...sx,
        }}
      />
      {helperText && (
        <FormHelperText
          sx={{
            color: "#ef4444",
            marginLeft: "14px",
            marginTop: "4px",
            fontSize: "0.75rem",
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

export default CustomTextarea;