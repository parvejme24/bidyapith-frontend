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

export const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  instructor: "Instructor",
  admin: "Administrator",
};

export function getInitials(name: string): string {
  if (!name) return "BU";
  return name
    .replace(/(Prof\.|Dr\.|Barrister|Md\.|Mr\.|Ms\.)\s*/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}

export function formatTimeAgo(timeStr: string): string {
  if (!timeStr) return "recently";
  try {
    const d = new Date(timeStr.replace(" ", "T"));
    if (isNaN(d.getTime())) return timeStr;
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSecs < 60) return "just now";
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return timeStr;
  }
}

export function computeGrade(marks: number): [string, number] {
  if (marks >= 80) return ["A+", 4.0];
  if (marks >= 75) return ["A", 3.75];
  if (marks >= 70) return ["A-", 3.5];
  if (marks >= 65) return ["B+", 3.25];
  if (marks >= 60) return ["B", 3.0];
  if (marks >= 55) return ["B-", 2.75];
  if (marks >= 50) return ["C+", 2.5];
  if (marks >= 45) return ["C", 2.25];
  if (marks >= 40) return ["D", 2.0];
  return ["F", 0.0];
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function formatShortDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}
