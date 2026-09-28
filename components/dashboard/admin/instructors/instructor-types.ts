export interface InstructorData {
  id: string;
  name: string;
  email: string;
  dept: string;
  designation?: string;
  phone?: string;
  room?: string;
  status: "active" | "suspended" | "on leave" | "graduated";
  joined: string;
  sectionsCount?: number;
  studentsCount?: number;
  avatar?: string;
}
