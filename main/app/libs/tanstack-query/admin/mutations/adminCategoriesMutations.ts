import { TQ_CBtype } from "@/app/types/commonTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { createNewCategory, deleteAllAdminCategoriesBA, deleteSelectedAdminCategoriesBA, deleteSingleCategory, updateSingleCategory } from "@/app/libs/tanstack-query/admin/api-functions/adminCategoriesAPIFunctions";
import { QF_ACreCatPayloadType, QF_ADSCatsPayloadType, QF_AGetSingleCatPayloadType, QF_AUpdCatPayloadType } from "@/app/types/libs/tanstack-query/admin/adminCategoriesTypes";

export const useDeleteAllAdminCategories = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteAllAdminCategories"],
        mutationFn: (payload: { token: string }) => deleteAllAdminCategoriesBA(payload),
        onSuccess(data) {
            if (data.success) {
                if (callbacks?.onSuccessCB) {
                    callbacks.onSuccessCB(data);
                }
            } else {
                if (callbacks?.errorCB) {
                    callbacks.errorCB(data);
                }
            }
        },
        onError(error: (Error & { response: AxiosResponse })) {
            const resp = error.response.data;
            if (!resp.success) {
                if (callbacks?.onErrorCB) {
                    callbacks.onErrorCB(resp);
                }
            }
        },
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({
                    queryKey: ["readAllAdminCategories", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useDeleteSelectedAdminCategories = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteSelectedAdminCategories"],
        mutationFn: (payload: QF_ADSCatsPayloadType) => deleteSelectedAdminCategoriesBA(payload),
        onSuccess(data) {
            if (data.success) {
                if (callbacks?.onSuccessCB) {
                    callbacks.onSuccessCB(data);
                }
            } else {
                if (callbacks?.errorCB) {
                    callbacks.errorCB(data);
                }
            }
        },
        onError(error: (Error & { response: AxiosResponse })) {
            const resp = error.response.data;
            if (!resp.success) {
                if (callbacks?.onErrorCB) {
                    callbacks.onErrorCB(resp);
                }
            }
        },
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({
                    queryKey: ["readAllAdminCategories", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useCreateNewCategory = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createNewCategory"],
        mutationFn: (payload: QF_ACreCatPayloadType) => createNewCategory(payload),
        onSuccess(data) {
            if (data.success) {
                if (callbacks?.onSuccessCB) {
                    callbacks.onSuccessCB(data);
                }
            } else {
                if (callbacks?.errorCB) {
                    callbacks.errorCB(data);
                }
            }
        },
        onError(error: (Error & { response: AxiosResponse })) {
            const resp = error.response.data;
            if (!resp.success) {
                if (callbacks?.onErrorCB) {
                    callbacks.onErrorCB(resp);
                }
            }
        },
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({
                    queryKey: ["readAllAdminCategories", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useUpdateSingleCategory = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateSingleCategory"],
        mutationFn: (payload: QF_AUpdCatPayloadType) => updateSingleCategory(payload),
        onSuccess(data) {
            if (data.success) {
                if (callbacks?.onSuccessCB) {
                    callbacks.onSuccessCB(data);
                }
            } else {
                if (callbacks?.errorCB) {
                    callbacks.errorCB(data);
                }
            }
        },
        onError(error: (Error & { response: AxiosResponse })) {
            const resp = error.response.data;
            if (!resp.success) {
                if (callbacks?.onErrorCB) {
                    callbacks.onErrorCB(resp);
                }
            }
        },
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({
                    queryKey: ["readAllAdminCategories", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["readSingleCategory", callbacks?.category_id]
                });
            }
        },
    });
};

export const useDeleteSingleCategory = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteSingleCategory"],
        mutationFn: (payload: QF_AGetSingleCatPayloadType) => deleteSingleCategory(payload),
        onSuccess(data) {
            if (data.success) {
                if (callbacks?.onSuccessCB) {
                    callbacks.onSuccessCB(data);
                }
            } else {
                if (callbacks?.errorCB) {
                    callbacks.errorCB(data);
                }
            }
        },
        onError(error: (Error & { response: AxiosResponse })) {
            const resp = error.response.data;
            if (!resp.success) {
                if (callbacks?.onErrorCB) {
                    callbacks.onErrorCB(resp);
                }
            }
        },
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({
                    queryKey: ["readAllAdminCategories", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};