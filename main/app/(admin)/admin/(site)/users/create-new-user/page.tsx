'use client';

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from 'sweetalert2';
import Image from "next/image";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import AdminBreadcrumbs from "@/app/components/admin/adminBreadcrumbs";
import { convertBase64, validatePhone } from "@/app/libs/helpers/helperFunctions";
import { UserDataPayloadType } from "@/app/types/pages/admin/adminPageCommonTypes";
import { AdminCreateUserFormVS, AdminCreateUserValidationSchema } from "@/app/libs/zod/schemas/adminValidationSchemas";
import TokenChecker from "@/app/libs/tokenChecker";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";

function Page() {

    const [phone, setPhone] = useState<string>("");
    const [phoneError, setPhoneError] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string>("");
    const [imageFile, setImageFile] = useState<string>('');
    const [fileExt, setFileExt] = useState<string>('');
    const [imageFileSize, setImageFileSize] = useState<boolean>(false);
    const [imageDimensions, setImageDimensions] = useState<boolean>(false);
    const [errorFileInput, setErrorFileInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [gender, setGender] = useState<string>('');
    const [blockUser, setBlockUser] = useState<string>('false');

    const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);
        // Validate Phone Number.
        const validPhone = validatePhone(value);
        if (value !== "") {
            if (!validPhone) {
                setPhoneError("Invalid phone number");
            } else {
                setPhoneError("");
            }
        }
    }

    const removeButtonClick = () => {
        setProfileImage("");
        setImageFile("");
        setFileExt("");
        setImageFileSize(false);
        setImageDimensions(false);
        setErrorFileInput("");
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            setImageFile('');
            return;
        } else {
            const gfnext = file.name;
            const fext = gfnext.split('.').pop();
            setFileExt(fext ?? "");
            setProfileImage(URL.createObjectURL(file));

            if (file.size > 500 * 1024) {
                setImageFileSize(false);
            } else {
                setImageFileSize(true);
            }

            const img = document.createElement('img');
            const objectURL = URL.createObjectURL(file);
            img.src = objectURL;
            img.onload = function handleLoad() {
                const { width, height } = img;
                if (width <= 1000 && height <= 1000) {
                    setImageDimensions(true);
                } else {
                    setImageDimensions(false);
                }
                URL.revokeObjectURL(objectURL);
            }
        }

        const base64 = await convertBase64(file);
        setImageFile(base64);
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminCreateUserFormVS>({
        resolver: zodResolver(AdminCreateUserValidationSchema),
    });

    const submitData = async (data: UserDataPayloadType) => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        try {
            const resp = await fetch(`${baseURI}/api/admin/users/crud/create`, {
                method: "POST",
                body: JSON.stringify(data),
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                Swal.fire({
                    title: "Success!",
                    text: body.message,
                    icon: "success",
                    timer: 3000
                });
                setIsLoading(false);
                removeButtonClick();
                setPhone('');
                setGender("");
                reset();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 3000
                });
                setIsLoading(false);
            }
            //eslint-disable-next-line
        } catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                timer: 4000
            });
        }
    }

    const handleFormSubmit: SubmitHandler<AdminCreateUserFormVS> = async (formdata) => {

        // Validate Phone Number.
        const validPhone = validatePhone(phone);
        if (phone !== "") {
            if (!validPhone) {
                setPhoneError("Invalid phone number");
            } else {
                setPhoneError("");
            }
        }

        // Get file extention.
        const allowedFileTypes = ["jpg", "png", "jpeg"];
        let validImage: boolean = false;
        // console.log(imageFile);
        if (imageFile !== '') {
            setErrorFileInput("Please select a photo.");
            validImage = false;
            if (!allowedFileTypes.includes(fileExt)) {
                setErrorFileInput("Only .jpg, .jpeg and .png files are allowed.");
                validImage = false;
            } else {
                if (!imageFileSize) {
                    setErrorFileInput("Image file size is bigger than 500 kb.");
                    validImage = false;
                } else {
                    if (!imageDimensions) {
                        setErrorFileInput("Image dimensions is expected 1000px x 1000px. (square size)");
                        validImage = false;
                    } else {
                        setErrorFileInput("");
                        validImage = true;
                    }
                }
            }
        }

        const token = getCookie(adminAuthUserCookieName);
        const prepData: UserDataPayloadType = {
            token: token as string,
            user_full_name: formdata.full_name,
            user_email: formdata.email,
            user_password: formdata.password,
            user_conf_password: formdata.confirmPassword,
            role: formdata.role,
            user_phone: phone,
            user_photo: imageFile,
            user_gender: gender,
            block_user: blockUser
        }

        if (imageFile == '') {
            await submitData(prepData);
        } else {
            if (validImage) {
                await submitData(prepData);
            }
        }
    }

    const breadcrumbsMenu = [
        {
            menu_item_id: 1,
            menu_title: "Users",
            menu_slug: "/admin/users",
            clickable: true
        },
        {
            menu_item_id: 2,
            menu_title: "Create New User",
            menu_slug: "",
            clickable: false
        }
    ];

    return (
        <>
            <TokenChecker is_admin={true} />
            <div className="py-[25px]">
                <div className="pb-[25px]">
                    <AdminBreadcrumbs
                        home_slug="/admin"
                        home_title="Admin Dashboard Home"
                        menuItems={breadcrumbsMenu}
                    />
                </div>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex gap-[20px] items-start flex-col xl-s2:flex-row-reverse">
                        <div className="w-full xl-s2:flex-1 xl-s2:w-auto">
                            <div className="transition-all sticky top-[0px] delay-75 border-[2px] border-solid p-[15px] md:p-[25px] border-zinc-300 bg-white dark:bg-zinc-800 dark:border-zinc-600">
                                <div className="pb-[20px]">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                        htmlFor="cq-qflnm"
                                    >
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="cq-qflnm"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        placeholder="eg. John Paul"
                                        {...register("full_name")}
                                    />
                                    {errors.full_name && (<div className="ws-input-error mt-[2px]">{errors.full_name.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                        htmlFor="cq-qflnm"
                                    >
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="cq-qeml"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        placeholder="eg. John_paul@example.com"
                                        {...register("email")}
                                    />
                                    {errors.email && (<div className="ws-input-error mt-[2px]">{errors.email.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                        htmlFor="cq-qpwd"
                                    >
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="cq-qpwd"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        placeholder="eg. 12345678"
                                        {...register("password")}
                                    />
                                    {errors.password && (<div className="ws-input-error mt-[2px]">{errors.password.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                        htmlFor="cq-qcnfpwd"
                                    >
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="cq-qcnfpwd"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        placeholder="eg. 12345678"
                                        {...register("confirmPassword")}
                                    />
                                    {errors.confirmPassword && (<div className="ws-input-error mt-[2px]">{errors.confirmPassword.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                        htmlFor="cq-qrole"
                                    >
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="cq-qrole"
                                        className="ws-input-pwd-m1-v1"
                                        {...register("role")}
                                    >
                                        <option value="">- Select -</option>
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    {errors.role && (<div className="ws-input-error mt-[2px]">{errors.role.message}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                        htmlFor="cq-gender"
                                    >
                                        Gender
                                    </label>
                                    <select
                                        name="user_gender"
                                        id="cq-gender"
                                        className="ws-input-pwd-m1-v1"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                        htmlFor="cq-qphn"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="cq-qphn"
                                        className="ws-input-pwd-m1-v1"
                                        autoComplete="off"
                                        placeholder="eg. 0987654321"
                                        value={phone}
                                        onChange={handleChangePhone}
                                    />
                                    {
                                        phoneError && (<div className="ws-input-error mt-[2px]">{phoneError}</div>)
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="w-full xl-s2:min-w-[400px] xl-s2:max-w-[400px] xl-1:min-w-[450px] xl-1:max-w-[450px]">
                            <div className="transition-all sticky top-[0px] delay-75 border-[2px] border-solid p-[15px] md:p-[25px] border-zinc-300 bg-white dark:bg-zinc-800 dark:border-zinc-600">
                                <div className="pb-[20px] text-center">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                    >
                                        Profile Photo
                                    </label>
                                    <div className="inline-block">
                                        <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center bg-zinc-200 text-zinc-800 rounded-full font-noto_sans text-[30px] md:text-[35px] dark:bg-zinc-600 dark:text-zinc-100">
                                            <span className="uppercase">a</span>
                                            {profileImage && (<Image src={profileImage} width={100} height={100} className="w-full h-full absolute top-0 left-0 z-[2] rounded-full" alt="Photo" />)}
                                            <label htmlFor="qf-ppfl" className="transition-all delay-75 absolute left-0 top-0 z-[6] cursor-pointer w-full h-full flex items-center justify-center text-white bg-[rgba(0,0,0,0.5)] opacity-0 hover:opacity-100 rounded-full">
                                                <input type="file" id="qf-ppfl" className="hidden" onChange={handleFileChange} />
                                                <MdOutlineAddAPhoto size={24} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="pt-[5px] text-center">
                                        <button
                                            type="button"
                                            title="Remove"
                                            className="transition-all delay-75 inline-block font-noto_sans text-red-500 text-[14px]"
                                            onClick={removeButtonClick}
                                        >
                                            <div className="flex gap-x-[5px] items-center">
                                                <FaRegTrashCan size={18} />
                                                Remove
                                            </div>
                                        </button>
                                    </div>
                                    {errorFileInput && (<div className="ws-input-error mt-[5px]">{errorFileInput}</div>)}
                                </div>
                                <div className="pb-[20px]">
                                    <label
                                        className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-red-600 dark:text-zinc-300"
                                        htmlFor="cq-block"
                                    >
                                        Block User
                                    </label>
                                    <select
                                        name="user_block_status"
                                        id="cq-block"
                                        className="ws-input-pwd-m1-v1"
                                        value={blockUser}
                                        onChange={(e) => setBlockUser(e.target.value)}
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                                <div className="text-right">
                                    {
                                        isLoading ?
                                            (<div className="spinner size-1"></div>)
                                            :
                                            (
                                                <button type="submit" title="Create User" className="transition-all delay-75 inline-block concard px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center text-white font-noto_sans font-semibold text-[16px] md:text-[18px] hover:shadow-lg">
                                                    Create User
                                                </button>
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Page;