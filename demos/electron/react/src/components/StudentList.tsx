import type { User as Student } from "../store/rtm";
import { useChatStore } from "../store/chat";
import "./styles/StudentList.less";

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
    <div className="student">
      <h2 className="student-title">Student List</h2>
      <div className="student-list">
        {students.map((student) => {
          const unread = unreadCounts[student.userId] || 0;
          return (
            <div
              key={student.userId}
              className="student-item"
              onClick={() => onStudentClick(student)}
            >
              <span className="student-avatar">{student.avatar}</span>
              <span className="student-name">{student.name}</span>
              {unread > 0 && <span className="student-badge">{unread}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
