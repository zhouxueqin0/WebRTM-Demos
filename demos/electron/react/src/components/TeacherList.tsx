import type { User as Teacher } from "../store/rtm";
import { useChatStore } from "../store/chat";
import "./styles/TeacherList.less";

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
    <div className="teacher">
      <h2 className="teacher-title">Teacher List</h2>
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
