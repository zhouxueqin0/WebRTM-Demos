import { User } from "./user";

export interface Classroom {
  id: string;
  name: string;
  users: User[];
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
  targetId: string;
  targetName: string;
}
