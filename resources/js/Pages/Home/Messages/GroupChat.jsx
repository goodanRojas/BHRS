import { useState, useRef, useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import axios from 'axios';
import UserMessageLayout from './UserMessageLayout';
import AvatarCollage from './AvatarCollage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faPencil, faPaperPlane, faClock, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'; // Import icons from FontAwesome
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
export default function GroupChat({ groups }) {
    const [activeGroup, setActiveGroup] = useState(null);
    const [message, setMessage] = useState('');
    const { auth } = usePage().props;
    const currentUserId = auth?.user?.id;

    const menuRef = useRef(null);
    const [messageOptionOpen, setMessageOptionOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeGroup]);


    // ⬇️ Load active group from localStorage on mount
    useEffect(() => {
        const storedGroupId = localStorage.getItem("activeGroupId");
        if (storedGroupId) {
            const group = groups.find(g => g.id === parseInt(storedGroupId));
            if (group) {
                setActiveGroup(group);
            }
        }
    }, [groups]);

    // ⬇️ Store active group in localStorage when it changes
    useEffect(() => {
        if (activeGroup) {
            localStorage.setItem("activeGroupId", activeGroup.id);
        } else {
            localStorage.removeItem("activeGroupId");
        }
    }, [activeGroup]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeGroup]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || !activeGroup) return;

        const tempId = Date.now();
        console.log(tempId);
        const tempMessage = {
            id: tempId,
            content: message,
            sender_id: currentUserId,
            sender: auth.user,
            created_at: new Date().toISOString(),
            status: "sending"
        };
        setActiveGroup((prev) => ({
            ...prev,
            messages: [...(prev.messages || []), tempMessage],
        }));

        setMessage("");

        try {
            const { data } = await axios.post('/group/send-message', {
                group_id: activeGroup.id,
                content: message,
                tempId: tempId,
            });

        } catch (error) {
            console.error("Send failed", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMessageOptionOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (auth.user && activeGroup) {
            const channel = window.Echo.private(`group-messages.${activeGroup.id}`)
                .listen('.GroupMessageSent', (message) => {
                    console.log("Message received:", message);

                    setActiveGroup(prev => {
                        let found = false;
                        const updatedMessages = prev.messages.map(m => {
                            if (m.tempId && m.tempId === message.tempId) {
                                found = true;
                                return {
                                    ...m,
                                    ...message,         // merge in real message data
                                    status: "sent",     // update status
                                    tempId: m.tempId,   // keep tempId so we can still track it
                                };
                            }
                            return m;
                        });

                        // If no temp message matched, append new (for messages from others)
                        return {
                            ...prev,
                            messages: found ? updatedMessages : [...updatedMessages, { ...message, status: "sent" }],
                        };
                    });
                });
        }
        return () => {
            if (window.Echo && activeGroup) {
                window.Echo.leave(`group-messages.${activeGroup.id}`);
            }
        };
    }, [auth.user, activeGroup]);


    return (
        <UserMessageLayout>
            <Head title="Group Chat" />
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Left: Group List */}
                <div className="w-1/3 border-r overflow-y-auto">
                    <h2 className="p-4 font-semibold text-gray-700 text-lg border-b">
                        Groups
                    </h2>

                    {groups.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => setActiveGroup(group)}
                            className={`px-4 py-3 cursor-pointer transition-all duration-200 
                ${activeGroup?.id === group.id
                                    ? 'bg-gray-100 shadow-sm'
                                    : 'hover:bg-gray-50'} 
                grid grid-cols-[3rem_1fr] gap-x-3 items-center`}
                        >
                            {/* Avatar / Collage */}
                            <div className="row-span-2">
                                {group.avatar ? (
                                    <img
                                        src={`/storage/${group.avatar}`}
                                        alt="Group Avatar"
                                        className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                                    />
                                ) : (
                                    <AvatarCollage
                                        users={group.members
                                            .filter(user => user.id !== currentUserId)
                                            .slice(0, 3)}
                                    />
                                )}
                            </div>

                            {/* Group name */}
                            <div className="font-medium text-gray-800 truncate">
                                {group.name}
                            </div>

                            {/* Last message preview */}
                            <div className="col-start-2 text-sm text-gray-500 truncate">
                                {group.messages?.[0]?.content || "No messages yet"}
                            </div>
                        </div>
                    ))}
                </div>


                {/* Right: Chat Panel */}
                {activeGroup ? (
                    <div className="w-2/3 h-full flex flex-col">
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b ">
                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={() => setActiveGroup(null)}
                                    className="p-2 text-gray-500 hover:text-black focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                <div className='flex items-center gap-2'>
                                    {activeGroup.avatar ? (
                                        <img
                                            src={`/storage/${activeGroup.avatar}`}
                                            alt="Group Avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <AvatarCollage
                                            users={activeGroup.members
                                                .filter(user => user.id !== currentUserId)
                                                .slice(0, 3)}
                                        />
                                    )}
                                    <h2 className="font-bold">{activeGroup.name}</h2>
                                </div>
                            </div>

                            {/* Dropdown */}
                            <div className="relative inline-block text-left" ref={menuRef}>
                                <button
                                    onClick={() => setMessageOptionOpen(!messageOptionOpen)}
                                    className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>

                                {messageOptionOpen && (
                                    <div className="absolute right-0 z-10 mt-2 w-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                        <h3 className='p-2 text-sm font-bold text-gray-900'>Options</h3>
                                        <hr />
                                        <button className='w-full truncate text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2'>
                                            <FontAwesomeIcon icon={faPencil} /> Edit Name
                                        </button>
                                        <button className='w-full truncate text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2'>
                                            <FontAwesomeIcon icon={faPencil} /> Change Avatar
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
                            {activeGroup.messages?.length > 0 ? (
                                activeGroup.messages.map((msg) => {
                                    const isCurrentUser = msg.sender_id === currentUserId;
                                    return (
                                        <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                            <div className="grid grid-cols-[2.5rem_1fr] grid-rows-2 gap-x-2 p-3 min-w-[200px] max-w-xs md:max-w-md lg:max-w-lg">
                                                <img
                                                    src={`/storage/${msg.sender?.avatar ?? 'profile/default_avatar.png'}`}
                                                    alt={msg.sender?.name ?? 'User Avatar'}
                                                    className="col-start-1 row-start-2 self-end w-8 h-8 rounded-full border-2 border-indigo-500"
                                                />
                                                <div className="col-start-2 row-span-2 flex flex-col gap-1">
                                                    <p className="text-sm font-semibold text-blue-700">
                                                        {isCurrentUser ? 'You' : msg.sender?.name ?? 'Unknown'}
                                                    </p>
                                                    <div className={`relative group text-gray-900 text-sm min-w-[200px] p-2 px-4 shadow-lg rounded-md ${isCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <div>{msg.content}</div>
                                                            {msg.sender_id === currentUserId && (
                                                                <>
                                                                    {msg.status === "sending" && (
                                                                        <FontAwesomeIcon icon={faClock} className="text-gray-400 text-xs" />
                                                                    )}
                                                                    {msg.status === "sent" && (
                                                                        <FontAwesomeIcon icon={faCheck} className="text-green-500 text-xs" />
                                                                    )}
                                                                    {msg.status === "failed" && (
                                                                        <FontAwesomeIcon icon={faXmark} className="text-red-500 text-xs" />
                                                                    )}
                                                                </>
                                                            )}

                                                        </div>

                                                        <div className="absolute top-10 opacity-0 group-hover:opacity-100 transition duration-200 text-xs text-gray-500">
                                                            {dayjs(msg.sent_at || msg.created_at).fromNow()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500">No messages yet</p>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Send Form */}
                        <form onSubmit={handleSend} className="p-4   flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring"
                            />
                            <button type="submit" className="">
                                <FontAwesomeIcon icon={faPaperPlane} className='text-indigo-600 hover:text-indigo-700' />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="w-2/3 h-full flex items-center justify-center">
                        <h3 className="text-xl font-semibold text-gray-700">Select a group to chat with</h3>
                    </div>
                )}
            </div>
        </UserMessageLayout>
    );
}

