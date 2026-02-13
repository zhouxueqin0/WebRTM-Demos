import type { User as Teacher } from "../types/user";
import { useChatStore } from "../store/chat";
import "./TeacherList.css";

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
    <div className="teacher-list-container">
      <h2 className="teacher-list-title">Teacher List</h2>
      <div className="teacher-list">
        {teachers.map((teacher) => {
          const unread = unreadCounts[teacher.userId] || 0;
          return (
            <div
              key={teacher.userId}
              className="teacher-list-item"
              onClick={() => onTeacherClick(teacher)}
            >
              <span className="teacher-list-avatar">{teacher.avatar}</span>
              <span className="teacher-list-name">{teacher.name}</span>
              {unread > 0 && (
                <span className="teacher-list-badge">{unread}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
