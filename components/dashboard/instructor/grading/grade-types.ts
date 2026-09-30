import type { InstructorSection, RosterStudent } from "@/lib/app-types";

export interface GradeRecord {
  mid: number | null;
  assign: number | null;
  final: number | null;
}

export interface SectionStudent extends RosterStudent {
  sectionId?: string;
}

export interface GradeSheetProps {
  sections: InstructorSection[];
  roster: RosterStudent[];
  onSaveDraft: (
    sectionId: string,
    marks: Record<string, GradeRecord>,
  ) => Promise<void>;
  onSubmit: (
    sectionId: string,
    marks: Record<string, GradeRecord>,
  ) => Promise<boolean>;
}
