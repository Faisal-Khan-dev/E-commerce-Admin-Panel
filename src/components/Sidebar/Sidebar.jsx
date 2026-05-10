import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import { MdLogout, MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import menuItems from "./menuItems";

const Sidebar = ({ open, setOpen, isMobile }) => {
    const navigate = useNavigate();
    const { mutate, isPending } = useLogout();

    const handleLogout = () => {
        mutate(null, {
            onSuccess: (res) => {
                toast.success(res.message || "Logged out");
                navigate("/login");
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Logout failed");
            }
        });
    }

    return (
        <>
            <Box
                sx={{
                    width: isMobile ? 260 : (open ? 260 : 70),
                    height: "100vh",
                    bgcolor: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    display: "flex",
                    flexDirection: "column",
                    transition: isMobile ? "transform 0.3s ease" : "width 0.3s ease",
                    position: isMobile ? "fixed" : "relative",
                    top: 0,
                    left: 0,
                    zIndex: isMobile ? 1200 : "auto",
                    transform: isMobile ? (open ? "translateX(0)" : "translateX(-100%)") : "none",
                    boxShadow: isMobile && open ? "0 8px 24px rgba(2, 6, 23, 0.15)" : "none",
                    borderRight: "1px solid var(--border-color)",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        px: 2,
                        py: open ? 1.46 : 2.1,
                        borderBottom: "2px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: open ? "space-between" : "center",
                    }}
                >
                    {open && (
                        <Typography variant="h6" fontWeight="bold" noWrap>
                            Admin Panel
                        </Typography>
                    )}

                    <Box
                        onClick={() => setOpen(!open)}
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {open ? <MdKeyboardDoubleArrowLeft size={22} /> : <MdKeyboardDoubleArrowRight size={22} />}
                    </Box>
                </Box>

                {/* Menu */}
                <List sx={{ flex: 1, px: 1, mt: 2 }}>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                            sx={{
                                my: 0.5,
                                px: 0.7,
                                py: open ? 1 : 1.3,
                                justifyContent: open ? "flex-start" : "center",
                                "&:hover": {
                                    backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                                },
                                "&.active": {
                                    bgcolor: "color-mix(in srgb, var(--color-accent) 15%, transparent)",
                                    borderLeft: open ? "4px solid var(--color-accent)" : "none",
                                    color: "var(--text-primary)",
                                },
                                "&.active .MuiListItemIcon-root": {
                                    color: "var(--color-accent)",
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: item.color || "var(--color-accent)",
                                    minWidth: open ? 40 : "auto",
                                    justifyContent: "center",
                                    fontSize: item.fontSize || 18,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>

                            {open && <ListItemText primaryTypographyProps={{ sx: { fontSize: "14px" } }} primary={item.label} />}
                        </ListItemButton>
                    ))}
                </List>

                <Divider sx={{ bgcolor: "var(--border-color)" }} />

                {/* Logout */}
                <List>
                    <ListItemButton
                        onClick={handleLogout}
                        disabled={isPending}
                        sx={{
                            mx: 1.5,
                            borderRadius: 2,
                            justifyContent: open ? "flex-start" : "center",
                            opacity: isPending ? 0.6 : 1,
                            "&:hover": {
                                bgcolor: "rgba(255, 107, 107, 0.15)",
                            }
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: "#ff6b6b",
                                minWidth: open ? 40 : "auto",
                                justifyContent: "center",
                                fontWeight: 800
                            }}
                        >
                            <MdLogout />
                        </ListItemIcon>

                        {open && (
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{
                                    sx: { color: "#ff6b6b", fontWeight: 500 },
                                }}
                            />
                        )}
                    </ListItemButton>
                </List>
            </Box >

            {/* Mobile overlay */}
            {isMobile && open && (
                <Box
                    onClick={() => setOpen(false)}
                    sx={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1100,
                        bgcolor: "rgba(15, 23, 42, 0.25)",
                        backdropFilter: "blur(2px)",
                    }}
                />
            )}
        </>
    );
};

export default Sidebar;