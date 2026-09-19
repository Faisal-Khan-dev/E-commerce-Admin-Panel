import AppRoutes from "./routes/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";
import React from "react";

const App = () => {
    return (
        <>
            <AppRoutes />
            <Toaster />
        </>
    );
};

export default App;