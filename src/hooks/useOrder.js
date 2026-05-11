import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { getOrders, updateOrderStatus } from "../services/order.js";

const useOrders = (page, limit, search = '', status = '', sort = 'newest', options) => {
    return useQuery({
        queryKey: ["orders", page, search, status, sort],
        queryFn: () => getOrders(page, limit, search, status, sort),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        ...options
    });
}

const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
    });
}

export { useOrders, useUpdateOrderStatus };