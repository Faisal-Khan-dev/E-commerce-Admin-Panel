import { Box, Stack, Typography } from "@mui/material";
import { MdOutlineInbox } from "react-icons/md";

const EmptyState = ({ title = "No items found", description }) => {
    return (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 2, width: "100%" }}>
            <Box>
                <MdOutlineInbox size={48} color="var(--text-secondary)" />
            </Box>
            <Typography
                sx={{ color: "var(--text-secondary)", fontWeight: 500 }}
            >
                {title}
            </Typography>
            {description && (
                <Typography
                    variant="caption"
                    sx={{ color: "var(--text-secondary)", maxWidth: 300, textAlign: "center" }}
                >
                    {description}
                </Typography>
            )}
        </Stack>
    );
}

export default EmptyState;