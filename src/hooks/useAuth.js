import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginAdmin, logoutAdmin, getMe } from "../services/auth";

const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginAdmin,
        onSuccess: (data) => {
            queryClient.setQueryData(["me"], data.user);
        }
    });
}

const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logoutAdmin,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["me"] });
        }
    });
}

const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        refetchOnWindowFocus: false,
        queryFn: getMe,
        retry: false,
        staleTime: Infinity
    });
}

export { useLogin, useLogout, useMe };