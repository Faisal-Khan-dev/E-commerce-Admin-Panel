import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCategories, getActiveCategories, createCategory, updateCategory, deleteCategory } from "../services/category";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        select: (data) => data?.categories || [],
    });
};

export const useActiveCategories = () => {
    return useQuery({
        queryKey: ["categories", "active"],
        queryFn: getActiveCategories,
        select: (data) => data?.categories || [],
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }) => updateCategory(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};