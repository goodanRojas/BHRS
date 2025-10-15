import { Head, Link } from "@inertiajs/react";
import Layout from "./Layout";
import { motion } from "framer-motion";

export default function Canceled({ bookings }) {
    return (
        <Layout>
            <Head title="Cancelled Bookings" />

            <div className="p-6 md:p-10 min-h-screen space-y-6 bg-gray-50">
                {/* Page Title */}
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    Cancelled Bookings
                </h1>

                {/* Table Container */}
                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                                <th className="p-4">Bed</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Building</th>
                                <th className="p-4">Owner</th>
                                <th className="p-4">Cancelled At</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                            {bookings.length > 0 ? (
                                bookings.map((booking, index) => {
                                    const bed = booking.bookable;
                                    const room = bed?.room;
                                    const building = room?.building;
                                    const seller = building?.seller;

                                    return (
                                        <motion.tr
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{
                                                scale: 1.01,
                                                backgroundColor: "#f9fafb",
                                            }}
                                            className="transition"
                                        >
                                            {/* Bed */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {bed?.name ?? "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Room */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">

                                                    <span className="font-medium text-gray-700">
                                                        {room?.name ?? "N/A"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Building */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                  
                                                    <span className="font-medium text-gray-700">
                                                        {building?.name ?? "N/A"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Owner */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                  
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {seller?.name ?? "N/A"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {seller?.email}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {seller?.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cancelled Date */}
                                            <td className="p-4 text-gray-600">
                                                {new Date(booking.updated_at).toLocaleString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                    }
                                                )}
                                            </td>

                                            {/* Price */}
                                            <td className="p-4 font-semibold text-indigo-600">
                                                ₱
                                                {booking.total_price?.toFixed(2) ?? "0.00"}
                                            </td>

                                            {/* Action */}
                                            <td className="p-4 text-center">
                                                <Link
                                                    href={`/home/bed/${booking.bookable.id}`}
                                                    className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-full shadow hover:bg-indigo-700 transition"
                                                >
                                                    Book
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-8 text-gray-500 italic"
                                    >
                                        No cancelled bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Empty State Action */}
                {bookings.length <= 0 && (
                    <div className="flex justify-center">
                        <Link
                            href="/buildings/home"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
                        >
                            Browse to find your stay
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}
