import SellerLayout from "@/Layouts/SellerLayout";
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Head, usePage } from "@inertiajs/react";

export default function Histories({ Bookings }) {
    const user = usePage().props.auth.seller;
    const [bookings, setBookings] = useState(Bookings);

    useEffect(() => {
        const ownerId = user?.id;
        if (!ownerId) return;

        console.log("✅ Owner authenticated with ID:", ownerId);

        try {
            const channel = window.Echo.private(`to_owner_user_booking_expired.${ownerId}`)
                .listen('.ToOwnerUserBookingExpiredEvent', (e) => {
                    console.log("📩 Event received from Reverb:", e);
                    setBookings(prevBookings => [...prevBookings, e.booking]);
                });

            console.log("🔗 Subscribed to channel:", `to_owner_user_booking_expired.${ownerId}`);

            return () => {
                console.log("🛑 Unsubscribing...");
                channel.stopListening('.ToOwnerUserBookingExpiredEvent');
            };
        } catch (err) {
            console.error("❌ Failed to connect:", err);
        }
    }, [user?.id]);

    // Helper: calculate end date
    const calculateEndDate = (start, months) => {
        if (!start || !months) return null;
        const startDate = new Date(start);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + months);
        return endDate;
    };

    return (
        <SellerLayout>
            <Head title="Histories" />
            <div className="p-8 min-h-screen">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Histories</h3>

                <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
                    <table className="min-w-full text-sm text-gray-800">
                        <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-6 py-3 text-left">Bed</th>
                                <th className="px-6 py-3 text-left">Room</th>
                                <th className="px-6 py-3 text-left">Building</th>
                                <th className="px-6 py-3 text-left">Months</th>
                                <th className="px-6 py-3 text-left">Start Date</th>
                                <th className="px-6 py-3 text-left">End Date</th>
                                <th className="px-6 py-3 text-left">Price</th>
                                <th className="px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const bed = booking.bookable;
                                const room = bed?.room;
                                const building = room?.building;

                                const endDate = calculateEndDate(booking.start_date, booking.month_count);

                                return (
                                    <tr key={booking.id} className="border-t border-gray-200 hover:bg-indigo-50 transition">
                                        {/* Bed */}
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <img
                                                src={bed?.image ? `/storage/${bed.image}` : "https://via.placeholder.com/80x60?text=No+Image"}
                                                alt={bed?.name || "Bed"}
                                                className="w-16 h-12 rounded-lg object-cover shadow-sm"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{bed?.name ?? "N/A"}</p>
                                                {bed?.ratings ? (
                                                    <p className="text-xs text-gray-500">
                                                        ⭐ {bed.ratings} ({bed.people_rated ?? 0} reviews)
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">No ratings yet</p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Room */}
                                        <td className="px-6 py-4">{room?.name ?? "N/A"}</td>

                                        {/* Building */}
                                        <td className="px-6 py-4">{building?.name ?? "N/A"}</td>

                                        {/* Month Count */}
                                        <td className="px-6 py-4 font-semibold text-gray-900">{booking.month_count}</td>

                                        {/* Start Date */}
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(booking.start_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </td>

                                        {/* End Date (calculated) */}
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {endDate
                                                ? endDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })
                                                : "Ongoing"}
                                        </td>

                                        {/* Price */}
                                        <td className="px-6 py-4 font-medium text-indigo-700">₱{booking.total_price}</td>

                                        {/* Action */}
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/seller/history/${booking.id}`}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-full shadow hover:bg-indigo-700 transition"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </SellerLayout>
    );
}
