import { loginApi } from "@/utils/api/authApi"
import { successToast, failedToast } from "@/utils/functions"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    return useMutation({
        mutationFn: loginApi, 
    })
}