import { format, parseISO } from "date-fns";
import { enGB } from "date-fns/locale";

export function formatNoticeDate(iso: string) {
  return format(parseISO(iso), "dd MMM yyyy", { locale: enGB });
}

export function formatEventDay(iso: string) {
  return format(parseISO(iso), "d");
}

export function formatEventMonth(iso: string) {
  return format(parseISO(iso), "MMM", { locale: enGB }).toUpperCase();
}

export function formatTaka(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function initials(name: string) {
  return name
    .replace(/(Prof\.|Dr\.|Barrister|Md\.|Mr\.|Ms\.)\s*/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

export function avatarTone(index: number) {
  return ((index % 4) + 1) as 1 | 2 | 3 | 4;
}

export function meterTone(percent: number) {
  if (percent >= 95) return "hot";
  if (percent >= 75) return "warn";
  return "";
}

export function programTagTone(tag: string) {
  if (tag === "Closing soon") return "rose" as const;
  if (tag === "Seats open") return "jade" as const;
  return "gold" as const;
}

export function noticeTone(type: string) {
  const tones = {
    Exam: "rose",
    Result: "orchid",
    Event: "gold",
    Payment: "gold",
    Academic: "jade",
  } as const;
  return tones[type as keyof typeof tones] ?? "default";
}
