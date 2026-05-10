import api from "../lib/axios";

export const getAllCategories = async () => {
    const res = await api.get("/categories");
    return res.data;
};

export const getActiveCategories = async () => {
    const res = await api.get("/categories?isActive=true");
    return res.data;
};

export const createCategory = async (formData) => {
    const res = await api.post("/categories", formData);
    return res.data;
};

export const updateCategory = async (id, formData) => {
    const res = await api.put(`/categories/${id}`, formData);
    return res.data;
};

export const deleteCategory = async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
};