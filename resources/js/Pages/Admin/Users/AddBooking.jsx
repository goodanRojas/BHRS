import { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Calendar, Hash, MapPin, Map, Building2, Home } from "lucide-react";
import axios from "axios";
import Toast from "@/Components/Toast";
export default function AddBooking({ bedId, userId, onBookingAdded }) {
    console.log('Bed Id: ', bedId);
    console.log('User Id: ', userId);
    console.log("On Booking Added: ", onBookingAdded);
    const today = dayjs().format("YYYY-MM-DD");
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        startDate: today,
        monthCount: 1,
        bedId: bedId,
        userId: userId,
    });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(route("admin.users.add.booking"), data);
            if (onBookingAdded) onBookingAdded(response.data.booking);
            if (response.data.success) {
                setToast({ show: true, message: 'Booking added successfully!', type: 'success' });
                reset();
            }
        }
        catch (error) {
            console.error("Error adding booking:", error);
        }
    }
    console.log("Data", data);
    return (

        <div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto"
        >
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} />
            {/* Title */}
            <h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-2xl font-bold text-gray-800 flex items-center gap-2"
            >
                <Calendar className="w-6 h-6 text-indigo-600" />
                Add Previous Booking
            </h1>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col gap-2"
                >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        {/* <Calendar className="w-4 h-4 text-indigo-500" /> */}
                        Start Date
                    </label>
                    <input
                        type="date"
                        className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        name="startDate"
                        value={data.startDate ?? ""}
                        onChange={(e) => setData("startDate", e.target.value)}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-col gap-2"
                >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        {/* <Hash className="w-4 h-4 text-indigo-500" /> */}
                        Month Count
                    </label>
                    <input
                        type="number"
                        className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        name="monthCount"
                        value={data.monthCount ?? ""}
                        onChange={(e) => setData("monthCount", e.target.value)}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex justify-end"
                >
                    <button
                        type="submit"
                        disabled={processing}
                        className={`${processing ? "opacity-50 cursor-not-allowed" : ""} px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2`}
                    >
                        {/* <Calendar className="w-4 h-4" /> */}
                        Submit
                    </button>
                </motion.div>
            </form>
        </div>
    );
}
