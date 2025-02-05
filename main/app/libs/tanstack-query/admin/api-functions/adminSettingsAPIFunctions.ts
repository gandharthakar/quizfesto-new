import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { CommonAPIResponse, CommonAPIResponseWithZodError } from "@/app/types/commonTypes";
import { QF_AGenSetGetDataType, QF_AGenSetSetPayloadType, QF_APhnSetGetDataType, QF_APhnSetSetPayloadType, QF_GetAdminProfilePhotoType, QF_GetAdminStatsDataType, QF_GetUserInfoDataType, QF_setAdminProfilePhotoPayloadType } from "@/app/types/libs/tanstack-query/admin/adminSettingsType";

export const getAdminStats = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { stats?: QF_GetAdminStatsDataType }>(`/api/admin/stats?token=${token}`)).data;
}

export const getAdminUserInfo = async (token: string) => {
    return (await axiosInstance.get<QF_GetUserInfoDataType & CommonAPIResponse>(`/api/admin/auth-user/get-user?token=${token}`)).data;
}

export const getAdminGeneralSettings = async (token: string) => {
    return (await axiosInstance.get<QF_AGenSetGetDataType & CommonAPIResponse>(`/api/admin/auth-user/settings/general/get?token=${token}`)).data;
}

export const setAdminGeneralSettings = async (payload: QF_AGenSetSetPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/auth-user/settings/general/set`, payload)).data;
}

export const getAdminPhoneSettings = async (token: string) => {
    return (await axiosInstance.get<QF_APhnSetGetDataType & CommonAPIResponse>(`/api/admin/auth-user/settings/phone/get?token=${token}`)).data;
}

export const setAdminPhoneSettings = async (payload: QF_APhnSetSetPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/auth-user/settings/phone/set`, payload)).data;
}

export const getAdminProfilePhoto = async (token: string) => {
    return (await axiosInstance.get<QF_GetAdminProfilePhotoType & CommonAPIResponse>(`/api/admin/auth-user/settings/photo/get?token=${token}`)).data;
}

export const setAdminProfilePhoto = async (payload: QF_setAdminProfilePhotoPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/admin/auth-user/settings/photo/set`, payload)).data;
}

export const removeAdminProfilePhoto = async (payload: { token: string }) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>('/api/admin/auth-user/settings/photo/remove', {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}