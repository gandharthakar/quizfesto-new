import { TQ_CBtype } from "@/app/types/commonTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { createDuplicateQuestion, createNewQuestion, deleteAllAdminQuestionsBA, deleteSelectedAdminQuestionsBA, deleteSingleQuestion, updateSingleQuestion } from "@/app/libs/tanstack-query/admin/api-functions/adminQuestionsAPIFunctions";
import { QF_ACreQuesPayloadType, QF_ADSQuestionsPayloadType, QF_ASingleQuesPayloadType } from "@/app/types/libs/tanstack-query/admin/adminQuestionType";

export const useDeleteAllAdminQuestions = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteAllAdminQuestions"],
        mutationFn: (payload: { token: string }) => deleteAllAdminQuestionsBA(payload),
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
                    queryKey: ["readAllAdminQuestions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useDeleteSelectedAdminQuestions = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteSelectedAdminQuestions"],
        mutationFn: (payload: QF_ADSQuestionsPayloadType) => deleteSelectedAdminQuestionsBA(payload),
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
                    queryKey: ["readAllAdminQuestions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useCreateNewQuestion = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createNewQuestion"],
        mutationFn: (payload: QF_ACreQuesPayloadType) => createNewQuestion(payload),
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
                    queryKey: ["readAllAdminQuestions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useUpdateSingleQuestion = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateSingleQuestion"],
        mutationFn: (payload: QF_ACreQuesPayloadType) => updateSingleQuestion(payload),
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
                    queryKey: ["readAllAdminQuestions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["readAllAdminOptions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["readSingleQuestion", callbacks?.question_id]
                });
            }
        },
    });
};

export const useCreateDuplicateQuestion = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createDuplicateQuestion"],
        mutationFn: (payload: QF_ASingleQuesPayloadType) => createDuplicateQuestion(payload),
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
                    queryKey: ["readAllAdminQuestions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};

export const useDeleteSingleQuestion = (callbacks?: TQ_CBtype) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["deleteSingleQuestion"],
        mutationFn: (payload: QF_ASingleQuesPayloadType) => deleteSingleQuestion(payload),
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
                    queryKey: ["readAllAdminQuestions", callbacks?.token]
                });
                await queryClient.invalidateQueries({
                    queryKey: ["getAdminStats", callbacks?.token]
                });
            }
        },
    });
};