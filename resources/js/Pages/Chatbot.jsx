import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    // Add the user message to the chat log
    setChatLog([...chatLog, { role: "user", message: userMessage }]);

    try {
      // Send the message to the Laravel backend
      const response = await axios.post("/chatbot", {
        message: userMessage,
      });

      // Add the bot's response to the chat log
      setChatLog([
        ...chatLog,
        { role: "user", message: userMessage },
        { role: "chatbot", message: response.data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatLog([
        ...chatLog,
        { role: "chatbot", message: "Sorry, there was an error. Please try again." },
      ]);
    }

    // Clear the input field
    setUserMessage("");
  };

  return (
    <div>
      <h1>Boarding House Chatbot</h1>
      <div id="chat-log">
        {chatLog.map((entry, index) => (
          <p key={index}>
            <strong>{entry.role === "user" ? "You" : "Chatbot"}:</strong> {entry.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Ask me something..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
