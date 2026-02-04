import { useAtomValue } from "jotai";
import type { User as Student } from "../types/user";
import { unreadCountsAtom } from "../store/chat";
import "./StudentList.less";

interface StudentListProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

export default function StudentList({
  students,
  onStudentClick,
}: StudentListProps) {
  const unreadCounts = useAtomValue(unreadCountsAtom);

  return (
    <div className="student-list-container">
      <h2 className="student-list-title">Student List</h2>
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
