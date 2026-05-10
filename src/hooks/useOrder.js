import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { getOrders, searchOrders, updateOrderStatus } from "../services/order.js";

const useOrders = (page, limit, options) => {
    return useQuery({
        queryKey: ["orders", page],
        queryFn: () => getOrders(page, limit),
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

const useSearchOrder = (query, page, limit) => {
    return useQuery({
        queryKey: ["orders", query, page],
        queryFn: () => searchOrders(query, page, limit),
        refetchOnWindowFocus: false,
        enabled: !!query,
        placeholderData: keepPreviousData,
        retry: false
    })
}

export { useOrders, useUpdateOrderStatus, useSearchOrder };