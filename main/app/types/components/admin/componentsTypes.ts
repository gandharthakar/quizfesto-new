
export type AdminStatsDataCardType = {
    total_quizes: number,
    total_questions: number,
    total_options: number,
    total_categories: number,
    total_users: number,
    total_winners: number
}

export type AdminBreadcrumbsMenuType = {
    menu_item_id: number,
    menu_title: string,
    menu_slug: string,
    clickable: boolean
}

export type AdminBreadcrumbsType = {
    home_slug?: string,
    home_title?: string,
    menuItems?: AdminBreadcrumbsMenuType[]
}


export type AdminCategoriesListCardType = {
    category_id: string,
    category_title: string,
    category_slug: string,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: (itemId: string) => void
}

export type AdminQuestionsListCardType = {
    question_id: string,
    question_text: string,
    question_marks: string | number,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: (question_id: string) => void
}


export type AdminOptionsListCardType = {
    option_id: string,
    options: string[],
    question_text?: string,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: (option_id: string) => void
}


export type AdminQuizesListCardType = {
    quiz_id: string,
    quiz_title: string,
    quiz_status: string,
    total_questions: number,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: (itemId: string) => void
}


export type AdminUsersListCardType = {
    user_id: string,
    user_name: string,
    user_role: string,
    user_block_status: string,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: (user_id: string) => void
}


export type AdminSearchPanelType = {
    sarchInputVal: string,
    searchInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    searchInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}


export type AdminSubMenuItemType = {
    subMenuItemId: string | number,
    subMenuItemURI: string,
    subMenuItemTitle: string,
    subMenuItemActArr: string[],
    subMenuItemPathName: string,
    subMenuItemOnClickCallBack?: () => void,
    // subMenuItem
}

export type AdminMenuItemType = {
    parentMenuItemURI: string,
    parentMenuItemTitle: string,
    //eslint-disable-next-line
    parentMenuItemIcon: any,
    parentMenuItemActArr: string[],
    parentMenuItemPathName: string,
    parentMenuItemOnClickCallBack?: () => void,
    submenu?: AdminSubMenuItemType[],
    closeMainMenuOnParentItemClick?: boolean,
    closeMainMenuFunc?: () => void,
    // parentMenuItem
}

export type WinnerPrizeFormType = {
    prize_type_text: string | number,
    prize_possition_text: string,
}

export type WinnerUserFormType = {
    winner_id?: string,
    winner_type: number,
    winning_position_text: string,
    user_id?: string,
    winner_date: string,
    user_full_name: string,
    winner_description: string,
    user_profile_picture?: string
}

export type RTSPkgSelectType = {
    value: string,
    label: string,
}

export type AdminOptionsDataType = {
    option_id: string,
    options: string[],
    question_text: string,
    search_tems: string[]
}

export type AdminQuestionDataType = {
    question_title: string,
    question_marks: number,
    question_id: string
}


export type AdminQuizDataType = {
    quiz_id: string,
    quiz_title: string,
    quiz_status: string,
}


export type AdminUserDataType = {
    user_id: string,
    user_name: string,
    user_role: string,
    user_block_status: string
}