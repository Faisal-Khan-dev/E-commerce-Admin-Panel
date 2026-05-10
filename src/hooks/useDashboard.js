import { getDashboardStats } from "../services/dashboard";
import { useQuery } from "@tanstack/react-query";

const useDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboardStats,
        select: (data) => data.data,
        refetchOnWindowFocus: false
    });
}

export default useDashboard;