import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  Avatar,
  Rating,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const ReviewsModal = ({ open, onClose, productName, reviews = [] }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "var(--bg-surface)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: 16,
          color: "var(--text-primary)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        {productName} - Customer Reviews
        <Button
          onClick={onClose}
          sx={{
            minWidth: "auto",
            p: 0.5,
            color: "var(--text-secondary)",
            "&:hover": {
              bgcolor: "var(--bg-page)",
            },
          }}
        >
          <Close fontSize="small" />
        </Button>
      </DialogTitle>

      <DialogContent
        sx={{
          py: 2,
          px: 3,
          maxHeight: "400px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "var(--bg-page)",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "var(--border-color)",
            borderRadius: 1,
            "&:hover": {
              bgcolor: "var(--text-secondary)",
            },
          },
        }}
      >
        {reviews.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ fontSize: 14, color: "var(--text-secondary)" }}>
              No reviews from this customer for this product
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {reviews.map((review, index) => (
              <Box key={index}>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  {/* Avatar with Product Image */}
                  <Avatar
                    src={review.images?.[0]}
                    sx={{
                      width: 60,
                      height: 60,
                      fontSize: 20,
                      bgcolor: "var(--color-primary)",
                      flexShrink: 0,
                    }}
                  >
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </Avatar>

                  {/* Review Content */}
                  <Box sx={{ flex: 1 }}>
                    {/* Header: Name, Email, Rating */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 0.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                          {review.user?.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
                          {review.user?.email}
                        </Typography>
                      </Box>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        precision={0.5}
                      />
                    </Box>

                    {/* Comment */}
                    <Typography sx={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6, mt: 0.8 }}>
                      {review.comment}
                    </Typography>

                    {/* Images */}
                    {review.images && review.images.length > 1 && (
                      <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                        {review.images.slice(1).map((image, idx) => (
                          <Box
                            key={idx}
                            component="img"
                            src={image}
                            sx={{
                              width: "70px",
                              height: "70px",
                              borderRadius: 1,
                              objectFit: "cover",
                              border: "1px solid var(--border-color)",
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
                {index < reviews.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "var(--color-primary)",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "color-mix(in srgb, var(--color-primary) 90%, black)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewsModal;
