import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Divider,
  Grid,
  Alert,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Close,
  Visibility,
  WhatsApp,
  LocalShipping,
  Payment as PaymentIcon,
  Person,
  Receipt,
  OpenInNew,
} from "@mui/icons-material";
import { SyncLoader } from "react-spinners";
import dayjs from "../lib/dayjs";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ReviewsModal from "../components/Orders/ReviewsModal";
import { getStatusColor } from "../utils/statusChip";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/single/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch order");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleOpenReviews = (product) => {
    setSelectedProduct(product);
    setReviewsModalOpen(true);
  };

  const handleCloseReviews = () => {
    setReviewsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <SyncLoader size={8} color="var(--color-primary)" />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error">
          Order not found
        </Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/orders")} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  const shipping = order.shippingId || order.shipping || {};
  const payment = order.paymentId || order.payment || {};
  const customer = order.customerId || order.customer || {};

  // Extraction of individual fields matching ShippingForm on site
  const rawFullAddress =
    shipping.addressSnapshot?.address ||
    shipping.address ||
    customer.address ||
    "";

  // Clean duplicate parts if any
  const cleanAddressParts = rawFullAddress
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const uniqueParts = [];
  cleanAddressParts.forEach((part) => {
    if (!uniqueParts.includes(part)) {
      uniqueParts.push(part);
    }
  });

  const recipientName =
    shipping.addressSnapshot?.name ||
    shipping.fullName ||
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "N/A";

  const houseNo =
    shipping.addressSnapshot?.houseNo ||
    shipping.houseNo ||
    (uniqueParts.length > 0 ? uniqueParts[0] : "") ||
    "N/A";

  const area =
    shipping.addressSnapshot?.area ||
    shipping.area ||
    (uniqueParts.length > 1 ? uniqueParts.slice(1).join(", ") : "") ||
    "N/A";

  const city =
    shipping.addressSnapshot?.city ||
    shipping.city ||
    customer.city ||
    "N/A";

  const postalCode =
    shipping.addressSnapshot?.postalCode ||
    shipping.postalCode ||
    shipping.zipCode ||
    customer.postalCode ||
    "N/A";

  const phone =
    shipping.addressSnapshot?.phone ||
    shipping.phone ||
    customer.phone ||
    "N/A";

  const whatsapp =
    shipping.addressSnapshot?.whatsapp ||
    shipping.whatsapp ||
    phone;

  const customerEmail = customer.email || "No email provided";

  // Payment Details Extraction
  const paymentMethod = payment.method || order.paymentMethod || "COD";
  const transactionId = payment.transactionId || "";
  const paymentScreenshotUrl =
    order.paymentScreenshot ||
    payment.paymentScreenshot ||
    "";

  const isNonCodPayment = paymentMethod !== "COD" || Boolean(paymentScreenshotUrl);

  // If non-COD payment method and payment screenshot uploaded, mark payment status as completed
  let rawPaymentStatus = (payment.status || "pending").toLowerCase();
  let paymentStatus = rawPaymentStatus;
  if (paymentMethod !== "COD" && paymentScreenshotUrl) {
    paymentStatus = "completed";
  }

  // Financial Computations Breakdown
  const itemsSubtotal = (order.orderItems || []).reduce(
    (sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)),
    0
  );

  const rawCost = Number(shipping.cost);
  const inferredCost = order.totalAmount > itemsSubtotal
    ? (order.totalAmount - itemsSubtotal)
    : 250;

  const shippingCost = (!isNaN(rawCost) && rawCost > 0) ? rawCost : inferredCost;
  const grandTotal = itemsSubtotal + shippingCost;

  const orderStatus = order.status || shipping.status || "processing";
  const statusColors = getStatusColor(orderStatus);

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* Navigation & Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/orders")}
          sx={{
            color: "var(--text-secondary)",
            mb: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" }
          }}
        >
          Back to Orders
        </Button>

        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
                Order #{order.orderNo || order._id}
              </Typography>
              <Chip
                label={orderStatus.toUpperCase().replace(/_/g, " ")}
                size="small"
                sx={{
                  bgcolor: statusColors.bg,
                  color: statusColors.text,
                  fontWeight: 700,
                  fontSize: 12,
                  height: 26,
                  borderRadius: 1.5,
                }}
              />
            </Stack>
            <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", mt: 0.5 }}>
              Placed on {dayjs(order.createdAt).format("MMM DD, YYYY - h:mm A")}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Main 2-Column Dashboard Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left Column: Shipping & Delivery Info */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid var(--border-color)",
              borderRadius: 3,
              bgcolor: "var(--bg-surface)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(37, 99, 235, 0.1)", color: "var(--color-primary)", width: 36, height: 36 }}>
                <LocalShipping fontSize="small" />
              </Avatar>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                Shipping Information
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2.5 }} />

            <Grid container spacing={2.5} sx={{ flex: 1 }}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Full Name
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {recipientName}
                  </Typography>
                </Box>
              </Grid>

              {/* House / Flat */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    House / Flat
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {houseNo}
                  </Typography>
                </Box>
              </Grid>

              {/* Area / Sector */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Area / Sector
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {area}
                  </Typography>
                </Box>
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    City
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {city}
                  </Typography>
                </Box>
              </Grid>

              {/* Zip Code */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Zip Code
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {postalCode}
                  </Typography>
                </Box>
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Phone Number
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {phone}
                  </Typography>
                </Box>
              </Grid>

              {/* WhatsApp Number */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    WhatsApp Number
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                      {whatsapp}
                    </Typography>
                    {whatsapp && whatsapp !== "N/A" && (
                      <Button
                        size="small"
                        startIcon={<WhatsApp sx={{ color: "#25D366" }} />}
                        href={`https://wa.me/${whatsapp.replace(/\D/g, "").replace(/^0/, "92")}`}
                        target="_blank"
                        sx={{ textTransform: "none", fontSize: 11, py: 0, px: 1, minWidth: "auto", color: "#15803d" }}
                      >
                        WhatsApp
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Grid>

              {/* Email Address */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Email Address
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "var(--text-primary)" }}>
                    {customerEmail}
                  </Typography>
                </Box>
              </Grid>

              {shipping.trackingId && (
                <Grid item xs={12}>
                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.3, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Tracking ID
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)", fontFamily: "monospace" }}>
                      {shipping.trackingId}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column: Payment Details & Amount Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid var(--border-color)",
              borderRadius: 3,
              bgcolor: "var(--bg-surface)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(37, 99, 235, 0.1)", color: "var(--color-primary)", width: 36, height: 36 }}>
                <PaymentIcon fontSize="small" />
              </Avatar>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                Payment & Summary
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2.5 }} />

            <Stack spacing={2} sx={{ flex: 1 }}>
              {/* Payment Method */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Payment Method
                </Typography>
                <Chip
                  label={paymentMethod.toUpperCase()}
                  size="small"
                  color={paymentMethod === "COD" ? "default" : "primary"}
                  sx={{ fontWeight: 700, fontSize: 11, borderRadius: 1 }}
                />
              </Box>

              {/* Payment Status */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Payment Status
                </Typography>
                <Chip
                  label={paymentStatus.toUpperCase()}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11,
                    borderRadius: 1,
                    bgcolor: paymentStatus === "completed" || paymentStatus === "paid" ? "rgba(22, 163, 74, 0.12)" : "rgba(245, 158, 11, 0.12)",
                    color: paymentStatus === "completed" || paymentStatus === "paid" ? "#15803d" : "#d97706",
                  }}
                />
              </Box>

              {transactionId && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Transaction ID
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>
                    {transactionId}
                  </Typography>
                </Box>
              )}

              {/* Payment Screenshot Section for Online Payments */}
              {isNonCodPayment && (
                <Box sx={{ mt: 1, p: 2, bgcolor: "var(--bg-page)", borderRadius: 2, border: "1px dashed var(--border-color)" }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 1, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Payment Receipt / Screenshot
                  </Typography>
                  {paymentScreenshotUrl ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        onClick={() => setScreenshotModalOpen(true)}
                        sx={{
                          position: "relative",
                          width: 64,
                          height: 64,
                          borderRadius: 1.5,
                          overflow: "hidden",
                          border: "1px solid var(--border-color)",
                          cursor: "pointer",
                          "&:hover": { opacity: 0.85 }
                        }}
                      >
                        <img
                          src={paymentScreenshotUrl}
                          alt="Payment receipt screenshot"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", mb: 0.5 }}>
                          Online Payment Proof Uploaded
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<Visibility fontSize="small" />}
                          onClick={() => setScreenshotModalOpen(true)}
                          sx={{ textTransform: "none", fontSize: 11, fontWeight: 600, py: 0.2 }}
                        >
                          View Full Screenshot
                        </Button>
                      </Box>
                    </Stack>
                  ) : (
                    <Alert severity="warning" sx={{ py: 0.5, fontSize: 12, bgcolor: "transparent" }}>
                      Payment receipt screenshot was not uploaded by customer.
                    </Alert>
                  )}
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              {/* Financial Amounts Breakdown */}
              <Box sx={{ spaceY: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>
                    Items Subtotal
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    Rs. {itemsSubtotal.toLocaleString()} PKR
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>
                    Shipping / Delivery Charges
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "var(--color-primary)" }}>
                    Rs. {shippingCost.toLocaleString()} PKR
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>
                    Grand Total
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: "var(--color-primary)" }}>
                    Rs. {grandTotal.toLocaleString()} PKR
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Items Table Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid var(--border-color)",
          borderRadius: 3,
          bgcolor: "var(--bg-surface)",
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", mb: 2 }}>
          Order Items ({(order.orderItems || []).length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "var(--bg-page)" }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 12, py: 1.5, color: "var(--text-primary)", textTransform: "uppercase" }}>
                  Product
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12, py: 1.5, color: "var(--text-primary)", textTransform: "uppercase" }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12, py: 1.5, color: "var(--text-primary)", textTransform: "uppercase" }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12, py: 1.5, color: "var(--text-primary)", textTransform: "uppercase" }}>
                  Total
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: 12, py: 1.5, color: "var(--text-primary)", textTransform: "uppercase" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(order.orderItems || []).map((item, index) => (
                <TableRow key={index} sx={{ borderBottom: "1px solid var(--border-color)" }}>
                  <TableCell sx={{ fontSize: 13, py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      {item.image && (
                        <Avatar
                          src={item.image}
                          sx={{ width: 44, height: 44, borderRadius: 1.5, border: "1px solid var(--border-color)" }}
                        />
                      )}
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "var(--text-secondary)" }}>
                          {item.category || "Organic"}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 13, fontWeight: 600, py: 2, color: "var(--text-primary)" }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600, py: 2, color: "var(--text-primary)" }}>
                    Rs. {Number(item.price || 0).toLocaleString()} PKR
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, fontWeight: 700, py: 2, color: "var(--color-primary)" }}>
                    Rs. {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()} PKR
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 13, py: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenReviews(item)}
                      sx={{
                        textTransform: "none",
                        fontSize: 12,
                        fontWeight: 600,
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary)",
                        "&:hover": {
                          borderColor: "var(--color-primary)",
                          bgcolor: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                        },
                      }}
                    >
                      Reviews
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Payment Screenshot Modal Lightbox */}
      {paymentScreenshotUrl && (
        <Dialog
          open={screenshotModalOpen}
          onClose={() => setScreenshotModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Payment Receipt Screenshot - Order #{order.orderNo || order._id}
            </Typography>
            <IconButton onClick={() => setScreenshotModalOpen(false)} size="small">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 2, textAlign: "center", bgcolor: "#f8fafc" }}>
            <img
              src={paymentScreenshotUrl}
              alt="Payment Receipt Screenshot"
              style={{ maxWidth: "100%", maxHeight: "75vh", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<OpenInNew />}
                href={paymentScreenshotUrl}
                target="_blank"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Open Original Image in New Tab
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* Reviews Modal */}
      {selectedProduct && (
        <ReviewsModal
          open={reviewsModalOpen}
          onClose={handleCloseReviews}
          productName={selectedProduct.name}
          reviews={selectedProduct.customerReviews || []}
        />
      )}
    </Box>
  );
};

export default OrderDetails;

