import * as yup from "yup";

export const validationLogin = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is incorrect"),
    password: yup.string().required("Password is required").min(6, "password cannot be less than 6 characters"),
  })