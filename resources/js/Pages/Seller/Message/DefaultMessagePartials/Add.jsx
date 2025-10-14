import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

export default function Add({ onAdd }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, reset } = useForm({
        message: "",
        remarks: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("seller.message.default.store"), {
            onSuccess: () => {
                onAdd({
                    id: Date.now(), // temporary ID (until refreshed)
                    message: data.message,
                    remarks: data.remarks,
                    created_at: new Date().toISOString(),
                });
                reset();
                setShowModal(false);
            },
        });
    };

    return (
        <>
            {/* Plus Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className={`bg-blue-600 text-white p-2 text-sm rounded-full shadow-lg hover:bg-blue-700 transition-colors`}
            >
                <Plus className="w-5 h-5" />
            </motion.button>

            {/* Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Add Default Message
                        </h2>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                value={data.message}
                                onChange={(e) =>
                                    setData({ ...data, message: e.target.value })
                                }
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition"
                                rows="4"
                                placeholder="Enter your default message..."
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks
                            </label>
                            <input
                                type="text"
                                value={data.remarks}
                                onChange={(e) =>
                                    setData({ ...data, remarks: e.target.value })
                                }
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Enter remarks (optional)"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow transition"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </motion.div>
            </Modal>
        </>
    );
}
