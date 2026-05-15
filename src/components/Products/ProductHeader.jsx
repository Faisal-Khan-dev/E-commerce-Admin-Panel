import { Box, Typography, Stack, Button } from "@mui/material";
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
            <Button
                variant="contained"
                startIcon={<MdAdd size={20} />}
                onClick={onAddClick}
                sx={{
                    height: 48,
                    borderRadius: 2.5,
                    fontWeight: 600,
                    textTransform: "none",
                }}
            >
                Add Product
            </Button>
        </Stack>
    );
};

export default ProductHeader;