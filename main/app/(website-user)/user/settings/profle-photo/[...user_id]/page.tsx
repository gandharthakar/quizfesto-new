'use client';

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { getCookie } from "cookies-next/client";
import { jwtDecode } from "jwt-decode";
import { JWTDec } from "@/app/types/commonTypes";
import { convertBase64 } from "@/app/libs/helpers/helperFunctions";

export default function Page() {

    const defaultImage = "https://placehold.co/1000x1000/png";

    const router = useRouter();
    const params = useParams<{ user_id: string }>();
    const user_id = params.user_id;

    const gau = getCookie('is_auth_user');
    if (gau) {
        const user_id_ck: JWTDec = jwtDecode(gau);
        const fin_uid = user_id_ck.is_auth_user;
        if (user_id !== fin_uid) {
            router.push('/logout');
        }
    }

    const [prevImageURI, setPrevImageURI] = useState<string>(defaultImage);
    const [imageFile, setImageFile] = useState<string>('');
    const [fileExt, setFileExt] = useState<string>('');
    const [imageFileSize, setImageFileSize] = useState<boolean>(false);
    const [imageDimensions, setImageDimensions] = useState<boolean>(false);
    const [errorInput, setErrorInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [alreadyHaveImage, setAlreadyHaveImage] = useState<boolean>(false);
    const [userImage, setUserImage] = useState<string>("");
    const [isLoadRmv, setIsLoadRmv] = useState<boolean>(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            setImageFile('');
            return;
        } else {
            const gfnext = file.name;
            const fext = gfnext.split('.').pop();
            setFileExt(fext ?? "");
            setPrevImageURI(URL.createObjectURL(file));

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

    const removeImageButtonClick = async () => {
        setIsLoadRmv(true);
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/auth-user/update-single-user/profile-photo`, {
            method: 'POST',
            body: JSON.stringify({ user_id, user_photo: '' })
        });
        const body = await resp.json();
        if (body.success) {
            Swal.fire({
                title: "Success!",
                text: body.message,
                icon: "success",
                timer: 4000
            });
            router.refresh();
            setUserImage("");
            setAlreadyHaveImage(false);
            setIsLoadRmv(false);
        }
    }

    const getUser = async () => {
        const baseURI = window.location.origin;
        const resp = await fetch(`${baseURI}/api/site/auth-user/get-single-user`, {
            method: 'POST',
            body: JSON.stringify({ user_id }),
        });
        const body = await resp.json();
        if (body.success) {
            setUserImage(body.user.user_photo);
            if (body.user.user_photo == '') {
                setAlreadyHaveImage(false);
            } else {
                setAlreadyHaveImage(true);
            }
            setIsLoading(false);
        } else {
            Swal.fire({
                title: "Error!",
                text: body.message,
                icon: "error",
                timer: 4000
            });
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let isValidImage: boolean = false;

        // Get file extention.
        const allowedFileTypes = ["jpg", "png", "jpeg"];

        if (imageFile === '') {
            setErrorInput("Please select a photo.");
        } else {
            if (!allowedFileTypes.includes(fileExt)) {
                setErrorInput("Only .jpg, .jpeg and .png files are allowed.");
            } else {
                if (!imageFileSize) {
                    setErrorInput("Image file size is bigger than 500 kb.");
                } else {
                    if (!imageDimensions) {
                        setErrorInput("Image dimensions is expected 1000px x 1000px. (square size)");
                    } else {
                        setErrorInput("");
                        isValidImage = true;
                    }
                }
            }
        }

        if (isValidImage) {
            setIsLoading(true);
            const baseURI = window.location.origin;
            const resp = await fetch(`${baseURI}/api/site/auth-user/update-single-user/profile-photo`, {
                method: 'POST',
                body: JSON.stringify({ user_id, user_photo: imageFile })
            });
            const body = await resp.json();
            if (body.success) {
                Swal.fire({
                    title: "Success!",
                    text: body.message,
                    icon: "success",
                    timer: 4000
                });
                //this will reload the page without doing SSR
                router.refresh();
                setUserImage(imageFile);
                setIsLoading(false);
                setAlreadyHaveImage(true);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: body.message,
                    icon: "error",
                    timer: 4000
                });
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        getUser();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="pt-[25px] lg:pt-0">
                <div className="transition-all delay-75 bg-white border-[2px] border-solid border-zinc-300 px-[20px] py-[20px] md:px-[40px] md:py-[30px] lg:max-w-[800px] dark:bg-zinc-950 dark:border-zinc-700">
                    {
                        alreadyHaveImage ?
                            (
                                <>
                                    <div className="text-center pb-[10px]">
                                        <Image src={`${userImage ? userImage : defaultImage}`} width={100} height={100} alt="photo" className="inline-block w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full" priority={true} />
                                    </div>
                                    <div className="text-center">
                                        {
                                            isLoadRmv ?
                                                (<div className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200 font-semibold">Loading...</div>)
                                                :
                                                (

                                                    <button
                                                        type="button"
                                                        title="Remove Photo"
                                                        className="inline-block font-ubuntu text-[18x] md:text-[20x] font-medium text-red-600 dark:text-red-500"
                                                        onClick={removeImageButtonClick}
                                                    >
                                                        <div className="flex gap-x-[10px] items-center">
                                                            <FaRegTrashAlt size={17} />
                                                            <div>
                                                                Remove Photo
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                        }
                                    </div>
                                </>
                            )
                            :
                            (
                                <>
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex flex-col md:flex-row gap-y-[15px] gap-x-[35px]">
                                            <div className="w-full md:flex-1">
                                                <label htmlFor="imgInp" className="transition-all delay-75 cursor-pointer border-[2px] border-dashed border-zinc-300 w-full flex justify-center items-center min-h-[200px] px-[15px] py-[50px] bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                                                    <input
                                                        type="file"
                                                        id="imgInp"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                    <div>
                                                        <div className="pb-[5px] text-center">
                                                            <FaCloudUploadAlt size={80} className="transition-all inline-block delay-75 w-[50px] h-[50px] md:w-[80px] md:h-[80px] text-zinc-400" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="inline-block font-noto_sans text-[16px] md:text-[18px] text-zinc-500 font-medium">
                                                                Drag & Drop File <br />
                                                                Or <span className="text-theme-color-2">Select File</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="w-full md:w-auto">
                                                <div className="pb-[10px]">
                                                    <h1 className="transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] font-semibold text-zinc-900 dark:text-zinc-300">
                                                        Image Preview
                                                    </h1>
                                                </div>
                                                <Image
                                                    src={prevImageURI}
                                                    width={100}
                                                    height={100}
                                                    className="inline-block w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-zinc-100 rounded-full"
                                                    alt="photo"
                                                    priority={true}
                                                />
                                            </div>
                                        </div>

                                        <div className="py-[20px]">
                                            <h4 className="block transition-all delay-75 font-noto_sans text-[18px] md:text-[20px] font-semibold text-zinc-900 dark:text-zinc-300">
                                                Requirements:
                                            </h4>
                                        </div>

                                        <ul className="flex flex-col gap-y-[5px] list-disc pl-[20px]">
                                            <li className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-900 dark:text-zinc-300">
                                                The image file size should be less than 500 KB. &#x3c; less 500 KB
                                            </li>
                                            <li className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-900 dark:text-zinc-300">
                                                The maximum height and width of image shuld be 1000px x 1000px.
                                            </li>
                                            <li className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-900 dark:text-zinc-300">
                                                {`Image file format should be ".jpg" or ".png". Other files are not allowed.`}
                                            </li>
                                        </ul>

                                        {
                                            errorInput.length > 0 || errorInput ?
                                                (
                                                    <>
                                                        <div className="pt-[25px]">
                                                            <div className="ws-input-error">{errorInput}</div>
                                                        </div>
                                                    </>
                                                )
                                                :
                                                ('')
                                        }

                                        <div className="text-right pt-[25px]">
                                            {
                                                isLoading ?
                                                    (<div className="transition-all delay-75 font-noto_sans text-[14px] md:text-[16px] text-zinc-800 dark:text-zinc-200 font-semibold">Loading...</div>)
                                                    :
                                                    (
                                                        <button type="submit" title="Save Changes" className="ws-button-m1">
                                                            Save Changes
                                                        </button>
                                                    )
                                            }

                                        </div>
                                    </form>
                                </>
                            )
                    }
                </div>
            </div>
        </>
    )
}