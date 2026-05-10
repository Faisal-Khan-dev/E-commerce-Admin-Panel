import api from "../lib/axios";

const getAllProducts = async () => {
    const res = await api.get("/products");
    return res.data;
}

const getProductById = async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
}

const addProduct = async (data) => {
    const res = await api.post("/products", data);
    return res.data;
}

const deleteProduct = async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
}

const updateProduct = async ({ id, formData }) => {
    const res = await api.put(`/products/${id}`, formData);
    return res.data;
}

export { getAllProducts, getProductById, addProduct, deleteProduct, updateProduct };