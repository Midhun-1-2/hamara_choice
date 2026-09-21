export const MOCK_OTP = "123456";
export const OTP_LENGTH = 6;
export const MPIN_LENGTH = 4;
export const OTP_COUNTDOWN = 30;

export const goldRate = {
  quotedOn: "14/09/2026",
  quotedAt: "10:30 AM IST",
  unit: "1 gram",
  karat: "22K",
  price: 14125.0,
  change: -30,
  /** Normalised 0-1 samples driving the movement sparkline. */
  movement: [0.18, 0.22, 0.34, 0.3, 0.46, 0.58, 0.52, 0.64, 0.79, 0.86, 0.74, 0.68, 0.71],
  options: [
    { id: "1g22", label: "1g 22K", unit: "1 gram", karat: "22K", price: 14125.0, change: -30 },
    { id: "8g22", label: "8g 22K", unit: "8 grams", karat: "22K", price: 113000.0, change: -240 },
    { id: "1g18", label: "1g 18K", unit: "1 gram", karat: "18K", price: 11552.0, change: -24 },
  ],
  footnote: "Indicative demo rate · not for transactions",
};

export const referral = {
  code: "KOCHI24",
  headline: "Invite friends to Thirukochi",
  body: "Share your code with friends and family when they join Thirukochi. Referral benefits are as per store policy.",
  invited: 6,
  joined: 4,
  bonusEarned: 4800,
  bonusPending: 1200,
  history: [
    { name: "Arun Nair", status: "Joined", note: "Scheme started", amount: 1500, date: "12 Sep 2026" },
    { name: "Meera Raj", status: "Joined", note: "Scheme started", amount: 1500, date: "04 Sep 2026" },
    { name: "Vishnu P", status: "Joined", note: "First instalment", amount: 1200, date: "28 Aug 2026" },
    { name: "Anjali S", status: "Joined", note: "First instalment", amount: 600, date: "19 Aug 2026" },
    { name: "Rahul Menon", status: "Pending", note: "Awaiting first instalment", amount: 1200, date: "16 Sep 2026" },
  ],
};

export const promos = [
  {
    id: "bridal",
    eyebrow: "The Bridal Edit",
    title: "Celebrate Every Moment with Gold",
    body: "Heirloom craftsmanship for the days you will always remember.",
    action: "Explore Now",
    image: "/brand/bg-ribbons.jpg",
  },
  {
    id: "temple",
    eyebrow: "Temple Heritage",
    title: "Kerala Craft, Carried Forward",
    body: "Hand-finished temple jewellery from our Kochi atelier.",
    action: "View Collection",
    image: "/brand/bg-ribbons.jpg",
  },
  {
    id: "solitaire",
    eyebrow: "Diamond Circle",
    title: "Solitaires Chosen by Hand",
    body: "Certified stones, set the way our house has always set them.",
    action: "Book a Viewing",
    image: "/brand/bg-ribbons.jpg",
  },
];

export const schemeCallout = {
  eyebrow: "Gold Schemes",
  title: "Begin your gold journey, one instalment at a time.",
  body: "Choose a scheme, set a monthly amount and watch your plan grow towards your next purchase.",
  action: "View schemes",
};

export const schemes = [
  { name: "Kanakadhara", tenure: "11 + 1 months", note: "One month's instalment gifted at maturity", minimum: 2500 },
  { name: "Swarna Nidhi", tenure: "18 months", note: "Rate protection on the day you book", minimum: 5000 },
  { name: "Diamond Circle", tenure: "24 months", note: "Priority access to solitaire collections", minimum: 10000 },
];

export const wallet = {
  goldGrams: 8.85,
  goldValue: 125000,
  scheme: { name: "Kanakadhara", paid: 5, total: 12, monthly: 10000 },
};

export const payments = {
  paidThisYear: 50000,
  nextDue: { amount: 10000, date: "01 Oct 2026", scheme: "Kanakadhara" },
  history: [
    { id: "TKG-2409", scheme: "Kanakadhara", amount: 10000, date: "01 Sep 2026", method: "UPI · HDFC", status: "Paid", grams: 0.708 },
    { id: "TKG-2388", scheme: "Kanakadhara", amount: 10000, date: "01 Aug 2026", method: "UPI · HDFC", status: "Paid", grams: 0.712 },
    { id: "TKG-2351", scheme: "Kanakadhara", amount: 10000, date: "01 Jul 2026", method: "Card · ICICI", status: "Paid", grams: 0.699 },
    { id: "TKG-2312", scheme: "Kanakadhara", amount: 10000, date: "01 Jun 2026", method: "UPI · HDFC", status: "Paid", grams: 0.723 },
    { id: "TKG-2276", scheme: "Kanakadhara", amount: 10000, date: "01 May 2026", method: "Netbanking · SBI", status: "Paid", grams: 0.731 },
  ],
};

export const notifications = [
  { title: "Instalment received", body: "₹10,000 credited to Kanakadhara", time: "2h ago" },
  { title: "Rate alert", body: "22K gold eased by ₹30 per gram", time: "Today" },
  { title: "Referral bonus", body: "₹1,500 added for Arun Nair", time: "Yesterday" },
];

export const joinScheme = {
  tenures: {
    Kanakadhara: "11 + 1 months",
    "Swarna Nidhi": "18 months",
    "Diamond Circle": "24 months",
  } as Record<string, string>,
  presets: [2500, 5000, 10000, 25000],
};

export const profile = {
  memberSince: "March 2026",
  kyc: "Verified",
  sections: [
    {
      title: "Account",
      items: [
        { key: "details", label: "Personal details", hint: "Name, address, KYC" },
        { key: "invoices", label: "Certificates & invoices", hint: "Download purchase records" },
      ],
    },
    {
      title: "Security",
      items: [
        { key: "mpin", label: "Change MPIN", hint: "Update your 4-digit vault PIN" },
        { key: "alerts", label: "Login alerts", hint: "Notify me on new sign-ins" },
      ],
    },
    {
      title: "Support",
      items: [
        { key: "help", label: "Help centre", hint: "Scheme and payment questions" },
        { key: "boutique", label: "Contact boutique", hint: "Marine Drive, Kochi" },
      ],
    },
  ],
};

/**
 * Account activity, newest first. `kind` picks the icon, `status` picks the
 * badge; `amount` is omitted for events that move no money.
 */
export const activity = [
  {
    id: "act-1",
    kind: "payment",
    title: "Instalment received",
    detail: "Kanakadhara · UPI · HDFC",
    time: "2 hours ago",
    status: "Completed",
    amount: 10000,
  },
  {
    id: "act-2",
    kind: "gold",
    title: "Gold credited",
    detail: "0.708 g added to your holding",
    time: "2 hours ago",
    status: "Completed",
  },
  {
    id: "act-3",
    kind: "referral",
    title: "Referral bonus",
    detail: "Arun Nair started a scheme",
    time: "Yesterday",
    status: "Completed",
    amount: 1500,
  },
  {
    id: "act-4",
    kind: "referral",
    title: "Referral pending",
    detail: "Rahul Menon · awaiting first instalment",
    time: "3 days ago",
    status: "Pending",
    amount: 1200,
  },
  {
    id: "act-5",
    kind: "rate",
    title: "Rate alert",
    detail: "22K gold eased by ₹30 per gram",
    time: "4 days ago",
    status: "Completed",
  },
  {
    id: "act-6",
    kind: "scheme",
    title: "Scheme running",
    detail: "Kanakadhara · instalment 5 of 12",
    time: "This month",
    status: "Active",
  },
];

/** Standing account state, shown beside the activity feed. */
export const accountStatus = {
  label: "Account active",
  detail: "All instalments up to date",
  lastSync: "Updated 2 hours ago",
};

/** House line, carried in the navigation footer and the sign-in furniture. */
export const houseLine = ["Trust", "Tradition", "Tomorrow"];

export const houseTagline = "Gold for a brighter tomorrow";
