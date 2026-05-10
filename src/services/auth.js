import api from "../lib/axios";

const loginAdmin = async (data) => {
    const res = await api.post("/auth", data);
    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
    }
    return res.data;
}

const logoutAdmin = async () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    return { success: true };
}

const getMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token");
    }
    return { success: true };
}

export { loginAdmin, logoutAdmin, getMe };