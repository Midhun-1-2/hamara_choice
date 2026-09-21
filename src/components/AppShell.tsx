import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import PageBackground from "./PageBackground";
import ToastStack from "./Toast";
import { ToastContext } from "../hooks/useToasts";
import type { ToastInput } from "../hooks/useToasts";
import type { ToastMessage } from "../types";

interface AppShellProps {
  children: ReactNode;
}

/**
 * The frame: full-bleed on phones, a seated device on tablet previews, the
 * whole viewport from lg up. Hosts the atmosphere and the toast stack.
 */
export default function AppShell({ children }: AppShellProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const pushToast = useCallback(({ title, detail }: ToastInput) => {
    const id = nextId.current;
    nextId.current += 1;
    setToasts((current) => [...current, { id, title, detail }].slice(-2));
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => pushToast, [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      <div className="flex min-h-dvh w-full items-center justify-center bg-cream sm:p-8 lg:p-0">
        {/* The same set behind the device frame on tablet previews */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 hidden bg-cover bg-center sm:block lg:hidden"
          style={{ backgroundImage: "url(/brand/app-bg-desktop.jpg)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 hidden sm:block lg:hidden"
          style={{
            background:
              "radial-gradient(62% 52% at 50% 40%, rgba(252,250,245,0.72) 0%, rgba(250,246,238,0.86) 72%)",
          }}
        />

        <div className="relative h-dvh w-full overflow-hidden bg-ivory shadow-[0_50px_120px_-48px_rgba(68,48,30,0.5),0_0_0_1px_rgba(232,222,208,0.9)] sm:h-[844px] sm:max-h-[94vh] sm:w-[390px] sm:rounded-[46px] lg:h-dvh lg:max-h-none lg:w-full lg:rounded-none lg:shadow-none">
          <PageBackground />
          {/*
            Named, because dialogs portal themselves in here. Declared beside
            the control that opens them, they would otherwise land wherever
            that control happens to live — for one of them, inside the tab
            scroller, which carries `contain: paint` and so became its
            containing block: the sheet was sized to the scroll area and
            painted under the dock, with its footer button unreachable.
          */}
          <div id="app-frame" className="relative z-10 h-full">
            {children}
          </div>
          <ToastStack toasts={toasts} />
        </div>
      </div>
    </ToastContext.Provider>
  );
}
