import { TQ_CBtype } from "@/app/types/commonTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { createUpdateSinglePrize, deleteSinglePrize } from "@/app/libs/tanstack-query/admin/api-functions/adminPrizesAPIFunctions";
import { QF_ACreUpdPrizesPayloadType, QF_ADelPrizePayloadType } from "@/app/types/libs/tanstack-query/admin/adminPrizesTypes";

export const useDeleteSinglePrize = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteSinglePrize"],
        mutationFn: (payload: QF_ADelPrizePayloadType) => deleteSinglePrize(payload),
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
                    queryKey: ["readSinglePrize", callbacks?.prize_type]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useUpdateSinglePrize = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateSinglePrize"],
        mutationFn: (payload: QF_ACreUpdPrizesPayloadType) => createUpdateSinglePrize(payload),
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
                    queryKey: ["readSinglePrize", callbacks?.prize_type]
                });
            }
        },
    });
};