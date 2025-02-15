import { TQ_CBtype } from "@/app/types/commonTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { QF_SetWebAuthUserGenSetPayloadType, QF_SetWebAuthUserphnSetPayloadType, QF_SetWebAuthUserPhtSetPayloadType } from "@/app/types/libs/tanstack-query/website/websiteAuthUserTypes";
import { setWebsiteAuthUserGeneralSettings, setWebsiteAuthUserPhoneSettings, setWebsiteAuthUserPhotoSettings } from "@/app/libs/tanstack-query/website/api-functions/websiteAuthUserAPIFunctions";

export const useUpdateWebAuthUserGenSettings = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateWebAuthUserGeneralSettings"],
        mutationFn: (payload: QF_SetWebAuthUserGenSetPayloadType) => setWebsiteAuthUserGeneralSettings(payload),
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
                    queryKey: ["getWebsiteAuthUserInfo", callbacks?.token]
                });
            }
        },
    });
};

export const useUpdateWebAuthUserPhoneSettings = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateWebAuthUserPhoneSettings"],
        mutationFn: (payload: QF_SetWebAuthUserphnSetPayloadType) => setWebsiteAuthUserPhoneSettings(payload),
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
                    queryKey: ["getWebsiteAuthUserInfo", callbacks?.token]
                });
            }
        },
    });
};

export const useUpdateWebAuthUserPhotoSettings = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateWebAuthUserPhotoSettings"],
        mutationFn: (payload: QF_SetWebAuthUserPhtSetPayloadType) => setWebsiteAuthUserPhotoSettings(payload),
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
                    queryKey: ["getWebsiteAuthUserInfo", callbacks?.token]
                });
            }
        },
    });
};