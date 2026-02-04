import { useAtomValue } from "jotai";
import type { User as Teacher } from "../types/user";
import { unreadCountsAtom } from "../store/chat";
import "./TeacherList.less";

interface TeacherListProps {
  teachers: Teacher[];
  onTeacherClick: (teacher: Teacher) => void;
}

export default function TeacherList({
  teachers,
  onTeacherClick,
}: TeacherListProps) {
  const unreadCounts = useAtomValue(unreadCountsAtom);

  return (
    <div className="teacher-list-container">
      <h2 className="teacher-list-title">Teacher List</h2>
      <div className="teacher-list">
        {teachers.map((teacher) => {
          const unread = unreadCounts[teacher.userId] || 0;
          return (
            <div
              key={teacher.userId}
              className="teacher-item"
              onClick={() => onTeacherClick(teacher)}
            >
              <span className="teacher-avatar">{teacher.avatar}</span>
              <span className="teacher-name">{teacher.name}</span>
              {unread > 0 && <span className="teacher-badge">{unread}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
