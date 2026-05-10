import { useState, useCallback } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, } from "@mui/material";
import { SyncLoader } from "react-spinners";
import { useCustomers, useSearchCustomer } from "../hooks/useCustomer";
import { ROWS_PER_PAGE } from "../constants";
import CustomerHeader from "../components/Customers/CustomerHeader";
import CustomerRow from "../components/Customers/CustomerRow";
import SearchInput from "../components/common/SearchInput";
import EmptyState from "../components/common/EmptyState";
import useDebounce from "../hooks/useDebounce";

const TABLE_HEADERS = ["Customer", "Email", "Status", "Action"];

const Customers = () => {

  const [page, setPage] = useState(1);
  const { data: listData, isLoading: isListLoading } = useCustomers(page, ROWS_PER_PAGE);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 800);
  const { data: searchData, isLoading: isSearching } = useSearchCustomer(debouncedSearch, page, ROWS_PER_PAGE);

  const activeData = debouncedSearch ? searchData : listData;
  const customers = activeData?.customers || [];
  const totalPages = activeData?.totalPages || 1;
  const totalCustomers = activeData?.total || 0;
  const isLoading = debouncedSearch ? isSearching : isListLoading;
  const isData = customers.length === 0 && !isLoading;


  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((_, v) => setPage(v), []);

  return (
    <Box sx={{ width: "100%" }}>
      <CustomerHeader count={totalCustomers} />

      <SearchInput
        placeholder="Search by name or email..."
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
                <TableCell colSpan={4} sx={{ textAlign: "center", py: 16 }}>
                  <SyncLoader style={{ margin: "0 auto" }} size={8} color="var(--color-primary)" />
                </TableCell>
              </TableRow>
            ) : isData ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", py: 8 }}>
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
    </Box>
  );
};

export default Customers;