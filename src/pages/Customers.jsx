import { useState, useCallback } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Stack, MenuItem, Select, FormControl, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { useCustomers } from "../hooks/useCustomer";
import CustomerHeader from "../components/Customers/CustomerHeader";
import CustomerRow from "../components/Customers/CustomerRow";
import SearchInput from "../components/common/SearchInput";
import EmptyState from "../components/common/EmptyState";
import useDebounce from "../hooks/useDebounce";
import { MdAdd } from "react-icons/md";
import { ROWS_PER_PAGE } from "../constants";

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

const Customers = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const debouncedSearch = useDebounce(searchTerm, 800);
  const { data = {}, isLoading } = useCustomers(page, ROWS_PER_PAGE, debouncedSearch, statusFilter, sortBy);

  const customers = data?.users || [];
  const pagination = data?.pagination || {};
  const totalCustomers = pagination.total || 0;
  const totalPages = pagination.pages || 1;
  const isData = customers.length === 0 && !isLoading;

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((_, v) => setPage(v), []);

  return (
    <Box sx={{ width: "100%" }}>
      <CustomerHeader count={totalCustomers} />

      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={2} 
        sx={{ mb: 3, flexWrap: "wrap", gap: 2, justifyContent: "space-between" }}
      >
        <SearchInput
          placeholder="Search by name, email or city..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1, minWidth: 280 }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="a-z">Name: A to Z</MenuItem>
            <MenuItem value="z-a">Name: Z to A</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<MdAdd size={20} />}
          onClick={() => navigate("/add-customer")}
          sx={{ textTransform: "none", borderRadius: 2, height: 48, fontWeight: 600, whiteSpace: "nowrap" }}
        >
          Add Customer
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2.5,
          border: "1px solid var(--border-color)",
          bgcolor: "var(--bg-surface)",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)"
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "var(--bg-page)" }}>
              <TableCell sx={{ width: "14%", fontWeight: 700, color: "var(--text-primary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, py: 2.5, px: 2.5, borderBottom: "2px solid var(--border-color)" }}>First Name</TableCell>
              <TableCell sx={{ width: "14%", fontWeight: 700, color: "var(--text-primary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, py: 2.5, px: 2.5, borderBottom: "2px solid var(--border-color)" }}>Last Name</TableCell>
              <TableCell sx={{ width: "21%", fontWeight: 700, color: "var(--text-primary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, py: 2.5, px: 2.5, borderBottom: "2px solid var(--border-color)" }}>Email</TableCell>
              <TableCell sx={{ width: "11%", fontWeight: 700, color: "var(--text-primary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, py: 2.5, px: 2.5, borderBottom: "2px solid var(--border-color)" }}>City</TableCell>
              <TableCell sx={{ width: "11%", fontWeight: 700, color: "var(--text-primary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, py: 2.5, px: 2.5, borderBottom: "2px solid var(--border-color)" }}>Role</TableCell>
              <TableCell sx={{ width: "11%", fontWeight: 700, color: "var(--text-primary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, py: 2.5, px: 2.5, borderBottom: "2px solid var(--border-color)" }}>Status</TableCell>
              <TableCell sx={{ width: "18%", fontWeight: 700, color: "var(--text-primary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, py: 2.5, px: 2.5, borderBottom: "2px solid var(--border-color)" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 16 }}>
                  <SyncLoader style={{ margin: "0 auto" }} size={8} color="var(--color-primary)" />
                </TableCell>
              </TableRow>
            ) : isData ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 8 }}>
                  <EmptyState
                    title={searchTerm ? "No customers match your search" : "No customers found"}
                    description={searchTerm ? "Try adjusting your search criteria" : "Customers will appear here once they register"}
                  />
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <CustomerRow key={customer._id} customer={customer} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && customers.length > 0 && totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="medium"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 1.5,
                border: "1px solid var(--border-color)",
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                bgcolor: "var(--color-primary)",
                borderColor: "var(--color-primary)",
                color: "white",
              },
            }}
          />
        </Stack>
      )}
    </Box>
  );
};

export default Customers;