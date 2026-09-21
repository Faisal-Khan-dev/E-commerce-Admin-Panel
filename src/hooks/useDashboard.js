import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboard";

const useDashboard = (month = "") => {
    return useQuery({
        queryKey: ["dashboard", month],
        queryFn: () => getDashboardStats(month),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2,
    });
};

export default useDashboard;