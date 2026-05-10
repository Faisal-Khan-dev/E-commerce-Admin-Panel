import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import Topbar from "../components/Topbar/Topbar";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const AdminLayout = () => {
    const isMobile = useMediaQuery("(max-width:900px)");
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
            <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "var(--bg-page)" }}>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: isMobile ? "100%" : "auto",
                    minWidth: 0,
                }}
            >
                <Topbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
                <Box
                    sx={{
                        p: { xs: 2, sm: 3 },
                        flexGrow: 1,
                        overflowY: "auto",
                        minHeight: 0,
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default AdminLayout;