"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../../store/chat";
import { useRtmStore } from "../../store/rtm";
import {
  MOCK_TEACHERS,
  MOCK_CLASSROOMS,
  MOCK_STUDENTS,
} from "../../store/mocks/data";
import TeacherList from "../components/TeacherList";
import ClassroomList from "../components/ClassroomList";
import ChatDrawer from "../components/ChatDrawer";
import type {
  Classroom,
  ChatDrawerState,
  User as Teacher,
} from "../../store/mocks/type";
import "./page.css";
import { useUserStore } from "@/store/user";
import StudentList from "../components/StudentList";

// 强制动态渲染，禁用静态生成
export const dynamic = "force-dynamic";

export default function Message() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const userRole = useUserStore((s) => s.role);

  const checkRtmStatus = useRtmStore((s) => s.checkRtmStatus);
  const openPrivateChat = useChatStore((s) => s.openPrivateChat);
  const openChannelChat = useChatStore((s) => s.openChannelChat);
  const closeChat = useChatStore((s) => s.closeChat);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const [drawerState, setDrawerState] = useState<ChatDrawerState>({
    isOpen: false,
    mode: "private",
    targetId: "",
    targetName: "",
  });

  useEffect(() => {
    // 检查登录状态
    if (!checkRtmStatus()) {
      router.push("/");
      return;
    }

    // 检查 RTM 状态
    if (!checkRtmStatus()) {
      router.push("/");
      return;
    }
  }, [router, checkRtmStatus]);

  const handlePrivateChatClick = (teacher: Teacher) => {
    // 打开私聊（清零未读数）
    openPrivateChat(teacher.userId);

    setDrawerState({
      isOpen: true,
      mode: "private",
      targetId: teacher.userId,
      targetName: teacher.name ?? teacher.userId,
    });
  };

  const handleClassroomClick = async (classroom: Classroom) => {
    try {
      // 打开频道聊天（订阅 + 注册监听器）
      await openChannelChat(classroom.id);

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
      // 关闭聊天（取消订阅 + 清理监听器）
      await closeChat(drawerState.mode);

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
      // 发送消息（通过 Chat Store）
      await sendMessage(drawerState.targetId, content, drawerState.mode);
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
