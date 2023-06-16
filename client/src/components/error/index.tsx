import React from "react"
import { FieldError } from "react-hook-form"

interface ErrorFormProps {
  message: string | FieldError | undefined
}

const ErrorForm = (props: ErrorFormProps) => {
  const { message } = props
  return <span className="text-red-500">{message?.toString()}</span>
}

export default ErrorForm
