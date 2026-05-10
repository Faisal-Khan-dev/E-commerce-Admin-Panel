import api from "../lib/axios";

const getDashboardStats = async () => {
    // const res = await api.get("/dashboard");
    // return res.data;
    return {
        totalSales: 0,
        deliveredOrders: 0,
        totalProducts: 0,
        monthlyRevenue: [],
        orderStatusBreakdown: {},
        recentOrders: [],
        lowStockProducts: [],
    };
}

export { getDashboardStats };