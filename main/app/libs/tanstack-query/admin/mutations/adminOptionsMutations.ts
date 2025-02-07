import { TQ_CBtype } from "@/app/types/commonTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { createNewOptions, deleteAllAdminOptionsBA, deleteSelectedAdminOptionsBA, deleteSingleOptions, updateSingleOptions } from "@/app/libs/tanstack-query/admin/api-functions/adminOptionsAPIFunctions";
import { QF_ACreOptionsPayloadType, QF_ADelOptionsPayloadType, QF_ADSOptsPayloadTypes, QF_AUpdOptionsPayloadType } from "@/app/types/libs/tanstack-query/admin/adminOptionsTypes";

export const useDeleteAllAdminOptions = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteAllAdminOptions"],
        mutationFn: (payload: { token: string }) => deleteAllAdminOptionsBA(payload),
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
                    queryKey: ["readAllAdminOptions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useDeleteSelectedAdminOptions = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteSelectedAdminOptions"],
        mutationFn: (payload: QF_ADSOptsPayloadTypes) => deleteSelectedAdminOptionsBA(payload),
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
                    queryKey: ["readAllAdminOptions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useCreateNewOptions = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createNewOptions"],
        mutationFn: (payload: QF_ACreOptionsPayloadType) => createNewOptions(payload),
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
                    queryKey: ["readAllAdminOptions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useUpdateSingleOptions = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateSingleOptions"],
        mutationFn: (payload: QF_AUpdOptionsPayloadType) => updateSingleOptions(payload),
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
                    queryKey: ["readAllAdminOptions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["readSingleOptions", callbacks?.option_id]
                });
            }
        },
    });
};

export const useDeleteSingleOptions = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteSingleOptions"],
        mutationFn: (payload: QF_ADelOptionsPayloadType) => deleteSingleOptions(payload),
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
                    queryKey: ["readAllAdminOptions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};