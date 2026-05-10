import api from "../lib/axios";

const getSiteConfig = async () => {
    const res = await api.get("/site-config");
    return res.data;
}

const updateSiteConfig = async (data) => {
    const res = await api.put("/site-config", data);
    return res.data;
}

export { getSiteConfig, updateSiteConfig };