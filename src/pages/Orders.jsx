import { useState, useCallback, useEffect } from "react";
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
} from "@mui/material";
import { SyncLoader } from "react-spinners";
import toast from "react-hot-toast";

import { useOrders, useUpdateOrderStatus, useSearchOrder } from "../hooks/useOrder";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../contexts/SocketContext";
import { ROWS_PER_PAGE } from "../constants";
import useDebounce from "../hooks/useDebounce";
import OrderHeader from "../components/Orders/OrderHeader";
import OrderRow from "../components/Orders/OrderRow";
import SearchInput from "../components/common/SearchInput";
import EmptyState from "../components/common/EmptyState";
import OrderDetailsDialog from "../components/Orders/OrderDetailsDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";

const TABLE_HEADERS = ["Order ID", "Date", "Customer", "Total", "Status", "Action"];

const Orders = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading: isListLoading } = useOrders(page, ROWS_PER_PAGE, { enabled: !debouncedSearch });
  const { data: searchData, isLoading: isSearching } = useSearchOrder(debouncedSearch, page, ROWS_PER_PAGE);

  const activeData = debouncedSearch ? searchData : data;
  const orders = activeData?.orders || [];
  const pendingOrders = data?.pendingOrders || 0;
  const totalPages = activeData?.totalPages || 1;
  const totalOrders = activeData?.total || 0;
  const isLoading = debouncedSearch ? isSearching : isListLoading;

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

  const handlePageChange = useCallback((_, v) => setPage(v), []);

  const handleStatusChange = useCallback(
    (id, status) => {
      if (status === "cancelled") {
        setPendingUpdate({ id, status });
        setIsConfirmOpen(true);
      } else {
        performStatusUpdate(id, status);
      }
    },
    []
  );

  const performStatusUpdate = useCallback((id, status) => {
    updateStatus(
      { id, status },
      {
        onSuccess: () => {
          toast.success("Order status updated");
          if (selectedOrder && selectedOrder._id === id) {
            setSelectedOrder(prev => ({ ...prev, status }));
          }
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Failed to update status"),
      }
    );
  }, [updateStatus, selectedOrder]);

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
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <OrderHeader count={totalOrders} pendingCount={pendingOrders} />

      <SearchInput
        placeholder="Search by order ID or customer email..."
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

      {isDetailsOpen &&
        <OrderDetailsDialog
          open={isDetailsOpen}
          onClose={handleCloseDetails}
          order={selectedOrder}
        />}

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
