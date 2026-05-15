import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Stack, Avatar, Chip, Paper, IconButton, Grid } from "@mui/material";
import { MdArrowBack, MdStarRate } from "react-icons/md";
import { useProduct } from "../hooks/useProduct";
import { SyncLoader } from "react-spinners";
import CustomButton from "../components/common/CustomButton";
import toast from "react-hot-toast";

const ViewProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product = {}, isLoading, error } = useProduct(slug);

  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data?.message || "Product not found");
      navigate("/products");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <SyncLoader size={8} color="var(--color-primary)" />
      </Box>
    );
  }

  const stockLabel = product.stock ? "In Stock" : "Out of Stock";
  const stockColor = product.stock ? { bg: "#d1fae5", text: "#15803d" } : { bg: "#fee2e2", text: "#991b1b" };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            "&:hover": { bgcolor: "var(--bg-page)" },
          }}
        >
          <MdArrowBack size={20} />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
            Product Details
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
            View complete product information
          </Typography>
        </Box>
      </Stack>

      {/* Product Details */}
      <Grid container spacing={3}>
        {/* Product Image */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              textAlign: "center",
            }}
          >
            {product.images && product.images.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  src={product.images[0]}
                  variant="rounded"
                  sx={{ width: 200, height: 200 }}
                />
              </Box>
            )}
            {product.images && product.images.length > 1 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                {product.images.map((img, idx) => (
                  <Avatar
                    key={idx}
                    src={img}
                    variant="rounded"
                    sx={{ width: 60, height: 60, cursor: "pointer" }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2.5,
              bgcolor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "var(--text-primary)" }}>
              {product.name}
            </Typography>

            <Typography variant="body2" sx={{ color: "var(--text-secondary)", mb: 2 }}>
              Slug: <strong>{product.slug}</strong>
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Chip
                label={stockLabel}
                sx={{
                  bgcolor: stockColor.bg,
                  color: stockColor.text,
                  fontWeight: 600,
                  fontSize: 12,
                  height: 28,
                }}
              />
              {product.category && (
                <Chip
                  label={product.category}
                  sx={{
                    bgcolor: "rgba(59, 130, 246, 0.12)",
                    color: "#1e40af",
                    fontWeight: 600,
                    fontSize: 12,
                    height: 28,
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                />
              )}
            </Stack>

            {/* Prices */}
            <Stack spacing={1.5} sx={{ mb: 3, pb: 3, borderBottom: "1px solid var(--border-color)" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                  Original Price:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  PKR {product.originalPrice}
                </Typography>
              </Stack>
              {product.salePrice > 0 && (
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    Sale Price:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#16a34a" }}>
                    PKR {product.salePrice}
                  </Typography>
                </Stack>
              )}
            </Stack>

            {/* Rating & Reviews */}
            {(product.ratings || product.numReviews) && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <MdStarRate size={20} color="#fbbf24" />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {product.ratings || 0} / 5
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                  ({product.numReviews || 0} reviews)
                </Typography>
              </Stack>
            )}

            {/* Description */}
            {product.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "var(--text-primary)" }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {product.description}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <CustomButton
                onClick={() => navigate("/products")}
                label="Back to Products"
                sx={{
                  bgcolor: "var(--bg-page)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  "&:hover": { bgcolor: "var(--bg-surface)" },
                }}
              />
              <CustomButton
                onClick={() => navigate(`/product-reviews/${product.slug}`)}
                label="View Reviews"
                sx={{}}
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewProductDetails;
