import { TQ_CBtype } from "@/app/types/commonTypes";
import { QF_AGenSetSetPayloadType, QF_APhnSetSetPayloadType, QF_setAdminProfilePhotoPayloadType } from "@/app/types/libs/tanstack-query/admin/adminSettingsType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAdminProfilePhoto, setAdminGeneralSettings, setAdminPhoneSettings, setAdminProfilePhoto } from "@/app/libs/tanstack-query/admin/api-functions/adminSettingsAPIFunctions";
import { AxiosResponse } from "axios";

export const useSetAdminGeneralSettings = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["setAdminGeneralSettings"],
        mutationFn: (payload: QF_AGenSetSetPayloadType) => setAdminGeneralSettings(payload),
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
                    queryKey: ["getAdminGeneralSettings", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminUserInfo", callbacks?.token]
                });
            }
        },
    });
};

export const useSetAdminPhoneSettings = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["setAdminPhoneSettings"],
        mutationFn: (payload: QF_APhnSetSetPayloadType) => setAdminPhoneSettings(payload),
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
                    queryKey: ["getAdminPhoneSettings", callbacks?.token]
                });
            }
        },
    });
};

export const useSetAdminProfilePhoto = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["setAdminProfilePhoto"],
        mutationFn: (payload: QF_setAdminProfilePhotoPayloadType) => setAdminProfilePhoto(payload),
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
                    queryKey: ["getAdminProfilePhoto", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminUserInfo", callbacks?.token]
                });
            }
        },
    });
};

export const useRemoveAdminProfilePhoto = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["removeAdminProfilePhoto"],
        mutationFn: (payload: { token: string }) => removeAdminProfilePhoto(payload),
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
                    queryKey: ["getAdminProfilePhoto", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminUserInfo", callbacks?.token]
                });
            }
        },
    });
};