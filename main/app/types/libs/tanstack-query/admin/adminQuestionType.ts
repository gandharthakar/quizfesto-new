export type QF_ADSQuestionsPayloadType = {
    token: string,
    question_id_list: string[]
}

export type QF_ASingleQuesPayloadType = {
    token: string,
    question_id: string
}

export type QF_ACreQuesPayloadType = {
    token: string,
    quiz_id?: string,
    question_title: string,
    question_marks: number,
    question_id?: string
}

export type QF_AGetQuestionDataType = {
    question_id: string,
    question_title: string,
    question_marks: number,
    quiz_id: string
}