import type { DegreeProgram, StudentCourse } from "@/lib/app-types";
import { computeGrade } from "@/lib/format";
import type { SemesterResultRecord, CourseGradeRow, GpaTrendPoint } from "./results-types";

const GRADE_DISTRIBUTION: Array<Array<{ grade: string; point: number; marks: number }>> = [
  // Semester 1
  [
    { grade: "A+", point: 4.0, marks: 92 },
    { grade: "A+", point: 4.0, marks: 95 },
    { grade: "A", point: 3.75, marks: 78 },
    { grade: "A-", point: 3.5, marks: 73 },
    { grade: "A", point: 3.75, marks: 76 },
  ],
  // Semester 2
  [
    { grade: "A+", point: 4.0, marks: 88 },
    { grade: "A", point: 3.75, marks: 79 },
    { grade: "A+", point: 4.0, marks: 94 },
    { grade: "A+", point: 4.0, marks: 86 },
    { grade: "A-", point: 3.5, marks: 74 },
  ],
  // Semester 3
  [
    { grade: "A", point: 3.75, marks: 77 },
    { grade: "A+", point: 4.0, marks: 91 },
    { grade: "A-", point: 3.5, marks: 72 },
    { grade: "A+", point: 4.0, marks: 89 },
  ],
  // Semester 4
  [
    { grade: "A+", point: 4.0, marks: 90 },
    { grade: "A+", point: 4.0, marks: 93 },
    { grade: "A", point: 3.75, marks: 78 },
    { grade: "A+", point: 4.0, marks: 87 },
  ],
];

export function generateAllSemesterResults(
  program: DegreeProgram,
  enrolledCurrent: StudentCourse[]
): SemesterResultRecord[] {
  return program.semesters.map((sem, sIdx) => {
    const isCompleted = sem.status === "completed";
    const isCurrent = sem.status === "current";
    const isLocked = sem.status === "locked";

    const semTitle = `Semester ${sem.semesterNumber}`;
    const courses: CourseGradeRow[] = (sem.courses || []).map((c, cIdx) => {
      if (isCompleted) {
        const gradeInfo = GRADE_DISTRIBUTION[sIdx]?.[cIdx] || { grade: "A", point: 3.75, marks: 78 };
        return {
          code: c.code,
          title: c.title,
          credits: c.credits,
          type: c.type,
          marks: gradeInfo.marks,
          grade: gradeInfo.grade,
          point: gradeInfo.point,
          status: "PASSED",
        };
      }

      if (isCurrent) {
        // Find matching course in enrolledCurrent or estimate
        const activeCourse = enrolledCurrent.find((e) => e.code === c.code);
        const marks = activeCourse ? activeCourse.marks : 82;
        const [grade, point] = computeGrade(marks);
        return {
          code: c.code,
          title: c.title,
          credits: c.credits,
          type: c.type,
          marks: marks,
          grade: grade,
          point: point,
          status: "IN_PROGRESS",
        };
      }

      // Locked / Upcoming
      return {
        code: c.code,
        title: c.title,
        credits: c.credits,
        type: c.type,
        grade: "—",
        point: 0.0,
        status: "SCHEDULED",
      };
    });

    // Compute semester GPA
    let totalPoints = 0;
    let earnedCredits = 0;

    courses.forEach((c) => {
      if (c.status === "PASSED" || c.status === "IN_PROGRESS") {
        totalPoints += c.point * c.credits;
        earnedCredits += c.credits;
      }
    });

    const gpa = earnedCredits > 0 ? Number((totalPoints / earnedCredits).toFixed(2)) : 0.0;
    const semTotalCredits = courses.reduce((acc, c) => acc + c.credits, 0);

    return {
      semesterNumber: sem.semesterNumber,
      semesterTitle: semTitle,
      status: (sem.status || "completed") as "completed" | "current" | "locked",
      gpa,
      totalCredits: semTotalCredits,
      courses,
      isPublished: isCompleted,
      publishedDate: isCompleted ? `202${4 + Math.floor(sIdx / 2)}-0${sIdx % 2 === 0 ? "6" : "1"}-15` : undefined,
    };
  });
}

export function computeGpaTrend(results: SemesterResultRecord[]): GpaTrendPoint[] {
  return results
    .filter((r) => r.status === "completed" || r.status === "current")
    .map((r) => ({
      label: `Sem ${r.semesterNumber}`,
      value: r.gpa,
    }));
}
