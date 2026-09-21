import api from "../lib/axios";

const getDashboardStats = async (month = "") => {
    const params = month ? { month } : {};
    const res = await api.get("/orders/dashboard", { params });
    return res.data;
};

export { getDashboardStats };