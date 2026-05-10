import { TableRow, TableCell, Avatar, Typography, Stack, Chip, Tooltip, Switch, IconButton } from "@mui/material";
import { MdEdit, MdDeleteOutline } from "react-icons/md";

const CategoryRow = ({ cat, onEdit, onDelete, onToggle }) => {
    if (!cat) return null;

    return (
        <TableRow
            sx={{
                transition: "background 0.15s",
                "&:hover": { bgcolor: "var(--bg-page)" },
            }}
        >
            <TableCell>
                <Avatar
                    src={cat.image}
                    alt={cat.title}
                    variant="rounded"
                    sx={{
                        width: 48,
                        height: 48,
                        border: "1px solid var(--border-color)",
                    }}
                />
            </TableCell>

            <TableCell>
                <Typography
                    sx={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}
                >
                    {cat.title}
                </Typography>
            </TableCell>

            <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                        label={cat.isActive ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: 12,
                            bgcolor: cat.isActive
                                ? "color-mix(in srgb, #22c55e 15%, transparent)"
                                : "color-mix(in srgb, #ef4444 15%, transparent)",
                            color: cat.isActive ? "#16a34a" : "#dc2626",
                            border: "none",
                        }}
                    />
                    <Tooltip
                        title={cat.isActive ? "Inactive" : "Activate"}
                    >
                        <Switch
                            checked={cat.isActive}
                            onChange={() => onToggle(cat)}
                            size="small"
                            sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "var(--color-primary)",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
                                    bgcolor: "var(--color-primary)",
                                },
                            }}
                        />
                    </Tooltip>
                </Stack>
            </TableCell>

            <TableCell sx={{ textAlign: "left" }}>
                <Tooltip title="Edit">
                    <IconButton
                        size="small"
                        onClick={() => onEdit(cat)}
                        sx={{
                            color: "var(--color-primary)",
                            bgcolor:
                                "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                            mr: 1,
                            "&:hover": {
                                bgcolor:
                                    "color-mix(in srgb, var(--color-primary) 20%, transparent)",
                            },
                        }}
                    >
                        <MdEdit size={18} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        size="small"
                        onClick={() => onDelete(cat)}
                        sx={{
                            color: "#ef4444",
                            bgcolor: "color-mix(in srgb, #ef4444 10%, transparent)",
                            "&:hover": {
                                bgcolor:
                                    "color-mix(in srgb, #ef4444 20%, transparent)",
                            },
                        }}
                    >
                        <MdDeleteOutline size={18} />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default CategoryRow;
