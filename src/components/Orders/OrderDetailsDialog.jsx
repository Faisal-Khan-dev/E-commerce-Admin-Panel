import {
    Dialog,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Stack,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Paper,
    Link,
    Grid,
    Tooltip
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { MdDescription, MdPerson, MdLocalShipping, MdWhatsapp } from "react-icons/md";
import dayjs from "../../lib/dayjs";
import { getStatusColor } from "../../utils/statusChip";

const OrderDetailsDialog = ({ open, onClose, order }) => {

    const status = getStatusColor(order.status);
    const { name: customerName, email: customerEmail } = order.customer;
    const customerPhone = order.address?.phone;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: "var(--bg-surface)",
                    backgroundImage: "none",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }
            }}
        >
            {/* Professional Header */}
            <Box sx={{ p: 2.5, borderBottom: "1px solid var(--border-color)", bgcolor: "var(--bg-page)" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2,
                                bgcolor: "var(--color-primary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 24
                            }}
                        >
                            <MdDescription />
                        </Box>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: -0.5 }}>
                                <Typography variant="subtitle1" fontWeight={700} color="var(--text-primary)">
                                    Order <span style={{ color: "var(--color-primary)" }}>#{order.orderNo}</span>
                                </Typography>
                                <Chip
                                    label={order.status?.toUpperCase()}
                                    size="small"
                                    sx={{
                                        bgcolor: status.bg,
                                        color: status.text,
                                        fontWeight: 700,
                                        fontSize: 10,
                                        height: 20,
                                        borderRadius: 1
                                    }}
                                />
                            </Stack>
                            <Typography variant="caption" fontWeight={500} color="var(--text-secondary)">
                                Placed on {dayjs(order.createdAt).format("MMM DD, YYYY - hh:mm A")}
                            </Typography>
                        </Box>
                    </Stack>
                    <IconButton onClick={onClose} size="small" sx={{ color: "var(--text-secondary)" }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Stack>
            </Box>

            <DialogContent sx={{ p: 3, bgcolor: "var(--bg-surface)" }}>
                {/* Quick Info Grid */}
                <Typography variant="body2" fontWeight={700} color="var(--text-secondary)" sx={{ mb: 1.5, display: "block", letterSpacing: 0.5 }}>
                    Customer Details
                </Typography>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        mb: 3,
                        bgcolor: "var(--bg-page)",
                        borderColor: "var(--border-color)",
                        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)"
                    }}
                >
                    <Grid container spacing={2} alignItems="flex-start">
                        {/* Customer Section */}
                        <Grid item xs={12} sm={4}>
                            <Stack direction="row" spacing={2}>
                                <Avatar sx={{ bgcolor: "rgba(38, 99, 235, 0.08)", color: "var(--color-primary)", width: 36, height: 36, fontSize: 20 }}>
                                    <MdPerson />
                                </Avatar>
                                <Box>
                                    <Tooltip title={customerName} arrow disableInteractive>
                                        <Typography variant="body2" fontWeight={600} color="var(--text-primary)" noWrap>{customerName}</Typography>
                                    </Tooltip>
                                    <Tooltip title={customerEmail} arrow disableInteractive>
                                        <Typography variant="caption" color="var(--text-secondary)" sx={{ display: "block", mb: 0.2 }} noWrap>{customerEmail}</Typography>
                                    </Tooltip>
                                    {customerPhone && (
                                        <Link
                                            href={`https://wa.me/+92${customerPhone.replace(/^0/, "")}`}
                                            target="_blank"
                                            underline="hover"
                                            sx={{
                                                color: "#25D366",
                                                fontSize: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                fontWeight: 600
                                            }}
                                        >
                                            <MdWhatsapp size={14} /> {customerPhone}
                                        </Link>
                                    )}
                                </Box>

                            </Stack>
                        </Grid>

                        {/* Shipping Section */}
                        <Grid item xs={12} sm={5}>
                            <Stack direction="row" spacing={2}>
                                <Avatar sx={{ bgcolor: "rgba(38, 99, 235, 0.08)", color: "var(--color-primary)", width: 36, height: 36, fontSize: 20 }}>
                                    <MdLocalShipping />
                                </Avatar>
                                <Box>
                                    <Tooltip title={order.address?.city} arrow disableInteractive>
                                        <Typography variant="body2" fontWeight={600} color="var(--text-primary)" noWrap>{order.address?.city}</Typography>
                                    </Tooltip>
                                    <Tooltip title={order.address?.shippingAddress} arrow disableInteractive>
                                        <Typography variant="caption" color="var(--text-secondary)" sx={{ lineHeight: 1.4, mt: 0.4, display: "block" }} noWrap>
                                            {order.address?.shippingAddress}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>

                <Typography variant="caption" fontWeight={700} color="var(--text-secondary)" sx={{ mb: 1.5, display: "block", letterSpacing: 0.5 }}>
                    ORDER ITEMS
                </Typography>

                {/* Professional Minimalist Table */}
                <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                        borderRadius: 2.5,
                        borderColor: "var(--border-color)",
                        bgcolor: "var(--bg-page)",
                        overflow: "hidden",
                        mb: 3
                    }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: "rgba(0,0,0,0.01)" }}>
                                <TableCell sx={{ fontWeight: 700, color: "var(--text-secondary)", py: 1.2, fontSize: "0.7rem" }}>PRODUCT</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.7rem" }}>PRICE</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.7rem" }}>QTY</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.7rem" }}>TOTAL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items?.map((item, idx) => (
                                <TableRow key={idx} sx={{ "&:hover": { bgcolor: "rgba(0,0,0,0.005)" } }}>
                                    <TableCell sx={{ py: 1.5 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                src={item.product?.images?.[0]?.url}
                                                variant="rounded"
                                                sx={{ width: 44, height: 44, borderRadius: 1.5, border: "1px solid var(--border-color)", bgcolor: "#fff" }}
                                            />
                                            <Box>
                                                <Tooltip title={item.product?.title} arrow disableInteractive>
                                                    <Typography variant="body2" fontWeight={600} color="var(--text-primary)" lineHeight={1.2} noWrap>
                                                        {item.product?.title}
                                                    </Typography>
                                                </Tooltip>
                                                <Typography variant="caption" color="var(--text-secondary)">
                                                    #{item.product?._id ? item.product._id.toString().slice(-6).toUpperCase() : "-"}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" color="var(--text-secondary)" sx={{ fontSize: "0.8rem" }}>Rs. {item.sellingPrice?.toLocaleString()}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{
                                                px: 1,
                                                py: 0.1,
                                                borderRadius: 0.5,
                                                bgcolor: "rgba(0,0,0,0.03)",
                                                display: "inline-block",
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            {item.quantity}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight={700} color="var(--text-primary)" sx={{ fontSize: "0.85rem" }}>
                                            Rs. {item.totalSelling?.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Clean Grand Total Only */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Typography variant="body2" fontWeight={600} color="var(--text-secondary)">
                            Total Amount
                        </Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ color: "var(--color-primary)", letterSpacing: -0.5 }}>
                            Rs. {order.grandTotal.toLocaleString()}
                        </Typography>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsDialog;