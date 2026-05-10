import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCustomers, updateCustomer, searchCustomer } from "../services/customer";

const useCustomers = (page, limit) => {
    return useQuery({
        queryKey: ["customers", page],
        queryFn: () => getAllCustomers(page, limit),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}

const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateCustomer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        }
    });
}

const useSearchCustomer = (query, page, limit) => {
    return useQuery({
        queryKey: ["customers", query, page],
        queryFn: () => searchCustomer(query, page, limit),
        enabled: Boolean(query),
        staleTime: 2 * 1000 * 60,
        placeholderData: keepPreviousData
    })
}

export { useCustomers, useUpdateCustomer, useSearchCustomer };