import { TableRow, TableCell, Avatar, Typography, Stack, Chip, Tooltip, IconButton } from "@mui/material";
import { MdEdit, MdDeleteOutline, MdRateReview } from "react-icons/md";

const ProductRow = ({ product, onEdit, onDelete, onViewReviews }) => {
    const stockLabel = product.stock ? "In Stock" : "Out of Stock";
    const stockColor = product.stock ? { bg: "#d1fae5", text: "#15803d" } : { bg: "#fee2e2", text: "#991b1b" };

    return (
        <TableRow
            sx={{
                borderBottom: "1px solid var(--border-color)",
                transition: "background 0.2s ease",
                "&:last-child": {
                    borderBottom: "none"
                },
                "&:hover": {
                    bgcolor: "rgba(59, 130, 246, 0.02)",
                },
            }}
        >
            {/* Image */}
            <TableCell sx={{ py: 2.5, px: 2.5, textAlign: "left" }}>
                <Avatar
                    src={product.images?.[0]}
                    variant="rounded"
                    sx={{ width: 44, height: 44 }}
                />
            </TableCell>

            {/* Name */}
            <TableCell sx={{ py: 2.5, px: 2.5, textAlign: "left" }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                    {product.name}
                </Typography>
                <Typography variant="caption" color="var(--text-secondary)">
                    {product.slug}
                </Typography>
            </TableCell>

            {/* Category */}
            <TableCell sx={{ py: 2.5, px: 2.5, textAlign: "left" }}>
                <Chip 
                    label={product.category || "—"}
                    size="small"
                    sx={{
                        fontWeight: 500,
                        fontSize: 12,
                        bgcolor: "rgba(59, 130, 246, 0.12)",
                        color: "#1e40af",
                        border: "1px solid rgba(59, 130, 246, 0.3)"
                    }}
                />
            </TableCell>

            {/* Price */}
            <TableCell sx={{ py: 2.5, px: 2.5, fontWeight: 700, textAlign: "left" }}>
                <Tooltip
                    arrow
                    placement="bottom"
                    title={
                        <Stack spacing={0.5} sx={{ p: 0.5 }}>
                            <Stack direction="row" justifyContent="space-between" spacing={3}>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Original Price</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>PKR {product.originalPrice}</Typography>
                            </Stack>
                            {product.salePrice > 0 && (
                                <Stack direction="row" justifyContent="space-between" spacing={3}>
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Sale Price</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#4ade80" }}>PKR {product.salePrice}</Typography>
                                </Stack>
                            )}
                        </Stack>
                    }
                >
                    <span style={{ cursor: "pointer", borderBottom: "1.5px dashed var(--border-color)" }}>
                        PKR {product.salePrice > 0 ? product.salePrice : product.originalPrice}
                    </span>
                </Tooltip>
            </TableCell>

            {/* Stock Status */}
            <TableCell sx={{ py: 2.5, px: 2.5, textAlign: "center" }}>
                <Chip
                    label={stockLabel}
                    size="small"
                    sx={{
                        bgcolor: stockColor.bg,
                        color: stockColor.text,
                        fontWeight: 600,
                        fontSize: 12,
                        height: 26,
                        borderRadius: 1.5,
                    }}
                />
            </TableCell>

            {/* Actions */}
            <TableCell sx={{ py: 2.5, px: 2.5, textAlign: "center", display: "flex", justifyContent: "center" }}>
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="View Reviews" arrow>
                        <IconButton
                            size="small"
                            onClick={() => onViewReviews(product)}
                            sx={{
                                color: "var(--text-secondary)",
                                "&:hover": {
                                    color: "#8b5cf6",
                                    bgcolor: "rgba(139, 92, 246, 0.1)"
                                },
                                transition: "all 0.2s ease"
                            }}
                        >
                            <MdRateReview size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" arrow>
                        <IconButton
                            size="small"
                            onClick={() => onEdit(product)}
                            sx={{
                                color: "var(--text-secondary)",
                                "&:hover": {
                                    color: "#f59e0b",
                                    bgcolor: "rgba(245, 158, 11, 0.1)"
                                },
                                transition: "all 0.2s ease"
                            }}
                        >
                            <MdEdit size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                        <IconButton
                            size="small"
                            onClick={() => onDelete(product)}
                            sx={{
                                color: "var(--text-secondary)",
                                "&:hover": {
                                    color: "#ef4444",
                                    bgcolor: "rgba(239, 68, 68, 0.1)"
                                },
                                transition: "all 0.2s ease"
                            }}
                        >
                            <MdDeleteOutline size={18} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    );
};

export default ProductRow;