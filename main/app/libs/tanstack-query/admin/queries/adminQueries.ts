import { TQ_DefaultConfig } from "@/app/libs/helpers/helperFunctions";
import { useQuery } from "@tanstack/react-query";
import { getAdminGeneralSettings, getAdminPhoneSettings, getAdminProfilePhoto, getAdminStats, getAdminUserInfo } from "@/app/libs/tanstack-query/admin/api-functions/adminSettingsAPIFunctions";
import { readAllAdminQuizesBA, readSingleQuiz } from "@/app/libs/tanstack-query/admin/api-functions/adminQuizAPIFunctions";
import { QF_AGetQuizPayloadType } from "@/app/types/libs/tanstack-query/admin/adminQuizTypes";

// Admin Settings Queries.

export const useGetAdminUserInfo = (token: string) => {
    return useQuery({
        queryKey: ["getAdminUserInfo", token],
        queryFn: () => getAdminUserInfo(token),
        ...TQ_DefaultConfig
    });
}

export const useGetAdminGeneralSettings = (token: string) => {
    return useQuery({
        queryKey: ["getAdminGeneralSettings", token],
        queryFn: () => getAdminGeneralSettings(token),
        ...TQ_DefaultConfig
    });
}

export const useGetAdminPhoneSettings = (token: string) => {
    return useQuery({
        queryKey: ["getAdminPhoneSettings", token],
        queryFn: () => getAdminPhoneSettings(token),
        ...TQ_DefaultConfig
    });
}

export const useGetAdminProfilePhoto = (token: string) => {
    return useQuery({
        queryKey: ["getAdminProfilePhoto", token],
        queryFn: () => getAdminProfilePhoto(token),
        ...TQ_DefaultConfig
    });
}

export const useGetAdminStats = (token: string) => {
    return useQuery({
        queryKey: ["getAdminStats", token],
        queryFn: () => getAdminStats(token),
        ...TQ_DefaultConfig
    });
}

// Admin Quiz Queries.

export const useReadAllAdminQuizes = (token: string) => {
    return useQuery({
        queryKey: ["readAllAdminQuizes", token],
        queryFn: () => readAllAdminQuizesBA(token),
        ...TQ_DefaultConfig
    });
}

export const useReadSingleQuiz = (payload: QF_AGetQuizPayloadType) => {
    return useQuery({
        queryKey: ["readSingleQuiz", payload.token],
        queryFn: () => readSingleQuiz(payload),
        ...TQ_DefaultConfig
    });
}