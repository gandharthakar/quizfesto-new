import { CommonAPIResponse } from "@/app/types/commonTypes";
import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { QF_ACreUpdPrizesPayloadType, QF_ADelPrizePayloadType, QF_AGetPrizeDataType, QF_AGetPrizePayloadType } from "@/app/types/libs/tanstack-query/admin/adminPrizesTypes";

export const readSinglePrize = async (payload: QF_AGetPrizePayloadType) => {
    return (await axiosInstance.get<CommonAPIResponse & QF_AGetPrizeDataType>(`/api/admin/prizes/read?token=${payload.token}&prize_type=${payload.prize_type}`)).data;
}

export const createUpdateSinglePrize = async (payload: QF_ACreUpdPrizesPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/admin/prizes/create-update`, payload)).data;
}

export const deleteSinglePrize = async (payload: QF_ADelPrizePayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/prizes/delete`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}