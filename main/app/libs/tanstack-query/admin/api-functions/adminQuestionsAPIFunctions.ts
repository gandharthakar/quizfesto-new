import { CommonAPIResponse, CommonAPIResponseWithZodError } from "@/app/types/commonTypes";
import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { QF_ASingleQuesPayloadType, QF_ADSQuestionsPayloadType, QF_ACreQuesPayloadType, QF_AGetQuestionDataType } from "@/app/types/libs/tanstack-query/admin/adminQuestionType";
import { AdminQuestionDataType } from "@/app/types/components/admin/componentsTypes";

export const readAllAdminQuestionsBA = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { questions?: AdminQuestionDataType[] }>(`/api/admin/questions/bulk-actions/read-all?token=${token}`)).data;
}

export const deleteAllAdminQuestionsBA = async (payload: { token: string }) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/questions/bulk-actions/delete-all`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const deleteSelectedAdminQuestionsBA = async (payload: QF_ADSQuestionsPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/questions/bulk-actions/delete-selected`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const readSingleQuestion = async (payload: QF_ASingleQuesPayloadType) => {
    return (await axiosInstance.get<CommonAPIResponse & { question?: QF_AGetQuestionDataType }>(`/api/admin/questions/crud/read?token=${payload.token}&question_id=${payload.question_id}`)).data;
}

export const createNewQuestion = async (payload: QF_ACreQuesPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/questions/crud/create`, payload)).data;
}

export const updateSingleQuestion = async (payload: QF_ACreQuesPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponseWithZodError>(`/api/admin/questions/crud/update`, payload)).data;
}

export const createDuplicateQuestion = async (payload: QF_ASingleQuesPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/admin/questions/crud/create-duplicate`, payload)).data;
}

export const deleteSingleQuestion = async (payload: QF_ASingleQuesPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/questions/crud/delete`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}