export interface StudentData {
  id: string;
  name: string;
  email: string;
  dept: string;
  batch?: string;
  cgpa?: number | string;
  credits?: number | string;
  phone?: string;
  guardian?: string;
  status: "active" | "suspended" | "graduated" | "on leave";
  joined: string;
  avatar?: string;
}
