import api from "../lib/axios";

const getUser = async (userId) => {
    const res = await api.get(`/users/${userId}`);
    return res.data.user || res.data;
}

const updateUser = async (userId, data) => {
    const res = await api.put(`/users/${userId}`, data);
    return res.data.user || res.data;
}

export { getUser, updateUser };
