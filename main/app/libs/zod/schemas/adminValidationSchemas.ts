import z from "zod";

export const AdminLoginValidationSchema = z.object({
    email: z.string({
        required_error: "Please enter email address.",
        invalid_type_error: "Email must be in string format."
    }).email({
        message: "Please enter valid email address."
    }).min(1),

    password: z.string({
        invalid_type_error: "Password must be in string format."
    }).min(8).max(16),
});

export type AdminLoginFormVS = z.infer<typeof AdminLoginValidationSchema>;

export const AdminOptionsValidationSchema = z.object({
    question_id: z.string({
        required_error: "Please enter question ID",
        invalid_type_error: "Question ID must be in string format."
    }).min(5, { message: "Question ID must be contains at least 5 characters." }),

    options: z.string({
        required_error: "Please enter options.",
        invalid_type_error: "Options text must be in string format."
    }).min(5, { message: "Options text must be contains at least 5 characters." }),

    correct_option: z.string({
        required_error: "Please enter correct option.",
        invalid_type_error: "Correct option text must be in string format."
    }).min(1, { message: "Correct option text must be contains at least 1 characters." })
});

export type AdminOptionsFormVS = z.infer<typeof AdminOptionsValidationSchema>;

export const AdminQuestionsValidationSchema = z.object({
    quiz_id: z.string({
        required_error: "Please enter quiz ID",
        invalid_type_error: "Quiz ID must be in string format."
    }).min(5, { message: "Quiz ID must be contains at least 5 characters." }),

    question_text: z.string({
        required_error: "Please enter question text",
        invalid_type_error: "Question text must be in string format."
    }).min(5, { message: "Question text must be contains at least 5 characters." }),

    question_marks: z.number({
        required_error: "Please enter question marks",
        invalid_type_error: "Question marks must be in number format."
    }).min(1, { message: "Question marks must be gretter than or is equal to 1." }),
});

export type AdminQuestionsFormVS = z.infer<typeof AdminQuestionsValidationSchema>;

export const AdminQuizesValidationSchema = z.object({
    quiz_main_title: z.string({
        required_error: "Please enter quiz title",
        invalid_type_error: "Quiz title must be in string format."
    }).min(10, { message: "Quiz title must be contains at least 10 characters." }),

    quiz_summ: z.string({
        required_error: "Please enter quiz summary",
        invalid_type_error: "Quiz summary must be in string format."
    }).min(15, { message: "Quiz summary must be contains at least 15 characters." }),

    quiz_disp_time: z.string({
        required_error: "Please enter quiz display time",
        invalid_type_error: "Quiz display time must be in string format."
    }).min(5, { message: "Quiz display time must be contains at least 5 characters." }),

    quiz_est_time: z.string({
        required_error: "Please enter quiz estimate time",
        invalid_type_error: "Quiz estimate time must be in string format."
    }).min(8, { message: "Quiz estimate time must be contains at least 8 characters." })
        .max(8, { message: "Quiz estimate time must be contains at least 8 characters." }),

    quiz_total_marks: z.number({
        required_error: "Please enter quiz total marks",
        invalid_type_error: "Quiz total marks be in integer (number) format."
    }),

    quiz_total_ques: z.number({
        required_error: "Please enter quiz total questions",
        invalid_type_error: "Quiz total questions be in integer (number) format."
    }),

    quiz_sts: z.string({
        required_error: "Please select quiz status",
        invalid_type_error: "Quiz status must be in string format."
    }).min(3, { message: "Quiz status must be contains at least 3 characters." }),
});

export type AdminQuizesFormVS = z.infer<typeof AdminQuizesValidationSchema>;

export const AdminCreateUserValidationSchema = z.object({
    full_name: z.string({
        required_error: "Please enter Full Name",
        invalid_type_error: "Full Name must be in string format."
    }).min(1, { message: "Full name must be contains at least 1 characters." }),

    email: z.string({
        required_error: "Please enter email address.",
        invalid_type_error: "Email must be in string format."
    }).email({
        message: "Please enter valid email address."
    }).min(1),

    role: z.string({
        required_error: "Please select a role."
    }).min(1, { message: "Please select a role." }),

    password: z.string({
        invalid_type_error: "Password must be in string format."
    }).min(8).max(16),

    confirmPassword: z.string({
        invalid_type_error: "Confirm password must be in string format."
    }).min(8).max(16)


}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Your password didn't match."
});

export type AdminCreateUserFormVS = z.infer<typeof AdminCreateUserValidationSchema>;

export const AdminEditUserValidationSchema = z.object({
    full_name: z.string({
        required_error: "Please enter Full Name",
        invalid_type_error: "Full Name must be in string format."
    }).min(1, { message: "Full name must be contains at least 1 characters." }),

    email: z.string({
        required_error: "Please enter email address.",
        invalid_type_error: "Email must be in string format."
    }).email({
        message: "Please enter valid email address."
    }).min(1),

    role: z.string({
        required_error: "Please select a role."
    }).min(1, { message: "Please select a role." }),
});

export type AdminEditUserFormVS = z.infer<typeof AdminEditUserValidationSchema>;

export const AdminGeneralSettingsValidationSchema = z.object({
    full_name: z.string({
        required_error: "Please enter Full Name",
        invalid_type_error: "Full Name must be in string format."
    }).min(10, { message: "Full name must be contains at least 10 characters." }),

    email: z.string({
        required_error: "Please enter email address.",
        invalid_type_error: "Email must be in string format."
    }).email({
        message: "Please enter valid email address."
    }).min(1),
});

export type AdminGeneralSettingsFormVS = z.infer<typeof AdminGeneralSettingsValidationSchema>;

export const AdminPasswordSettingsValidationSchema = z.object({
    password: z.string({
        invalid_type_error: "Password must be in string format."
    }).min(8).max(16),

    confirmPassword: z.string({
        invalid_type_error: "Confirm password must be in string format."
    }).min(8).max(16)
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Your password didn't match."
});

export type AdminPasswordSettingsFormVS = z.infer<typeof AdminPasswordSettingsValidationSchema>;

export const AdminPhoneSettingsValidationSchema = z.object({
    phone_number: z.string({
        required_error: "Please enter phone number.",
        invalid_type_error: "Phone Number must be in numeric format."
    }).trim().min(10).max(13)
        .refine((value) => !isNaN(Number(value)), {
            message: 'Invalid phone number format (must be digits)',
        }),
});

export type AdminPhoneSettingsFormVS = z.infer<typeof AdminPhoneSettingsValidationSchema>;
