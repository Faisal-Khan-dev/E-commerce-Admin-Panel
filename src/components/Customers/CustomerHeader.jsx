import { Box, Typography, Stack } from "@mui/material";

const CustomerHeader = ({ count }) => {
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
                    Customers
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "var(--text-secondary)", mt: 0.5 }}
                >
                    {count} customer{count > 1 ? "s" : ""} found
                </Typography>
            </Box>
        </Stack>
    );
};

export default CustomerHeader;