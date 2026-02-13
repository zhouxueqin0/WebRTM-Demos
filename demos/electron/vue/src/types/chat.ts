export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export interface Classroom {
  id: string;
  name: string;
  users: string[];
}

export interface ChatDrawerState {
  isOpen: boolean;
  mode: "private" | "channel";
  targetId: string;
  targetName: string;
}
