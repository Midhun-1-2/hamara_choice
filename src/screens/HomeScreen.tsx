import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import DesktopNavigation from "../components/DesktopNavigation";
import Modal from "../components/Modal";
import PremiumButton from "../components/PremiumButton";
import SchemeCard from "../components/SchemeCard";
import ScreenTransition from "../components/ScreenTransition";
import SuccessOverlay from "../components/SuccessOverlay";
import TopBar from "../components/TopBar";
import HomeTab from "./tabs/HomeTab";
import JoinSchemeTab from "./tabs/JoinSchemeTab";
import WalletTab from "./tabs/WalletTab";
import PaymentsTab from "./tabs/PaymentsTab";
import ProfileTab from "./tabs/ProfileTab";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { useToast } from "../hooks/useToasts";
import { joinScheme, notifications, schemes } from "../data/mock";
import { dateLabel } from "../lib/format";
import { staggerTight, tabVariants } from "../lib/motion";
import type { NavKey } from "../lib/nav";

type Sheet = "none" | "schemes" | "notifications";

interface HomeScreenProps {
  name: string;
  phone: string;
  onSignOut: () => void;
}

export default function HomeScreen({ name, phone, onSignOut }: HomeScreenProps) {
  const [sheet, setSheet] = useState<Sheet>("none");
  const [tab, setTab] = useState<NavKey>("home");
  /*
    Bumped on every navigation, including one that lands on the tab already
    open. It rides in the panel's key, so the panel remounts and deals its
    contents in again — asking for a tab you are already on reads as a refresh
    rather than as a dead press.
  */
  const [visit, setVisit] = useState(0);
  const [subscribed, setSubscribed] = useState<{ scheme: string; detail: string } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const toast = useToast();
  // Only one logo may claim the shared layoutId, so the hidden one is not rendered.
  const isDesktop = useIsDesktop();
  const initial = (name.trim()[0] || "T").toUpperCase();

  const openTab = (next: NavKey) => {
    setTab(next);
    setVisit((count) => count + 1);
  };

  // A new tab always opens at its own beginning, never half way down the last one.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [tab, visit]);

  return (
    <ScreenTransition className="lg:grid lg:h-full lg:grid-cols-[278px_1fr] xl:grid-cols-[296px_1fr]">
      <DesktopNavigation
        active={tab}
        onChange={openTab}
        onSignOut={onSignOut}
        showLogo={isDesktop}
      />

      <div className="flex h-full min-h-0 flex-col">
        <TopBar
          initial={initial}
          showLogo={!isDesktop}
          leading={
            isDesktop && tab === "home" ? (
              <div className="min-w-0">
                <p className="text-[12px] font-medium tracking-luxe uppercase text-gold-700">{dateLabel()}</p>
                <h1 className="mt-1 font-display text-[34px] leading-none text-ink">
                  Hi, <span className="text-gold-shimmer">{(name.trim().split(" ")[0] || "there")}</span>
                </h1>
              </div>
            ) : undefined
          }
          onNotifications={() => setSheet("notifications")}
          onProfile={() => openTab("profile")}
        />

        <div
          ref={scroller}
          /*
            The dock floats clear of the bottom edge, so the runway under the
            content is measured to the top of the coin, not the top of the bar:
            a 55px card 10px off the edge, with the coin standing 40px proud of
            its rule. `pb-28` leaves about two dozen pixels clear of that.
          */
          className="no-scrollbar scroll-smooth-y min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-1 sm:px-6 sm:pb-32 lg:px-10 lg:pb-14 lg:pt-2 xl:px-14"
        >
          <div className="mx-auto w-full max-w-[1180px] 2xl:max-w-[1320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${tab}-${visit}`}
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {tab === "home" && (
                  <HomeTab
                    name={name}
                    onOpenSchemes={() => setSheet("schemes")}
                    onNavigate={openTab}
                  />
                )}
                {tab === "join" && <JoinSchemeTab onJoined={setSubscribed} />}
                {tab === "wallet" && <WalletTab onNavigate={openTab} />}
                {tab === "payments" && <PaymentsTab onNavigate={openTab} />}
                {tab === "profile" && <ProfileTab name={name} phone={phone} onSignOut={onSignOut} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <BottomNavigation active={tab} className="lg:hidden" onChange={openTab} />
      </div>

      <SuccessOverlay
        open={Boolean(subscribed)}
        title={`${subscribed?.scheme ?? ""} subscribed`}
        detail={subscribed?.detail}
        onDone={() => {
          setSubscribed(null);
          openTab("payments");
          toast({ title: `${subscribed?.scheme ?? "Scheme"} subscribed`, detail: subscribed?.detail });
        }}
      />

      <Modal
        open={sheet === "schemes"}
        onClose={() => setSheet("none")}
        eyebrow="Curated plans"
        title="Gold schemes"
        footer={
          <PremiumButton
            onClick={() => {
              setSheet("none");
              openTab("join");
            }}
          >
            Join a scheme
          </PremiumButton>
        }
      >
        <motion.div
          variants={staggerTight}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-3 pb-1"
        >
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.name}
              scheme={{ ...scheme, tenure: joinScheme.tenures[scheme.name] ?? scheme.tenure }}
              action={
                <button
                  type="button"
                  onClick={() => {
                    setSheet("none");
                    toast({ title: `${scheme.name} enquiry sent`, detail: "A concierge will call you" });
                  }}
                  className="tap-area shrink-0 text-[11.5px] font-medium tracking-luxe-sm uppercase text-wine-700 underline decoration-[rgba(212,175,55,0.6)] underline-offset-4"
                >
                  Enquire
                </button>
              }
            />
          ))}
        </motion.div>
      </Modal>

      <Modal
        open={sheet === "notifications"}
        onClose={() => setSheet("none")}
        eyebrow="Recent"
        title="Notifications"
      >
        <motion.ul
          variants={staggerTight}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-2.5 pb-1"
        >
          {notifications.map((item) => (
            <motion.li
              key={item.title}
              variants={tabVariants}
              className="flex gap-3.5 rounded-2xl border border-line-soft bg-cream/70 px-4 py-3.5"
            >
              <span
                aria-hidden
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700"
                style={{ border: "1px solid rgba(212,175,55,0.35)" }}
              >
                <Bell size={14} strokeWidth={1.6} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-medium text-ink">{item.title}</span>
                  <span className="shrink-0 text-[12px] text-muted-soft">{item.time}</span>
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-muted">{item.body}</span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </Modal>
    </ScreenTransition>
  );
}
