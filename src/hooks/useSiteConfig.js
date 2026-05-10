import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSiteConfig, updateSiteConfig } from "../services/siteConfig";

const useSiteConfig = () => {
    return useQuery({
        queryKey: ["site-config"],
        queryFn: getSiteConfig,
        select: (data) => data?.config || {},
    });
};

const useUpdateSiteConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSiteConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["site-config"] });
        },
    });
};

export { useSiteConfig, useUpdateSiteConfig };