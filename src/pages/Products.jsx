import { useState, useCallback } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, MenuItem, Select, FormControl } from "@mui/material";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useProducts, useDeleteProduct } from "../hooks/useProduct";
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

const TABLE_HEADERS = ["Image", "Name", "Category", "Price", "Stock", "Actions"];
const ROWS_PER_PAGE = 10;

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 800);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const { data: apiResponse = {}, isLoading } = useProducts(debouncedSearch, category, "", "", sort, page, ROWS_PER_PAGE);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const products = apiResponse?.products || [];
  const pagination = apiResponse?.pagination || {};

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSort(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((_, v) => setPage(v), []);

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.slug}`);
  };

  const handleDelete = (product) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingProduct) return;

    deleteProduct(deletingProduct._id, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        setDeleteDialogOpen(false);
        setDeletingProduct(null);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to delete product");
      },
    });
  };

  const hasActiveFilters = debouncedSearch || category || sort !== "newest";

  return (
    <Box sx={{ width: "100%" }}>
      <ProductHeader
        count={products.length}
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
            <MenuItem value="">All Categories</MenuItem>
            {/* Categories derived from backend or hardcoded */}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1, minWidth: 130 }}>
          <Select value={sort} onChange={handleSortChange} displayEmpty size="small" sx={selectStyles}>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="low-to-high">Price: Low to High</MenuItem>
            <MenuItem value="high-to-low">Price: High to Low</MenuItem>
            <MenuItem value="top-rated">Top Rated</MenuItem>
            <MenuItem value="most-reviewed">Most Reviewed</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        className="custom-scrollbar"
        sx={{
          borderRadius: 2.5,
          border: "1px solid var(--border-color)",
          bgcolor: "var(--bg-surface)",
          overflow: "auto",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(14, 165, 233, 0.03) 100%)",
              borderBottom: "2px solid var(--border-color)"
            }}>
              {TABLE_HEADERS.map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    py: 3,
                    px: 2.5,
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
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 16 }}>
                  <SyncLoader style={{ margin: "0 auto" }} size={8} color="var(--color-primary)" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 8, textAlign: "center" }}>
                  <EmptyState
                    title={hasActiveFilters ? "No products match your search" : "No products found"}
                    description={hasActiveFilters ? "Try adjusting your search or filter criteria" : "Add your first product to get started"}
                  />
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={pagination.pages}
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
        loading={isDeleting}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="#ef4444"
      />}
    </Box>
  );
};

export default Products;