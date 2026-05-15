import api from "../lib/axios";

const loginAdmin = async (data) => {
    const res = await api.post("/auth", data);
    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
    }
    return res.data;
}

const logoutAdmin = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    return { success: true };
}

const getMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found");
    }

    // Decode JWT payload to extract userId (browser environment)
    const parts = token.split('.');
    if (parts.length < 2) throw new Error('Invalid token');
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const userId = payload.userId || payload.userId;
    if (!userId) throw new Error('User ID not found in token');

    const res = await api.get(`/users/${userId}`);
    return res.data.user || res.data;
}

const changePassword = async (data) => {
    const res = await api.post("/users/change-password", data);
    return res.data;
}

export { loginAdmin, logoutAdmin, getMe, changePassword };