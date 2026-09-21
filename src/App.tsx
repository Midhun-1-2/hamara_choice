import { AnimatePresence, MotionConfig } from "framer-motion";
import { useState } from "react";
import AppShell from "./components/AppShell";
import SplashScreen from "./screens/SplashScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import OtpScreen from "./screens/OtpScreen";
import MpinScreen from "./screens/MpinScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import type { Account, Screen } from "./types";

const emptyAccount: Account = { name: "", phone: "" };

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [account, setAccount] = useState<Account>(emptyAccount);

  return (
    <MotionConfig reducedMotion="user">
      <AppShell>
        {/* No `mode` here: screens overlap briefly so the logo can morph across them. */}
        <AnimatePresence initial={false}>
          {screen === "splash" && <SplashScreen key="splash" onDone={() => setScreen("registration")} />}

          {screen === "registration" && (
            <RegistrationScreen
              key="registration"
              onContinue={(next) => {
                setAccount(next);
                setScreen("otp");
              }}
            />
          )}

          {screen === "otp" && (
            <OtpScreen
              key="otp"
              phone={account.phone}
              onVerified={() => setScreen("mpin")}
              onBack={() => setScreen("registration")}
            />
          )}

          {/* Setting the MPIN hands over to the sign-in screen, not the vault. */}
          {screen === "mpin" && <MpinScreen key="mpin" onComplete={() => setScreen("login")} />}

          {screen === "login" && (
            <LoginScreen key="login" phone={account.phone} onLogin={() => setScreen("home")} />
          )}

          {screen === "home" && (
            <HomeScreen
              key="home"
              name={account.name}
              phone={account.phone}
              onSignOut={() => setScreen("login")}
            />
          )}
        </AnimatePresence>
      </AppShell>
    </MotionConfig>
  );
}
