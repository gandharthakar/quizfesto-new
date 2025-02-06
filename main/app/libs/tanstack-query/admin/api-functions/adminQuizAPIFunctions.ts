import { CommonAPIResponse, CommonAPIResponseWithZodError } from "@/app/types/commonTypes";
import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { QF_ACreateQuizPayloadType, QF_ADSQuizesPayloadType, QF_AGetQuizDataType, QF_AGetQuizPayloadType, QF_ARAQuizesDataType } from "@/app/types/libs/tanstack-query/admin/adminQuizTypes";

export const readAllAdminQuizesBA = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { quizes?: QF_ARAQuizesDataType[] }>(`/api/admin/quizes/bulk-actions/read-all?token=${token}`)).data;
}

export const deleteAllAdminQuizesBA = async (payload: { token: string }) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/quizes/bulk-actions/delete-all`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const deleteSelectedAdminQuizesBA = async (payload: QF_ADSQuizesPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/quizes/bulk-actions/delete-selected`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const readSingleQuiz = async (payload: QF_AGetQuizPayloadType) => {
    return (await axiosInstance.get<CommonAPIResponseWithZodError & { quiz?: QF_AGetQuizDataType }>(`/api/admin/quizes/crud/read?token=${payload.token}&quiz_id=${payload.quiz_id}`)).data;
}

export const createNewQuiz = async (payload: QF_ACreateQuizPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/quizes/crud/create`, payload)).data;
}

export const updateSingleQuiz = async (payload: QF_ACreateQuizPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/quizes/crud/update`, payload)).data;
}

export const createDuplicateQuiz = async (payload: QF_AGetQuizPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/admin/quizes/crud/create-duplicate`, payload)).data;
}

export const deleteSingleQuiz = async (payload: QF_AGetQuizPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/quizes/crud/delete`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}
