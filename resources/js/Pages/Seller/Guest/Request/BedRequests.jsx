import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function BedRequests({ requests }) {
    
    
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
        <div className="overflow-x-auto">
            {requests.length === 0 ? (
                <p className="text-gray-500">No bed requests found.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left border-b">User</th>
                            <th className="px-4 py-2 text-left border-b">Booking Details</th>
                            <th className="px-4 py-2 text-left border-b">Payment</th>
                            <th className="px-4 py-2 text-left border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => {
                            const startDate = new Date(request.start_date);
                            const endDate = new Date(request.end_date);
                            const monthCount = calculateMonths(startDate, endDate); // Calculate months between start and end date

                            return (
                                <tr key={request.id} className="hover:bg-gray-100 cursor-pointer">
                                    {/* User Information */}
                                    <td className="px-4 py-2 border-b flex items-center">
                                        <img
                                            src={`/storage/${request.user.avatar ? request.user.avatar : 'profile/default_avatar.png'}`}
                                            alt={request.user.name}
                                            className="w-12 h-12 rounded-full mr-4"
                                        />
                                        <div>
                                            <p className="font-semibold text-lg">{request.user.name}</p>
                                            <p className="text-sm text-gray-500">{request.user.email}</p>
                                            {request.user.address && (
                                                <p className="text-sm text-gray-500">{request.user.address}</p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Booking Information */}
                                    <td className="px-4 py-2 border-b">
                                        <p className="font-semibold">{request.bookable.name}</p>
                                        <p className="text-sm text-gray-500">Start Date: {startDate.toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500">End Date: {endDate.toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500">Duration: {monthCount} month{monthCount > 1 ? 's' : ''}</p>
                                    </td>

                                    {/* Payment Information */}
                                    <td className="px-4 py-2 border-b">
                                        <p className="text-sm text-gray-500"> {request.payment_method}</p>
                                    </td>

                                    {/* Action Column */}
                                    <td className="px-4 py-2 border-b">
                                        <Link href={`/seller/request/bed/${request.id}`} className="text-blue-600 hover:text-blue-800">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
