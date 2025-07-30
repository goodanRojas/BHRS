import { useState, useRef, useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import axios from 'axios';
import UserMessageLayout from './UserMessageLayout';
import AvatarCollage from './AvatarCollage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons'; // Import icons from FontAwesome
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function GroupChat({ groups }) {
    const [activeGroup, setActiveGroup] = useState(null); // not opened by default
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const { auth } = usePage().props;
    const currentUserId = auth?.user?.id;

    const menuRef = useRef(null);
    const [messageOptionOpen, setMessageOptionOpen] = useState(false);
    // Auto-scroll to bottom when activeGroup or its messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeGroup]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const { data } = await axios.post('/group/send-message', {
                group_id: activeGroup.id,
                content: message,
            });

            // Temporarily append message locally
            setActiveGroup((prev) => ({
                ...prev,
                messages: [...prev.messages, data.message],
            }));

            setMessage('');
        } catch (error) {
            console.error("Send failed", error);
        }
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
    return (
        <UserMessageLayout>
            <Head title="Group Chat" />
            <div className="flex h-full">
                {/* Left: Group List */}
                <div className="w-1/3 border-r overflow-y-auto">
                    <h2 className="p-4 font-bold text-lg">Groups</h2>
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => setActiveGroup(group)}
                            className={`p-4 cursor-pointer hover:bg-gray-100 ${activeGroup?.id === group.id ? 'bg-gray-200' : ''
                                } grid [grid-template-columns:3rem_1fr]  items-center`}
                        >
                            {/* First column (Avatar) - fixed width */}
                            <div className='row-span-2'>
                                {group.avatar ? (
                                    <img
                                        src={`/storage/${group.avatar}`}
                                        alt="Group Avatar"
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <AvatarCollage
                                        users={group.users
                                            .filter(user => user.id !== currentUserId)
                                            .slice(0, 3)}
                                    />
                                )}
                            </div>

                            {/* Second column (Name) */}
                            <div className="font-semibold">{group.name}</div>

                            {/* Second column, second row (Message) */}
                            <div className="col-start-2 text-sm text-gray-600 truncate">
                                {group.messages[0]?.content || ""}
                            </div>
                        </div>

                    ))}
                </div>

                {/* Right: Chat Panel - Only if selected */}
                {activeGroup != null ? (
                    <div className="w-2/3 h-full flex flex-col">
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b bg-gray-50">
                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={() => setActiveGroup(null)}
                                    className="p-2 text-gray-500 hover:text-black focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="text-gray-500 hover:text-black" />
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
                                            users={activeGroup.users
                                                .filter(user => user.id !== currentUserId)
                                                .slice(0, 3)}
                                        />
                                    )}
                                    <h2 className=" font-bold">{activeGroup.name}</h2>

                                </div>
                            </div>
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
                                            className='w-full truncate text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2'
                                        >
                                            <FontAwesomeIcon icon={faPencil} /> Edit Name
                                        </button>
                                        <button
                                            className='w-full truncate text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2'
                                        >
                                            <FontAwesomeIcon icon={faPencil} /> Change Avatar
                                        </button>
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

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">

                            {activeGroup.messages.length > 0 ? (
                                activeGroup.messages
                                    .slice()
                                    // .reverse()
                                    .map((msg) => {
                                        const isCurrentUser = msg.sender_id === currentUserId;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`grid grid-cols-[2.5rem_1fr] grid-rows-2 gap-x-2 p-3 min-w-[200px] max-w-xs md:max-w-md lg:max-w-lg`}
                                                >
                                                    {/* Avatar: bottom-left */}
                                                    <img
                                                        src={`/storage/${msg.sender?.avatar ?? 'profile/default_avatar.png'}`}
                                                        alt={msg.sender?.name ?? 'User Avatar'}
                                                        className="col-start-1 row-start-2 self-end w-8 h-8 rounded-full border-2 border-indigo-500"
                                                    />

                                                    {/* Name + Message block (stacked together) */}
                                                    <div className="col-start-2 row-span-2 flex flex-col gap-1">
                                                        <p className="text-sm font-semibold text-blue-700">
                                                            {isCurrentUser ? 'You' : msg.sender?.name ?? 'Unknown'}
                                                        </p>
                                                        <div
                                                            className={`relative group text-gray-900 text-sm min-w-[200px] p-2 px-4 shadow-lg rounded-md ${isCurrentUser ? 'bg-blue-100' : 'bg-gray-200'
                                                                }`}
                                                        >
                                                            {msg.content}
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
                        <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="w-2/3 h-full flex items-center pt-20 flex-col">
                        <div className="p-4 flex items-center justify-center">
                            <h3 className="text-xl font-semibold text-gray-700">Select a group to chat with</h3>
                        </div>
                    </div>
                )}
            </div>
        </UserMessageLayout>
    );
}
