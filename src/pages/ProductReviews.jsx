import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  IconButton,
  Rating,
  Avatar,
  Chip,
  Grid,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useProductReviews } from "../hooks/useReview";
import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";

const ProductReviews = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [rating, setRating] = useState('');

  const { data: reviewsData = {}, isLoading, error } = useProductReviews(slug, page, limit, rating);

  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data?.message || "Product not found");
      navigate("/products");
    }
  }, [error, navigate]);

  const reviews = reviewsData.reviews || [];
  const pagination = reviewsData.pagination || {};

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <SyncLoader size={8} color="var(--color-primary)" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <IconButton
          onClick={() => navigate("/products")}
          sx={{
            bgcolor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            "&:hover": { bgcolor: "var(--bg-page)" },
          }}
        >
          <MdArrowBack size={20} />
        </IconButton>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            Product Reviews
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--text-secondary)" }}
          >
            {slug}
          </Typography>
        </Box>
      </Stack>

      {/* Product Summary Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2.5,
          bgcolor: "color-mix(in srgb, var(--color-primary) 8%, var(--bg-page))",
          border: "1px solid var(--border-color)",
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Box flex={1}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {slug}
            </Typography>
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating
                  value={Number(getAverageRating())}
                  readOnly
                  precision={0.1}
                  size="medium"
                />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {getAverageRating()}
                </Typography>
              </Stack>
              <Chip
                label={`${pagination.total || 0} Review${pagination.total !== 1 ? "s" : ""}`}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: "rgba(59, 130, 246, 0.12)",
                  color: "#1e40af",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Filter & Sort */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setPage(1);
            }}
            displayEmpty
            size="small"
            sx={{
              height: 48,
              borderRadius: 2.5,
              bgcolor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              "&:hover": {
                borderColor: "color-mix(in srgb, var(--color-primary) 40%, var(--border-color))",
              },
              "&.Mui-focused": {
                borderColor: "var(--color-primary)",
              },
            }}
          >
            <MenuItem value="">All Ratings</MenuItem>
            <MenuItem value="high-to-low">Highest First</MenuItem>
            <MenuItem value="low-to-high">Lowest First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Reviews List */}
      <Box>
        {reviews.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2.5,
              bgcolor: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
              No reviews yet. Be the first to review this product!
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {reviews.map((review, index) => (
              <Box key={review._id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2.5,
                    bgcolor: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "color-mix(in srgb, var(--color-primary) 40%, var(--border-color))",
                      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.1)",
                    },
                  }}
                >
                  {/* Reviewer Info */}
                  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: "var(--color-primary)",
                        fontWeight: 700,
                      }}
                    >
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    <Box flex={1}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {review.user?.name || "Anonymous"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Rating
                          value={Number(review.rating)}
                          readOnly
                          size="small"
                          precision={0.1}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {review.rating}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  {/* Review Comment */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--text-primary)",
                      lineHeight: 1.6,
                      mb: review.images?.length > 0 ? 2 : 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {review.comment}
                  </Typography>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <Grid container spacing={1.5} sx={{ mt: 2 }}>
                      {review.images.map((image, idx) => (
                        <Grid item xs={6} sm={4} md={3} key={idx}>
                          <Box
                            component="img"
                            src={image}
                            alt={`Review image ${idx + 1}`}
                            sx={{
                              width: "100%",
                              height: 150,
                              objectFit: "cover",
                              borderRadius: 1.5,
                              border: "1px solid var(--border-color)",
                              cursor: "pointer",
                              transition: "transform 0.2s ease",
                              "&:hover": {
                                transform: "scale(1.02)",
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
                {index < reviews.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(e, v) => setPage(v)}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
                "&.Mui-selected": {
                  bgcolor: "var(--color-primary)",
                  color: "white",
                  border: "none",
                },
              },
            }}
          />
        </Stack>
      )}
    </Box>
  );
};

export default ProductReviews;
