import { useState, useMemo, useCallback } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, MenuItem, Select, FormControl } from "@mui/material";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useProducts, useDeleteProduct, useUpdateProduct } from "../hooks/useProduct";
import { ROWS_PER_PAGE } from "../constants";
import ProductHeader from "../components/Products/ProductHeader";
import ProductRow from "../components/Products/ProductRow";
import SearchInput from "../components/common/SearchInput";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";

const selectStyles = {
  height: 48,
  borderRadius: 2.5,
  bgcolor: "var(--bg-surface)",
  color: "var(--text-secondary)",
  fontSize: 14,
  border: "1px solid var(--border-color)",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "color-mix(in srgb, var(--color-primary) 40%, var(--border-color))",
  },
  "&.Mui-focused": {
    borderColor: "var(--color-primary)",
    boxShadow: "0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)",
  },
};

const TABLE_HEADERS = ["Image", "Title", "Category", "Price", "Stock", "Publish", "Featured", "Actions"];

const Products = () => {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const { mutate: deleteMutation, isPending: deleting } = useDeleteProduct();
  const { mutate: updateMutation, isPending: updating } = useUpdateProduct();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("All");
  const [stockStatus, setStockStatus] = useState("All");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
    setPage(1);
  }, []);

  const handleStockChange = useCallback((e) => {
    setStockStatus(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((_, v) => setPage(v), []);

  const handleEdit = (product) => {
    navigate(`/edit-product/${product._id}`);
  };

  const handleDelete = (product) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingProduct) return;

    deleteMutation(deletingProduct._id, {
      onSuccess: (res) => {
        toast.success(res.message || "Product deleted");
        setDeleteDialogOpen(false);
        setDeletingProduct(null);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to delete product");
      },
    });
  };

  // Category options derived from products
  const categoryOptions = useMemo(() => {
    return [...new Set(products.map((p) => p.category?.title))]
  }, [products]);

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = p.title?.toLowerCase().includes(searchLower);
      const matchesCat = category === "All" || p.category?.title === category;
      const matchesStock = stockStatus === "All" || (stockStatus === "InStock" ? p.stock > 0 : p.stock === 0);
      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, debouncedSearch, category, stockStatus]);

  const count = Math.ceil(filteredProducts.length / ROWS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const hasActiveFilters = searchTerm || category !== "All" || stockStatus !== "All";

  const handleTogglePublish = (product) => {
    const formData = new FormData();
    formData.append("isPublished", !product.isPublished);

    updateMutation({ id: product._id, formData }, {
      onSuccess: () => toast.success("Updated publish status."),
      onError: (err) => toast.error(err?.response?.data?.message || "Failed to update product.")
    }
    );
  };

  const handleToggleFeatured = (product) => {
    const formData = new FormData();
    formData.append("isFeatured", !product.isFeatured);

    updateMutation({ id: product._id, formData }, {
      onSuccess: () => toast.success("Updated featured status."),
      onError: (err) => toast.error(err?.response?.data?.message || "Failed to update product.")
    }
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ProductHeader
        count={filteredProducts.length}
        onAddClick={() => navigate("/add-product")}
      />

      {/* Search & Filters */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <SearchInput
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1.5 }}
        />

        <FormControl sx={{ flex: 1, minWidth: 150 }}>
          <Select value={category} onChange={handleCategoryChange} displayEmpty size="small" sx={selectStyles}>
            <MenuItem value="All">All Categories</MenuItem>
            {categoryOptions.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1, minWidth: 130 }}>
          <Select value={stockStatus} onChange={handleStockChange} displayEmpty size="small" sx={selectStyles}>
            <MenuItem value="All">All Stock</MenuItem>
            <MenuItem value="InStock">In Stock</MenuItem>
            <MenuItem value="OutStock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Table */}
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
              {TABLE_HEADERS.map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    py: 1.8,
                    px: 1,
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: "center", py: 16 }}>
                  <SyncLoader style={{ margin: "0 auto" }} size={8} color="var(--color-primary)" />
                </TableCell>
              </TableRow>
            ) : displayedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ py: 8, textAlign: "center" }}>
                  <EmptyState
                    title={hasActiveFilters ? "No products match your filters" : "No products found"}
                    description={hasActiveFilters ? "Try adjusting your search or filter criteria" : "Add your first product to get started"}
                  />
                </TableCell>
              </TableRow>
            ) : (
              displayedProducts.map((product, index) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  index={(page - 1) * ROWS_PER_PAGE + index + 1}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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

      {deleteDialogOpen && <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.title}"? It'll be removed from the database.`}
        confirmText="Delete"
        confirmColor="#ef4444"
      />}
    </Box>
  );
};

export default Products;