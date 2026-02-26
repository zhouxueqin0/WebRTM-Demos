import type { User } from "../types/user";
import { useChatStore } from "../store/chat";
import "./StudentList.css";

interface StudentListProps {
  students: User[];
  onStudentClick: (student: User) => void;
}

export default function StudentList({
  students,
  onStudentClick,
}: StudentListProps) {
  const unreadCounts = useChatStore((state) => state.unreadCounts);

  return (
    <div className="list-container">
      <h2 className="list-title">Student List</h2>
      <div className="list-items">
        {students.map((student) => {
          const unread = unreadCounts[student.userId] || 0;
          return (
            <div
              key={student.userId}
              className="list-item"
              onClick={() => onStudentClick(student)}
            >
              <span className="list-avatar">{student.avatar}</span>
              <span className="list-name">{student.name}</span>
              {unread > 0 && <span className="list-badge">{unread}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
