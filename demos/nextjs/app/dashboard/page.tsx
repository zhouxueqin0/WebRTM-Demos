"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../shared/utils/auth";
import { getGlobalRtmClient } from "../../../shared/rtm/index";
import { sendMessageToUser } from "../../../shared/rtm/message";
import {
  subscribeChannel,
  unsubscribeChannel,
  sendChannelMessage,
} from "../../../shared/rtm/streamchannel";
import { useChatStore } from "../../store/chat";
import { MOCK_TEACHERS, MOCK_CLASSROOMS } from "../../mocks/data";
import TeacherList from "../components/TeacherList";
import ClassroomList from "../components/ClassroomList";
import ChatDrawer from "../components/ChatDrawer";
import type {
  Teacher,
  Classroom,
  ChatDrawerState,
  Message,
} from "../../types/chat";
import "./page.css";

export default function Dashboard() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState("");
  const [classrooms, setClassrooms] = useState(MOCK_CLASSROOMS);
  const [drawerState, setDrawerState] = useState<ChatDrawerState>({
    isOpen: false,
    mode: "private",
    targetId: "",
    targetName: "",
  });

  const currentChannelRef = useRef<string | null>(null);

  const addPrivateMessage = useChatStore((s) => s.addPrivateMessage);
  const addChannelMessage = useChatStore((s) => s.addChannelMessage);
  const clearUnread = useChatStore((s) => s.clearUnread);
  const incrementUnread = useChatStore((s) => s.incrementUnread);

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    // 获取当前用户 ID
    const username = localStorage.getItem("username") || "student";
    setCurrentUserId(username);

    // 设置课程的 studentUid
    setClassrooms(MOCK_CLASSROOMS.map((c) => ({ ...c, studentUid: username })));

    // 初始化 RTM 监听
    let rtmClient;
    try {
      rtmClient = getGlobalRtmClient();
    } catch (error) {
      console.error("RTM client not initialized:", error);
      return;
    }

    // 监听私聊消息
    const handleMessage = (event: any) => {
      const { publisher, message, channelType } = event;

      // 只处理私聊消息
      if (channelType === "USER") {
        // 查找是否是老师发来的消息
        const teacher = MOCK_TEACHERS.find((t) => t.uid === publisher);
        if (teacher) {
          const msg: Message = {
            id: `${Date.now()}-${Math.random()}`,
            senderId: publisher,
            senderName: teacher.name,
            content: message,
            timestamp: Date.now(),
          };

          addPrivateMessage(teacher.uid, msg);

          // 如果当前没有打开该老师的聊天窗口，增加未读数
          if (!drawerState.isOpen || drawerState.targetId !== teacher.uid) {
            incrementUnread(teacher.uid);
          }
        }
      } else if (channelType === "MESSAGE") {
        // 处理频道消息
        const { channelName } = event;

        // 查找发送者名称
        let senderName = publisher;
        const teacher = MOCK_TEACHERS.find((t) => t.uid === publisher);
        if (teacher) {
          senderName = teacher.name;
        } else if (publisher === username) {
          senderName = "Me";
        }

        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: publisher,
          senderName,
          content: message,
          timestamp: Date.now(),
        };

        addChannelMessage(channelName, msg);
      }
    };

    rtmClient.addEventListener("message", handleMessage);

    return () => {
      rtmClient.removeEventListener("message", handleMessage);

      // 清理频道订阅
      if (currentChannelRef.current) {
        unsubscribeChannel(currentChannelRef.current).catch(console.error);
      }
    };
  }, [
    drawerState,
    addPrivateMessage,
    addChannelMessage,
    incrementUnread,
    router,
  ]);

  const handleTeacherClick = (teacher: Teacher) => {
    setDrawerState({
      isOpen: true,
      mode: "private",
      targetId: teacher.uid,
      targetName: teacher.name,
    });

    // 清零未读数
    clearUnread(teacher.uid);
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

        // 添加到本地消息列表
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: currentUserId,
          senderName: "Me",
          content,
          timestamp: Date.now(),
        };
        addPrivateMessage(drawerState.targetId, msg);
      } else {
        // 发送频道消息
        await sendChannelMessage(drawerState.targetId, content);

        // 添加到本地消息列表
        const msg: Message = {
          id: `${Date.now()}-${Math.random()}`,
          senderId: currentUserId,
          senderName: "Me",
          content,
          timestamp: Date.now(),
        };
        addChannelMessage(drawerState.targetId, msg);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>RTM SDK Demo</h1>

      <div className="lists-container">
        <TeacherList
          teachers={MOCK_TEACHERS}
          onTeacherClick={handleTeacherClick}
        />
        <ClassroomList
          classrooms={classrooms}
          onClassroomClick={handleClassroomClick}
        />
      </div>

      <ChatDrawer
        state={drawerState}
        currentUserId={currentUserId}
        onClose={handleCloseDrawer}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
