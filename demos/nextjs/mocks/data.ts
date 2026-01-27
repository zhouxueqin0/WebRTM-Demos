// Mock 数据

import { User } from "@/types/user";
import type { Classroom } from "../types/chat";

export const MOCK_TEACHERS: User[] = [
  { userId: "teacher_wang", name: "Mr. Wang", avatar: "👨‍🏫", role: "teacher" },
  { userId: "teacher_li", name: "Ms. Li", avatar: "👩‍🏫", role: "teacher" },
  { userId: "teacher_zhang", name: "Mr. Zhang", avatar: "👨‍💼", role: "teacher" },
  { userId: "teacher_chen", name: "Ms. Chen", avatar: "👩‍💼", role: "teacher" },
  { userId: "teacher_liu", name: "Mr. Liu", avatar: "👨‍🎓", role: "teacher" },
];

export const MOCK_STUDENTS: User[] = [
  { userId: "student_wang", name: "Ms. Wang", avatar: "👨‍🏫", role: "student" },
  { userId: "student_li", name: "Ms. Li", avatar: "👩‍🏫", role: "student" },
  { userId: "student_zhang", name: "Ms. Zhang", avatar: "👨‍💼", role: "student" },
  { userId: "student_chen", name: "Ms. Chen", avatar: "👩‍💼", role: "student" },
  { userId: "student_liu", name: "Ms. Liu", avatar: "👨‍🎓", role: "student" },
];

export const MOCK_CLASSROOMS: Classroom[] = [
  { id: "math_class", name: "Math Class", users: [] }, // 在运行时设置
  { id: "english_class", name: "English Class", users: [] },
  { id: "science_class", name: "Science Class", users: [] },
];
