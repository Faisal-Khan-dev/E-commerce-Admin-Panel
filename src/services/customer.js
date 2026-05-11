import api from "../lib/axios";

const getAllCustomers = async (page = 1, limit = 10, search = '', status = '', sort = 'newest') => {
    let url = `/users/all?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;
    if (sort) url += `&sort=${sort}`;
    
    const res = await api.get(url);
    return res.data;
}

const getSingleCustomer = async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
}

const createCustomer = async (data) => {
    const res = await api.post(`/users`, data);
    return res.data;
}

const updateCustomer = async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
}

const deleteCustomer = async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
}

export { getAllCustomers, getSingleCustomer, createCustomer, updateCustomer, deleteCustomer };