import { Box } from "@mui/material";
import { getStatusColor } from "../../utils/statusChip";

const StatusBadge = ({ status }) => {
    const colors = getStatusColor(status);
    return (
        <Box
            sx={{
                display: "inline-flex",
                px: 1.5,
                py: 0.5,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                bgcolor: colors.bg,
                color: colors.text,
                border: `1px solid color-mix(in srgb, ${colors.text} 15%, transparent)`,
            }}
        >
            {status}
        </Box>
    );
};

export default StatusBadge;