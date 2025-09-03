import React, { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { message: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (message) => {
    const newMessage = { message, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { message: "I'm still learning!", sender: "bot" }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", width: "300px", height: "400px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={isTyping ? <TypingIndicator content="AI is typing..." /> : null}>
            {messages.map((msg, i) => (
              <Message key={i} model={{ message: msg.message, sender: msg.sender, direction: msg.sender === "user" ? "outgoing" : "incoming" }} />
            ))}
          </MessageList>
          <MessageInput placeholder="Type a message..." onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatBot;
