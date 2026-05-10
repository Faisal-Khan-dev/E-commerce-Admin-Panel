import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, addProduct, deleteProduct, updateProduct, getProductById } from "../services/product";

const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
        refetchOnWindowFocus: false,
        select: (data) => data?.products || [],
    });
}

const useProduct = (id) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: !!id,
        select: (data) => data?.product || {},
    });
}

const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] })
    });
}

export { useProducts, useProduct, useCreateProduct, useDeleteProduct, useUpdateProduct };