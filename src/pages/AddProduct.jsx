import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, Typography, Box, Paper, IconButton, Stack, Avatar } from "@mui/material";
import { MdAddPhotoAlternate, MdClose, MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import CustomTextarea from "../components/common/CustomTextArea";
import { useCreateProduct } from "../hooks/useProduct";
import CustomSelectBox from "../components/common/CustomSelectBox";
import toast from "react-hot-toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { mutate: createMutation, isPending } = useCreateProduct();
  const { control, handleSubmit, formState: { errors }, setError, watch } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      originalPrice: "",
      salePrice: "",
      category: "",
      stock: true,
    }
  });

  const nameValue = watch("name");

  // Auto-generate slug from name  
  const generatedSlug = useMemo(() => {
    if (!nameValue) return "";
    return nameValue
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }, [nameValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }

      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSubmit = (data) => {
    if (images.length === 0) {
      return toast.error("Please upload at least one product image");
    }

    // Validate sale price is not greater than original price
    if (Number(data.salePrice) > Number(data.originalPrice)) {
      return toast.error("Sale price cannot be greater than original price");
    }

    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("slug", data.slug || generatedSlug);
    formData.append("description", data.description?.trim() || "");
    formData.append("originalPrice", Number(data.originalPrice));
    formData.append("salePrice", Number(data.salePrice || 0));
    formData.append("category", data.category || "");
    // Send stock as string since FormData converts everything to string
    formData.append("stock", String(data.stock));
    
    // Append multiple images
    images.forEach((image) => {
      formData.append("images", image);
    });

    createMutation(formData, {
      onSuccess: (res) => {
        toast.success(res.message || "Product added successfully");
        navigate("/products");
      },
      onError: (err) => {
        const message = err?.response?.data?.message || "Failed to add product";
        setError("root", { message });
        toast.error(message);
      }
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 3 }}
      >
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Product Information */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2.5,
                bgcolor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2.5, fontWeight: 700, color: "var(--text-primary)" }}
              >
                Product Information
              </Typography>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Product Name <span style={{ color: "#ef4444" }}>*</span>
                  </Typography>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Product name is required" }}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        placeholder="Enter product name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        height={44}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Product Slug <span style={{ color: "#ef4444" }}>*</span>
                  </Typography>
                  <Controller
                    name="slug"
                    control={control}
                    rules={{ required: "Slug is required" }}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        placeholder={generatedSlug || "Auto-generated from name"}
                        error={!!errors.slug}
                        helperText={errors.slug?.message || "URL-friendly identifier"}
                        height={44}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Original Price <span style={{ color: "#ef4444" }}>*</span>
                  </Typography>
                  <Controller
                    name="originalPrice"
                    control={control}
                    rules={{
                      required: "Original price is required",
                      min: { value: 1, message: "Price must be greater than 0" },
                    }}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        type="number"
                        placeholder="Rs. 0"
                        error={!!errors.originalPrice}
                        helperText={errors.originalPrice?.message}
                        height={44}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Sale Price
                  </Typography>
                  <Controller
                    name="salePrice"
                    control={control}
                    rules={{
                      min: { value: 0, message: "Sale price cannot be negative" },
                    }}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        type="number"
                        placeholder="Rs. 0 (optional)"
                        error={!!errors.salePrice}
                        helperText={errors.salePrice?.message || "Leave empty if no discount"}
                        height={44}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Category
                  </Typography>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        {...field}
                        placeholder="Enter category (e.g., Electronics)"
                        error={!!errors.category}
                        helperText={errors.category?.message}
                        height={44}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Stock Status
                  </Typography>
                  <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                      <CustomSelectBox
                        value={field.value ? "true" : "false"}
                        onChange={(e) => field.onChange(e.target.value === "true")}
                        options={[
                          { label: "In Stock", value: "true" },
                          { label: "Out of Stock", value: "false" },
                        ]}
                        height={44}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Description
                  </Typography>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <CustomTextarea
                        {...field}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        placeholder="Describe your product features and details..."
                        sx={{ minHeight: 120 }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Product Image */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2.5,
                bgcolor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2.5, fontWeight: 700, color: "var(--text-primary)" }}
              >
                Product Image
              </Typography>

              {imagePreviews.length === 0 ? (
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed var(--border-color)",
                    borderRadius: 2.5,
                    p: 4,
                    minHeight: 200,
                    cursor: "pointer",
                    bgcolor: "var(--bg-page)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "var(--color-primary)",
                      bgcolor: "color-mix(in srgb, var(--color-primary) 4%, var(--bg-page))",
                    },
                  }}
                >
                  <input
                    type="file"
                    hidden
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                  />
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                    }}
                  >
                    <MdAddPhotoAlternate size={28} color="var(--color-primary)" />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    Click to upload images
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary)", mt: 0.5 }}>
                    PNG, JPG up to 5MB (multiple files allowed)
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    {imagePreviews.map((preview, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <Avatar
                          src={preview}
                          variant="rounded"
                          sx={{ width: 120, height: 120 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            bgcolor: "#ef4444",
                            color: "white",
                            "&:hover": { bgcolor: "#dc2626" },
                          }}
                        >
                          <MdClose size={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    component="label"
                    sx={{
                      display: "inline-block",
                      border: "2px dashed var(--border-color)",
                      borderRadius: 2,
                      p: 1.5,
                      cursor: "pointer",
                      bgcolor: "var(--bg-page)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "var(--color-primary)",
                        bgcolor: "color-mix(in srgb, var(--color-primary) 4%, var(--bg-page))",
                      },
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      + Add More Images
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
              <CustomButton
                onClick={() => navigate(-1)}
                label="Cancel"
                sx={{
                  order: { xs: 2, sm: 1 },
                  bgcolor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  "&:hover": { bgcolor: "var(--bg-page)" },
                }}
              />
              <CustomButton
                type="submit"
                label={isPending ? "Adding..." : "Add Product"}
                disabled={isPending}
                sx={{ order: { xs: 1, sm: 2 } }}
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProduct;