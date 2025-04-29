import { useState, useContext, useEffect } from "react";
import { ChatContext } from "@/Layouts/AuthenticatedLayout";
import axios from "axios";

export default function BotChat({ auth }) {
    const { directMessages, setDirectMessages } = useContext(ChatContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState("");

    // Fetch previous conversation when the component first renders
    useEffect(() => {
        if (selectedUser) {
            // Fetch conversation with the selected user
            axios.get(`/direct-message/${selectedUser.id}`)
                .then(({ data }) => {
                    setDirectMessages((prevMessages) => ({
                        ...prevMessages,
                        [selectedUser.id]: data.messages,
                    }));
                })
                .catch((err) => console.error("Error fetching previous conversation:", err));
        }
    }, [selectedUser]);

  

    // Function to send message
    const sendMessage = () => {
        if (!messageInput.trim() || !selectedUser) return;

        axios.post("/messages/send", {
            receiver_id: selectedUser.id,
            content: messageInput,
        }).then(({ data }) => {
            // Update the messages in the state after sending a new message
            setDirectMessages((prev) => ({
                ...prev,
                [selectedUser.id]: [
                    ...(prev[selectedUser.id] || []),
                    data.message,
                ],
            }));
            setMessageInput("");
        });
    };

    return (
        <div className="h-80 border rounded shadow-lg overflow-hidden">
            {/* Sidebar - Search & Conversations */}
            <div className="border-r p-3 relative">
             

                {/* Floating Search Results */}
                {searchResults.length > 0 && (
                    <div className="absolute top-12 left-3 bg-white border rounded shadow-lg z-10 max-h-40 overflow-y-auto">
                        {searchResults.map((user) => (
                            <div
                                key={user.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => { setSelectedUser(user); setSearchQuery(""); setSearchResults([]); }}
                            >
                                {user.name}
                            </div>
                        ))}
                    </div>
                )}

                {/* Previous Messages */}
                <div className="mt-3 max-h-48 overflow-y-auto">
                    {Object.keys(directMessages || {}).map((userId) => (
                        <div
                            key={userId}
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                            onClick={() => setSelectedUser({ id: userId })}
                        >
                            User {userId}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window (Only Appears When a User is Selected) */}
            <div className="flex flex-col h-full">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 border-b font-bold bg-gray-100">
                            Chat with {selectedUser.name || `User ${selectedUser.id}`}
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                            {directMessages && directMessages[selectedUser.id] ? (
                                directMessages[selectedUser.id].map((msg, index) => (
                                    <p key={index} className="bg-blue-100 p-2 rounded my-1 text-sm">
                                        {msg.content}
                                    </p>
                                ))
                            ) : (
                                <p className="text-gray-400">No messages yet.</p>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-3 flex border-t bg-white">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center flex-1 text-gray-400">
                        Start Chatting with our bot.
                    </div>
                )}
            </div>
        </div>
    );
}
