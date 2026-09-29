import { apiClient } from "@/lib/api-client";
import { DB } from "@/lib/data";
import type {
  ApiEnvelope,
  Collection,
  Course,
  Database,
  Department,
  FacultyMember,
  Notice,
  Program,
} from "@/lib/types";

const DEFAULT_DELAY_MS = 100;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function get<K extends Collection>(
  collection: K,
  options: { delay?: number } = {},
): Promise<ApiEnvelope<Database[K]>> {
  const delay = options.delay ?? DEFAULT_DELAY_MS;
  if (delay > 0) await wait(delay);

  try {
    if (collection === "departments") {
      const res = await apiClient.departments.getAll({ limit: "100" }).catch(() => null);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const liveDepts: Department[] = res.data.map((d) => {
          const codeLower = d.code.toLowerCase();
          const fallback = DB.departments.find(
            (f) => f.id === codeLower || f.name.toLowerCase() === d.name.toLowerCase()
          );
          return {
            id: codeLower,
            name: d.name,
            school:
              fallback?.school ||
              (d.name.includes("Engineering")
                ? "School of Engineering & Physical Sciences"
                : d.name.includes("Business")
                ? "School of Business & Economics"
                : d.name.includes("Law")
                ? "School of Law"
                : d.name.includes("Pharmacy")
                ? "School of Health & Life Sciences"
                : "School of Humanities & Social Sciences"),
            head: fallback?.head || "Prof. Department Head",
            programs: fallback?.programs || 3,
            courses: fallback?.courses || 24,
            faculty: fallback?.faculty || 18,
          };
        });
        return {
          success: true,
          message: "Fetched live departments from API",
          data: liveDepts as Database[K],
        };
      }
    }

    if (collection === "programs") {
      const res = await apiClient.programs.getAll({ limit: "100" }).catch(() => null);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const livePrograms: Program[] = res.data.map((p) => {
          const codeLower = p.code.toLowerCase();
          const deptMatch =
            p.department?.code?.toLowerCase() ||
            (codeLower.includes("cse") || codeLower.includes("cs")
              ? "cse"
              : codeLower.includes("eee")
              ? "eee"
              : codeLower.includes("bba")
              ? "bba"
              : codeLower.includes("law")
              ? "law"
              : codeLower.includes("pharm")
              ? "pharm"
              : "cse");

          const fallback = DB.programs.find(
            (item) =>
              item.code.toLowerCase() === p.code.toLowerCase() ||
              item.name.toLowerCase() === p.name.toLowerCase()
          );

          const isUndergrad =
            p.degreeType === "BSC" ||
            p.degreeType === "BA" ||
            p.degreeType === "BBA" ||
            p.degreeType === "UNDERGRADUATE" ||
            p.degreeType === "BACHELORS";

          const feePerCredit = Number(p.feePerCredit || 4500);
          const totalCredits = Number(p.totalCredits || 140);
          const years = Number(p.durationYears || 4);
          const semesterTuition = Math.round((totalCredits / (years * 2)) * feePerCredit);

          return {
            code: p.code,
            name: p.name,
            dept: deptMatch,
            school:
              fallback?.school ||
              (p.department?.name?.includes("Engineering")
                ? "School of Engineering & Physical Sciences"
                : p.department?.name?.includes("Business")
                ? "School of Business & Economics"
                : p.department?.name?.includes("Law")
                ? "School of Law"
                : p.department?.name?.includes("Pharmacy")
                ? "School of Health & Life Sciences"
                : "School of Engineering & Physical Sciences"),
            level: isUndergrad ? "Undergraduate" : "Graduate",
            credits: totalCredits,
            years,
            seats: fallback?.seats || 120,
            filled: fallback?.filled || 98,
            tuition: fallback?.tuition || semesterTuition,
            tag: p.code,
            about:
              fallback?.about ||
              `Comprehensive degree programme in ${p.name} designed with rigorous academic standards and modern industry requirements.`,
            highlights: fallback?.highlights || [
              "Industry-aligned curriculum and laboratory facilities",
              "Renowned research faculty and academic mentorship",
              "Mandatory capstone / professional internship placement",
              "Global academic accreditation and credit transfer pathway",
            ],
          };
        });
        return {
          success: true,
          message: "Fetched live programs from API",
          data: livePrograms as Database[K],
        };
      }
    }

    if (collection === "courses") {
      const [coursesRes, offeringsRes] = await Promise.all([
        apiClient.courses.getAll({ limit: "100" }).catch(() => null),
        apiClient.offerings.getAll({ limit: "100" }).catch(() => null),
      ]);

      if (coursesRes?.data && Array.isArray(coursesRes.data) && coursesRes.data.length > 0) {
        const offeringsList = Array.isArray(offeringsRes?.data) ? offeringsRes.data : [];
        const liveCourses: Course[] = (coursesRes.data as any[]).map((c) => {
          const codeUpper = (c.code || "").toUpperCase();
          const deptCode =
            c.department?.code?.toLowerCase() ||
            (codeUpper.startsWith("CSE")
              ? "cse"
              : codeUpper.startsWith("EEE")
              ? "eee"
              : codeUpper.startsWith("BBA") ||
                codeUpper.startsWith("ACT") ||
                codeUpper.startsWith("FIN") ||
                codeUpper.startsWith("MKT")
              ? "bba"
              : codeUpper.startsWith("ENG")
              ? "eng"
              : codeUpper.startsWith("LAW")
              ? "law"
              : codeUpper.startsWith("PHR") || codeUpper.startsWith("BIO")
              ? "pharm"
              : "cse");

          const matchingOffering = (offeringsList as any[]).find(
            (o: any) => o.courseId === c.id || o.course?.code === c.code || o.course?.id === c.id
          );

          const fallback = DB.courses.find(
            (fc) => fc.code.toUpperCase() === codeUpper
          );

          const instructorName = matchingOffering?.instructor?.user
            ? `${matchingOffering.instructor.user.firstName} ${matchingOffering.instructor.user.lastName}`
            : fallback?.instructor || "Prof. Academic Faculty";

          return {
            code: c.code,
            title: c.title,
            dept: deptCode,
            credits: Number(c.credits || 3),
            level: Number(c.level || 100),
            semester:
              fallback?.semester ||
              (c.level && Number(c.level) >= 400 ? "Level 4" : "Fall"),
            prereq: fallback?.prereq || "None",
            instructor: instructorName,
            seats: Number(matchingOffering?.capacity || fallback?.seats || 40),
            taken: Number(matchingOffering?.enrolledCount || fallback?.taken || 28),
          };
        });
        return {
          success: true,
          message: "Fetched live courses from API",
          data: liveCourses as Database[K],
        };
      }
    }

    if (collection === "faculty") {
      const res = await apiClient.instructors.getAll({ limit: "100" }).catch(() => null);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const liveFaculty: FacultyMember[] = res.data.map((inst, idx) => {
          const deptCode = (inst as any).department?.code?.toLowerCase() || "cse";
          const fallback =
            DB.faculty.find((f) => f.email.toLowerCase() === inst.user.email?.toLowerCase()) ||
            DB.faculty[idx % DB.faculty.length];
          const designationMap: Record<string, string> = {
            PROFESSOR: "Professor",
            ASSOCIATE_PROFESSOR: "Associate Professor",
            ASSISTANT_PROFESSOR: "Assistant Professor",
            LECTURER: "Lecturer",
          };
          const role =
            designationMap[inst.designation] || inst.designation || fallback?.role || "Assistant Professor";

          return {
            name: `${inst.user.firstName} ${inst.user.lastName}`,
            dept: deptCode,
            role,
            field:
              inst.specialization ||
              fallback?.field ||
              "Computer Systems & Machine Learning",
            email: inst.user.email,
            office:
              fallback?.office ||
              `Academic Complex AB${(idx % 4) + 1}-${200 + ((idx * 5) % 80)}`,
            since: fallback?.since || 2021,
            papers: fallback?.papers || (12 + ((idx * 3) % 25)),
            bio:
              fallback?.bio ||
              `${role} in the Department of ${deptCode.toUpperCase()}, focusing on ${
                inst.specialization || "advanced research and university curriculum"
              }.`,
            avatar: inst.user.avatarUrl || fallback?.avatar || undefined,
          };
        });
        return {
          success: true,
          message: "Fetched live instructors from API",
          data: liveFaculty as Database[K],
        };
      }
    }

    if (collection === "notices") {
      const res = await apiClient.notifications.getAll().catch(() => null);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const typeMap: Record<string, Notice["type"]> = {
          ANNOUNCEMENT: "Registration",
          ENROLLMENT: "Registration",
          ATTENDANCE: "Academic",
          PAYMENT: "Finance",
          RESULT: "Exam",
          SYSTEM: "General",
        };
        const liveNotices: Notice[] = res.data.map((n, idx) => ({
          id: idx + 1,
          title: n.title,
          date: n.createdAt ? n.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
          type: typeMap[n.type] || (n.type as Notice["type"]) || "General",
          pinned: idx === 0 || n.type === "ANNOUNCEMENT",
          body: n.body,
        }));
        return {
          success: true,
          message: "Fetched live notifications from API",
          data: liveNotices as Database[K],
        };
      }
    }

    if (collection === "fees") {
      const progRes = await apiClient.programs.getAll({ limit: "100" }).catch(() => null);
      if (progRes?.data && Array.isArray(progRes.data) && progRes.data.length > 0) {
        const liveFees = progRes.data.map((p) => {
          const feePerCredit = Number(p.feePerCredit || 4500);
          const totalCredits = Number(p.totalCredits || 140);
          const years = Number(p.durationYears || 4);
          const admissionFee = Number(p.registrationFee || 25000);
          const semesterFee = Math.round((totalCredits / (years * 2)) * feePerCredit);
          const totalFee = Math.round(feePerCredit * totalCredits + admissionFee);

          return {
            program: p.name,
            admission: admissionFee,
            perCredit: feePerCredit,
            semester: semesterFee,
            total: totalFee,
          };
        });
        return {
          success: true,
          message: "Fetched live program fees from API",
          data: liveFees as Database[K],
        };
      }
    }

    if (collection === "meta") {
      const currentSem = await apiClient.semesters.getCurrent().catch(() => null);
      if (currentSem?.data) {
        return {
          success: true,
          message: "Fetched current semester meta from API",
          data: {
            ...DB.meta,
            semester: currentSem.data.name || `${currentSem.data.term} ${currentSem.data.year}`,
            admissionCloses: currentSem.data.registrationEnd || DB.meta.admissionCloses,
          } as Database[K],
        };
      }
    }
  } catch (e) {
    console.warn(`[API] Could not fetch live collection ${collection}, falling back:`, e);
  }

  return {
    success: true,
    message: "Operation successful",
    data: DB[collection],
  };
}

export function deptName(id: string) {
  const department = DB.departments.find((item) => item.id === id);
  return department ? department.name : id;
}

export function deptShort(id: string) {
  return (DB.departments.find((item) => item.id === id)?.name || id).replace(
    / ?& ?Engineering/,
    "",
  );
}

export const api = {
  get,
  deptName,
  deptShort,
};
