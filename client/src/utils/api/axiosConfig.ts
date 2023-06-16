import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import Router from "next/router";
import { successToast, failedToast } from "@/utils/functions"

interface ValidationError {
  message: string,
  success: boolean
}

const isServer = () => {
  return typeof window === "undefined";
}

let accessToken = "";
let context = <GetServerSidePropsContext>{};
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const setAccessToken = (_accessToken: string) => {
  accessToken = _accessToken
}

export const getAccessToken = () => (accessToken)

export const setContext = (_context: GetServerSidePropsContext) => {
  context = _context;
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // to send cookie
})

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  if (isServer() && context?.req?.cookies) {
    config.headers.Cookie = `gid=${context.req.cookies.gid};`
  }
  return config;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if (axios.isAxiosError<ValidationError>(error)) {
      if (error.response?.data.message)
        failedToast(error?.response?.data?.message)
    } else {
      failedToast(error.message)
    }

  }
)
