import { CommonAPIResponse } from "@/app/types/commonTypes";
import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { QF_ACreCatPayloadType, QF_ADSCatsPayloadType, QF_AGetHomeCatsDataType, QF_AGetSingleCatPayloadType, QF_ASetHomeCatsPayloadType, QF_AUpdCatPayloadType } from "@/app/types/libs/tanstack-query/admin/adminCategoriesTypes";
import { CategoriesType } from "@/app/types/components/website/componentsTypes";

export const readAllAdminCategoriesBA = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { cat_data?: CategoriesType[] }>(`/api/admin/categories/bulk-actions/read-all?token=${token}`)).data;
}

export const deleteAllAdminCategoriesBA = async (payload: { token: string }) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/categories/bulk-actions/delete-all`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const deleteSelectedAdminCategoriesBA = async (payload: QF_ADSCatsPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/categories/bulk-actions/delete-selected`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const readSingleCategory = async (payload: QF_AGetSingleCatPayloadType) => {
    return (await axiosInstance.get<CommonAPIResponse & { cat_data?: CategoriesType }>(`/api/admin/categories/crud/read?token=${payload.token}&category_id=${payload.category_id}`)).data;
}

export const createNewCategory = async (payload: QF_ACreCatPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/admin/categories/crud/create`, payload)).data;
}

export const updateSingleCategory = async (payload: QF_AUpdCatPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/admin/categories/crud/update`, payload)).data;
}

export const deleteSingleCategory = async (payload: QF_AGetSingleCatPayloadType) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/categories/crud/delete`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}

export const readAllAdminHomeCategoriesBA = async (token: string) => {
    return (await axiosInstance.get<CommonAPIResponse & QF_AGetHomeCatsDataType>(`/api/admin/categories/home-categories/read?token=${token}`)).data;
}

export const updateAllAdminHomeCategoriesBA = async (payload: QF_ASetHomeCatsPayloadType) => {
    return (await axiosInstance.post<CommonAPIResponse>(`/api/admin/categories/home-categories/create-update`, payload)).data;
}

export const deleteAllAdminHomeCategoriesBA = async (payload: { token: string }) => {
    const resp = await axiosInstance.delete<CommonAPIResponse>(`/api/admin/categories/home-categories/clear`, {
        data: JSON.stringify({ ...payload }),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((pr) => pr.data);

    return resp;
}