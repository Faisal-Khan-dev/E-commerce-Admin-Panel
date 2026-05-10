import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import PageLoader from "../components/loaders/PageLoader";

const ProtectedRoute = () => {
    const [isAuthed] = useState(() => {
        const token = localStorage.getItem("token");
        return !!token;
    });

    if (isAuthed === null) return <PageLoader />;
    if (!isAuthed) return <Navigate to="/login" replace />;

    return <Outlet />;
}

export default ProtectedRoute;