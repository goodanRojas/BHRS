import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperPlane } from '@fortawesome/free-solid-svg-icons'; // Import icons from FontAwesome
import { SVG } from 'leaflet';

export default function Messages({ sentMessages, receivedMessages }) {
    console.log("Sent Messages:", sentMessages);
    console.log("Received Messages:", receivedMessages);

    const [users, setUsers] = useState([]); // Store list of users (all conversations)
    const [searchResults, setSearchResults] = useState([]); // Store filtered list of users based on search
    const [activeUser, setActiveUser] = useState(null); // Active user to chat with
    const [messages, setMessages] = useState([]); // Store messages for the active user
    const [message, setMessage] = useState(''); // Message to send
    const [searchQuery, setSearchQuery] = useState(''); // User search input
    const user = usePage().props.auth.user; // Get the authenticated user

    // Extract users from both sent and received messages
    useEffect(() => {
        const allMessages = [...sentMessages, ...receivedMessages];

        // Get unique users by their ID
        const usersSet = new Set();

        allMessages.forEach(msg => {
            // Add sender if they are not the current user
            if (msg.sender_id !== user.id) {
                usersSet.add(msg.sender_id);
            }
            // Add receiver if they are not the current user
            if (msg.receiver_id !== user.id) {
                usersSet.add(msg.receiver_id);
            }
        });

        // Fetch user details for all unique IDs
        if (usersSet.size > 0) {
            axios.get('/direct-messages/users', { params: { userIds: Array.from(usersSet) } })
                .then(({ data }) => {
                    // Update the state with the user details
                    setUsers(data.users);
                })
                .catch((err) => console.error("Error fetching users:", err));
        } else {
            setUsers([]); // If no users found, reset users state
        }
    }, [sentMessages, receivedMessages, user.id]);

    // Fetch messages for the active user
    const fetchMessages = (userId) => {

        axios.get(`direct-message/selected-user/${userId}`)
            .then(({ data }) => {
                setMessages(data.messages); // Store messages of the active user
            }).catch((err) => console.error('Error loading messages:', err));
    };

    // Handle sending a message
    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !activeUser) return;

        axios.post("/direct-messages/send", {
            receiver_id: activeUser.id,
            content: message,
        }).then(({ data }) => {
            // Update the messages in the state after sending a new message
            setMessages((prevMessages) => [
                ...prevMessages,
                data.message,
            ]);
            setMessage(""); // Clear the input
        }).catch((err) => console.error('Error sending message:', err));
    };

    // Search users based on query
    const searchUsers = (query) => {
        setSearchQuery(query);

        // If the search query is less than 2 characters, clear search results
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        // Filter the users based on the search query
        const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
        setSearchResults(filteredUsers);
    };

    // Use Echo for real-time updates
    useEffect(() => {
        if (user) {
            // Set up real-time Echo listener for messages
            Echo.private(`direct-messages.${user.id}`)
                .listen('MessageSent', (message) => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        message,
                    ]);
                });
        }

        // Cleanup Echo listener when component unmounts
        return () => {
            if (window.Echo) {
                window.Echo.leave(`direct-messages.${user.id}`);
            }
        };
    }, [user]);

    return (
        <AuthenticatedLayout>
            <div className="flex min-h-screen">
                {/* Left column: User list with search */}
                <div className="w-1/3 p-4 border-r border-gray-300">
                    <div className="mb-4 flex items-center border-b pb-2">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => searchUsers(e.target.value)} // Update the search query
                            placeholder="Search users"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    {users.length === 0 ? (
                        <p className="text-gray-600">No users found.</p> // Message if no users match
                    ) : (
                        <ul className="space-y-2">
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => {
                                        console.log("Selected User:", user);
                                        setActiveUser(user);
                                        fetchMessages(user.id); // Fetch messages for the selected user
                                    }}
                                    className="cursor-pointer bg-blue-100 b-1 hover:bg-blue-200 p-2 rounded-md transition duration-200 flex items-center"
                                >
                                    <img src={`/storage/${user.avatar || 'profile/default_avatar.png'}`} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                                    <span>{user.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Right column: Chat window */}
                <div className="w-2/3 p-4">
                    {!activeUser ? (
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-700">Start chatting with someone!</h3>
                            <p className="text-gray-500">Select a user from the list to begin the conversation.</p>
                        </div>
                    ) : (
                        <div className="min-h-[80%] mb-5 flex flex-col justify-between">
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                                    <img
                                        src={
                                            activeUser.avatar
                                                ? `/storage/${activeUser.avatar}`
                                                : '/storage/profile/default_avatar.png'  // Provide default avatar if avatar is null
                                        }
                                        alt={activeUser.name || 'User Avatar'}
                                        className="w-8 h-8 rounded-full border-indigo-500 border-2 p-[1px] mr-2"
                                    />
                                    {activeUser.name}
                                </h3>

                                <div className="messages max-h-[400px] overflow-y-auto mb-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender_id === user.id ? 'items-end' : 'items-start'} p-2 gap-2 flex-col my-2`}
                                        >
                                            {/* Avatar and Name for Received Messages (Other User) */}
                                            {msg.sender_id !== user.id ? (
                                                <div className="flex items-center">
                                                    <img
                                                        src={`/storage/${msg.sender.avatar || 'profile/default_avatar.png'}`}
                                                        alt={msg.sender.name}
                                                        className="w-8 h-8 rounded-full mr-2"
                                                    />
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        {msg.sender.name}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end">
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        <p>You</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Message Content */}
                                            <div
                                                className={`p-2 rounded-md min-w-[200px] max-w-[75%] ${msg.sender_id === user.id ? 'bg-blue-400 text-white' : 'bg-gray-400'
                                                    }`}
                                            >
                                                <p>{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={sendMessage} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </form>
                        </div>

                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
