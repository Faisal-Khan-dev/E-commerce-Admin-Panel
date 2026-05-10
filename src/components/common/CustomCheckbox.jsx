import { Checkbox, FormControlLabel } from "@mui/material";

export default function CustomCheckbox({
  label = "",
  checked = false,
  onChange,
  disabled = false,
  size = "medium",
  sx = {},
  labelSx = {},
  fontWeight = '600'
}) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          size={size}
          sx={{
            color: "#555",
            "&.Mui-checked": {
              color: "#89C441",
            },
            height: "auto",
            width: "auto",
            border: "none",
            borderRadius: 0,
            ...sx,
          }}
        />
      }
      label={label}
      sx={{
        "& .MuiFormControlLabel-label": {
          fontSize: "15px",
          fontWeight: { fontWeight },
          color: disabled ? "#aaa" : "#333",
          ...labelSx,
        },
      }}
    />
  );
}
