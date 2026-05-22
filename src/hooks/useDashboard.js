import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboard";

const useDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboardStats,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2,
    });
}

export default useDashboard;