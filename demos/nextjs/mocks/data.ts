// Mock 数据

import type { Teacher, Classroom } from "../types/chat";

export const MOCK_TEACHERS: Teacher[] = [
  { uid: "teacher_wang", name: "Mr. Wang", avatar: "👨‍🏫" },
  { uid: "teacher_li", name: "Ms. Li", avatar: "👩‍🏫" },
  { uid: "teacher_zhang", name: "Mr. Zhang", avatar: "👨‍💼" },
  { uid: "teacher_chen", name: "Ms. Chen", avatar: "👩‍💼" },
  { uid: "teacher_liu", name: "Mr. Liu", avatar: "👨‍🎓" },
];

export const MOCK_CLASSROOMS: Classroom[] = [
  { id: "math_class", name: "Math Class", studentUid: "" }, // studentUid 在运行时设置
  { id: "english_class", name: "English Class", studentUid: "" },
  { id: "science_class", name: "Science Class", studentUid: "" },
];
