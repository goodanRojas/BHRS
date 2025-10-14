import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Pencil, X } from "lucide-react";
import Modal from "@/Components/Modal";
export default function Edit({ message, onUpdate }) {
    const [showEditModal, setShowEditModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: message.message || "",
        remarks: message.remarks || "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("seller.message.default.update", message.id), {
            onSuccess: () => {
                onUpdate({...message, message: data.message, remarks: data.remarks});
                reset();
                setShowEditModal(false);
            },
        });
    };
    return (
        <>
            {/* Edit Button */}
            <motion.button
                whileHover={{
                    scale: 1.15,
                    color: "#2563eb", // blue-600
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setShowEditModal(true)}
            >
                <Pencil className="w-5 h-5" />
            </motion.button>

            {/* Edit Modal */}
          <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Edit Default Message
                        </h2>
                        <button
                            onClick={() => setShowEditModal(false)}
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
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow transition` + (processing ? " opacity-50 cursor-not-allowed" : "")}
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