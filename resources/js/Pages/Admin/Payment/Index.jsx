import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "../AuthenticatedLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Index({ paymentInfo }) {
    const [isEditing, setIsEditing] = useState(!paymentInfo);
    const [preview, setPreview] = useState(paymentInfo?.qr_code ? `/storage/${paymentInfo.qr_code}` : null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };
    const { data, setData, post, put, processing } = useForm({
        gcash_name: paymentInfo?.gcash_name || "",
        gcash_number: paymentInfo?.gcash_number || "",
        qr_code: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (paymentInfo) {
            put(route("admin.payment.info.update", paymentInfo.id), {
                forceFormData: true,
                onSuccess: () => setIsEditing(false),
            });
        } else {
            post(route("admin.payment.info.store"), {
                forceFormData: true,
                onSuccess: () => setIsEditing(false),
            });
        }
    };

    const handleFileChange = (input) => {
        let file;

        // If input is an event (from input element)
        if (input.target) {
            file = input.target.files[0];
        } else {
            // If input is a File (from drag/drop)
            file = input;
        }

        if (!file) return;

        setData("qr_code", file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const container = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payment Info" />
            <motion.div
                className="p-6 max-w-3xl mx-auto"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Header */}
                <motion.div variants={item} className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Payment Info</h1>
                    <p className="text-gray-600">
                        Manage your GCash payment information.
                    </p>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    variants={item}
                    className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 space-y-4"
                >
                    {!isEditing && paymentInfo ? (
                        <div className="space-y-4">
                            <p>
                                <span className="font-semibold text-gray-700">GCash Name:</span>{" "}
                                {paymentInfo.gcash_name}
                            </p>
                            <p>
                                <span className="font-semibold text-gray-700">GCash Number:</span>{" "}
                                {paymentInfo.gcash_number}
                            </p>
                            <div>
                                <span className="font-semibold text-gray-700">QR Code:</span>
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="GCash QR"
                                        className="w-32 h-32 mt-2 rounded-xl border border-gray-200 object-contain shadow-sm"
                                    />
                                ) : (
                                    <span className="text-gray-500 ml-1">
                                        No QR code uploaded
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                            >
                                Edit Payment Info
                            </button>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            encType="multipart/form-data"
                        >
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">
                                    GCash Name
                                </label>
                                <input
                                    type="text"
                                    name="gcash_name"
                                    value={data.gcash_name}
                                    onChange={(e) => setData("gcash_name", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">
                                    GCash Number
                                </label>
                                <input
                                    type="text"
                                    name="gcash_number"
                                    value={data.gcash_number}
                                    onChange={(e) => setData("gcash_number", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">
                                    GCash QR Code
                                </label>
                                <div
                                    className={`w-full p-6 border-2 border-dashed rounded-xl text-center transition 
                  ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}`}
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="fileUpload"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="fileUpload"
                                        className="cursor-pointer flex flex-col items-center justify-center text-gray-600"
                                    >
                                        <svg
                                            className="w-12 h-12 mb-3 text-indigo-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16v-4m0 0L5 8m2 4l2-4m4 4v-4m0 0L11 8m2 4l2-4m4 4v-4m0 0l-2-4m2 4l2-4"
                                            />
                                        </svg>
                                        <span>Drag & drop your QR code here or click to upload</span>
                                    </label>
                                </div>
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-32 h-32 mt-2 rounded-xl border border-gray-200 object-contain shadow-sm"
                                    />
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-2">
                                {paymentInfo && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                                >
                                    {paymentInfo ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
