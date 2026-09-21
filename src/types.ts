export type Screen = "splash" | "registration" | "otp" | "mpin" | "login" | "home";

export interface Account {
  name: string;
  phone: string;
}

export interface ToastMessage {
  id: number;
  title: string;
  detail?: string;
}
