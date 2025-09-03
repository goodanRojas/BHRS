import { useState, useEffect, useRef, useMemo } from 'react';
import { usePage, Head } from '@inertiajs/react';
import axios, { all } from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import SellerLayout from '@/Layouts/SellerLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperPlane, faTimes, faEllipsisV, faTrashCan, faWarning, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons'; // Import icons from FontAwesome
import Modal from '@/Components/Modal';

export default function Index({ sentMessages, receivedMessages }) {
    const [users, setUsers] = useState([]); // Store list of users (all conversations)
    const [onlineUsers, setOnlineUsers] = useState([]); // Store list of online users
    const [searchResults, setSearchResults] = useState([]); // Store filtered list of users based on search
    const [activeUser, setActiveUser] = useState(null); // Active user to chat with
    const [messages, setMessages] = useState([]); // Store messages for the active user
    const [message, setMessage] = useState(''); // Message to send
    const [searchQuery, setSearchQuery] = useState(''); // User search input
    const [messageOptionOpen, setMessageOptionOpen] = useState(false);
    const [deletePromptOpen, setDeletePromptOpen] = useState(false);
    const isAIOn = activeUser?.ai_response_status?.status === true;

    const [focusedIndex, setFocusedIndex] = useState(-1);
    const searchBoxRef = useRef(null); // optional for scroll into view
    const menuRef = useRef(null);

    const owner = usePage().props.auth.seller; // Get the authenticated user
    // Extract users from both sent and received messages
    useEffect(() => {
        const allMessages = [...sentMessages, ...receivedMessages];

        // Get unique users by their ID
        const usersSets = new Set();
        // console.log(allMessages);
        allMessages.forEach(msg => {
            // Add sender if they are not the current user
            if (msg.sender_id !== owner.id) {
                usersSets.add(msg.sender_id);
            }
            // Add receiver if they are not the current user
            if (msg.receiver_id !== owner.id) {
                usersSets.add(msg.receiver_id);
            }
        });
        // Fetch user details for all unique IDs
        if (usersSets.size > 0) {
            axios.get('/seller/owner-messages/owners', { params: { userIds: Array.from(usersSets) } })
                .then(({ data }) => {
                    // Update the state with the user details
                    setUsers(data.users);
                    console.log("Fetched Users:", data.users);
                })
                .catch((err) => console.error("Error fetching users:", err));
        } else {
            setUsers([]); // If no users found, reset users state
        }
    }, [sentMessages, receivedMessages, owner.id]);

    // Fetch messages for the active user
    const fetchMessages = (userId) => {

        axios.get(`/seller/owner-message/selected-owner/${userId}`)
            .then(({ data }) => {
                setMessages(data.messages); // Store messages of the active user

                console.log(data.messages);
            }).catch((err) => console.error('Error loading messages:', err));
    };

    // Handle sending a message
    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !activeUser) return;

        axios.post("/seller/owner-messages/send", {
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

    // Search owners based on query
    const searchUsers = (query) => {
        setSearchQuery(query);
        setFocusedIndex(-1);

        // If query is less than 2 characters, clear results
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        // Fetch filtered users from the backend
        axios.get('/seller/owner-message/search', {
            params: { query: query }
        })
            .then(({ data }) => {
                setSearchResults(data.users); // Update state with searched users
                console.log("Search results:", data.users);
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
        axios.delete(`/seller/owner-message/delete/${userIdToDelete}`)
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
    const toggleAI = (userId) => {
        // setIsAIOn(!isAIOn);
        axios.post('/seller/owner-message/toggle-ai', {
            userId: userId,
        }).then(({ data }) => {
            setActiveUser((prevUser) => ({
                ...prevUser,
                ai_response_status: {
                    ...prevUser.ai_response_status,
                    status: data.status, // assuming backend returns new status
                }
            }));
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, ai_response_status: { status: data.status } }
                        : user
                )
            );
        }).catch((err) => console.error('Error toggling AI:', err));
    };


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
        const handleKeyDown = (e) => {
            if (searchQuery.length < 2 || searchResults.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % searchResults.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
            } else if (e.key === 'Enter' && focusedIndex >= 0) {
                e.preventDefault();
                const selected = searchResults[focusedIndex];
                setActiveUser(selected);
                fetchMessages(selected.id);
                setSearchQuery('');
                setFocusedIndex(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchQuery, searchResults, focusedIndex]);

    useEffect(() => {
        if (owner) {
            // Set up real-time Echo listener for messages
            Echo.private(`user-to-owner-messages.${owner.id}`)
                .listen('.UserMessageSentToOwner', (message) => {
                    console.log('🔔 New message received!', message);

                    // 1. If I am chatting with this user right now
                    if (activeUser && message.sender_id === activeUser.id) {
                        setMessages((prev) => [...prev, message]);
                    }

                    // 2. Optionally: update "last message" in user list
                    setUsers((prevUsers) =>
                        prevUsers.map((u) =>
                            u.id === message.sender_id
                                ? { ...u, last_message: message }
                                : u
                        )
                    );
                });


            // Cleanup Echo listener when component unmounts
            return () => {
                if (window.Echo) {
                    window.Echo.leave(`user-to-owner-messages.${owner.id}`);
                }
            };
        }
    }, [owner?.id, activeUser]);

    return (
        <SellerLayout>
            <Head title="Messages" />
            <div className="flex min-h-screen overflow-hidden">
                {/* Left column: User list with search */}
                <div className="w-1/4 sm:w-1/3 p-4 border-r border-gray-300">
                    {/* Search Bar */}
                    <div className="mb-4 flex items-center border-b pb-2">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => searchUsers(e.target.value)}
                            placeholder="Search users..."
                            className="w-full p-2 border border-gray-300 rounded-full text-sm pl-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Default User List */}

                    {users.length > 0 ? (
                        <ul className="space-y-2">
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => {
                                        setActiveUser(user);
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
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <h4 className="text-xl font-semibold text-gray-700">No owners found</h4>
                        </div>
                    )}

                    {/* Search Results (overlayed or below) */}
                    {searchQuery.length >= 2 && searchResults.length > 0 && (
                        <div className="absolute left-[40px] top-[180px] w-[200px ] z-30 bg-white border border-gray-300 rounded-md shadow-lg max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">

                            <h3 className='p-2 text-sm font-medium'>Results</h3>
                            <hr />
                            <ul className="divide-y divide-gray-200">
                                {searchResults.map((user, index) => (
                                    <li
                                        key={user.id}
                                        onClick={() => {
                                            setActiveUser(user);
                                            fetchMessages(user.id);
                                            setSearchQuery(''); // optional: clear after select
                                            setFocusedIndex(-1);
                                        }}
                                        className={`flex flex-col gap-2 px-3 py-2 cursor-pointer transition-all ${index === focusedIndex ? 'bg-indigo-100' : 'hover:bg-indigo-50'
                                            }`}>
                                        <div className='flex items-center gap-2'>
                                            <img
                                                src={`/storage/${user.avatar || 'profile/default_avatar.png'}`}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span className="text-sm font-medium">{user.name}</span>
                                            {onlineUsers.some((o) => o.id === user.id) && (
                                                <span className="ml-auto text-xs text-green-500">Online</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {searchQuery.length > 0 && searchResults.length === 0 && (
                        <div className="absolute left-[40px] top-[180px] w-[200px ] z-30 bg-white border border-gray-300 rounded-md shadow-lg max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                            <h3 className='p-2 text-sm font-bold text-gray-900'>No results found</h3>
                            <hr />
                            <p className='p-2 text-sm text-gray-500'>Try searching for a different name.</p>
                        </div>
                    )}


                </div>


                {/* Right column: Chat window */}
                <div className="w-2/3 ">
                    {!activeUser ? (
                        <div className="text-center h-full flex items-center justify-center flex-col">
                            <h3 className="text-xl font-semibold text-gray-700">Start chatting with someone!</h3>
                            <p className="text-gray-500">Select a user from the list to begin the conversation.</p>
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
                                        <div className="absolute w-[180px] right-0 z-10 mt-2 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all ">
                                            <h3 className='p-2 text-sm font-bold text-gray-900'>Options</h3>
                                            <hr />
                                            <button
                                                onClick={() => toggleAI(activeUser.id)}
                                                className={`flex items-center gap-2 px-4 p-2 w-full  cursor-pointer hover:bg-gray-100 `}
                                            >
                                                <FontAwesomeIcon icon={isAIOn ? faToggleOn : faToggleOff} className="w-5 h-5 text-purple-600" />
                                                <span>AI</span>
                                            </button>
                                            {messages.length > 0 && (
                                                <button
                                                    onClick={() => {
                                                        setDeletePromptOpen(true);
                                                    }}
                                                    className="w-full truncate text-left px-4 py-2 text-sm  hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    <FontAwesomeIcon className='text-red-600' icon={faTrashCan} />
                                                    Delete
                                                </button>)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messages scrollable section */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.length > 0 ? (
                                    <div >
                                        {messages.map((msg) => {
                                            const isCurrentUser = msg.sender_id === owner.id;
                                            const isToday = dayjs(msg.created_at).isSame(dayjs(), 'day');
                                            const timeDisplay = isToday
                                                ? dayjs(msg.created_at).fromNow()
                                                : dayjs(msg.created_at).format('MMM D, YYYY h:mm A');

                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={` group flex ${isCurrentUser ? 'items-end' : 'items-start'} gap-2 flex-col`}
                                                >
                                                    {/* Avatar and Name */}
                                                    <div className={`flex items-center ${isCurrentUser ? 'justify-end self-end' : 'justify-start self-start'} gap-2`}>
                                                        <img
                                                            src={`/storage/${msg.sender?.avatar ?? 'profile/default_avatar.png'}`}
                                                            alt={msg.sender?.name ?? 'User Avatar'}
                                                            className="w-8 h-8 rounded-full border"
                                                        />
                                                        <span className="text-sm font-semibold text-gray-700">{isCurrentUser ? 'You' : msg.sender.name}</span>
                                                    </div>

                                                    {/* Message bubble */}
                                                    <div
                                                        className={`p-3 rounded-lg text-sm min-w-[200px] max-w-[75%] break-words ${isCurrentUser ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
                                                            }`}
                                                    >
                                                        <p>{msg.content}</p>
                                                    </div>

                                                    {/* Timestamp */}
                                                    <div
                                                        className={`text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition duration-200 ${isCurrentUser ? 'text-right self-end' : 'text-left self-start'
                                                            }`}
                                                    >
                                                        {timeDisplay}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center flex-col">
                                        <img
                                            src={
                                                activeUser.avatar
                                                    ? `/storage/${activeUser.avatar}`
                                                    : '/storage/profile/default_avatar.png'
                                            }
                                            alt={activeUser.name || 'User Avatar'}
                                            className="w-32 h-32 rounded-full border-indigo-500 border-2 p-[1px] mr-2"
                                        />
                                        <h2 className='text-xl font-semibold text-gray-700'>{activeUser.name}</h2>
                                        {onlineUsers.some((u) => u.id === activeUser.id) && (
                                            <span className="text-xs text-green-500">Online</span>
                                        )}
                                    </div>
                                )}
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
                    <div className='flex items-center gap-2 p-2 text-sm'>
                        <FontAwesomeIcon icon={faWarning} className='text-red-500 mr-2' />
                        <p>This action cannot be undone.</p>

                    </div>
                    <div className='flex items-center justify-end gap-2 mt-4'>
                        <button
                            onClick={() => {
                                deleteConversation(activeUser?.id);
                                setDeletePromptOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                            Delete
                        </button>
                        <button
                            onClick={() => setDeletePromptOpen(false)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                            Cancel
                        </button>
                    </div>
                </Modal>)}
        </SellerLayout>
    );
}
