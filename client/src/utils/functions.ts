import { toast } from "react-toastify"

export const successToast = (titleNotification: string) => {
    toast.success(titleNotification, {
        position: toast.POSITION.TOP_RIGHT,
    });
}

export const failedToast = (titleNotification: string) => {
    toast.error(titleNotification, {
        position: toast.POSITION.TOP_RIGHT,
    });
}

