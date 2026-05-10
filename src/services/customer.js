import api from "../lib/axios";

const getAllCustomers = async (search = '') => {
    const res = await api.get(`/users/all?search=${search}`);
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