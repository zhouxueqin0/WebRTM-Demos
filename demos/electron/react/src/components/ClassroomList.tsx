import type { Classroom } from "../types/chat";
import "./ClassroomList.css";

interface ClassroomListProps {
  classrooms: Classroom[];
  onClassroomClick: (classroom: Classroom) => void;
}

export default function ClassroomList({
  classrooms,
  onClassroomClick,
}: ClassroomListProps) {
  return (
    <div className="classroom-list-container">
      <h2 className="classroom-list-title">Classroom Channels</h2>
      <div className="classroom-list">
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="classroom-list-item"
            onClick={() => onClassroomClick(classroom)}
          >
            <span className="classroom-list-icon">📚</span>
            <span className="classroom-list-name">{classroom.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
