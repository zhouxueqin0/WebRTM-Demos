import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app";
import {
  useRTMStore,
  MOCK_TEACHERS,
  MOCK_CLASSROOMS,
  MOCK_STUDENTS,
  type User,
  type Classroom,
} from "../store/rtm";
import { useChatStore } from "../store/chat";
import { useUserStore } from "../store/user";
import TeacherList from "../components/TeacherList";
import StudentList from "../components/StudentList";
import ClassroomList from "../components/ClassroomList";
import ChatDrawer from "../components/ChatDrawer";
import "./styles/Message.css";

interface ChatDrawerState {
  isOpen: boolean;
  mode: "private" | "channel";
  targetId: string;
  targetName: string;
}

export default function Message() {
  const navigate = useNavigate();
  const appStore = useAppStore();
  const rtmStore = useRTMStore();
  const chatStore = useChatStore();
  const userId = useUserStore((s) => s.userId);
  const userRole = useUserStore((s) => s.role);

  const [drawerState, setDrawerState] = useState<ChatDrawerState>({
    isOpen: false,
    mode: "private",
    targetId: "",
    targetName: "",
  });

  useEffect(() => {
    if (!appStore.isLoggedIn || !rtmStore.isLoggedIn) {
      navigate("/");
      return;
    }
  }, [appStore.isLoggedIn, rtmStore.isLoggedIn, navigate]);

  const handlePrivateChatClick = (user: User) => {
    chatStore.openPrivateChat(user.userId);
    setDrawerState({
      isOpen: true,
      mode: "private",
      targetId: user.userId,
      targetName: user.name ?? user.userId,
    });
  };

  const handleClassroomClick = async (classroom: Classroom) => {
    try {
      await chatStore.openChannelChat(classroom.id);
      setDrawerState({
        isOpen: true,
        mode: "channel",
        targetId: classroom.id,
        targetName: classroom.name,
      });
    } catch (error) {
      console.error("Failed to open channel chat:", error);
    }
  };

  const handleCloseDrawer = async () => {
    try {
      await chatStore.closeChat();
      setDrawerState({
        ...drawerState,
        isOpen: false,
      });
    } catch (error) {
      console.error("Failed to close chat:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      await chatStore.sendMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="message-container">
      <h1>RTM SDK Demo</h1>

      <div className="lists-container">
        {userRole === "student" ? (
          <TeacherList
            teachers={MOCK_TEACHERS}
            onTeacherClick={handlePrivateChatClick}
          />
        ) : (
          <StudentList
            students={MOCK_STUDENTS}
            onStudentClick={handlePrivateChatClick}
          />
        )}
        <ClassroomList
          classrooms={MOCK_CLASSROOMS}
          onClassroomClick={handleClassroomClick}
        />
      </div>

      <ChatDrawer
        state={drawerState}
        currentUserId={userId}
        onClose={handleCloseDrawer}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
