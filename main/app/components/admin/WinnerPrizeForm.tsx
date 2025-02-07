'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { RiCloseLargeFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { WinnerPrizeFormType } from "@/app/types/components/admin/componentsTypes";
import { convertBase64 } from "@/app/libs/helpers/helperFunctions";
import { getCookie } from "cookies-next/client";
import { adminAuthUserCookieName } from "@/app/constant/datafaker";

function WinnerPrizeForm(props: WinnerPrizeFormType) {

    const { prize_type_text, prize_possition_text } = props;

    const defaultImage = "https://placehold.co/700x500/png";

    const [profileImage, setProfileImage] = useState<string>("");
    const [imageFile, setImageFile] = useState<string>('');
    const [fileExt, setFileExt] = useState<string>('');
    const [imageFileSize, setImageFileSize] = useState<boolean>(false);
    const [imageDimensions, setImageDimensions] = useState<boolean>(false);
    const [descr, setDescr] = useState<string>("");
    const [descError, setDescError] = useState<string>("");
    const [scoreLimit, setScoreLimit] = useState<string>("");
    const [SLError, setSLError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [btnTxt, setBtnTxt] = useState<string>("Save");

    const handleImageFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                if (width == 700 && height == 500) {
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

    const removeButtonClick = () => {
        setProfileImage("");
        setImageFile("");
        setFileExt("");
        setImageFileSize(false);
        setImageDimensions(false);
        setScoreLimit("");
    }

    const removePrize = async () => {
        const conf = confirm("Are you sure you want to remove prize ?");
        if (conf) {
            setIsLoading(true);
            const baseURI = window.location.origin;
            const token = getCookie(adminAuthUserCookieName);
            try {
                const resp = await fetch(`${baseURI}/api/admin/prizes/delete`, {
                    method: "DELETE",
                    body: JSON.stringify({ token, prize_type: prize_type_text })
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
                        timer: 1500
                    });
                    const s1 = setTimeout(() => {
                        window.location.reload();
                        clearTimeout(s1);
                    }, 1500);
                    setIsLoading(false);
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
    }

    const handleChangeDscr = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDescr(value);
        if (value == '') {
            setDescError("Please enter some value.");
        } else {
            setDescError("");
        }
    }

    const handleChangeSL = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setScoreLimit(value);
        if (value == '') {
            setSLError("Please enter score limit");
        } else {
            if (isNaN(Number(value))) {
                setSLError("Please enter numbers only.");
            } else {
                setSLError("");
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let validPrizeCoverPhoto: boolean = false;

        if (descr == '') {
            setDescError("Please enter some value.");
        } else {
            setDescError("");
        }

        // Get file extention.
        const allowedFileTypes = ["jpg", "png", "jpeg"];

        // console.log(imageFile);
        if (imageFile == '') {
            Swal.fire({
                title: "Error!",
                text: "Please select a photo.",
                icon: "error",
                timer: 4000
            });
        } else {
            if (!allowedFileTypes.includes(fileExt)) {
                Swal.fire({
                    title: "Error!",
                    text: "Only .jpg, .jpeg and .png files are allowed.",
                    icon: "error",
                    timer: 4000
                });
            } else {
                if (!imageFileSize) {
                    Swal.fire({
                        title: "Error!",
                        text: "Image file size is bigger than 500 kb.",
                        icon: "error",
                        timer: 4000
                    });
                } else {
                    if (!imageDimensions) {
                        Swal.fire({
                            title: "Error!",
                            text: "Image dimensions is expected 700px x 500px. (rectangular size)",
                            icon: "error",
                            timer: 4000
                        });
                    } else {
                        validPrizeCoverPhoto = true;
                    }
                }
            }
        }

        let validSL = false;
        if (scoreLimit == '') {
            setSLError("Please enter score limit");
            validSL = false;
        } else {
            if (isNaN(Number(scoreLimit))) {
                setSLError("Please enter numbers only.");
                validSL = false;
            } else {
                setSLError("");
                validSL = true;
            }
        }

        if (validPrizeCoverPhoto && descr && validSL) {
            const token = getCookie(adminAuthUserCookieName);
            const data = {
                token,
                prize_type: prize_type_text,
                prize_photo: imageFile,
                prize_description: descr,
                winning_score_limit: Number(scoreLimit)
            }
            setIsLoading(true);
            const baseURI = window.location.origin;
            try {
                const resp = await fetch(`${baseURI}/api/admin/prizes/create-update`, {
                    method: "POST",
                    body: JSON.stringify(data)
                });
                if (!resp.ok) {
                    setIsLoading(false);
                }
                const body = await resp.json();
                if (body.success) {
                    setIsLoading(false);
                    Swal.fire({
                        title: "Success!",
                        text: body.message,
                        icon: "success",
                        timer: 1500
                    });
                    // let s1 = setTimeout(() => {
                    //     window.location.reload();
                    //     clearTimeout(s1);
                    // }, 1500);
                } else {
                    setIsLoading(false);
                    Swal.fire({
                        title: "Error!",
                        text: body.message,
                        icon: "error",
                        timer: 10000
                    });
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
    }

    const getPrize = async () => {
        setIsLoading(true);
        const baseURI = window.location.origin;
        const token = getCookie(adminAuthUserCookieName);
        try {
            const resp = await fetch(`${baseURI}/api/admin/prizes/read?token=${token}&prize_type=${prize_type_text}`, {
                method: "GET",
            });
            if (!resp.ok) {
                setIsLoading(false);
            }
            const body = await resp.json();
            if (body.success) {
                setIsLoading(false);
                // Swal.fire({
                //     title: "Success!",
                //     text: body.message,
                //     icon: "success",
                //     timer: 4000
                // });
                if (body.message == "No Prize Found!") {
                    setBtnTxt("Save");
                } else {
                    setBtnTxt("Update");
                    setDescr(body.prize_description);
                    setProfileImage(body.prize_cover_photo);
                    setImageFile(body.prize_cover_photo);
                    setScoreLimit(body.winning_score_limit);
                    setFileExt("png");
                    setImageFileSize(true);
                    setImageDimensions(true);
                }
            } else {
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

    useEffect(() => {
        getPrize();
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <input type="hidden" value={profileImage} />
            <div className="transition-all delay-75 relative border-[2px] border-solid p-[15px] border-zinc-300 bg-white hover:border-zinc-600 dark:bg-zinc-800 dark:border-zinc-600 dark:hover:border-zinc-400">
                {
                    isLoading ?
                        (
                            <div className={`transition-all delay-75 absolute left-0 top-0 z-[5] bg-[rgba(255,255,255,0.90)] w-full h-full dark:bg-[rgba(9,9,11,0.95)] justify-center items-center flex`}>
                                <div className="spinner"></div>
                            </div>
                        )
                        :
                        ("")
                }
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-x-[30px] gap-y-[15px] items-start md:items-start flex-col md:flex-row">
                        <div className="w-full md:max-w-[200px]">
                            <div className="relative">
                                <div className="flex items-center justify-center gap-[20px] h-full w-full absolute left-0 top-0 z-[4] cursor-pointer text-white bg-[rgba(0,0,0,0.5)] opacity-0 hover:opacity-100">
                                    <input
                                        type="file"
                                        id={`qf-dimg-${prize_type_text}`}
                                        onChange={handleImageFileInput}
                                        className="hidden"
                                    />
                                    <label htmlFor={`qf-dimg-${prize_type_text}`} className="">
                                        <MdOutlineAddAPhoto size={30} className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] cursor-pointer" />
                                    </label>
                                    <RiCloseLargeFill
                                        size={30}
                                        className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] cursor-pointer"
                                        onClick={removeButtonClick}
                                    />
                                </div>
                                <Image src={imageFile ? imageFile : defaultImage} width={700} height={500} className="w-full h-auto relative z-[2]" alt="photo" priority={true} />
                            </div>
                        </div>
                        <div className="w-full md:flex-1">
                            <div className="pb-[10px]">
                                <h6 className="transition-all delay-75 font-ubuntu text-[20px] md:text-[25px] text-zinc-800 dark:text-zinc-200">
                                    <b>{prize_type_text}<sup>{prize_possition_text}</sup></b> : Winner Prize
                                </h6>
                            </div>
                            <div className="pb-[20px]">
                                <div className="flex flex-col 2xl:flex-row gap-[20px]">
                                    <div className="w-full flex-auto md-t1:flex-1">
                                        <label
                                            className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                            htmlFor={`przdesc-${prize_type_text}`}
                                        >
                                            Prize Description <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="description"
                                            className="ws-input-pwd-m1-v1"
                                            placeholder="eg. Lorem ipsum dolor sit amet consectetur adipisicing elit. A dolorum sed ea nesciunt voluptatum magnam!"
                                            value={descr}
                                            id={`przdesc-${prize_type_text}`}
                                            onChange={handleChangeDscr}
                                            autoComplete="off"
                                        />
                                        {descError && (<div className="ws-input-error mt-[2px]">{descError}</div>)}
                                    </div>
                                    <div className="w-full max-w-none 2xl:max-w-[250px]">
                                        <label
                                            className="transition-all delay-75 block mb-[5px] font-noto_sans text-[16px] font-semibold text-zinc-900 dark:text-zinc-300"
                                            htmlFor={`scrlmt-${prize_type_text}`}
                                        >
                                            Score Limit <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="score_limit"
                                            className="ws-input-pwd-m1-v1"
                                            placeholder="eg. 25000"
                                            value={scoreLimit}
                                            id={`scrlmt-${prize_type_text}`}
                                            onChange={handleChangeSL}
                                            autoComplete="off"
                                        />
                                        {SLError && (<div className="ws-input-error mt-[2px]">{SLError}</div>)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <button
                                    type="button"
                                    title="Remove"
                                    className="transition-all delay-75 inline-block px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center font-noto_sans font-semibold text-[16px] md:text-[18px] text-red-600"
                                    onClick={removePrize}
                                >
                                    Remove
                                </button>
                                <button type="submit" title={btnTxt} className="transition-all delay-75 inline-block concard px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-center text-white font-noto_sans font-semibold text-[16px] md:text-[18px] hover:shadow-lg">
                                    {btnTxt}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default WinnerPrizeForm;