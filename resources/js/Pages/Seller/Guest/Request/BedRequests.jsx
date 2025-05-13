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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length === 0 ? (
                <p className="text-gray-500">No bed requests found.</p>
            ) : (
                requests.map((request) => {
                    const startDate = new Date(request.start_date);
                    const endDate = new Date(request.end_date);
                    const monthCount = calculateMonths(startDate, endDate); // Calculate months between start and end date

                    return (
                        <div key={request.id} className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
                            {/* User Information */}
                            <Link>
                                <div className="flex items-center mb-4">
                                    <img
                                        src={`/storage/user/${request.user.avatar ? request.user.avatar : 'default_avatar.png'}`}
                                        alt={request.user.name}
                                        className="w-10 h-10 rounded-full mr-4"
                                    />
                                    <div>
                                        <p className="font-semibold text-lg">{request.user.name}</p>
                                        <p className="text-sm text-gray-500">{request.user.email}</p>
                                        {request.user.address && (
                                            <p className="text-sm text-gray-500">{request.user.address}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Bed Information */}
                                <div className="mb-4">
                                    <p className="text-xl font-semibold">{request.bookable.name}</p>
                                    {request.bookable.image && (
                                        <img
                                            src={
                                                request.bookable.image
                                                    ? request.bookable.image.startsWith('https')
                                                        ? request.bookable.image
                                                        : `/storage/bed/${request.bookable.image}`
                                                    : 'storage/bed/bed.png'
                                            }
                                            alt={request.bookable.name}
                                            className="w-full h-48 object-cover rounded-lg mb-2"
                                        />
                                    )}
                                </div>

                                <div className="flex justify-between items-end gap-6 p-4 bg-white rounded-lg shadow-sm">
                                    {/* Request Dates */}
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            <strong>Start:</strong> {startDate.toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <strong>End:</strong> {endDate.toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <strong>Duration:</strong> {monthCount} month{monthCount > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    {/* Payment Status */}
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                          Payment Method: {request.payment_method}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                        </div>
                    );
                })
            )}
        </div>
    );
}
