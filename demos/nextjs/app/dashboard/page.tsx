import "./page.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Hello World</h1>
      {/* 需要一个消息框，绑定 store，我收到消息就往 store 中 push，维护消息列表*/}
      {/* 需要 sendMessage 按钮，我需要发送消息 */}
    </div>
  );
}
