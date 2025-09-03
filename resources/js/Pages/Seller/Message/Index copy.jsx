import SellerLayout from '@/Layouts/SellerLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
export default function Index({ messages, users }) {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isAIOn, setIsAIOn] = useState(false);
    const conversationUsers = [...new Map(
        messages.map(msg => {
            const isSellerSender = msg.sender_type === 'App\\Models\\Seller';
            const otherUserId = isSellerSender ? msg.receiver_id : msg.sender_id;
            const user = users[otherUserId];

            return [otherUserId, {
                userId: otherUserId,
                name: user?.name || `User ${otherUserId}`,
                image: user?.profile_photo_url || '/default-avatar.png', // Adjust based on your app
            }];
        })
    ).values()];

    const filteredMessages = selectedUserId
        ? messages.filter(msg => {
            const isSellerSender = msg.sender_type === 'App\\Models\\Seller';
            const otherUserId = isSellerSender ? msg.receiver_id : msg.sender_id;
            return otherUserId === selectedUserId;
        })
        : [];
    const toggleAI = () => {
        setIsAIOn(!isAIOn);
    };
    return (
        <SellerLayout>
            <Head title="Messages" />
            <div className="flex h-screen">
                {/* Sidebar with user list */}
                <div className="w-1/4 border-r p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                    {conversationUsers.map(user => (
                        <div
                            key={user.userId}
                            onClick={() => setSelectedUserId(user.userId)}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedUserId === user.userId ? 'bg-gray-200' : ''
                                }`}
                        >
                            <img
                                src={user.image ? `/storage/profile${user.image}` : '/storage/profile/default_avatar.png'}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span>{user.name}</span>
                        </div>
                    ))}
                </div>

                {/* Chat area */}
                <div className="w-3/4 p-4 flex flex-col">
                    {selectedUserId ? (
                        <>
                            <div className='flex items-center justify-end mb-4'>
                                <button
                                    onClick={toggleAI}
                                    className={`flex items-center gap-2 p-2 rounded-full cursor-pointer hover:bg-gray-100 `}
                                >
                                    <FontAwesomeIcon icon={isAIOn ? faToggleOn : faToggleOff} className="w-5 h-5 text-purple-600" />
                                    <span>{isAIOn ? 'Disable' : 'Enable'} AI</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                                {filteredMessages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`max-w-sm px-3 py-2 rounded-lg ${msg.sender_type === 'App\\Models\\Seller' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="border rounded px-3 py-2 flex-1"
                                />
                                <button className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 text-center mt-20">Select a conversation to view messages.</div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
