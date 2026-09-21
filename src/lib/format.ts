const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const inrDecimal = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatRupees = (value: number) => `₹${inr.format(Math.round(value))}`;

export const formatRupeesExact = (value: number) => `₹${inrDecimal.format(value)}`;

export const formatGrams = (value: number) => `${value.toFixed(3)} g`;

export const dateLabel = () =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" })
    .format(new Date())
    .toUpperCase();

export const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length < 10) return phone;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
};
