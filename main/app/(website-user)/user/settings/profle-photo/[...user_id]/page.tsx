'use client';

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import { callbackErrT1S1_ST1, callbackOnErrT1S1_ST1, callbackOnSucT1S1_ST1, convertBase64, QF_TQ_UEF_CatchErrorCB } from "@/app/libs/helpers/helperFunctions";
import TokenChecker from "@/app/libs/tokenChecker";
import AuthChecker from "@/app/libs/authChecker";
import { siteAuthUserCookieName } from "@/app/constant/datafaker";
import { getCookie } from "cookies-next/client";
import { useGetWebsiteAuthUserInfo } from "@/app/libs/tanstack-query/website/queries/websiteQueries";
import { useUpdateWebAuthUserPhotoSettings } from "@/app/libs/tanstack-query/website/mutations/websiteAuthUserMutations";

export default function Page() {

    const defaultImage = "https://placehold.co/1000x1000/png";

    const token = getCookie(siteAuthUserCookieName);
    const params = useParams<{ user_id: string[] }>();
    const user_id = params.user_id[0];

    const [prevImageURI, setPrevImageURI] = useState<string>(defaultImage);
    const [imageFile, setImageFile] = useState<string>('');
    const [fileExt, setFileExt] = useState<string>('');
    const [imageFileSize, setImageFileSize] = useState<boolean>(false);
    const [imageDimensions, setImageDimensions] = useState<boolean>(false);
    const [errorInput, setErrorInput] = useState<string>('');
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const [alreadyHaveImage, setAlreadyHaveImage] = useState<boolean>(false);
    const [userImage, setUserImage] = useState<string>("");
    // const [isLoadRmv, setIsLoadRmv] = useState<boolean>(false);

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

    const cbRmvPht = () => {
        setUserImage("");
        setAlreadyHaveImage(false);
    }

    const rmvPhoto = useUpdateWebAuthUserPhotoSettings({
        onSuccessCB: (resp) => callbackOnSucT1S1_ST1(resp, cbRmvPht),
        errorCB: (resp) => callbackErrT1S1_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S1_ST1(resp),
        token
    });

    const removeImageButtonClick = async () => {
        const tokenRmv = getCookie(siteAuthUserCookieName);
        rmvPhoto.mutate({ token: tokenRmv ?? "", user_photo: '' });
    }

    const cbAddPht = () => {
        setUserImage(imageFile);
        setAlreadyHaveImage(true);
    }

    const addPhoto = useUpdateWebAuthUserPhotoSettings({
        onSuccessCB: (resp) => callbackOnSucT1S1_ST1(resp, cbAddPht),
        errorCB: (resp) => callbackErrT1S1_ST1(resp),
        onErrorCB: (resp) => callbackOnErrT1S1_ST1(resp),
        token
    });

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
            const tokenSub = getCookie(siteAuthUserCookieName);
            addPhoto.mutate({ token: tokenSub ?? "", user_photo: imageFile });
        }
    }

    const { data, isError, error, isSuccess, isLoading } = useGetWebsiteAuthUserInfo(token ?? "");

    useEffect(() => {
        if (isSuccess) {
            if (data.user) {
                setUserImage(data.user.user_photo);
                if (data.user.user_photo == '') {
                    setAlreadyHaveImage(false);
                } else {
                    setAlreadyHaveImage(true);
                }
            }
        }
        QF_TQ_UEF_CatchErrorCB(isError, error);
    }, [data, isSuccess, isError, error]);

    return (
        <>
            <AuthChecker />
            <TokenChecker is_admin={false} />
            <input type="hidden" value={user_id} />
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
                                            rmvPhoto.isPending ?
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
                                                isLoading || addPhoto.isPending ?
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