import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { userIdAtom, userRoleAtom } from "../store/user";
import { clearUnreadAtom } from "../store/chat";
import { isAuthenticated } from "../../../shared/utils/auth";
import {
  subscribeChannel,
  unsubscribeChannel,
  sendChannelMessage,
  sendMessageToUser,
  getGlobalRtmClient,
} from "../../../shared/rtm";
import { MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../mocks/data";
import TeacherList from "../components/TeacherList";
import StudentList from "../components/StudentList";
import ClassroomList from "../components/ClassroomList";
import ChatDrawer from "../components/ChatDrawer";
import type { Classroom, ChatDrawerState, Message } from "../types/chat";
import type { User } from "../types/user";
import "./Message.less";

export default function Message() {
  const navigate = useNavigate();
  const userId = useAtomValue(userIdAtom);
  const userRole = useAtomValue(userRoleAtom);
  const clearUnread = useSetAtom(clearUnreadAtom);

  const [drawerState, setDrawerState] = useState<ChatDrawerState>({
    isOpen: false,
    mode: "private",
    targetId: "",
    targetName: "",
  });

  const currentChannelRef = useRef<string | null>(null);

  // 检查登录状态
  if (!isAuthenticated()) {
    navigate("/");
    return null;
  }

  try {
    getGlobalRtmClient();
  } catch (e) {
    navigate("/");
    return null;
  }

  const handlePrivateChatClick = (user: User) => {
    setDrawerState({
      isOpen: true,
      mode: "private",
      targetId: user.userId,
      targetName: user.name ?? user.userId,
    });

    clearUnread(user.userId);
  };

  const handleClassroomClick = async (classroom: Classroom) => {
    try {
      await subscribeChannel(classroom.id);
      currentChannelRef.current = classroom.id;

      setDrawerState({
        isOpen: true,
        mode: "channel",
        targetId: classroom.id,
        targetName: classroom.name,
      });
    } catch (error) {
      console.error("Failed to subscribe channel:", error);
    }
  };

  const handleCloseDrawer = async () => {
    if (drawerState.mode === "channel" && currentChannelRef.current) {
      try {
        await unsubscribeChannel(currentChannelRef.current);
        currentChannelRef.current = null;
      } catch (error) {
        console.error("Failed to unsubscribe channel:", error);
      }
    }

    setDrawerState({
      ...drawerState,
      isOpen: false,
    });
  };

  const handleSendMessage = async (content: string) => {
    try {
      if (drawerState.mode === "private") {
        await sendMessageToUser(drawerState.targetId, content);
      } else {
        await sendChannelMessage(drawerState.targetId, content);
      }
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
