import React, { useState } from "react";
import axios from "axios";
import initialLayout from "./data/initialLayout.json";
import WireframePreview from "./components/WireframePreview";

const App = () => {
  const [showSidebar, setShowSidebar] =useState(false);
  const [layout, setLayout] = useState(initialLayout);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const newMessage = {
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    try {
      const response = await axios.post("http://localhost:3001/api/chat", {
        message: input,
        layout,
        history: messages.slice(-2),
      });

      // HANDLE BACKEND ERRORS
      if (response.data.error) {
        const assistantMessage = {
          role: "assistant",
          content: response.data.message,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        return;
      }

      const assistantMessage = {
        role: "assistant",
        content: JSON.stringify(response.data.action, null, 2),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (response.data.updatedLayout) {
        setLayout(response.data.updatedLayout);
      }
      setInput("");
    } catch (error) {
      console.log(error);

      const assistantMessage = {
        role: "assistant",
        content: "Something went wrong. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  console.log(initialLayout);
  return (
    <div className="h-screen flex bg-[#0f0f0f] text-white overflow-hidden">
      {/* LEFT SIDE */}
      <div
  className={`
    fixed md:relative z-50
    h-full
    w-[85%] md:w-[28%]
    min-w-[320px]
    border-r border-zinc-800
    flex flex-col
    bg-[#181818]
    transition-all duration-300
    ${
      showSidebar
        ? "left-0"
        : "-left-full md:left-0"
    }
  `}
>  {/* HEADER */}
<div className="p-5 border-b border-zinc-800 flex items-center justify-between">
<h1 className="text-xl font-semibold tracking-tight">
  AI Layout Agent
</h1>

<button
  onClick={() =>
    setShowSidebar(!showSidebar)
  }
  className="md:hidden text-2xl"
>
  {showSidebar ? "✕" : "☰"}
</button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-xl max-w-[90%] text-sm leading-relaxed
                whitespace-pre-wrap break-words
                ${
                  msg.role === "user"
                    ? "bg-blue-400 ml-auto"
                    : "bg-zinc-800 text-zinc-100"
                }
              `}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-zinc-800 flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="
            flex-1
              bg-zinc-900
            border border-zinc-600
            rounded-lg
            px-4 py-3
            outline-none
            text-sm
          "
          />

          <button
            onClick={sendMessage}
            className="
            bg-white
            text-black
            px-5
            rounded-xl
            text-sm
            font-medium
          "
          >
            Send
          </button>
        </div>
      </div>

      {/* MOBILE OPEN BUTTON */}

{!showSidebar && (

<button
  onClick={() =>
    setShowSidebar(true)
  }
  className="
    md:hidden
    fixed
    top-4
    left-4
    z-40
    bg-zinc-800
    text-white
    px-3 py-2
    rounded-lg
  "
>
  ☰
</button>

)}

      {/* RIGHT SIDE */}

      <div className="flex-1 overflow-auto p-8">
        <div className="min-w-max min-h-full flex items-start justify-center">
          <WireframePreview layout={layout} />
        </div>
      </div>
    </div>
  );
};

export default App;
