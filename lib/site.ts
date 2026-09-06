import { DB } from "@/lib/data";

export const SITE = {
  name: DB.meta.name,
  bangla: DB.meta.bangla,
  founded: DB.meta.founded,
  address: DB.meta.address,
  phone: DB.meta.phone,
  email: DB.meta.email,
  students: DB.stats[0].value,
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/courses", label: "Courses" },
  { href: "/faculty", label: "Faculty" },
  { href: "/admissions", label: "Admissions" },
  { href: "/notices", label: "Notices" },
  { href: "/about", label: "About" },
] as const;

export function isNavActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
