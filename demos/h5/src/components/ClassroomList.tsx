import type { Classroom } from "../store/rtm";
import "./styles/ClassroomList.less";

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
            className="classroom-item"
            onClick={() => onClassroomClick(classroom)}
          >
            <span className="classroom-icon">📚</span>
            <span className="classroom-name">{classroom.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
