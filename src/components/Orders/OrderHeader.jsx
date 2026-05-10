import { Box, Typography, Stack } from "@mui/material";

const OrderHeader = ({ count, pendingCount = 0 }) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
        >
            <Box>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            fontFamily: "var(--font-heading)",
                            lineHeight: 1.2,
                        }}
                    >
                        Orders
                    </Typography>
                    {pendingCount > 0 && (
                        <Box
                            sx={{
                                px: 1.2,
                                py: 0.4,
                                borderRadius: "8px",
                                bgcolor: "rgba(245, 158, 11, 0.1)",
                                color: "#d97706",
                                fontSize: 12,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                border: "1px solid rgba(245, 158, 11, 0.2)"
                            }}
                        >
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#f59e0b", animation: "pulse 2s infinite" }} />
                            {pendingCount} Pending
                        </Box>
                    )}
                </Stack>
                <Typography
                    variant="body2"
                    sx={{ color: "var(--text-secondary)", mt: 0.5, fontWeight: 500 }}
                >
                    {count} total order{count !== 1 ? "s" : ""} found
                </Typography>
            </Box>
        </Stack>
    );
};

export default OrderHeader;