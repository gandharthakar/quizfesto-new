import { TQ_DefaultConfig } from "@/app/libs/helpers/helperFunctions";
import { useQuery } from "@tanstack/react-query";
import {
    getFeHomeCats,
    getPublicPrizes,
    getPublicQuizzesByCategory,
    getPublicQuizzesOnlyInfo,
    getPublicSingleQuizzesOnlyInfo,
    getPublicWinners,
} from "@/app/libs/tanstack-query/website/api-functions/websiteCommonAPIFunctions";
import {
    getWebsiteAuthUserInfo,
    getWebsiteAuthUserParticipation,
    getWebsiteAuthUserStats,
    getWebsiteAuthUserWinnings
} from "@/app/libs/tanstack-query/website/api-functions/websiteAuthUserAPIFunctions";

export const useGetHomeFeCats = () => {
    return useQuery({
        queryKey: ["getHomeFeCats"],
        queryFn: () => getFeHomeCats(),
        ...TQ_DefaultConfig
    });
}

export const useGetPublicPrizes = () => {
    return useQuery({
        queryKey: ["getPublicPrizes"],
        queryFn: () => getPublicPrizes(),
        ...TQ_DefaultConfig
    });
}

export const useGetPublicWinners = () => {
    return useQuery({
        queryKey: ["getPublicWinners"],
        queryFn: () => getPublicWinners(),
        ...TQ_DefaultConfig
    });
}

export const useGetPublicQuizzesOnlyInfo = () => {
    return useQuery({
        queryKey: ["getPublicQuizzesOnlyInfo"],
        queryFn: () => getPublicQuizzesOnlyInfo(),
        ...TQ_DefaultConfig
    });
}

export const useGetPublicSingleQuizzesOnlyInfo = (quiz_id: string) => {
    return useQuery({
        queryKey: ["getPublicSingleQuizzesOnlyInfo", quiz_id],
        queryFn: () => getPublicSingleQuizzesOnlyInfo(quiz_id),
        ...TQ_DefaultConfig
    });
}

export const useGetPublicQuizzesByCategory = (category_slug: string) => {
    return useQuery({
        queryKey: ["getPublicQuizzesByCategory", category_slug],
        queryFn: () => getPublicQuizzesByCategory(category_slug),
        ...TQ_DefaultConfig
    });
}

export const useGetWebsiteAuthUserInfo = (token: string) => {
    return useQuery({
        queryKey: ["getWebsiteAuthUserInfo", token],
        queryFn: () => getWebsiteAuthUserInfo(token),
        ...TQ_DefaultConfig
    });
}

export const useGetWebsiteAuthUserStats = (token: string) => {
    return useQuery({
        queryKey: ["getWebsiteAuthUserStats", token],
        queryFn: () => getWebsiteAuthUserStats(token),
        ...TQ_DefaultConfig
    });
}

export const useGetWebsiteAuthUserParticipation = (token: string) => {
    return useQuery({
        queryKey: ["getWebsiteAuthUserParticipation", token],
        queryFn: () => getWebsiteAuthUserParticipation(token),
        ...TQ_DefaultConfig
    });
}

export const useGetWebsiteAuthUserWinning = (token: string) => {
    return useQuery({
        queryKey: ["getWebsiteAuthUserWinning", token],
        queryFn: () => getWebsiteAuthUserWinnings(token),
        ...TQ_DefaultConfig
    });
}
