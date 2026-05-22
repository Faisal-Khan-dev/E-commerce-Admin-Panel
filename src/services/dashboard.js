import api from "../lib/axios";

const getDashboardStats = async () => {
    const res = await api.get("/orders/dashboard");
    return res.data;
}

export { getDashboardStats };