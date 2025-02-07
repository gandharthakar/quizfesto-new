import { CommonAPIResponse, CommonAPIResponseWithZodError } from "@/app/types/commonTypes";
import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { QF_ACreOptionsPayloadType, QF_ADelOptionsPayloadType, QF_ADSOptsPayloadTypes, QF_AGetOptionsDataType, QF_ARAOptsDataType, QF_AUpdOptionsPayloadType } from "@/app/types/libs/tanstack-query/admin/adminOptionsTypes";

export const readAllAdminOptionsBA = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { options_list?: QF_ARAOptsDataType[] }>(`/api/admin/options/bulk-actions/read-all?token=${token}`)).data;
}

export const deleteAllAdminOptionsBA = async (payload: { token: string }) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/options/bulk-actions/delete-all`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const deleteSelectedAdminOptionsBA = async (payload: QF_ADSOptsPayloadTypes) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/options/bulk-actions/delete-selected`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const readSingleOptions = async (payload: QF_ADelOptionsPayloadType) => {
    return (await axiosInstance.get<CommonAPIResponse & { option?: QF_AGetOptionsDataType }>(`/api/admin/options/crud/read?token=${payload.token}&option_id=${payload.option_id}`)).data;
}

export const createNewOptions = async (payload: QF_ACreOptionsPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/options/crud/create`, payload)).data;
}

export const updateSingleOptions = async (payload: QF_AUpdOptionsPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/options/crud/update`, payload)).data;
}

export const deleteSingleOptions = async (payload: QF_ADelOptionsPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/options/crud/delete`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}