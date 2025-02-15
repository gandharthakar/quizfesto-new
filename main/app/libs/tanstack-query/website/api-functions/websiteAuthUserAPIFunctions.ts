import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { CommonAPIResponse, CommonAPIResponseWithZodError } from "@/app/types/commonTypes";
import {
    QF_SetWebAuthUserGenSetPayloadType,
    QF_SetWebAuthUserphnSetPayloadType,
    QF_SetWebAuthUserPhtSetPayloadType,
    QF_WebsiteGetUserInfoDataType,
    QF_WebsiteGetUserStatsDataType
} from "@/app/types/libs/tanstack-query/website/websiteAuthUserTypes";
import { MyParticipationCardDataType, WinnerUserDataType } from "@/app/types/pages/website/user-area/userAreaPageTypes";

export const getWebsiteAuthUserInfo = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { user?: QF_WebsiteGetUserInfoDataType }>(`/api/site/auth-user/get-single-user?token=${token}`)).data;
}

export const getWebsiteAuthUserStats = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { user_stats?: QF_WebsiteGetUserStatsDataType }>(`/api/site/auth-user/get-user-stats?token=${token}`)).data;
}

export const getWebsiteAuthUserParticipation = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { participation_data?: MyParticipationCardDataType[] }>(`/api/site/auth-user/get-my-participation?token=${token}`)).data;
}

export const getWebsiteAuthUserWinnings = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { winner?: WinnerUserDataType }>(`/api/site/auth-user/get-my-winning?token=${token}`)).data;
}

export const setWebsiteAuthUserGeneralSettings = async (payload: QF_SetWebAuthUserGenSetPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/site/auth-user/update-single-user/general`, payload)).data;
}

export const setWebsiteAuthUserPhoneSettings = async (payload: QF_SetWebAuthUserphnSetPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/site/auth-user/update-single-user/phone`, payload)).data;
}

export const setWebsiteAuthUserPhotoSettings = async (payload: QF_SetWebAuthUserPhtSetPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/site/auth-user/update-single-user/profile-photo`, payload)).data;
}