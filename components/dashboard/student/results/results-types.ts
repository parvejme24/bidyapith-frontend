export interface CourseGradeRow {
  code: string;
  title: string;
  credits: number;
  type?: string;
  marks?: number;
  grade: string;
  point: number;
  status: "PASSED" | "IN_PROGRESS" | "SCHEDULED";
}

export interface SemesterResultRecord {
  semesterNumber: number;
  semesterTitle: string;
  status: "completed" | "current" | "locked";
  gpa: number;
  totalCredits: number;
  courses: CourseGradeRow[];
  isPublished: boolean;
  publishedDate?: string;
}

export interface GpaTrendPoint {
  label: string;
  value: number;
}
