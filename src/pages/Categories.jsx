import { useState, useMemo, useCallback } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack } from "@mui/material";
import { useCategories, useUpdateCategory, useDeleteCategory } from "../hooks/useCategory";
import { ROWS_PER_PAGE } from "../constants";
import CategoryModal from "../components/Categories/CategoryModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SearchInput from "../components/common/SearchInput";
import toast from "react-hot-toast";
import EmptyState from "../components/common/EmptyState";
import useDebounce from "../hooks/useDebounce";
import CategoryHeader from "../components/Categories/CategoryHeader";
import CategoryRow from "../components/Categories/CategoryRow";
import { SyncLoader } from "react-spinners";

const Categories = () => {
    const { data: categories = [], isLoading: loading } = useCategories();
    const { mutate: updateMutation } = useUpdateCategory();
    const { mutate: deleteMutation, isPending: deleting } = useDeleteCategory();

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState(null);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((_, v) => setPage(v), []);

    const openAddModal = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    const handleToggleActive = (cat) => {
        const formData = new FormData();
        formData.append("isActive", !cat.isActive);

        updateMutation({ id: cat._id, formData }, {
            onSuccess: () => {
                toast.success(`${cat.isActive ? "Inactivated" : "Activated"}`);
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || "Failed to update category");
            }
        });
    };

    const openDeleteDialog = (cat) => {
        setDeletingCategory(cat);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!deletingCategory) return;

        deleteMutation(deletingCategory._id, {
            onSuccess: (res) => {
                toast.success(res.message || "Category deleted");
                setDeleteDialogOpen(false);
                setDeletingCategory(null);
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || "Failed to delete category");
            }
        });
    };

    const filteredCategories = useMemo(() => {
        if (!debouncedSearch) return categories;
        const lower = debouncedSearch.toLowerCase();
        return categories.filter(
            (c) => c && (
                c.title?.toLowerCase().includes(lower) ||
                c._id?.toLowerCase().includes(lower)
            )
        );
    }, [categories, debouncedSearch]);

    const count = Math.ceil(filteredCategories.length / ROWS_PER_PAGE);
    const displayed = filteredCategories.slice(
        (page - 1) * ROWS_PER_PAGE,
        page * ROWS_PER_PAGE
    );

    return (
        <Box sx={{ width: "100%" }}>
            <CategoryHeader
                count={filteredCategories.length}
                onAddClick={openAddModal}
            />

            <SearchInput
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ mb: 3, maxWidth: 420 }}
            />

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid var(--border-color)",
                    bgcolor: "var(--bg-surface)",
                    overflow: "hidden",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "var(--bg-page)" }}>
                            {["Image", "Title", "Status", "Actions"].map((head) => (
                                <TableCell
                                    key={head}
                                    sx={{
                                        fontWeight: 700,
                                        color: "var(--text-secondary)",
                                        fontSize: 13,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        py: 1.8,
                                        borderBottom: "1px solid var(--border-color)",
                                    }}
                                >
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ textAlign: "center", py: 16 }}>
                                    <SyncLoader style={{ margin: "0 auto" }} size={8} color="var(--color-primary)" />
                                </TableCell>
                            </TableRow>
                        ) : displayed.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ textAlign: "center", py: 8 }}>
                                    <EmptyState
                                        title={searchTerm ? "No categories match your filters" : "No categories found"}
                                        description={searchTerm ? "Try adjusting your search or filter criteria" : "Add your first category to get started"}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayed.map((cat) => (
                                <CategoryRow
                                    key={cat._id}
                                    cat={cat}
                                    onEdit={openEditModal}
                                    onDelete={openDeleteDialog}
                                    onToggle={handleToggleActive}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {count > 1 && (
                <Stack alignItems="center" sx={{ mt: 3 }}>
                    <Pagination
                        count={count}
                        page={page}
                        onChange={handlePageChange}
                        shape="rounded"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontWeight: 600,
                                "&.Mui-selected": {
                                    bgcolor: "var(--color-primary)",
                                    color: "#fff",
                                    "&:hover": {
                                        bgcolor: "color-mix(in srgb, var(--color-primary) 85%, #000)",
                                    },
                                },
                            },
                        }}
                    />
                </Stack>
            )}

            {modalOpen && <CategoryModal
                open={modalOpen}
                onClose={closeModal}
                category={editingCategory}
            />}

            {deleteDialogOpen && <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeletingCategory(null);
                }}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Category"
                description={`Are you sure you want to delete "${deletingCategory?.title}"? It'll be removed from the database.`}
                confirmText="Delete"
                confirmColor="#ef4444"
            />}
        </Box>
    );
};

export default Categories;