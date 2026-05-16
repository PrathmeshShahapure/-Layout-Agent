import React, { useState } from "react";
import axios from "axios";
import initialLayout from "./data/initialLayout.json";
import WireframePreview from "./components/WireframePreview";

const App = () => {
  const [layout, setLayout] = useState(initialLayout);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async() => {
    if (input.trim() === "") return;
    const newMessage = {
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    try {

      const response = await axios.post(
        "http://localhost:3001/api/chat",
        {
          message: input,
          layout,
          history: messages,
        }
      );
    
      const assistantMessage = {
        role: "assistant",
        content: JSON.stringify(
          response.data.action,
          null,
          2
        ),
      };
    
      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
      setLayout(response.data.updatedLayout);
      setInput("");
    
    } catch (error) {
      console.log(error);
    }
   
  };

  console.log(initialLayout);
  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="w-1/2 border-r flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Layout  Agent</h1>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%]
        ${
          msg.role === "user"
            ? "bg-blue-500 text-white ml-auto"
            : "bg-gray-200 text-black"
        }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t flex gap-2">
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
            className="flex-1 border rounded px-3 py-2 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Wireframe Preview</h1>
        <WireframePreview layout={layout} />
      </div>
    </div>
  );
};

export default App;
