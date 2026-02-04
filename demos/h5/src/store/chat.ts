// Jotai 聊天状态管理

import { atom } from "jotai";
import type { Message } from "../types/chat";

// 私聊消息：userId -> Message[]
export const privateMessagesAtom = atom<Record<string, Message[]>>({});

// 频道消息：channelId -> Message[]
export const channelMessagesAtom = atom<Record<string, Message[]>>({});

// 未读计数：userId -> count
export const unreadCountsAtom = atom<Record<string, number>>({});

// 派生 atom：添加私聊消息
export const addPrivateMessageAtom = atom(
  null,
  (get, set, { userId, message }: { userId: string; message: Message }) => {
    const current = get(privateMessagesAtom);
    set(privateMessagesAtom, {
      ...current,
      [userId]: [...(current[userId] || []), message],
    });
  },
);

// 派生 atom：添加频道消息
export const addChannelMessageAtom = atom(
  null,
  (
    get,
    set,
    { channelId, message }: { channelId: string; message: Message },
  ) => {
    const current = get(channelMessagesAtom);
    set(channelMessagesAtom, {
      ...current,
      [channelId]: [...(current[channelId] || []), message],
    });
  },
);

// 派生 atom：清零未读数
export const clearUnreadAtom = atom(null, (get, set, userId: string) => {
  const current = get(unreadCountsAtom);
  set(unreadCountsAtom, {
    ...current,
    [userId]: 0,
  });
});

// 派生 atom：增加未读数
export const incrementUnreadAtom = atom(null, (get, set, userId: string) => {
  const current = get(unreadCountsAtom);
  set(unreadCountsAtom, {
    ...current,
    [userId]: (current[userId] || 0) + 1,
  });
});

// 派生 atom：清空频道消息
export const clearChannelMessagesAtom = atom(
  null,
  (get, set, channelId: string) => {
    const current = get(channelMessagesAtom);
    set(channelMessagesAtom, {
      ...current,
      [channelId]: [],
    });
  },
);
