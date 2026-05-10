import { Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdTrendingDown } from "react-icons/md";
import TableCard from "./TableCard";

const LowStockTable = ({ products = [] }) => {
    const navigate = useNavigate();

    return (
        <TableCard
            title="Low Stock Alerts"
            buttonText="Manage Stock"
            handleClick={() => navigate("/products")}
            data={products}
            emptyText="Your inventory is well stocked"
            renderRow={(product) => (
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    sx={{
                        py: 2.5,
                        borderBottom: "1px dashed var(--border-color)",
                        "&:last-child": { borderBottom: 0 },
                    }}
                >
                    <Box
                        sx={{ flex: 2, display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}
                    >
                        <Box
                            component="img"
                            src={product.images?.[0]?.url}
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 1.5,
                                objectFit: "cover",
                                bgcolor: "var(--bg-page)",
                                border: "1px solid var(--border-color)",
                                flexShrink: 0
                            }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                noWrap
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "var(--text-primary)",
                                    mb: 0.25,
                                }}
                            >
                                {product.title}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "var(--text-secondary)", opacity: 0.8 }}>
                                {product.category || "General"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: "fit-content", textAlign: "right" }}>
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "var(--color-warning)",
                            }}
                        >
                            {product.stock} Units
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            minWidth: 100,
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 10,
                                fontWeight: 800,
                                textTransform: "uppercase",
                                color: "var(--color-warning)",
                                letterSpacing: 0.5,
                                whiteSpace: "nowrap"
                            }}
                        >
                            Low Stock
                        </Typography>
                        <MdTrendingDown color="var(--color-warning)" size={16} />
                    </Box>
                </Stack>
            )}
        />
    );
};

export default LowStockTable;