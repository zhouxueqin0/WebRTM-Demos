"use client";

import type { User as Teacher } from "../../types/user";
import { useChatStore } from "../../store/chat";
import styles from "./TeacherList.module.css";

interface TeacherListProps {
  teachers: Teacher[];
  onTeacherClick: (teacher: Teacher) => void;
}

export default function TeacherList({
  teachers,
  onTeacherClick,
}: TeacherListProps) {
  const unreadCounts = useChatStore((state) => state.unreadCounts);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Teacher List</h2>
      <div className={styles.list}>
        {teachers.map((teacher) => {
          const unread = unreadCounts[teacher.userId] || 0;
          return (
            <div
              key={teacher.userId}
              className={styles.item}
              onClick={() => onTeacherClick(teacher)}
            >
              <span className={styles.avatar}>{teacher.avatar}</span>
              <span className={styles.name}>{teacher.name}</span>
              {unread > 0 && <span className={styles.badge}>{unread}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
