import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, getProductBySlug, addProduct, deleteProduct, updateProduct } from "../services/product";

const useProducts = (search = "", category = "", minPrice = "", maxPrice = "", sort = "newest", page = 1, limit = 10) => {
    return useQuery({
        queryKey: ["products", search, category, minPrice, maxPrice, sort, page, limit],
        queryFn: () => getAllProducts(search, category, minPrice, maxPrice, sort, page, limit),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
}

const useProduct = (slug) => {
    return useQuery({
        queryKey: ["product", slug],
        queryFn: () => getProductBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
}

export { useProducts, useProduct, useCreateProduct, useDeleteProduct, useUpdateProduct };