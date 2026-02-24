"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRtmStore } from "@/store/rtm";
import "./page.css";

// 强制动态渲染
export const dynamic = "force-dynamic";

export default function Home() {
  const router = useRouter();
  // rtm status
  const checkRtmStatus = useRtmStore().checkRtmStatus;

  useEffect(() => {
    // 检查登录状态
    if (!checkRtmStatus()) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Hello World</h1>
        <p className="home-subtitle">Welcome to RTM SDK Demo</p>
      </div>
    </div>
  );
}
