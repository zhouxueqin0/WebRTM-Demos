import { type Classroom } from "../store/rtm";
import "./styles/ClassroomList.css";

interface ClassroomListProps {
  classrooms: Classroom[];
  onClassroomClick: (classroom: Classroom) => void;
}

export default function ClassroomList({
  classrooms,
  onClassroomClick,
}: ClassroomListProps) {
  return (
    <div className="list-container">
      <h2 className="list-title">Classroom Channels</h2>
      <div className="list-items">
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="list-item"
            onClick={() => onClassroomClick(classroom)}
          >
            <span className="list-icon">📚</span>
            <span className="list-name">{classroom.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
