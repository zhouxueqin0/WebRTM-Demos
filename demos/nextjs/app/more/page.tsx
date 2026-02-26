"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRtmStore } from "@/store/rtm";
import "./page.css";

// 强制动态渲染
export const dynamic = "force-dynamic";

export default function More() {
  const router = useRouter();
  const checkRtmStatus = useRtmStore().checkRtmStatus;

  useEffect(() => {
    // 检查登录状态
    if (!checkRtmStatus()) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="more-container">
      <div className="more-content">
        <h1>More</h1>
        <p className="more-message">请自行补充其他业务功能</p>
      </div>
    </div>
  );
}
