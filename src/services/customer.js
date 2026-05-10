import api from "../lib/axios";

const getAllCustomers = async (page, limit) => {
    const res = await api.get(`/customers?page=${page}&limit=${limit}`);
    return res.data;
}

const updateCustomer = async (id, data) => {
    const res = await api.patch(`/customers/${id}/status`, data);
    return res.data;
}


const searchCustomer = async (query, page = 1, limit = 10) => {
    const res = await api.get(`/customers/search?query=${query}&page=${page}&limit=${limit}`);
    return res.data;
}

export { getAllCustomers, updateCustomer, searchCustomer };