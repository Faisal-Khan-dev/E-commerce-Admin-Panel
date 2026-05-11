import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { SyncLoader } from "react-spinners";
import toast from "react-hot-toast";

import { useOrders, useUpdateOrderStatus } from "../hooks/useOrder";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../contexts/SocketContext";
import { ROWS_PER_PAGE } from "../constants";
import useDebounce from "../hooks/useDebounce";
import OrderHeader from "../components/Orders/OrderHeader";
import OrderRow from "../components/Orders/OrderRow";
import SearchInput from "../components/common/SearchInput";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";

const TABLE_HEADERS = ["Order ID", "Customer", "Date", "Total", "Status", "Action"];

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

const Orders = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceSort, setPriceSort] = useState("newest");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data = {}, isLoading } = useOrders(page, ROWS_PER_PAGE, debouncedSearch, statusFilter, priceSort);

  const orders = data?.orders || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.pages || 1;
  const totalOrders = pagination.total || 0;

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, [socket, queryClient]);


  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  }, []);

  const handlePriceSortChange = useCallback((e) => {
    setPriceSort(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((_, v) => setPage(v), []);

  const performStatusUpdate = useCallback((id, status) => {
    updateStatus(
      { id, status },
      {
        onSuccess: () => {
          toast.success("Order status updated");
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Failed to update status"),
      }
    );
  }, [updateStatus]);

  const handleStatusChange = useCallback(
    (id, status) => {
      if (status === "cancelled") {
        setPendingUpdate({ id, status });
        setIsConfirmOpen(true);
      } else {
        performStatusUpdate(id, status);
      }
    },
    [performStatusUpdate]
  );

  const handleConfirmCancel = useCallback(() => {
    if (pendingUpdate) {
      performStatusUpdate(pendingUpdate.id, pendingUpdate.status);
      setIsConfirmOpen(false);
      setPendingUpdate(null);
    }
  }, [pendingUpdate, performStatusUpdate]);

  const handleCloseConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    setPendingUpdate(null);
  }, []);

  const handleOpenDetails = useCallback((order) => {
    navigate(`/orders/${order._id}`);
  }, [navigate]);

  return (
    <Box sx={{ width: "100%" }}>
      <OrderHeader count={totalOrders} pendingCount={0} />

      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={2} 
        sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}
      >
        <SearchInput
          placeholder="Search by order no, customer name, email or amount..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1, minWidth: 280 }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            placeholder="Filter by Status"
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={priceSort}
            onChange={handlePriceSortChange}
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="low-to-high">Price: Low to High</MenuItem>
            <MenuItem value="high-to-low">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Stack>

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
              {TABLE_HEADERS.map((head) => {
                let align = "left";
                if (head === "Date" || head === "Status") align = "center";
                if (head === "Total") align = "right";
                if (head === "Action") align = "center";
                
                return (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      py: 2,
                      textAlign: align,
                      ...(head === "Total" && { pr: 3 }),
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    {head}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={TABLE_HEADERS.length} sx={{ textAlign: "center", py: 16 }}>
                  <SyncLoader style={{ margin: "0 auto" }} size={8} color="var(--color-primary)" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={TABLE_HEADERS.length} sx={{ textAlign: "center", py: 8 }}>
                  <EmptyState
                    title={searchTerm ? "No orders match your search" : "No orders found"}
                    description={
                      searchTerm
                        ? "Try adjusting your search criteria"
                        : "Orders will appear here once customers place them"
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleOpenDetails}
                  isUpdating={isUpdating}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
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

      {isConfirmOpen && <ConfirmDialog
        open={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmCancel}
        loading={isUpdating}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action will mark the order as cancelled and it cannot be reversed."
        confirmText="Cancel Order"
        confirmColor="#ef4444"
      />}
    </Box>
  );
};

export default Orders;
