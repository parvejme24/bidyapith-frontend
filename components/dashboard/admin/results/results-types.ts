export interface StudentGradeRecord {
  studentId: string;
  studentName: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  instructorName: string;
  term: string;
  department: string;
  midterm: number;
  assignment: number;
  finalExam: number;
  total: number;
  letterGrade: string;
  gradePoint: number;
  status: "published" | "submitted" | "draft";
}

export interface HistoricalTranscriptRecord {
  term: string;
  gpa: number;
  credits: number;
  courses: {
    code: string;
    title: string;
    credits: number;
    grade: string;
    point: number;
  }[];
}
