import { TQ_CBtype } from "@/app/types/commonTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { deleteAllAdminWinnersBA, deleteSingleWinner, findAllAdminWinnersBA, updateSingleWinner } from "@/app/libs/tanstack-query/admin/api-functions/adminWinnersAPIFunctions";
import { QF_ADelSingleWinnerPayloadType, QF_AUpdSingleWinnerPayloadType } from "@/app/types/libs/tanstack-query/admin/adminWinnersTypes";

export const useDeleteAllAdminWinners = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteAllAdminWinners"],
        mutationFn: (payload: { token: string }) => deleteAllAdminWinnersBA(payload),
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
                    queryKey: ["readAllAdminWinners", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useFindAllAdminWinners = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["findAllAdminWinners"],
        mutationFn: (payload: { token: string }) => findAllAdminWinnersBA(payload),
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
                    queryKey: ["readAllAdminWinners", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useUpdateSingleWinner = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateSingleWinner"],
        mutationFn: (payload: QF_AUpdSingleWinnerPayloadType) => updateSingleWinner(payload),
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
                    queryKey: ["readAllAdminWinners", callbacks?.token]
                });
            }
        },
    });
};

export const useDeleteSingleWinner = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteSingleWinner"],
        mutationFn: (payload: QF_ADelSingleWinnerPayloadType) => deleteSingleWinner(payload),
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
                    queryKey: ["readAllAdminWinners", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};