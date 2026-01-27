"use client";
import type { User as Student } from "../../types/user";
import { useChatStore } from "../../store/chat";
import styles from "./StudentList.module.css";

interface StudentListProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

export default function StudentList({
  students,
  onStudentClick,
}: StudentListProps) {
  const unreadCounts = useChatStore((state) => state.unreadCounts);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Student List</h2>
      <div className={styles.list}>
        {students.map((student) => {
          const unread = unreadCounts[student.userId] || 0;
          return (
            <div
              key={student.userId}
              className={styles.item}
              onClick={() => onStudentClick(student)}
            >
              <span className={styles.avatar}>{student.avatar}</span>
              <span className={styles.name}>{student.name}</span>
              {unread > 0 && <span className={styles.badge}>{unread}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
