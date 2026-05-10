import { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import TopbarSettings from "../components/Settings/TopbarSettings";
import CarouselSettings from "../components/Settings/CarouselSettings";
import FooterSettings from "../components/Settings/FooterSettings";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`web-settings-tabpanel-${index}`}
            aria-labelledby={`web-settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const WebSettings = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_, newValue) => setValue(newValue);

    return (
        <Box sx={{ width: "100%", pb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-heading)",
                        lineHeight: 1.2,
                    }}
                >
                    Web Content Settings
                </Typography>
            </Box>

            <Paper
                sx={{
                    overflow: "hidden",
                    border: "1.5px solid var(--border-color)",
                }}
                elevation={0}
            >
                <Box sx={{ borderBottom: 1, borderColor: 'var(--border-color)', px: 2, pt: 1 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="web settings tabs"
                    >
                        <Tab label="Topbar" />
                        <Tab label="Hero Carousel" />
                        <Tab label="Footer" />
                    </Tabs>
                </Box>

                <Box sx={{ px: { xs: 2, sm: 4 }, minHeight: 400 }}>
                    <TabPanel value={value} index={0}>
                        <TopbarSettings />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <CarouselSettings />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <FooterSettings />
                    </TabPanel>
                </Box>
            </Paper>
        </Box>
    );
};

export default WebSettings;
