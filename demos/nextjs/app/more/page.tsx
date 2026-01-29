"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../shared/utils/auth";
import "./page.css";

// 强制动态渲染
export const dynamic = "force-dynamic";

export default function More() {
  const router = useRouter();

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated()) {
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
