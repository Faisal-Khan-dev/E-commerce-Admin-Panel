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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { SyncLoader } from "react-spinners";
import dayjs from "../lib/dayjs";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ReviewsModal from "../components/Orders/ReviewsModal";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      </Box>
    );
  }

  const customerName = `${order.customerInfo?.firstName || ""} ${order.customerInfo?.lastName || ""}`.trim();

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Status Header */}
      <Box
        sx={{
          bgcolor: "var(--color-primary)",
          color: "white",
          py: 2,
          px: 4,
          mb: 3,
          textAlign: "center",
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        Order Status: {(order.shipping?.status || "processing").charAt(0).toUpperCase() + (order.shipping?.status || "processing").slice(1)}
      </Box>

      {/* Content Wrapper */}
      <Box sx={{ px: 4 }}>
        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 2 }}>
          Order Details - {order.orderNo}
        </Typography>

        {/* Order Date */}
        <Typography sx={{ fontSize: 14, color: "var(--text-secondary)", mb: 3 }}>
          Order Date: {dayjs(order.createdAt).format("MMM DD, YYYY, h:mm A")}
        </Typography>

        {/* Two Column Layout */}
        <Grid container spacing={4} sx={{ mb: 3 }}>
          {/* Shipping Information */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
            sx={{
              p: 3,
              border: "1px solid var(--border-color)",
              borderRadius: 2,
              bgcolor: "var(--bg-surface)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                Shipping Information
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                }}
              >
                Track Order
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2.5} sx={{ flex: 1 }}>
              <Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Customer Name
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                  {customerName}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Phone
                </Typography>
                <Typography sx={{ fontSize: 14, color: "var(--text-primary)" }}>
                  {order.customerInfo?.phone || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", mb: 0.8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Delivery Address
                </Typography>
                <Typography sx={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.7 }}>
                  {order.customerInfo?.address}
                  <br />
                  {order.customerInfo?.city} {order.customerInfo?.postalCode}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid var(--border-color)",
              borderRadius: 2,
              bgcolor: "var(--bg-surface)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", mb: 2 }}>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2.5} sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Order Total
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "var(--color-primary)", textAlign: "right" }}>
                  {order.totalAmount?.toLocaleString()} PKR
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Payment Method
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", textAlign: "right" }}>
                  {order.payment?.method}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Payment Status
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", textAlign: "right" }}>
                  {(order.payment?.status || "pending").charAt(0).toUpperCase() + (order.payment?.status || "pending").slice(1)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Shipping Cost
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", textAlign: "right" }}>
                  {order.shipping?.cost?.toLocaleString() || "0"} PKR
                </Typography>
              </Box>
              {order.payment?.transactionId && (
                <>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Transaction ID
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", textAlign: "right", fontFamily: "monospace" }}>
                      {order.payment.transactionId}
                    </Typography>
                  </Box>
                </>
              )}
              {order.shipping?.trackingId && (
                <>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Tracking ID
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", textAlign: "right", fontFamily: "monospace" }}>
                      {order.shipping.trackingId}
                    </Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>
        </Grid>

        {/* Order Items */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid var(--border-color)",
            borderRadius: 2,
            bgcolor: "var(--bg-surface)",
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", mb: 2 }}>
            Order Items
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "var(--bg-page)" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13, py: 1.5, color: "var(--text-primary)" }}>Product</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: 13, py: 1.5, color: "var(--text-primary)" }}>
                    Quantity
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: 13, py: 1.5, color: "var(--text-primary)" }}>
                    Price
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: 13, py: 1.5, color: "var(--text-primary)" }}>
                    Total
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: 13, py: 1.5, color: "var(--text-primary)" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderItems?.map((item, index) => (
                  <TableRow key={index} sx={{ borderBottom: "1px solid var(--border-color)" }}>
                  <TableCell sx={{ fontSize: 13, py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      {item.image && (
                        <Avatar
                          src={item.image}
                          sx={{ width: 40, height: 40, borderRadius: 1 }}
                        />
                      )}
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "var(--text-secondary)" }}>
                          {item.category}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 13, fontWeight: 600, py: 2, color: "var(--text-primary)" }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600, py: 2, color: "var(--text-primary)" }}>
                    {item.price?.toLocaleString()} PKR
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, fontWeight: 700, py: 2, color: "var(--color-primary)" }}>
                    {(item.price * item.quantity)?.toLocaleString()} PKR
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
      </Box>

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
