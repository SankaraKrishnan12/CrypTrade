import React, { useState } from "react";
import "./aiChatPopup.css";

const AIChatPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Simulating AI response
    setTimeout(() => {
      const botResponse =
        input.toLowerCase().includes("predict")
          ? "I will analyze market trends and predict outcomes."
          : input.toLowerCase().includes("analyze")
          ? "Analyzing the crypto data for better insights."
          : "I'm here to assist with predictions and analysis.";
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    }, 1000);
  };

  return (
    <div className="ai-chat-popup">
      <div className="chat-header">
        <span>AI Chat Assistant</span>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default AIChatPopup;
