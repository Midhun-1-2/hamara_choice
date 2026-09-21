import { createContext, useContext } from "react";

export interface ToastInput {
  title: string;
  detail?: string;
}

export const ToastContext = createContext<(toast: ToastInput) => void>(() => {});

/** Raises a contextual toast from anywhere inside the shell. */
export const useToast = () => useContext(ToastContext);
