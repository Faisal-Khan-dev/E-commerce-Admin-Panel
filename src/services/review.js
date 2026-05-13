import api from "../lib/axios";

const getProductReviews = async (slugWithParams) => {
    const res = await api.get(`/reviews/${slugWithParams}`);
    return res.data;
}

export { getProductReviews };
