import { CalendarPlus, Home, Receipt, User, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavKey = "home" | "wallet" | "join" | "payments" | "profile";

export interface NavItem {
  key: NavKey;
  label: string;
  /** Shorter form for the phone dock, where width is scarce. */
  short: string;
  icon: LucideIcon;
  hint: string;
}

/** One source of truth for the rail, the dock and any jump list. */
export const navItems: NavItem[] = [
  { key: "home", label: "Home", short: "Home", icon: Home, hint: "Rate, journey and offers" },
  { key: "wallet", label: "Wallet", short: "Wallet", icon: Wallet, hint: "Holdings and referral bonus" },
  { key: "join", label: "Join Scheme", short: "Schemes", icon: CalendarPlus, hint: "Start a new gold plan" },
  { key: "payments", label: "Payments", short: "Payments", icon: Receipt, hint: "Instalments and receipts" },
  { key: "profile", label: "Profile", short: "Profile", icon: User, hint: "Account, security, support" },
];
