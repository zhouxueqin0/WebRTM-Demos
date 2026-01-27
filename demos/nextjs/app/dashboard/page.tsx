"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../shared/utils/auth";
import {
  subscribeChannel,
  unsubscribeChannel,
  sendChannelMessage,
  sendMessageToUser,
  getGlobalRtmClient,
  rtmEventEmitter,
} from "../../../shared/rtm/index";

import { handleMessage, useChatStore } from "../../store/chat";
import {
  MOCK_TEACHERS,
  MOCK_CLASSROOMS,
  MOCK_STUDENTS,
} from "../../mocks/data";
import TeacherList from "../components/TeacherList";
import ClassroomList from "../components/ClassroomList";
import ChatDrawer from "../components/ChatDrawer";
import type { Classroom, ChatDrawerState, Message } from "../../types/chat";
import type { User as Teacher } from "../../types/user";
import "./page.css";
import { useUserStore } from "@/store/user";
import StudentList from "../components/StudentList";

// 强制动态渲染，禁用静态生成
export const dynamic = "force-dynamic";

export default function Dashboard() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const userRole = useUserStore((s) => s.role);
  const [classrooms, setClassrooms] = useState(MOCK_CLASSROOMS);
  const [drawerState, setDrawerState] = useState<ChatDrawerState>({
    isOpen: false,
    mode: "private",
    targetId: "",
    targetName: "",
  });

  const currentChannelRef = useRef<string | null>(null);

  const clearUnread = useChatStore((s) => s.clearUnread);

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    try {
      getGlobalRtmClient();
    } catch (e) {
      router.push("/");
    }

    rtmEventEmitter.addListener("message", handleMessage);

    return () => {
      rtmEventEmitter.removeListener("message", handleMessage);
    };
  }, [router]);

  const handlePrivateChatClick = (teacher: Teacher) => {
    setDrawerState({
      isOpen: true,
      mode: "private",
      targetId: teacher.userId,
      targetName: teacher.name ?? teacher.userId,
    });

    // 清零未读数
    clearUnread(teacher.userId);
  };

  const handleClassroomClick = async (classroom: Classroom) => {
    // 订阅频道
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
    // 如果是频道模式，取消订阅
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
        // 发送私聊消息
        await sendMessageToUser(drawerState.targetId, content);

        // 添加到本地消息列表 - 使用 getState()
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: userId,
          senderName: "Me",
          content,
          timestamp: Date.now(),
        };
        useChatStore.getState().addPrivateMessage(drawerState.targetId, msg);
      } else {
        // 发送频道消息
        await sendChannelMessage(drawerState.targetId, content);

        // 添加到本地消息列表 - 使用 getState()
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: userId,
          senderName: "Me",
          content,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="dashboard-container">
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
          classrooms={classrooms}
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
