import { CommonAPIResponse } from "@/app/types/commonTypes";
import { CategoriesType } from "@/app/types/components/website/componentsTypes";
import { axiosInstance } from "@/app/libs/tanstack-query/fetcher";
import { QF_MasterCategoriesDataType, QF_MasterQuizDataType, QF_PUBPrizesDataType } from "@/app/types/libs/tanstack-query/website/websiteCommonTypes";
import { WinnersType } from "@/app/types/pages/website/winnersPageTypes";

export const getFeHomeCats = async () => {
    return (await axiosInstance.get<CommonAPIResponse & { home_cats?: CategoriesType[] }>(`/api/site/get-home-featured-categories`)).data;
}

export const getPublicPrizes = async () => {
    return (await axiosInstance.get<CommonAPIResponse & { prizes?: QF_PUBPrizesDataType[] }>(`/api/site/get-prizes`)).data;
}

export const getPublicWinners = async () => {
    return (await axiosInstance.get<CommonAPIResponse & { winners?: WinnersType[] }>(`/api/site/get-winners`)).data;
}

export const getPublicQuizzesOnlyInfo = async () => {
    return (await axiosInstance.get<CommonAPIResponse & { quizes?: QF_MasterQuizDataType[] }>(`/api/site/get-quizes/bulk-list/only-info`)).data;
}

export const getPublicSingleQuizzesOnlyInfo = async (quiz_id: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { quiz?: QF_MasterQuizDataType }>(`/api/site/get-quizes/single/only-info?quiz_id=${quiz_id}`)).data;
}

export const getPublicQuizzesByCategory = async (category_slug: string) => {
    return (await axiosInstance.get<CommonAPIResponse & { quizes?: QF_MasterQuizDataType[], category?: QF_MasterCategoriesDataType }>(`/api/site/get-quizes/bulk-list/category-wise?category_slug=${category_slug}`)).data;
}