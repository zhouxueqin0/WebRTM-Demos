"use client";

import type { Classroom } from "../../types/chat";
import styles from "./ClassroomList.module.css";

interface ClassroomListProps {
  classrooms: Classroom[];
  onClassroomClick: (classroom: Classroom) => void;
}

export default function ClassroomList({
  classrooms,
  onClassroomClick,
}: ClassroomListProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Classroom Channels</h2>
      <div className={styles.list}>
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className={styles.item}
            onClick={() => onClassroomClick(classroom)}
          >
            <span className={styles.icon}>📚</span>
            <span className={styles.name}>{classroom.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
