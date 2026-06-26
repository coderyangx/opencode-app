import { createRoot } from "react-dom/client";

import "../../shared/global.css";
import { Chat } from "./chat";

export function App() {
  const url = new URL(window.location.href);
  const query = Array.from(url.searchParams.keys()).reduce((prev, curr) => {
    prev[curr] = url.searchParams.get(curr);
    return prev;
  }, {} as Record<string, string | null>);

  console.log("datasheet-chat", query);

  return <Chat {...query} />;
}

export function init() {
  createRoot(document.getElementById("root")!).render(<App />);
}
