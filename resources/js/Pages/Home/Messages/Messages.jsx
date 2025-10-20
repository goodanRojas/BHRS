import { useState, useEffect, useRef, use } from 'react';
import { usePage, Head } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import UserMessageLayout from './UserMessageLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperPlane, faTimes, faEllipsisV, faTrashCan, faWarning } from '@fortawesome/free-solid-svg-icons'; // Import icons from FontAwesome
import Modal from '@/Components/Modal';

export default function Messages({ sentMessages, receivedMessages, selectedUser }) {

    const [users, setUsers] = useState([]); // Store list of users (all conversations)
    const [onlineUsers, setOnlineUsers] = useState([]); // Store list of online users
    const [searchResults, setSearchResults] = useState([]); // Store filtered list of users based on search
    const [activeUser, setActiveUser] = useState(null); // Active user to chat with
    const [messages, setMessages] = useState([]); // Store messages for the active user
    const [message, setMessage] = useState(''); // Message to send
    const [searchQuery, setSearchQuery] = useState(''); // User search input
    const [messageOptionOpen, setMessageOptionOpen] = useState(false); // State to manage message options dropdown
    const [deletePromptOpen, setDeletePromptOpen] = useState(false); // State to manage delete prompt
    const menuRef = useRef(null); // Reference to the message options dropdown

    const user = usePage().props.auth.user; // Get the authenticated user
    const messsagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messsagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        const saved = sessionStorage.getItem('selectedUser');
        if (saved) {
            try {
                const parsedUser = JSON.parse(saved);
                setActiveUser(parsedUser);
                fetchMessages(parsedUser.id);
            } catch (e) {
                console.error("Invalid JSON in sessionStorage:", e);
                sessionStorage.removeItem('selectedUser');
            }
        }
    }, []);
    const selectedUserToSessionStorage = (user) => {
        sessionStorage.setItem('selectedUser', JSON.stringify(user));
    };

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

        axios.get(`/direct-message/selected-user/${userId}`)
            .then(({ data }) => {
                setMessages(data.messages); // Store messages of the active user

                console.log(data.messages);
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
            // console.log(data.message);

            setMessages((prevMessages) => {
                // Append the new message to the existing messages
                return [...prevMessages, data.message];
            });
            console.log("Message sent:", data.message);

            setMessage(""); // Clear the input
        }).catch((err) => console.error('Error sending message:', err));
    };

    // Search users based on query
    const searchUsers = (query) => {
        setSearchQuery(query);

        // If query is less than 2 characters, clear results
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        // Fetch filtered users from the backend
        axios.get('/direct-message/search', {
            params: { query: query }
        })
            .then(({ data }) => {
                setSearchResults(data.users); // Update state with searched users
            })
            .catch((error) => {
                console.error('Error searching users:', error);
                setSearchResults([]); // Fallback in case of error
            });
    };

    // Delete conversation with the selected user
    const deleteConversation = (userIdToDelete) => {
        if (!userIdToDelete) return;
        console.log(userIdToDelete);
        axios.delete(`/direct-message/delete/${userIdToDelete}`)
            .then(() => {
                // Remove the conversation from the UI
                setUsers(prev => prev.filter(u => u.id !== userIdToDelete));
                setMessages([]);
                setActiveUser(null);
            })
            .catch((err) => {
                console.error("Failed to delete conversation:", err);
            });
    };

    const addUserIfNotExists = (userId) => {
        const alreadyExists = users.some((u) => u.id === userId);
        if (!alreadyExists) {
            axios.get('/direct-messages/users', {
                params: { userIds: [userId] }
            }).then(({ data }) => {
                setUsers((prev) => {
                    // Filter out any accidental duplicates before adding
                    const newUsers = data.users.filter(
                        newUser => !prev.some(existing => existing.id === newUser.id)
                    );
                    return [...prev, ...newUsers];
                });
            }).catch((err) => console.error('Error fetching user details:', err));
        }
    };



    // Use Echo for real-time updates
    useEffect(() => {
        if (user) {
            // Set up real-time Echo listener for messages
            Echo.private(`direct-messages.${user.id}`)
                .listen('MessageSent', (message) => {
                    if (message.sender_id !== user.id) {
                        setMessages((prevMessages) => [...prevMessages, message]);
                        addUserIfNotExists(message.sender_id);
                    }
                });
        }

        // Cleanup Echo listener when component unmounts
        return () => {
            if (window.Echo) {
                window.Echo.leave(`direct-messages.${user.id}`);
            }
        };
    }, [user]);

    useEffect(() => {
        if (user) {
            console.log("Subscribing to user-status channel");

            const channel = Echo.join('user-status') // Presence Channel
                .here((users) => {
                    setOnlineUsers(users);
                })
                .joining((user) => {
                    setOnlineUsers([...onlineUsers, user]);
                })
                .leaving((user) => {
                    setOnlineUsers((prev) => prev.filter((u) => u.id !== user.id));
                })
                .listen('UserStatusUpdated', (notif) => {
                    console.log("UserStatusUpdated event received:", notif);
                    setOnlineUsers((prev) => prev.filter((u) => u.id !== notif.userId));
                    // You can now update the UI based on the status update.
                })
                .error((error) => {
                    console.error("Error while listening to user-status channel:", error);
                });

            return () => {
                if (window.Echo) {
                    console.log("Leaving user-status channel");
                    window.Echo.leave(); // Properly leave the presence channel
                }
            };
        }
    }, [user]);  // Effect will re-run when `user` changes


    useEffect(() => {
        const handleCLickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMessageOptionOpen(false);
            }
        };
        document.addEventListener('mousedown', handleCLickOutside);
        return () => document.removeEventListener('mousedown', handleCLickOutside);
    }, []);

    useEffect(() => {
        if (selectedUser) {
            setActiveUser(selectedUser);
            selectedUserToSessionStorage(selectedUser);
            fetchMessages(selectedUser.id);
        }

    }, [selectedUser]);
    return (
        <UserMessageLayout>
            <Head title="Messages" />
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Left column: User list with search */}
                <div className="w-1/4 sm:w-1/3 p-4 border-r border-gray-300 flex flex-col overflow-y-auto">
                    {/* Search Bar */}
                    <div className="relative mb-4 flex items-center">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 text-gray-500"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => searchUsers(e.target.value)}
                            placeholder="Search users"
                            className="w-full p-2 border border-gray-300 rounded-full text-sm pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Default User List */}
                    {users.length > 0 ? (
                        <ul className="space-y-2 custom-scrollbar">
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => {
                                        setActiveUser(user);
                                        selectedUserToSessionStorage(user);
                                        fetchMessages(user.id);
                                    }}
                                    className="group relative cursor-pointer bg-indigo-100 hover:bg-indigo-200 rounded-full transition duration-200 flex items-center p-1"
                                >
                                    <img
                                        src={`/storage/${user.avatar || 'profile/default_avatar.png'}`}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <p className="text-sm truncate">{user.name}</p>

                                    {/* Hover name badge */}
                                    <div className="absolute sm:hidden w-full left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md z-10">
                                        {user.name}
                                    </div>

                                    {onlineUsers.some((u) => u.id === user.id) && (
                                        <span className="text-xs text-green-500 ml-auto">Online</span>
                                    )}
                                </li>
                            ))}
                        </ul>) : <div className="text-center ">Start Chatting..</div>}

                    {/* Search Results (overlayed or below) */}
                    {searchQuery.length >= 2 && searchResults.length > 0 && (
                        <div className="absolute left-[40px] top-[120px] w-[200px ] z-30 bg-white border border-gray-300 rounded-md shadow-lg max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">

                            <h3 className='p-2 text-sm font-medium'>Results</h3>
                            <hr />
                            <ul className="divide-y divide-gray-200">
                                {searchResults.map((user) => (
                                    <li
                                        key={user.id}
                                        onClick={() => {
                                            setActiveUser(user);
                                            selectedUserToSessionStorage(user);
                                            fetchMessages(user.id);
                                            setSearchQuery(''); // optional: clear after select
                                        }}
                                        className="flex  flex-col gap-2 px-3 py-2 hover:bg-indigo-100 cursor-pointer transition-all"
                                    >
                                        <div className='flex items-center gap-2'>
                                            <img
                                                src={`/storage/${user.avatar || 'profile/default_avatar.png'}`}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span className="text-sm font-medium">{user.name}</span>
                                            {onlineUsers.some((u) => u.id === user.id) && (
                                                <span className="ml-auto text-xs text-green-500">Online</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>


                {/* Right column: Chat window */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {!activeUser ? (
                        <div className="min-h-screen flex flex-1 items-center justify-center flex-col text-center">
                            <h3 className="text-xl font-semibold text-gray-700">
                                Start chatting with someone!
                            </h3>
                            <p className="text-gray-500">
                                Select a user from the list to begin the conversation.
                            </p>
                        </div>
                    ) : (
                        <div className="h-[calc(100vh-4rem)] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-2 border-b bg-gradient from-bg-indigo-100 to-white">
                                <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                                    <img
                                        src={
                                            activeUser.avatar
                                                ? `/storage/${activeUser.avatar}`
                                                : '/storage/profile/default_avatar.png'
                                        }
                                        alt={activeUser.name || 'User Avatar'}
                                        className="w-8 h-8 rounded-full border-indigo-500 border-2 p-[1px] mr-2"
                                    />
                                    {activeUser.name}
                                    {onlineUsers.some((u) => u.id === activeUser.id) && (
                                        <span className="text-xs text-green-500">Online</span>
                                    )}
                                </h3>
                                {/* Dropdown button here... */}
                                <div className="relative inline-block text-left" ref={menuRef}>
                                    <button
                                        onClick={() => setMessageOptionOpen(!messageOptionOpen)}
                                        className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                    >
                                        <FontAwesomeIcon icon={faEllipsisV} />
                                    </button>

                                    {messageOptionOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all ">
                                            <h3 className='p-2 text-sm font-bold text-gray-900'>Options</h3>
                                            <hr />
                                            <button
                                                onClick={() => {
                                                    setDeletePromptOpen(true);
                                                }}
                                                className="w-full truncate text-left px-4 py-2 text-sm  hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon className='text-red-600' icon={faTrashCan} />
                                                Delete Conversation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messages scrollable section */}
                            <div className="flex-1 custom-scrollbar overflow-y-auto p-4 space-y-3">
                                {messages.length > 0 ? (
                                    messages.map((msg) => {
                                        const isCurrentUser = msg.sender_id === user.id;
                                        const isToday = dayjs(msg.created_at).isSame(dayjs(), 'day');
                                        const timeDisplay = isToday
                                            ? dayjs(msg.created_at).fromNow()
                                            : dayjs(msg.created_at).format('MMM D, YYYY h:mm A');

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`group flex ${isCurrentUser ? 'items-end' : 'items-start'} gap-2 flex-col`}
                                            >
                                                {/* Avatar and Name */}
                                                <div className={`flex items-center ${isCurrentUser ? 'justify-end self-end' : 'justify-start self-start'} gap-2`}>
                                                    <img
                                                        src={`/storage/${msg.sender?.avatar ?? 'profile/default_avatar.png'}`}
                                                        alt={msg.sender?.name ?? 'User Avatar'}
                                                        className="w-8 h-8 rounded-full border"
                                                    />
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        {isCurrentUser ? 'You' : msg.sender.name}
                                                    </span>
                                                </div>

                                                {/* Message bubble */}
                                                <div
                                                    className={`p-3 rounded-lg text-sm min-w-[200px] max-w-[75%] break-words ${isCurrentUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'}`}
                                                >
                                                    <p>{msg.content}</p>
                                                </div>

                                                {/* Timestamp */}
                                                <div
                                                    className={`text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition duration-200 ${isCurrentUser ? 'text-right self-end' : 'text-left self-start'}`}
                                                >
                                                    {timeDisplay}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center">Start chatting with {activeUser.name}</div>
                                )}
                                <div ref={messsagesEndRef} />
                            </div>


                            {/* Send Message Form - Sticky Bottom */}
                            <form
                                onSubmit={sendMessage}
                                className="p-4 flex items-center space-x-2"
                            >
                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="flex-1 p-2 pl-4 border border-gray-300 rounded-full"
                                    placeholder="Type a message..."
                                />
                                <button
                                    type="submit"
                                    className="p-2  text-indigo-600 rounded-md hover:text-indigo-700"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </form>
                        </div>

                    )}
                </div>
            </div>


            {/* Modal Section */}

            {/* Delete Conversation Modal Prompt */}
            {deletePromptOpen && (
                <Modal
                    show={deletePromptOpen}
                    onClose={() => setDeletePromptOpen(false)}>
                    <h3 className='p-2 text-sm font-bold text-gray-900'>Delete Conversation</h3>
                    <hr />
                    <p className='p-2 text-sm text-gray-500'>Are you sure you want to delete this conversation?</p>
                    <div className='flex items-center  gap-2 p-2 text-sm'>
                        <FontAwesomeIcon icon={faWarning} className='text-red-500 mr-2' />
                        <p>This action cannot be undone.</p>

                    </div>
                    <div className='flex items-center justify-end gap-2 mt-4'>
                        <button
                            onClick={() => setDeletePromptOpen(false)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                deleteConversation(activeUser?.id);
                                setDeletePromptOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                            Delete
                        </button>

                    </div>
                </Modal>)}
        </UserMessageLayout>
    );
}
