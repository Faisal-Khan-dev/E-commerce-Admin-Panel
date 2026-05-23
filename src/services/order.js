import api from "../lib/axios"

const getOrders = async (page, limit, search = '', status = '', sort = 'newest') => {
    let url = `/orders/all?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;
    if (sort) url += `&sort=${sort}`;
    
    const res = await api.get(url);
    return res.data;
}

const updateOrderStatus = async ({ id, status }) => {
    const res = await api.patch(`/orders/${id}/status`, { 
        status,
        shippingStatus: status
    });
    return res.data;
}

export { getOrders, updateOrderStatus };