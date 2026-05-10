import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, Typography, Box, Paper, IconButton, Stack } from "@mui/material";
import { MdAddPhotoAlternate, MdClose, MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import CustomTextarea from "../components/common/CustomTextArea";
import { useCreateProduct } from "../hooks/useProduct";
import { useActiveCategories } from "../hooks/useCategory";
import CustomSelectBox from "../components/common/CustomSelectBox";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const { data: categories = [] } = useActiveCategories();
  const { mutate: createMutation, isPending } = useCreateProduct();
  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 6 - images.length;
    if (remaining <= 0) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    if (files.length > remaining) {
      toast.error(`You can only add ${remaining} more image${remaining > 1 ? "s" : ""}`);
    }
    const newImages = files.slice(0, remaining).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const categoryOptions = categories.map((cat) => ({
    label: cat.title,
    value: cat._id,
  }));

  const onSubmit = (data) => {
    if (images.length === 0) return toast.error("At least one image is required");
    if (images.length > 6) return toast.error("Maximum 6 images allowed");

    const formData = new FormData();
    formData.append("title", data.title.trim());
    formData.append("description", data.description.trim());
    formData.append("category", data.category);
    formData.append("stock", Number(data.stock || 0));
    formData.append("discount", Number(data.discount || 0));
    formData.append("sellingPrice", Number(data.sellingPrice));
    formData.append("buyingPrice", Number(data.buyingPrice || 0));

    images.forEach((img) => {
      formData.append("images", img.file);
    });

    createMutation(formData, {
      onSuccess: (res) => {
        toast.success(res.message || "Product Added successfully");
        navigate("/products");
      },
      onError: (err) => {
        const message = err?.response?.data?.message || "Product add failed";
        setError("root", { message });
        toast.error(message);
      }
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5}>
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
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Add Product
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                Create a new product listing
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* LEFT: Product Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                bgcolor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 3, fontWeight: 700, color: "var(--text-primary)" }}
              >
                Product Information
              </Typography>

              <Grid container spacing={2.5}>
                <Grid size={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    Product Title <span className="text-red-500">*</span>
                  </Typography>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        placeholder="Enter product title"
                        error={errors.title}
                        height={44}
                        helperText={errors.title?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    Stock Quantity <span style={{ color: "#ef4444" }}>*</span>
                  </Typography>
                  <Controller
                    name="stock"
                    control={control}
                    rules={{
                      required: "Stock is required",
                      min: { value: 0, message: "Stock cannot be negative" },
                    }}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        type="number"
                        placeholder="0"
                        height={44}
                        error={!!errors.stock}
                        helperText={errors.stock?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                    }}
                  >
                    Cost Price{" "}
                    <span style={{ fontSize: 11, opacity: 0.7 }}>
                      (Optional)
                    </span>
                  </Typography>
                  <Controller
                    name="buyingPrice"
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        type="number"
                        placeholder="Rs. 0"
                        height={44}
                      />
                    )}
                  />
                </Grid>

                <Grid size={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      color: "var(--color-primary)",
                    }}
                  >
                    Sale Price <span style={{ color: "#ef4444" }}>*</span>
                  </Typography>
                  <Controller
                    name="sellingPrice"
                    control={control}
                    rules={{
                      required: "Sale price is required",
                      min: { value: 1, message: "Price must be greater than 0" },
                    }}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        type="number"
                        placeholder="Rs. 0"
                        error={!!errors.sellingPrice}
                        helperText={errors.sellingPrice?.message}
                        height={44}
                      />
                    )}
                  />
                </Grid>

                <Grid size={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    Discount (%)
                  </Typography>
                  <Controller
                    name="discount"
                    control={control}
                    rules={{
                      min: { value: 0, message: "Discount cannot be negative" },
                      max: { value: 100, message: "Discount cannot exceed 100%" },
                    }}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        type="number"
                        placeholder="0"
                        height={44}
                        error={!!errors.discount}
                        helperText={errors.discount?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    Category <span style={{ color: "#ef4444" }}>*</span>
                  </Typography>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <CustomSelectBox
                        value={field.value || ""}
                        onChange={field.onChange}
                        options={categoryOptions}
                        placeholder="Select category"
                        error={!!errors.category}
                        helperText={errors.category?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* RIGHT: Description */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                bgcolor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 3, fontWeight: 700, color: "var(--text-primary)" }}
              >
                Product Description
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
              >
                Detailed Description
              </Typography>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required." }}
                render={({ field }) => (
                  <CustomTextarea
                    {...field}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Describe your product features, specifications, and details..."
                    height="100%"
                    sx={{ flex: 1 }}
                  />
                )}
              />
            </Paper>
          </Grid>

          {/* FULL WIDTH: Images */}
          <Grid size={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 700, color: "var(--text-primary)" }}
              >
                Product Images
              </Typography>

              <Box
                component="label"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed var(--border-color)",
                  borderRadius: 3,
                  p: 4,
                  height: 250,
                  cursor: "pointer",
                  bgcolor: "var(--bg-page)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "var(--color-primary)",
                    bgcolor:
                      "color-mix(in srgb, var(--color-primary) 4%, var(--bg-page))",
                  },
                }}
              >
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor:
                      "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <MdAddPhotoAlternate size={28} color="var(--color-primary)" />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                >
                  Click to upload images
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--text-secondary)", mt: 0.5 }}
                >
                  PNG, JPG up to 5MB each
                </Typography>
              </Box>

              {/* Image Preview */}
              {images.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {images.map((img, index) => (
                    <Grid size={{ xs: 6, sm: 4, md: 2 }} key={index}>
                      <Box
                        sx={{
                          position: "relative",
                          pt: "100%",
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "1px solid var(--border-color)",
                          bgcolor: "var(--bg-page)",
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`Product ${index + 1}`}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          onClick={() => removeImage(index)}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            bgcolor: "rgba(239, 68, 68, 0.9)",
                            color: "#fff",
                            width: 24,
                            height: 24,
                            "&:hover": { bgcolor: "#dc2626" },
                          }}
                        >
                          <MdClose size={14} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mt: 3 }}
        >
          <CustomButton
            type="button"
            onClick={() => navigate(-1)}
            bgColor="var(--bg-surface)"
            color="var(--text-primary)"
            width={120}
            height={44}
            sx={{
              border: "1px solid var(--border-color)",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "var(--bg-page)",
              },
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            loading={isSubmitting || isPending}
            width={160}
            height={44}
            sx={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              fontWeight: 600,
              "&:hover": {
                boxShadow:
                  "0 8px 20px color-mix(in srgb, var(--color-primary) 30%, transparent)",
              },
            }}
          >
            Save Product
          </CustomButton>
        </Stack>
      </form>
    </Box>
  );
};

export default AddProduct;