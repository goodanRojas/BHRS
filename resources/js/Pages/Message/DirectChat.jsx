import { useState, useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { usePage } from "@inertiajs/react";


export default function DirectChat() {
    const { auth } = usePage().props;
    const { directMessages, setDirectMessages } = useContext(ChatContext);
    const messagesEndRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messageInput, setMessageInput] = useState("");


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [directMessages, selectedUser])

    // Fetch previous conversation when the component first renders
    useEffect(() => {
        if (selectedUser) {
            // Fetch conversation with the selected user
            axios.get(`direct-message/selected-user/${selectedUser.id}`)
                .then(({ data }) => {
                    setDirectMessages((prevMessages) => ({
                        ...prevMessages,
                        [selectedUser.id]: data.messages,
                    }));
                })
                .catch((err) => console.error("Error fetching previous conversation:", err));
        }


    }, [selectedUser]);
    useEffect(() => {
        axios.get("/direct-message").then(({ data }) => {
            setDirectMessages(data.messages);
        });
    }, []); // only once on mount
    // Function to search users
    const searchUsers = (query) => {
        setSearchQuery(query);

        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        axios.get(`/direct-message/search`, { params: { query } })
            .then(({ data }) => setSearchResults(data.users))
            .catch((err) => console.error("Error searching users:", err));
    };

    // Function to send message
    const sendMessage = () => {
        if (!messageInput.trim() || !selectedUser) return;

        axios.post("/direct-messages/send", {
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
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => searchUsers(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

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


            </div>
            {selectedUser ? (
                <div className="flex flex-col relative  h-full">
                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between p-3  border-b">
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                            }}
                            className="text-gray-700 hover:text-gray-900"
                        >
                            ←
                        </button>

                        <div className="font-semibold">{selectedUser.name}</div>
                        <div></div> {/* Empty div to balance flex spacing */}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 h-full overflow-y-auto p-3 space-y-2 mb-10">
                        {(directMessages[selectedUser.id] || []).map((message) => (
                            <div
                                key={message.id}
                                className={`max-w-xs p-2 rounded-lg ${message.sender_id === auth.user.id
                                    ? "ml-auto bg-blue-100 text-right"
                                    : "mr-auto bg-gray-100"
                                    }`}
                            >
                                <div className="text-sm">{message.content}</div>
                                <div className="text-xs text-gray-500">
                                    <span>{new Date(message.sent_at).toLocaleString()}</span>

                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> {/* Empty div to scroll to bottom */}
                    </div>

                    {/* Input for sending message */}
                    <div className="p-3 border-t flex gap-2 absolute bottom-0 left-0 right-0">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            className="flex-1 p-2 border rounded focus:outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-4 space-y-2 overflow-y-auto h-full">
                    {Object.entries(directMessages || {}).map(([userId, messages]) => {

                        // Get the last message in the conversation
                        const lastMessage = messages[messages.length - 1];
                        const anyMessage = messages[0];

                        // Ensure otherUser is valid and not null/undefined
                        const otherUser = anyMessage?.sender_id === auth.user.id
                            ? anyMessage.receiver
                            : anyMessage?.sender;

                        // Provide a fallback value for otherUser in case it is undefined or null
                        const safeOtherUser = otherUser || { name: "Unavailable", id: null }; // Add fallback user object
                       
                        return (
                            <div
                                key={userId}
                                className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedUser(safeOtherUser);
                                }}
                            >
                                <div className="font-semibold">{safeOtherUser.name}</div>
                                <div className="text-sm text-gray-600 truncate">
                                    {lastMessage?.content || "No message"}
                                </div>
                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}
