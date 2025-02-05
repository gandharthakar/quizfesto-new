import { CommonAPIResponse, CommonAPIResponseWithZodError } from "@/app/types/commonTypes";
import Swal from "sweetalert2";

//eslint-disable-next-line
export const GFG = (array: any, currPage: number, pageSize: number) => {
    const startIndex = (currPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
}

//eslint-disable-next-line
export const shuffle_array = (array: any[]) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const getClassOfTimeTaken = (qet: string, qttby: string): string => {
    let className = '';
    if (qttby < qet) {
        className = 'text-green-600';
    } else {
        if (qet === qttby) {
            className = '';
        } else {
            className = 'text-red-600';
        }
    }
    return className;
}

/* Encode string to slug */
export const convertToSlug = (str: string) => {

    //replace all special characters | symbols with a space
    str = str.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();

    // trim spaces at start and end of string
    str = str.replace(/^\s+|\s+$/gm, '');

    // replace space with dash/hyphen
    str = str.replace(/\s+/g, '-');
    return str;
}

export const validatePhone = (phoneNumber: string) => {
    const phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return phoneNumberPattern.test(phoneNumber);
}

export const validPassword = (pwd: string) => {
    const pwdPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&*-+]).{8,16}$/;
    return pwdPattern.test(pwd);
}

export const convertBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            if (typeof fileReader.result === "string") {
                resolve(fileReader.result);
            } else {
                reject("Unexpected type received from FileReader");
            }
        }
        fileReader.onerror = (error) => {
            reject(error);
        }
    })
}

export const getWinnerPosTxt = (winType: number) => {
    let txt = '';
    switch (winType) {
        case 1:
            txt = 'st'
            break;
        case 2:
            txt = 'nd'
            break;
        case 3:
            txt = 'rd'
            break;
        default:
            txt = ''
            break;
    }

    return txt;
}

export const convertDigitIn = (str: string) => {
    return str.split('-').reverse().join('-');
}

export const TQ_DefaultConfig = {
    refetchOnWindowFocus: false,
    staleTime: 60 * (60 * 1000), // 1 Hour
    gcTime: 60 * (60 * 1000), // 1 Hour
    throwOnError: true,
}

//  ---- 

export const callbackOnSucT1S1 = (resp: (CommonAPIResponse | undefined), cb?: () => void) => {
    if (resp) {
        if (resp.success) {
            Swal.fire({
                title: "Success!",
                text: resp.message,
                icon: "success",
                timer: 4000
            });
            if (cb) {
                cb();
            }
        }
    }
}


export const callbackOnSucT1S1_ST1 = (resp: (CommonAPIResponse | undefined), cb?: () => void) => {
    if (resp) {
        if (resp.success) {
            const st = setTimeout(() => {
                if (cb) {
                    cb();
                }
                clearTimeout(st);
            }, 4000);
            Swal.fire({
                title: "Success!",
                text: resp.message,
                icon: "success",
                timer: 4000
            }).then(result => {
                if (result.isConfirmed) {
                    if (cb) {
                        cb();
                    }
                    clearTimeout(st);
                }
            });
        }
    }
}

export const callbackOnSucT1S2 = (resp: (CommonAPIResponseWithZodError | undefined), cb?: () => void) => {
    if (resp) {
        if (resp.success) {
            Swal.fire({
                title: "Success!",
                text: resp.message,
                icon: "success",
                timer: 4000
            });
            if (cb) {
                cb();
            }
        }
    }
}

export const callbackOnSucT1S2_ST1 = (resp: (CommonAPIResponseWithZodError | undefined), cb?: () => void) => {
    if (resp) {
        if (resp.success) {
            const st = setTimeout(() => {
                if (cb) {
                    cb();
                }
                clearTimeout(st);
            }, 4000);
            Swal.fire({
                title: "Success!",
                text: resp.message,
                icon: "success",
                timer: 4000
            }).then(result => {
                if (result.isConfirmed) {
                    if (cb) {
                        cb();
                    }
                    clearTimeout(st);
                }
            });
        }
    }
}

//  ---- 

export const callbackOnErrT1S1 = (resp: (CommonAPIResponse | undefined), cb?: () => void) => {
    if (resp) {
        if (!resp.success) {
            Swal.fire({
                title: "Error!",
                text: resp.message,
                icon: "error",
                timer: 4000
            });
            if (cb) {
                cb();
            }
        }
    }
}

export const callbackOnErrT1S1_ST1 = (resp: (CommonAPIResponse | undefined), cb?: () => void) => {
    if (resp) {
        if (!resp.success) {
            const st = setTimeout(() => {
                if (cb) {
                    cb();
                }
                clearTimeout(st);
            }, 4000);
            Swal.fire({
                title: "Error!",
                text: resp.message,
                icon: "error",
                timer: 4000
            }).then(result => {
                if (result.isConfirmed) {
                    if (cb) {
                        cb();
                    }
                    clearTimeout(st);
                }
            });
        }
    }
}

export const callbackOnErrT1S2 = (resp: (CommonAPIResponseWithZodError | undefined), cb?: () => void) => {
    if (resp) {
        if (!resp.success) {
            Swal.fire({
                title: "Error!",
                text: resp.message,
                icon: "error",
                timer: 4000
            });
            if (cb) {
                cb();
            }
        }
    }
}

export const callbackOnErrT1S2_ST1 = (resp: (CommonAPIResponseWithZodError | undefined), cb?: () => void) => {
    if (resp) {
        if (!resp.success) {
            const st = setTimeout(() => {
                if (cb) {
                    cb();
                }
                clearTimeout(st);
            }, 4000);
            Swal.fire({
                title: "Error!",
                text: resp.message,
                icon: "error",
                timer: 4000
            }).then(result => {
                if (result.isConfirmed) {
                    if (cb) {
                        cb();
                    }
                    clearTimeout(st);
                }
            });
        }
    }
}

//  ---- 

export const callbackErrT1S1 = (resp: (CommonAPIResponse | undefined), cb?: () => void) => {
    if (resp) {
        if (!resp.success) {
            Swal.fire({
                title: "Error!",
                text: resp.message,
                icon: "error",
                timer: 4000
            });
            if (cb) {
                cb();
            }
        }
    }
}

export const callbackErrT1S1_ST1 = (resp: (CommonAPIResponse | undefined), cb?: () => void) => {
    if (resp) {
        if (!resp.success) {
            const st = setTimeout(() => {
                if (cb) {
                    cb();
                }
                clearTimeout(st);
            }, 4000);
            Swal.fire({
                title: "Error!",
                text: resp.message,
                icon: "error",
                timer: 4000
            }).then(result => {
                if (result.isConfirmed) {
                    if (cb) {
                        cb();
                    }
                    clearTimeout(st);
                }
            });
        }
    }
}

export const callbackErrT1S2 = (resp: (CommonAPIResponseWithZodError | undefined), cb?: () => void) => {
    if (resp) {
        if (!resp.success) {
            Swal.fire({
                title: "Error!",
                text: resp.message,
                icon: "error",
                timer: 4000
            });
            if (cb) {
                cb();
            }
        }
    }
}

export const callbackErrT1S2_ST1 = (resp: (CommonAPIResponseWithZodError | undefined), cb?: () => void) => {
    if (resp) {
        if (!resp.success) {
            const st = setTimeout(() => {
                if (cb) {
                    cb();
                }
                clearTimeout(st);
            }, 4000);
            Swal.fire({
                title: "Error!",
                text: resp.message,
                icon: "error",
                timer: 4000
            }).then(result => {
                if (result.isConfirmed) {
                    if (cb) {
                        cb();
                    }
                    clearTimeout(st);
                }
            });
        }
    }
}

//  ---- 

//eslint-disable-next-line
export const QF_TQ_UEF_CatchErrorCB = (isError: boolean, error: any) => {
    // Catch errors.
    if (isError) {
        if (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                timer: 4000
            });
        }
    }
}