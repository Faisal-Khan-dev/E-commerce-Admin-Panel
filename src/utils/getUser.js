
import { jwtDecode } from "jwt-decode";

export const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        let decoded = jwtDecode(token);
        return decoded;
    } catch (err) {
        return null;
    }
}