import { useState, forwardRef, memo } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const CustomInput = forwardRef(({
  placeholder,
  max,
  type = "text",
  name,
  startIcon,
  value,
  onChange,
  defaultValue,
  onBlur,
  fullWidth = true,
  height = 55,
  border,
  background = "var(--bg-surface)",
  disabled = false,
  dir,
  error = false,
  sx = {},
  inputProps = {},
  disableNumberSpin = false,
  maxLength,
  id = "",
  className,
  borderRadius = 3,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <TextField
      {...props}
      id={id}
      variant="outlined"
      dir={dir}
      defaultValue={defaultValue}
      onBlur={onBlur}
      fullWidth={fullWidth}
      placeholder={placeholder}
      type={isPassword ? (showPassword ? "text" : "password") : type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      inputRef={ref}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
        endAdornment: isPassword && (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "var(--text-secondary)" }}>
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </IconButton>
          </InputAdornment>
        ),
        inputProps: {
          name,
          maxLength: type === "number" ? undefined : maxLength,
          onInput:
            type === "number" && maxLength
              ? (e) => (e.target.value = e.target.value.slice(0, maxLength))
              : undefined,
          ...inputProps,
        },
      }}
      sx={{
        ...(disableNumberSpin &&
          type === "number" && {
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            { WebkitAppearance: "none", margin: 0 },
          "& input[type=number]": { MozAppearance: "textfield" },
        }),
        "& .MuiOutlinedInput-root": {
          height: `${height}px`,
          background,
          color: "var(--text-primary)",
          fontSize: "0.875rem",
          transition: "all 0.2s ease",
          "& fieldset": {
            borderColor: error ? "#ef4444" : "var(--border-color)",
            borderRadius: borderRadius,
            border: { border },
            transition: "all 0.2s ease",
          },
          "&:hover fieldset": {
            borderColor: error ? "#ef4444" : "color-mix(in srgb, var(--color-primary) 40%, var(--border-color))",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "#ef4444" : "var(--color-primary)",
            borderWidth: "1.5px",
            boxShadow: error ? "0 0 0 3px rgba(239, 68, 68, 0.12)" : "0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)",
          },
          "& input": {
            padding: "8px 10px",
            "&::placeholder": {
              color: "var(--text-secondary)",
              opacity: 0.7,
            },
          },
        },
        ...sx,
      }}
    />
  );
});

export default memo(CustomInput);