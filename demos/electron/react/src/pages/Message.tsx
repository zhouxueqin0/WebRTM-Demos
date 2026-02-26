import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/chat";
import { MOCK_TEACHERS, MOCK_CLASSROOMS, MOCK_STUDENTS } from "../store/rtm";
import TeacherList from "../components/TeacherList";
import ClassroomList from "../components/ClassroomList";
import ChatDrawer from "../components/ChatDrawer";
import type { Classroom, ChatDrawerState, User as Teacher } from "../store/rtm";
import "./styles/Message.less";
import { useUserStore } from "../store/user";
import StudentList from "../components/StudentList";
import { useRtmStore } from "../store/rtm";

export default function Message() {
  const navigate = useNavigate();
  const userId = useUserStore((s) => s.userId);
  const userRole = useUserStore((s) => s.role);
  const checkRtmStatus = useRtmStore((s) => s.checkRtmStatus);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const openPrivateChat = useChatStore((s) => s.openPrivateChat);
  const openChannelChat = useChatStore((s) => s.openChannelChat);
  const closeChat = useChatStore((s) => s.closeChat);
  const [drawerState, setDrawerState] = useState<ChatDrawerState>({
    isOpen: false,
    mode: "private",
    targetId: "",
    targetName: "",
  });

  const currentChannelRef = useRef<string | null>(null);

  useEffect(() => {
    // 检查登录状态
    if (!checkRtmStatus()) {
      navigate("/");
      return;
    }
  }, [navigate, checkRtmStatus]);

  const handlePrivateChatClick = (teacher: Teacher) => {
    setDrawerState({
      isOpen: true,
      mode: "private",
      targetId: teacher.userId,
      targetName: teacher.name ?? teacher.userId,
    });

    // 清零未读数
    openPrivateChat(teacher.userId);
  };

  const handleClassroomClick = async (classroom: Classroom) => {
    // 使用 Chat Store 的方法，内部会处理监听器注册和频道订阅
    try {
      await openChannelChat(classroom.id);
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
    // 使用 Chat Store 的方法，内部会处理监听器清理和取消订阅
    if (drawerState.mode === "channel" && currentChannelRef.current) {
      try {
        await closeChat("channel");
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
      // 使用 Chat Store 的统一发送方法
      await sendMessage(drawerState.targetId, content, drawerState.mode);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="message">
      <h1>RTM SDK Demo</h1>

      <div className="message-lists">
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
