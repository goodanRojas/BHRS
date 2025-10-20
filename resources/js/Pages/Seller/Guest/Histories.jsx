import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    CreditCard,
    Building2,
    BedDouble,
    CheckCircle,
    XCircle,
    Search,
    UserCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Link } from "@inertiajs/react";
import SellerLayout from "@/Layouts/SellerLayout";

export default function GuestHistories({ bookings }) {
    const [search, setSearch] = useState("");

    // Laravel pagination data
    const bookingList = bookings?.data || [];
    const links = bookings?.links || [];

    // Filter bookings (client-side)
    const filtered = useMemo(() => {
        if (!search.trim()) return bookingList;
        const lower = search.toLowerCase();
        return bookingList.filter(
            (b) =>
                b.payment_method?.toLowerCase().includes(lower) ||
                b.user.name?.toLowerCase().includes(lower) ||
                String(b.id).includes(lower) ||
                b.status?.toLowerCase().includes(lower)
        );
    }, [bookingList, search]);

    return (
        <SellerLayout>
            <motion.div
                className="p-6 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <motion.h1
                        className="text-2xl font-semibold text-gray-800 flex items-center gap-2"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Calendar className="w-6 h-6 text-indigo-500" />
                        Booking History
                    </motion.h1>

                    {/* Search bar */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search booking..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Booking list */}
                {filtered.length === 0 ? (
                    <motion.div
                        className="text-center py-20 text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <XCircle className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                        <p>No booking history found.</p>
                    </motion.div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    onClick={() => window.location.href = `/seller/guest/history/${booking.id}`}
                                    className="rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-300">    
                                    <CardContent className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BedDouble className="w-5 h-5 text-indigo-500" />
                                                <span className="font-medium text-gray-700">
                                                    Booking #{booking.id}
                                                </span>
                                            </div>
                                            {booking.status === "ended" ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>

                                        <div className="text-sm text-gray-500 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-4 h-4 text-gray-400" />
                                                <span>User {booking.user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span>Bookable ID: {booking.bookable_id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    Start:{" "}
                                                    <span className="text-gray-700 font-medium">
                                                        {booking.start_date}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-gray-400" />
                                                <span className="capitalize">
                                                    Payment: {booking.payment_method || "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <span className="text-gray-500 text-sm">Total Price</span>
                                            <span className="text-indigo-600 font-semibold">
                                                ₱{parseFloat(booking.total_price).toLocaleString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {links.length > 3 && (
                    <motion.div
                        className="flex justify-center items-center gap-2 pt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {bookings.prev_page_url ? (
                            <Link href={bookings.prev_page_url}>
                                <button
                                    variant="outline"
                                    className="flex items-center gap-1 rounded-xl"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </button>
                            </Link>
                        ) : (
                            <button disabled variant="outline" className="rounded-xl">
                                <ChevronLeft className="w-4 h-4" /> Prev
                            </button>
                        )}

                        <span className="text-sm text-gray-500">
                            Page {bookings.current_page} of {bookings.last_page}
                        </span>

                        {bookings.next_page_url ? (
                            <Link href={bookings.next_page_url}>
                                <button
                                    variant="outline"
                                    className="flex items-center gap-1 rounded-xl"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </Link>
                        ) : (
                            <button disabled variant="outline" className="rounded-xl">
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </SellerLayout>
    );
}
