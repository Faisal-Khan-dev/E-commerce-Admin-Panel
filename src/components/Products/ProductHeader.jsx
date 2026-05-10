import { Box, Typography, Stack } from "@mui/material";
import { MdAdd } from "react-icons/md";

const ProductHeader = ({ count, onAddClick }) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
        >
            <Box>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-heading)",
                        lineHeight: 1.2,
                    }}
                >
                    Products
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "var(--text-secondary)", mt: 0.5 }}
                >
                    {count} product{count !== 1 ? "s" : ""} found
                </Typography>
            </Box>
            <Box
                component="button"
                onClick={onAddClick}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2.5,
                    height: 48,
                    bgcolor: "var(--color-primary)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 2.5,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        bgcolor: "color-mix(in srgb, var(--color-primary) 85%, #000)",
                    },
                }}
            >
                <MdAdd size={20} />
                Add Product
            </Box>
        </Stack>
    );
};

export default ProductHeader;