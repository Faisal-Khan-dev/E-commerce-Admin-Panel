import { FormControl, MenuItem, Select, FormHelperText } from "@mui/material";

function CustomSelectBox({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  fullWidth = true,
  error,
  helperText,
  noPlaceholder = true,
  height = 55,
  background = "#F7F8F9",
  disabled = false,
  sx = {},
}) {
  return (
    <FormControl fullWidth={fullWidth} sx={{ height }} error={error}>
      <Select
        value={value}
        error={error}
        onChange={onChange}
        displayEmpty
        disabled={disabled}
        sx={{
          height: `${height}px`,
          backgroundColor: background,
          borderRadius: 3,

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#d32f2f" : "#ccc",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#d32f2f" : "#ccc !important",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#d32f2f" : "#047857",
            borderWidth: "1px",
          },

          "& .MuiSelect-select": {
            padding: "8px 14px",
            color: value ? "#000" : "#6c757d",
          },
          ...sx,
        }}
      >
        {/* Placeholder */}
        {noPlaceholder && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}

        {/* Dynamic Options */}
        {options.map((opt, index) => (
          <MenuItem key={index} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText
          sx={{
            color: "#d32f2f",
            marginLeft: "14px",
            marginTop: "4px",
            fontSize: "0.75rem",
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default CustomSelectBox;