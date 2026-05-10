import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from "@mui/material";
import CustomButton from "./CustomButton";

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    loading = false,
    title = "Confirm Action",
    description = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "var(--color-primary)",
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontSize: 18,
                    pb: 1
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {description}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Stack direction="row" spacing={1.5} width="100%">
                    <CustomButton
                        type="button"
                        onClick={onClose}
                        bgColor="var(--bg-page)"
                        color="var(--text-primary)"
                        height={40}
                        sx={{
                            flex: 1,
                            boxShadow: "none",
                            border: "1px solid var(--border-color)",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.02)" }
                        }}
                    >
                        {cancelText}
                    </CustomButton>
                    <CustomButton
                        type="button"
                        onClick={onConfirm}
                        loading={loading}
                        bgColor={confirmColor}
                        height={40}
                        sx={{ flex: 1 }}
                    >
                        {confirmText}
                    </CustomButton>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;