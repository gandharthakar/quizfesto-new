import { TQ_DefaultConfig } from "@/app/libs/helpers/helperFunctions";
import { useQuery } from "@tanstack/react-query";
import { getAdminGeneralSettings, getAdminPhoneSettings, getAdminProfilePhoto, getAdminStats, getAdminUserInfo } from "@/app/libs/tanstack-query/admin/api-functions/adminSettingsAPIFunctions";
import { readAllAdminQuizesBA, readSingleQuiz } from "@/app/libs/tanstack-query/admin/api-functions/adminQuizAPIFunctions";
import { QF_AGetQuizPayloadType } from "@/app/types/libs/tanstack-query/admin/adminQuizTypes";
import { QF_ASingleQuesPayloadType } from "@/app/types/libs/tanstack-query/admin/adminQuestionType";
import { readAllAdminQuestionsBA, readSingleQuestion } from "@/app/libs/tanstack-query/admin/api-functions/adminQuestionsAPIFunctions";
import { readAllAdminOptionsBA, readSingleOptions } from "@/app/libs/tanstack-query/admin/api-functions/adminOptionsAPIFunctions";
import { QF_ADelOptionsPayloadType } from "@/app/types/libs/tanstack-query/admin/adminOptionsTypes";
import { readAllAdminCategoriesBA, readAllAdminHomeCategoriesBA, readSingleCategory } from "@/app/libs/tanstack-query/admin/api-functions/adminCategoriesAPIFunctions";
import { QF_AGetSingleCatPayloadType } from "@/app/types/libs/tanstack-query/admin/adminCategoriesTypes";
import { readAllAdminUsersBA, readSingleUser } from "@/app/libs/tanstack-query/admin/api-functions/adminUsersAPIFunctions";
import { QF_AGetSingleUserPayloadType } from "@/app/types/libs/tanstack-query/admin/adminUsersTypes";
import { readAllAdminWinnersBA } from "@/app/libs/tanstack-query/admin/api-functions/adminWinnersAPIFunctions";
import { readSinglePrize } from "@/app/libs/tanstack-query/admin/api-functions/adminPrizesAPIFunctions";
import { QF_AGetPrizePayloadType } from "@/app/types/libs/tanstack-query/admin/adminPrizesTypes";

// Admin Settings Queries.

export const useGetAdminUserInfo = (token: string) => {
    return useQuery({
        queryKey: ["getAdminUserInfo", token],
        queryFn: () => getAdminUserInfo(token),
        ...TQ_DefaultConfig
    });
}

export const useGetAdminGeneralSettings = (token: string) => {
    return useQuery({
        queryKey: ["getAdminGeneralSettings", token],
        queryFn: () => getAdminGeneralSettings(token),
        ...TQ_DefaultConfig
    });
}

export const useGetAdminPhoneSettings = (token: string) => {
    return useQuery({
        queryKey: ["getAdminPhoneSettings", token],
        queryFn: () => getAdminPhoneSettings(token),
        ...TQ_DefaultConfig
    });
}

export const useGetAdminProfilePhoto = (token: string) => {
    return useQuery({
        queryKey: ["getAdminProfilePhoto", token],
        queryFn: () => getAdminProfilePhoto(token),
        ...TQ_DefaultConfig
    });
}

export const useGetAdminStats = (token: string) => {
    return useQuery({
        queryKey: ["getAdminStats", token],
        queryFn: () => getAdminStats(token),
        ...TQ_DefaultConfig
    });
}

// Admin Quiz Queries.

export const useReadAllAdminQuizes = (token: string) => {
    return useQuery({
        queryKey: ["readAllAdminQuizes", token],
        queryFn: () => readAllAdminQuizesBA(token),
        ...TQ_DefaultConfig
    });
}

export const useReadSingleQuiz = (payload: QF_AGetQuizPayloadType) => {
    return useQuery({
        queryKey: ["readSingleQuiz", payload.quiz_id],
        queryFn: () => readSingleQuiz(payload),
        ...TQ_DefaultConfig
    });
}

// Admin Questions Queries.

export const useReadAllAdminQuestions = (token: string) => {
    return useQuery({
        queryKey: ["readAllAdminQuestions", token],
        queryFn: () => readAllAdminQuestionsBA(token),
        ...TQ_DefaultConfig
    });
}

export const useReadSingleQuestion = (payload: QF_ASingleQuesPayloadType) => {
    return useQuery({
        queryKey: ["readSingleQuestion", payload.question_id],
        queryFn: () => readSingleQuestion(payload),
        ...TQ_DefaultConfig
    });
}

// Admin Options Queries.

export const useReadAllAdminOptions = (token: string) => {
    return useQuery({
        queryKey: ["readAllAdminOptions", token],
        queryFn: () => readAllAdminOptionsBA(token),
        ...TQ_DefaultConfig
    });
}

export const useReadSingleOptions = (payload: QF_ADelOptionsPayloadType) => {
    return useQuery({
        queryKey: ["readSingleOptions", payload.option_id],
        queryFn: () => readSingleOptions(payload),
        ...TQ_DefaultConfig
    });
}

// Admin Categories Queries.

export const useReadAllAdminCategories = (token: string) => {
    return useQuery({
        queryKey: ["readAllAdminCategories", token],
        queryFn: () => readAllAdminCategoriesBA(token),
        ...TQ_DefaultConfig
    });
}

export const useReadSingleCategory = (payload: QF_AGetSingleCatPayloadType) => {
    return useQuery({
        queryKey: ["readSingleCategory", payload.category_id],
        queryFn: () => readSingleCategory(payload),
        ...TQ_DefaultConfig
    });
}

// Admin Home Categories Queries.

export const useReadAllAdminHomeCategories = (token: string) => {
    return useQuery({
        queryKey: ["readAllAdminHomeCategories", token],
        queryFn: () => readAllAdminHomeCategoriesBA(token),
        ...TQ_DefaultConfig
    });
}

// Admin Users Queries.

export const useReadAllAdminUsers = (token: string) => {
    return useQuery({
        queryKey: ["readAllAdminUsers", token],
        queryFn: () => readAllAdminUsersBA(token),
        ...TQ_DefaultConfig
    });
}

export const useReadSingleUsers = (payload: QF_AGetSingleUserPayloadType) => {
    return useQuery({
        queryKey: ["readSingleUsers", payload.uid],
        queryFn: () => readSingleUser(payload),
        ...TQ_DefaultConfig
    });
}

// Admin Winners Queries.

export const useReadAllAdminWinners = (token: string) => {
    return useQuery({
        queryKey: ["readAllAdminWinners", token],
        queryFn: () => readAllAdminWinnersBA(token),
        ...TQ_DefaultConfig
    });
}

// Admin Prizes Queries.

export const useReadSinglePrize = (payload: QF_AGetPrizePayloadType) => {
    return useQuery({
        queryKey: ["readSinglePrize", payload.prize_type],
        queryFn: () => readSinglePrize(payload),
        ...TQ_DefaultConfig
    });
}