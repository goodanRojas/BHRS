import { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';

export default function Bedrequests({ Requests: Intialrequests }) {
 const user = usePage().props.auth.seller;

 const [requests, setrequests] = useState(Intialrequests || []);
    useEffect(() => {
        const ownerId = user?.id; // however you get it

        if (!ownerId) return;
        const channel = window.Echo.private(`owner.${ownerId}`)
            .listen('.NewBooking', (e) => {
                console.log('🔔 New booking received!', e);
                setrequests((prev) => [...prev, e.booking]);

            });

        return () => {
            channel.stopListening('.NewBooking');
        };
    }, [user?.id]);

    const calculateMonths = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the difference in years and months
        const yearsDifference = end.getFullYear() - start.getFullYear();
        const monthsDifference = end.getMonth() - start.getMonth();

        // Adjust if the month difference is negative (i.e., end month is earlier than start month)
        return yearsDifference * 12 + monthsDifference;
    };

    return (
        <SellerLayout>
            <Head title="Current requests" />
            <div className="overflow-x-auto">
                {requests.length === 0 ? (
                    <p className="text-gray-500">No bed requests found.</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="min-w-full text-sm text-gray-800">
                            <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">User</th>
                                    <th className="px-6 py-3 text-left">Booking Details</th>
                                    <th className="px-6 py-3 text-left">Payment</th>
                                    <th className="px-6 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => {
                                    const startDate = new Date(request.start_date);
                                    const endDate = new Date(request.end_date);
                                    const monthCount = calculateMonths(startDate, endDate);

                                    return (
                                        <tr key={request.id} className="border-t border-gray-200 hover:bg-indigo-50 transition">
                                            {/* User Information */}
                                            <td className="px-6 py-4 flex items-center gap-4 whitespace-nowrap">
                                                <img
                                                    src={`/storage/${request.user.avatar || 'profile/default_avatar.png'}`}
                                                    alt={request.user.name}
                                                    className="w-12 h-12 rounded-full border object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium">{request.user.name}</p>
                                                    <p className="text-xs text-gray-500">{request.user.email}</p>
                                                    {request.user.address && (
                                                        <p className="text-xs text-gray-400">{request.user.address}</p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Booking Information */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-semibold">{request.bookable.name}</p>
                                                <p className="text-xs text-gray-500">Start: {startDate.toLocaleDateString()}</p>
                                                <p className="text-xs text-gray-500">End: {endDate.toLocaleDateString()}</p>
                                                <p className="text-xs text-gray-500">Duration: {monthCount} month{monthCount > 1 ? 's' : ''}</p>
                                            </td>

                                            {/* Payment Info */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-600">{request.payment_method}</span>
                                            </td>

                                            {/* Action Button */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={`/seller/request/bed/${request.id}`}
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

                )}
            </div>
        </SellerLayout>
    );
}
