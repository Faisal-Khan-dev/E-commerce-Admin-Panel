import { Box } from "@mui/material";
import { MdSearch } from "react-icons/md";

const SearchInput = ({ placeholder = "Search...", value, onChange, ...props }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        height: 48,
        borderRadius: 2.5,
        bgcolor: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor:
            "color-mix(in srgb, var(--color-primary) 40%, var(--border-color))",
        },
        "&:focus-within": {
          borderColor: "var(--color-primary)",
          boxShadow:
            "0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)",
        },
        ...props.sx,
      }}
    >
      <MdSearch size={20} color="var(--text-secondary)" />
      <Box
        component="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        sx={{
          flex: 1,
          border: 0,
          outline: 0,
          bgcolor: "transparent",
          color: "var(--text-primary)",
          fontSize: 14,
          fontFamily: "var(--font-sans)",
          "&::placeholder": {
            color: "var(--text-secondary)",
            opacity: 0.65,
          },
        }}
      />
    </Box>
  );
};

export default SearchInput;