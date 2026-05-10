import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCustomers, getSingleCustomer, updateCustomer, deleteCustomer } from "../services/customer";

const useCustomers = (search = '') => {
    return useQuery({
        queryKey: ["customers", search],
        queryFn: () => getAllCustomers(search),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false
    });
}

const useGetSingleCustomer = (id) => {
    return useQuery({
        queryKey: ["customer", id],
        queryFn: () => getSingleCustomer(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};

const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateCustomer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        }
    });
}

const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deleteCustomer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        }
    });
}

export { useCustomers, useGetSingleCustomer, useUpdateCustomer, useDeleteCustomer };