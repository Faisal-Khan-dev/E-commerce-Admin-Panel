import { useState, useCallback } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { useCustomers } from "../hooks/useCustomer";
import CustomerHeader from "../components/Customers/CustomerHeader";
import CustomerRow from "../components/Customers/CustomerRow";
import SearchInput from "../components/common/SearchInput";
import EmptyState from "../components/common/EmptyState";
import useDebounce from "../hooks/useDebounce";
import { MdAdd } from "react-icons/md";

const Customers = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 800);
  const { data: listData, isLoading } = useCustomers(debouncedSearch);

  const customers = listData?.users || [];
  const totalCustomers = listData?.users?.length || 0;
  const isData = customers.length === 0 && !isLoading;


  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <CustomerHeader count={totalCustomers} />

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <SearchInput
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1, maxWidth: "none" }}
        />
        <Button
          variant="contained"
          startIcon={<MdAdd size={20} />}
          onClick={() => navigate("/add-customer")}
          sx={{ textTransform: "none", borderRadius: 2, height: 45, fontWeight: 600, whiteSpace: "nowrap" }}
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
    </Box>
  );
};

export default Customers;