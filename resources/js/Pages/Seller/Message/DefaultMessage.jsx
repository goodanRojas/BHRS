import React, { useState } from "react";
import SellerLayout from "@/Layouts/SellerLayout";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    MessageSquareText,
    Info,
    CalendarClock,
    Pencil,
    Trash2,
    X
} from "lucide-react";
import axios from "axios";
import Add from "./DefaultMessagePartials/Add";
import Edit from "./DefaultMessagePartials/Edit";
import Modal from "@/Components/Modal";

export default function DefaultMessage({ message: initialMessage }) {
    const [messages, setMessages] = useState(initialMessage || []);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const handleDelete = () => {
        axios.delete(`/seller/message/default/${selectedMessage.id}`).then(() => {
            setShowDeleteModal(false);
            setMessages(messages.filter((msg) => msg.id !== selectedMessage.id));
        });
        setSelectedMessage(null);
    };
    return (
        <SellerLayout>
            <Head title="Default Message" />

            <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                        <MessageSquareText className="w-7 h-7 text-blue-600" />
                        Default Messages
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage and review your automated tenant messages.
                    </p>
                </motion.div>

                {/* Tool Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex justify-end mb-8"
                >
                    <Add
                        onAdd={(message) => {
                            setMessages([...messages, message]);
                        }}
                    />
                </motion.div>
                {/* Messages List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <motion.div
                                key={msg.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-end gap-2">
                                    <Edit message={msg} 
                                        onUpdate={(updatedMsg) => {
                                            setMessages(messages.map(m => m.id === updatedMsg.id ? updatedMsg : m));
                                            
                                        }}
                                    />
                                    {/* Delete Button */}
                                    <motion.button
                                        whileHover={{
                                            scale: 1.15,
                                            color: "#dc2626", // red-600
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-gray-600 hover:text-red-600 transition-colors"
                                        onClick={() => {
                                            setShowDeleteModal(true);
                                            setSelectedMessage(msg);
                                        }}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                                {/* Message Body */}
                                <div>
                                    <h2 className="text-gray-800 font-semibold flex items-center gap-2">
                                        <MessageSquareText className="w-5 h-5 text-blue-500" />
                                        Message
                                    </h2>
                                    <p className="mt-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-4 leading-relaxed">
                                        {msg.message || "No message content available."}
                                    </p>
                                </div>

                                {/* Remarks */}
                                {msg.remarks && (
                                    <div className="mt-4">
                                        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-500" />
                                            Remarks
                                        </h3>
                                        <p className="mt-1 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-3">
                                            {msg.remarks}
                                        </p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="w-full flex items-center justify-start text-sm text-gray-500 mt-4 pt-3 border-t">
                                    <div className="flex items-center gap-1">
                                        <CalendarClock className="w-4 h-4" />
                                        Created:{" "}
                                        <span className="text-gray-600 ml-1">
                                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            }) : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-500 col-span-full"
                        >
                            No messages found.
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Delete Default Message
                        </h2>
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete this default message?
                        </p>
                        <div className="w-full flex items-center justify-end gap-2 mt-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    handleDelete();
                                }}
                                className=" px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                Delete
                            </button>
                            <button
                                onClick={() => { setShowDeleteModal(false); setSelectedMessage(null); }}
                                className=" px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>
        </SellerLayout>
    );
}
