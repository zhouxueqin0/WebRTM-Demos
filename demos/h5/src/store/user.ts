// Jotai 用户状态管理

import { atom } from "jotai";

// 原子化状态
export const userIdAtom = atom("");
export const userRoleAtom = atom<"teacher" | "student">("student");
export const userNameAtom = atom("");
export const userAvatarAtom = atom("");
