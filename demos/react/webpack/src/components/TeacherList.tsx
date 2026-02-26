import type { User } from "../types/user";
import { useChatStore } from "../store/chat";
import "./TeacherList.css";

interface TeacherListProps {
  teachers: User[];
  onTeacherClick: (teacher: User) => void;
}

export default function TeacherList({
  teachers,
  onTeacherClick,
}: TeacherListProps) {
  const unreadCounts = useChatStore((state) => state.unreadCounts);

  return (
    <div className="list-container">
      <h2 className="list-title">Teacher List</h2>
      <div className="list-items">
        {teachers.map((teacher) => {
          const unread = unreadCounts[teacher.userId] || 0;
          return (
            <div
              key={teacher.userId}
              className="list-item"
              onClick={() => onTeacherClick(teacher)}
            >
              <span className="list-avatar">{teacher.avatar}</span>
              <span className="list-name">{teacher.name}</span>
              {unread > 0 && <span className="list-badge">{unread}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
