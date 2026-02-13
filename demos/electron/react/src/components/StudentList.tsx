import type { User as Student } from "../types/user";
import { useChatStore } from "../store/chat";
import "./StudentList.css";

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
    <div className="student-list-container">
      <h2 className="student-list-title">Student List</h2>
      <div className="student-list">
        {students.map((student) => {
          const unread = unreadCounts[student.userId] || 0;
          return (
            <div
              key={student.userId}
              className="student-list-item"
              onClick={() => onStudentClick(student)}
            >
              <span className="student-list-avatar">{student.avatar}</span>
              <span className="student-list-name">{student.name}</span>
              {unread > 0 && (
                <span className="student-list-badge">{unread}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
