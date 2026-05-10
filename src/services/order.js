import api from "../lib/axios"

const getOrders = async (page, limit) => {
    const res = await api.get(`/orders?page=${page}&limit=${limit}`);
    return res.data;
}

const updateOrderStatus = async ({ id, status }) => {
    const res = await api.put(`/orders/${id}`, { status });
    return res.data;
}

const searchOrders = async (query, page, limit) => {
    const res = await api.get(`/orders/search?query=${query}&page=${page}&limit=${limit}`);
    return res.data;
}

export { getOrders, updateOrderStatus, searchOrders };