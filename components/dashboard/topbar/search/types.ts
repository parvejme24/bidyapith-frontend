import React from "react";

export type SearchCategory =
  | "Navigation"
  | "Course"
  | "Study"
  | "Teaching"
  | "Section"
  | "Student"
  | "User"
  | "Attendance"
  | "Finance"
  | "Notice"
  | "Advising"
  | "Audit";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
  icon: React.ReactNode;
}
