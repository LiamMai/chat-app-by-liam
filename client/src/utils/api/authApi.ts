import { AUTH_API_URL } from '@/constants/apiConstants'
import { api } from './axiosConfig' 
import { ILoginBody } from '../types/authTypes'

export const loginApi = (body: ILoginBody) => {
    return api.post(AUTH_API_URL.LOGIN, body)
}

