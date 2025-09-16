import { useState, useEffect, useRef } from 'react';
import { usePage, Head } from '@inertiajs/react';
import axios, { all } from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import UserMessageLayout from './UserMessageLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperPlane, faTimes, faEllipsisV, faTrashCan, faWarning } from '@fortawesome/free-solid-svg-icons'; // Import icons from FontAwesome
import Modal from '@/Components/Modal';

export default function landowner({ sentMessages, receivedMessages }) {
    // console.log("Sent Messages:", sentMessages);
    // console.log("Received Messages:", receivedMessages);

    const [owners, setOwners] = useState([]); // Store list of users (all conversations)
    const [onlineOwners, setOnlineOwners] = useState([]); // Store list of online users
    const [searchResults, setSearchResults] = useState([]); // Store filtered list of users based on search
    const [activeOwner, setActiveOwner] = useState(null); // Active user to chat with
    const [messages, setMessages] = useState([]); // Store messages for the active user
    const [message, setMessage] = useState(''); // Message to send
    const [searchQuery, setSearchQuery] = useState(''); // User search input
    const [messageOptionOpen, setMessageOptionOpen] = useState(false);
    const [deletePromptOpen, setDeletePromptOpen] = useState(false);
    const menuRef = useRef(null);

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
    const selectedOwnerToSessionStorage = (owner) => {
        sessionStorage.setItem('selectedOwner', JSON.stringify(owner));
    };
    useEffect(() => {
        const saved = sessionStorage.getItem('selectedOwner');
        if (saved) {
            try {
                const parsedOwner = JSON.parse(saved);
                setActiveOwner(parsedOwner);
                fetchMessages(parsedOwner.id);
            } catch (e) {
                console.error("Invalid JSON in sessionStorage:", e);
                sessionStorage.removeItem('selectedOwner');
            }
        }
    }, []);

    // Extract users from both sent and received messages
    useEffect(() => {
        const allMessages = [...sentMessages, ...receivedMessages];

        // Get unique users by their ID
        const ownersSet = new Set();
        // console.log(allMessages);
        allMessages.forEach(msg => {
            // Add sender if they are not the current user
            if (msg.sender_id !== user.id) {
                ownersSet.add(msg.sender_id);
            }
            // Add receiver if they are not the current user
            if (msg.receiver_id !== user.id) {
                ownersSet.add(msg.receiver_id);
            }
        });
        console.log("Unique Owners Set:", ownersSet);
        // Fetch user details for all unique IDs
        if (ownersSet.size > 0) {
            axios.get('/owner-messages/owners', { params: { ownerIds: Array.from(ownersSet) } })
                .then(({ data }) => {
                    // Update the state with the user details
                    setOwners(data.owners);
                    console.log("Fetched Owners:", data.owners);
                })
                .catch((err) => console.error("Error fetching users:", err));
        } else {
            setOwners([]); // If no users found, reset users state
        }
    }, [receivedMessages, user.id]);

    // Fetch messages for the active user
    const fetchMessages = (ownerId) => {

        axios.get(`/owner-message/selected-owner/${ownerId}`)
            .then(({ data }) => {
                setMessages(data.messages); // Store messages of the active user
                console.log(data.messages);
            }).catch((err) => console.error('Error loading messages:', err));
    };

    // Handle sending a message
    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !activeOwner) return;

        axios.post("/owner-messages/send", {
            receiver_id: activeOwner.id,
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
    const searchOwners = (query) => {
        setSearchQuery(query);

        // If query is less than 2 characters, clear results
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        // Fetch filtered users from the backend
        axios.get('/owner-message/search', {
            params: { query: query }
        })
            .then(({ data }) => {
                setSearchResults(data.owners); // Update state with searched users
                console.log("Search results:", data.owners);
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
                setOwners(prev => prev.filter(u => u.id !== userIdToDelete));
                setMessages([]);
                setActiveOwner(null);
            })
            .catch((err) => {
                console.error("Failed to delete conversation:", err);
            });
    };



    // Use Echo for real-time updates
    useEffect(() => {
        if (user) {
            // Set up real-time Echo listener for messages
            Echo.private(`owner-to-user-messages.${user.id}`)
                .listen('.OwnerMessageSentToUser', (message) => {
                    console.log("Message received:", message);
                    // 1. if I am chatting with this owner right now
                    if (activeOwner && message.sender_id === activeOwner.id) {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            message,
                        ]);
                    }

                    // 2. Optionally: update "last message" in owner list
                    setOwners((prevOwners) =>
                        prevOwners.map((o) =>
                            o.id === message.sender_id
                                ? { ...o, last_message: message }
                                : o
                        )
                    );
                });
        }
        // Cleanup Echo listener when component unmounts
        return () => {
            if (window.Echo) {
                window.Echo.leave(`owner-to-user-messages.${user.id}`);
            }
        };
    }, [user, activeOwner]);
    useEffect(() => {
        if (user) {
            console.log("Subscribing to user-status channel");

            const channel = Echo.join('user-status') // Presence Channel
                .here((users) => {
                    setOnlineOwners(users);
                })
                .joining((user) => {
                    setOnlineOwners([...preview, user]);
                })
                .leaving((user) => {
                    setOnlineOwners((prev) => prev.filter((u) => u.id !== user.id));
                })
                .listen('UserStatusUpdated', (notif) => {
                    console.log("UserStatusUpdated event received:", notif);
                    setOnlineOwners((prev) => prev.filter((u) => u.id !== notif.userId));
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
    return (
        <UserMessageLayout>
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
                            onChange={(e) => searchOwners(e.target.value)}
                            placeholder="Search owners"
                            className="w-full p-2 border border-gray-300 rounded-full text-sm pl-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Default User List */}

                    {owners.length > 0 ? (
                        <ul className="space-y-2">
                            {owners.map((owner) => (
                                <li
                                    key={owner.id}
                                    onClick={() => {
                                        setActiveOwner(owner);
                                        fetchMessages(owner.id);
                                        selectedOwnerToSessionStorage(owner);
                                    }}
                                    className="group relative cursor-pointer bg-indigo-100 hover:bg-indigo-200 rounded-full transition duration-200 flex items-center p-1"
                                >
                                    <img
                                        src={`/storage/${owner.avatar || 'profile/default_avatar.png'}`}
                                        alt={owner.name}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <p className="text-sm truncate">{owner.name}</p>

                                    {/* Hover name badge */}
                                    <div className="absolute sm:hidden w-full left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md z-10">
                                        {owner.name}
                                    </div>

                                    {onlineOwners.some((u) => u.id === user.id) && (
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
                                {searchResults.map((owner) => (
                                    <li
                                        key={owner.id}
                                        onClick={() => {
                                            setActiveOwner(owner);
                                            fetchMessages(owner.id);
                                            selectedOwnerToSessionStorage(owner);
                                            setSearchQuery(''); // optional: clear after select
                                        }}
                                        className="flex  flex-col gap-2 px-3 py-2 hover:bg-indigo-100 cursor-pointer transition-all"
                                    >
                                        <div className='flex items-center gap-2'>
                                            <img
                                                src={`/storage/${owner.avatar || 'profile/default_avatar.png'}`}
                                                alt={owner.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span className="text-sm font-medium">{owner.name}</span>
                                            {onlineOwners.some((o) => o.id === owner.id) && (
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
                    {!activeOwner ? (
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
                                            activeOwner.avatar
                                                ? `/storage/${activeOwner.avatar}`
                                                : '/storage/profile/default_avatar.png'
                                        }
                                        alt={activeOwner.name || 'User Avatar'}
                                        className="w-8 h-8 rounded-full border-indigo-500 border-2 p-[1px] mr-2"
                                    />
                                    {activeOwner.name}
                                    {onlineOwners.some((u) => u.id === activeOwner.id) && (
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
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.length > 0 ? (
                                    <div >
                                        {messages.map((msg) => {
                                            const isCurrentUser = msg.sender_id === user.id;
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
                                                activeOwner.avatar
                                                    ? `/storage/${activeOwner.avatar}`
                                                    : '/storage/profile/default_avatar.png'
                                            }
                                            alt={activeOwner.name || 'User Avatar'}
                                            className="w-32 h-32 rounded-full border-indigo-500 border-2 p-[1px] mr-2"
                                        />
                                        <h2 className='text-xl font-semibold text-gray-700'>{activeOwner.name}</h2>
                                        {onlineOwners.some((u) => u.id === activeOwner.id) && (
                                            <span className="text-xs text-green-500">Online</span>
                                        )}
                                    </div>
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
                    <div className='flex items-center gap-2 p-2 text-sm'>
                        <FontAwesomeIcon icon={faWarning} className='text-red-500 mr-2' />
                        <p>This action cannot be undone.</p>

                    </div>
                    <div className='flex items-center justify-end gap-2 mt-4'>
                        <button
                            onClick={() => {
                                deleteConversation(activeOwner?.id);
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
        </UserMessageLayout>
    );
}
