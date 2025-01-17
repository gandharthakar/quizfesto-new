
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
    cat_id: string,
    category_title: string,
    category_slug: string,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: any
}

export type AdminQuestionsListCardType = {
    question_id: string,
    question_text: string,
    question_marks: string | number,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: any
}


export type AdminOptionsListCardType = {
    option_id: string,
    options: string[],
    question_text?: string,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: any
}


export type AdminQuizesListCardType = {
    quizid: string,
    quiz_title: string,
    quiz_publish_status: string,
    total_questions: number,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: any
}


export type AdminUsersListCardType = {
    user_id: string,
    user_name: string,
    user_role: string,
    user_block_status: string,
    checkboxName?: string,
    checkboxChecked?: boolean,
    checkboxValue?: string,
    onCheckboxChange?: any
}


export type AdminSearchPanelType = {
    sarchInputVal: string,
    searchInputChange?: any,
    searchInputKeyDown?: any,
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
    winner_type: number,
    winning_position_text: string,
    user_id?: string,
    winner_date: string,
    user_full_name: string,
    winner_description: string,
    user_profile_picture?: string
}
