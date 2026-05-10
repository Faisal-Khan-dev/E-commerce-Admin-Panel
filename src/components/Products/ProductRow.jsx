import { TableRow, TableCell, Avatar, Typography, Stack, Chip, Switch, Tooltip, IconButton } from "@mui/material";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import { getStockStatusColor } from "../../utils/statusChip";

const ProductRow = ({ product, onEdit, onDelete, onTogglePublish, onToggleFeatured }) => {

    const stockStyle = getStockStatusColor(product.stock);

    return (
        <TableRow
            sx={{
                transition: "background 0.15s",
                "&:hover": { bgcolor: "var(--bg-page)" },
            }}
        >

            <TableCell>
                <Avatar
                    src={product.images?.[0]?.url}
                    variant="rounded"
                    sx={{ width: 44, height: 44 }}
                />
            </TableCell>

            <TableCell>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                    {product.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {product._id}
                </Typography>
            </TableCell>

            <TableCell>
                <Chip label={product.category?.title} size="small" />
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
                <Tooltip
                    arrow
                    placement="bottom"
                    title={
                        <Stack spacing={0.5} sx={{ p: 0.5 }}>
                            <Stack direction="row" justifyContent="space-between" spacing={3}>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Original Price</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>PKR {product.sellingPrice}</Typography>
                            </Stack>
                            {product.discount > 0 && (
                                <Stack direction="row" justifyContent="space-between" spacing={3}>
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Discount</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#4ade80" }}>{product.discount}% OFF</Typography>
                                </Stack>
                            )}
                            <Stack direction="row" justifyContent="space-between" spacing={3}>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Buying Price</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>PKR {product.buyingPrice}</Typography>
                            </Stack>
                        </Stack>
                    }
                >
                    <span style={{ cursor: "default", borderBottom: "1.5px dashed var(--border-color)" }}>
                        {product.discount > 0 ? (
                            <Stack direction="row" spacing={1} alignItems="center" component="span">
                                <span>PKR {product.price}</span>
                            </Stack>
                        ) : (
                            `PKR ${product.price}`
                        )}
                    </span>
                </Tooltip>
            </TableCell>

            <TableCell>
                <Chip
                    label={stockStyle.label}
                    size="small"
                    sx={{
                        bgcolor: stockStyle.bg,
                        color: stockStyle.text,
                        fontWeight: 600,
                        fontSize: 12,
                        height: 26,
                        borderRadius: 1.5,
                    }}
                />
            </TableCell>

            <TableCell>
                <Switch checked={product.isPublished || false} size="small" onChange={() => onTogglePublish(product)} />
            </TableCell>

            <TableCell>
                <Switch checked={product.isFeatured || false} size="small" onChange={() => onToggleFeatured(product)} />
            </TableCell>

            <TableCell>
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit" arrow>
                        <IconButton
                            size="small"
                            onClick={() => onEdit(product)}
                            sx={{
                                color: "var(--color-primary)",
                                bgcolor: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                                "&:hover": {
                                    bgcolor: "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                                },
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
                                color: "var(--color-error)",
                                bgcolor: "color-mix(in srgb, var(--color-error) 8%, transparent)",
                                "&:hover": {
                                    bgcolor: "color-mix(in srgb, var(--color-error) 15%, transparent)",
                                },
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