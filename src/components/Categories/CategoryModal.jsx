import { useState, useEffect } from "react";
import { Box, Typography, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { MdClose, MdAddPhotoAlternate } from "react-icons/md";
import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";
import toast from "react-hot-toast";
import { useCreateCategory, useUpdateCategory } from "../../hooks/useCategory";

const CategoryModal = ({ open, onClose, category }) => {

    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const { mutate: createMutation, isPending: creating } = useCreateCategory();
    const { mutate: updateMutation, isPending: updating } = useUpdateCategory();

    const submitting = creating || updating;
    const isEditing = Boolean(category);

    useEffect(() => {
        if (open) {
            setTitle(category?.title || "");
            setImageFile(null);
            setImagePreview(category?.image || "");
        }
    }, [open, category]);

    const handleClose = () => {
        setTitle("");
        setImageFile(null);
        setImagePreview("");
        onClose();
    };

    const handleImagePick = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            toast.error("Category title is required");
            return;
        }

        if (!isEditing && !imageFile) {
            toast.error("Category image is required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title.trim());
        if (imageFile) formData.append("image", imageFile);

        if (isEditing) {
            updateMutation({ id: category._id, formData }, {
                onSuccess: (res) => {
                    toast.success(res.message || "Category updated");
                    handleClose();
                },
                onError: (err) => {
                    toast.error(err?.response?.data?.message || "Failed to update category");
                }
            });
        } else {
            createMutation(formData, {
                onSuccess: (res) => {
                    toast.success(res.message || "Category created");
                    handleClose();
                },
                onError: (err) => {
                    toast.error(err?.response?.data?.message || "Failed to create category");
                }
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 700,
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-primary)",
                    pb: 1,
                }}
            >
                {isEditing ? "Edit Category" : "Add Category"}
                <IconButton onClick={handleClose} size="small">
                    <MdClose size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Typography
                    variant="body2"
                    sx={{ mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                >
                    Category Title <span style={{ color: "#ef4444" }}>*</span>
                </Typography>
                <CustomInput
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Electronics, Clothing"
                    height={44}
                />

                <Typography
                    variant="body2"
                    sx={{ mt: 2.5, mb: 0.5, fontWeight: 600, color: "var(--text-primary)" }}
                >
                    Category Image{" "}
                    {!isEditing && <span style={{ color: "#ef4444" }}>*</span>}
                </Typography>

                <Box
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    {imagePreview ? (
                        <Box sx={{ position: "relative", width: "100%" }}>
                            <Box
                                component="label"
                                htmlFor="category-image-input"
                                sx={{ cursor: "pointer", display: "block" }}
                            >
                                <Avatar
                                    src={imagePreview}
                                    variant="rounded"
                                    sx={{
                                        width: "100%",
                                        height: 230,
                                        border: "2px solid var(--border-color)",
                                        borderRadius: 3,
                                    }}
                                />
                            </Box>
                            <IconButton
                                size="small"
                                onClick={handleRemoveImage}
                                sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    bgcolor: "#ef4444",
                                    color: "#fff",
                                    width: 24,
                                    height: 24,
                                    zIndex: 1,
                                    "&:hover": { bgcolor: "#dc2626" },
                                }}
                            >
                                <MdClose size={14} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box
                            component="label"
                            htmlFor="category-image-input"
                            sx={{
                                width: "100%",
                                height: 180,
                                borderRadius: 3,
                                border: "2px dashed var(--border-color)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    borderColor: "var(--color-primary)",
                                    bgcolor:
                                        "color-mix(in srgb, var(--color-primary) 5%, transparent)",
                                },
                            }}
                        >
                            <MdAddPhotoAlternate
                                size={28}
                                color="var(--text-secondary)"
                            />
                            <Typography
                                variant="caption"
                                sx={{ mt: 0.5, color: "var(--text-secondary)" }}
                            >
                                Upload
                            </Typography>
                        </Box>
                    )}

                    <input
                        id="category-image-input"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImagePick}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <CustomButton
                    type="button"
                    onClick={handleClose}
                    bgColor="var(--button-secondary-bg)"
                    color="var(--text-primary)"
                    height={42}
                    sx={{ boxShadow: "none" }}
                >
                    Cancel
                </CustomButton>
                <CustomButton
                    type="button"
                    onClick={handleSubmit}
                    loading={submitting}
                    height={42}
                >
                    {isEditing ? "Update" : "Create"}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryModal;
