import React, { useState, useEffect, useRef, } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const SellerChat = ({ seller, bed, messages }) => {
    const { data, setData, post, processing } = useForm({ content: '' });
    const [chatMessages, setChatMessages] = useState(messages);
    const user = usePage().props.auth.user;
    console.log(user);
    // console.log(seller);
    // console.log(bed);

    // Handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setChatMessages((prevMessages) => [
            ...prevMessages,
            {
                sender_id: user.id,
                receiver_id: seller.id,
                content: data.content,
                created_at: new Date().toISOString(),
            },
        ]);
        setData('content', '');
        // if (data.content.trim() === '') return;

        try {
            const response = await axios.post('/chatbot/message', {
                receiver_id: seller.id,
                bed_id: bed.id,
                message: data.content
            });
            console.log(response.data);

            // Add the new message to the chat
            setChatMessages((prevMessages) => [
                ...prevMessages,
                response.data.botMessage,
            ]);

            // Clear the message input field
            setData('message', '');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="chat-container p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">{seller.buildings[0].name}</h2>

                <div className="chat-box overflow-y-auto mb-4 h-80 space-y-4">
                    {bed && (
                        <div className="flex items-center space-x-4">
                            {/* Bed image and details */}
                            <img
                                src={`/storage/${bed.image}`}
                                alt={bed.name}
                                className="w-24 h-24 rounded-t-md"
                            />
                            <div className="p-3">
                                <h2 className="text-xl font-semibold mb-4">{bed.name}</h2>
                                <p className="text-sm text-gray-500">{bed.price}</p>
                            </div>
                        </div>
                    )}

                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'} space-x-4`}>
                            {/* If the message is from the user, align it to the right */}
                            {msg.sender_id === user.id && (
                                <div className="flex items-center space-x-2">
                                    {/* User message bubble */}
                                    <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
                                        <p>{msg.content}</p>
                                        <span className="text-xs text-gray-300">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    {/* User avatar or placeholder (optional) */}
                                    <img
                                        src={user.user?.avatar ? `/storage/${user.user.avatar}` : '/storage/profile/default_avatar.png'}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />

                                </div>
                            )}

                            {/* If the message is from the chatbot, align it to the left */}
                            {msg.sender_id !== user.id && (
                                <div className="flex items-center space-x-2">
                                    {/* Chatbot message bubble */}
                                    <div className="bg-gray-200 p-2 rounded-lg max-w-xs">
                                        <p>{msg.content}</p>
                                        <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    {/* Chatbot avatar or placeholder */}
                                    <img
                                        src="/path/to/chatbot-avatar.png" // Replace with chatbot avatar image
                                        alt="Chatbot Avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>


                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                        type="text"
                        name="content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Type a message..."
                        required
                    />
                    <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                        disabled={processing}
                    >
                        Send
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default SellerChat;
