import { CommonAPIResponse, CommonAPIResponseWithZodError } from "@/app/types/commonTypes";
import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { QF_ACreUserDataType, QF_ADSUsersPayloadType, QF_AGetSingleUserDataType, QF_AGetSingleUserPayloadType, QF_AGetUsersDataType, QF_ASetSingleUserPayloadType } from "@/app/types/libs/tanstack-query/admin/adminUsersTypes";

export const readAllAdminUsersBA = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { users?: QF_AGetUsersDataType[] }>(`/api/admin/users/bulk-actions/read-all?token=${token}`)).data;
}

export const deleteAllAdminUsersBA = async (payload: { token: string }) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/users/bulk-actions/delete-all`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const deleteSelectedAdminUsersBA = async (payload: QF_ADSUsersPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/users/bulk-actions/delete-selected`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const readSingleUser = async (payload: QF_AGetSingleUserPayloadType) => {
    return (await axiosInstance.get<CommonAPIResponse & { user?: QF_AGetSingleUserDataType }>(`/api/admin/users/crud/read?token=${payload.token}&uid=${payload.uid}`)).data;
}

export const createNewUser = async (payload: QF_ACreUserDataType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/users/crud/create`, payload)).data;
}

export const updateSingleUser = async (payload: QF_ASetSingleUserPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/users/crud/update`, payload)).data;
}

export const deleteSingleUser = async (payload: QF_AGetSingleUserPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/users/crud/delete`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}