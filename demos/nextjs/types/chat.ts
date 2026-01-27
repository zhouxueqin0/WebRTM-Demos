// 聊天相关类型定义

export interface Teacher {
  uid: string;
  name: string;
  avatar?: string;
}

export interface Classroom {
  id: string;
  name: string;
  studentUid: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export type ChatMode = "private" | "channel";

export interface ChatDrawerState {
  isOpen: boolean;
  mode: ChatMode;
  targetId: string; // teacherUid or channelId
  targetName: string;
}
