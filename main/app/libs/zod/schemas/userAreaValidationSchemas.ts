import { z } from 'zod';

export const userRegisterValidationSchema = z.object({
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

    password: z.string({
        invalid_type_error: "Password must be in string format."
    }).min(8).max(16),

    confirm_password: z.string({
        invalid_type_error: "Confirm password must be in string format."
    }).min(8).max(16)
}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Your password didn't match."
});

export type userRegisterFormVS = z.infer<typeof userRegisterValidationSchema>;

export const userLoginValidationSchema = z.object({
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

export type userLoginFormVS = z.infer<typeof userLoginValidationSchema>;

export const userResetPasswordValidationSchema = z.object({
    password: z.string({
        invalid_type_error: "Password must be in string format."
    }).min(8).max(16),

    confirm_password: z.string({
        invalid_type_error: "Confirm password must be in string format."
    }).min(8).max(16)
}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Your password didn't match."
});

export type userResetPasswordFormVS = z.infer<typeof userResetPasswordValidationSchema>;

export const userForgotPasswordValidationSchema = z.object({
    email: z.string({
        required_error: "Please enter email address.",
        invalid_type_error: "Email must be in string format."
    }).email({
        message: "Please enter valid email address."
    }).min(1),
});

export type userForgotPasswordFormVS = z.infer<typeof userForgotPasswordValidationSchema>;

export const userGeneralSettingsValidationSchema = z.object({
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

export type userGeneralSettingsFormVS = z.infer<typeof userGeneralSettingsValidationSchema>;

export const userPasswordSettingsValidationSchema = z.object({
    password: z.string({
        invalid_type_error: "Password must be in string format."
    }).min(8).max(16),

    confirm_password: z.string({
        invalid_type_error: "Confirm password must be in string format."
    }).min(8).max(16)
}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Your password didn't match."
});

export type userPasswordSettingsFormVS = z.infer<typeof userPasswordSettingsValidationSchema>;

export const userPhoneSettingsValidationSchema = z.object({
    phone_number: z.string({
        required_error: "Please enter phone number.",
        invalid_type_error: "Phone Number must be in numeric format."
    }).trim().min(10).max(13)
        .refine((value) => !isNaN(Number(value)), {
            message: 'Invalid phone number format (must be digits)',
        }),
});

export type userPhoneSettingsFormVS = z.infer<typeof userPhoneSettingsValidationSchema>;