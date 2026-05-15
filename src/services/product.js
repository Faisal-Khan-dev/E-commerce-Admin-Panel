import api from "../lib/axios";

const getAllProducts = async (search = "", category = "", minPrice = "", maxPrice = "", sort = "newest", page = 1, limit = 10) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sort) params.append("sort", sort);
    params.append("page", page);
    params.append("limit", limit);
    
    const res = await api.get(`/products/all?${params.toString()}`);
    return res.data;
}

const getProductBySlug = async (slug) => {
    const res = await api.get(`/products/${slug}`);
    return res.data.product;
}

const addProduct = async (formData) => {
    const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
}

const deleteProduct = async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
}

const updateProduct = async ({ id, formData }) => {
    const res = await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
}

export { getAllProducts, getProductBySlug, addProduct, deleteProduct, updateProduct };