import { CommonAPIResponse } from "@/app/types/commonTypes";
import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { QF_ADelSingleWinnerPayloadType, QF_ARAWinnersDataType, QF_AUpdSingleWinnerPayloadType } from "@/app/types/libs/tanstack-query/admin/adminWinnersTypes";

export const readAllAdminWinnersBA = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { winners?: QF_ARAWinnersDataType[] }>(`/api/admin/winners/bulk-actions/read-all?token=${token}`)).data;
}

export const deleteAllAdminWinnersBA = async (payload: { token: string }) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/winners/bulk-actions/remove-all`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const findAllAdminWinnersBA = async (payload: { token: string }) => {
    //eslint-disable-next-line
    return (await axiosInstance.post<CommonAPIResponse & { winners?: any[] }>(`/api/admin/winners/crud/find`, payload)).data;
}

export const updateSingleWinner = async (payload: QF_AUpdSingleWinnerPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/admin/winners/crud/update`, payload)).data;
}

export const deleteSingleWinner = async (payload: QF_ADelSingleWinnerPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/winners/crud/remove`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}