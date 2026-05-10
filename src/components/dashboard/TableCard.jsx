import { Typography, Box } from "@mui/material";
import CustomButton from "../common/CustomButton";

function TableCard({ title, buttonText, handleClick, columns, emptyText, data = [], renderRow }) {
  return (
    <Box
      sx={{
        bgcolor: "var(--bg-surface)",
        borderRadius: 3,
        border: "1px solid var(--border-color)",
        p: 3,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 20,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {title}
        </Typography>
        <CustomButton
          onClick={handleClick}
          type="button"
          bgColor="#F3F4F6"
          color="#374151"
          height={32}
          fontSize={13}
          sx={{
            boxShadow: "none",
            px: 2,
            fontWeight: 600,
            borderRadius: "8px",
            "&:hover": { bgcolor: "#E5E7EB" }
          }}
        >
          {buttonText}
        </CustomButton>
      </Box>

      {/* Header Removed for cleaner list look */}

      <Box sx={{ flex: 1 }}>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <Box key={index}>
              {renderRow ? renderRow(item, index) : null}
            </Box>
          ))
        ) : (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography
              sx={{
                color: "var(--text-secondary)",
                fontSize: 14,
              }}
            >
              {emptyText}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default TableCard;