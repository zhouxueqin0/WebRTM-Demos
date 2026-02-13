export interface User {
  userId: string;
  name?: string;
  avatar?: string;
  role: "teacher" | "student";
}
