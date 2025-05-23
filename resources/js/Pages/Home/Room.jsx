import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function Rooms({ room, ratingStats, totalCompletedBookings, bedAvailability, roomAvailablity }) {
    // console.log(room); // Debugging line to check the room data
    return (
        <AuthenticatedLayout>
            <Head title={`Room: ${room.name}`} />

            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/home/buildings' },
                        { label: room.building.name, url: `/home/building/${room.building.id}` },
                        { label: room.name },
                    ]}
                />

                {/* Image Section */}
                <div className="overflow-hidden rounded-t-lg">
                    <img
                        src={`/storage/room/${room.image}`}
                        alt={room.name}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{room.name}</h2>

                    <div className="flex items-center gap-2 mt-2">
                        <img src="/storage/system/sale-icon.png" alt="Sale" className="h-5 w-5" />
                        <p className="text-sm text-red-500">&#8369;{room.sale_price}</p>
                    </div>
                </div>
                {/* Rating and Booking Stats */}
                <div className="flex gap-6 text-sm text-gray-700 mt-2">
                    <div>
                        <span className="font-semibold text-yellow-600"><FontAwesomeIcon icon={faStar} /> {ratingStats.average || 'N/A'}</span>
                        <span className="ml-1">(from {ratingStats.total} reviews)</span>
                    </div>
                    <div>
                        <span className="font-semibold text-green-600">{totalCompletedBookings}</span>
                        <span className="ml-1">completed bookings</span>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    {roomAvailablity === 0 ? (
                        <span className="text-green-600 font-medium">Room Available</span>
                    ) : (
                        <span className="text-red-600 font-medium">Room Occupied</span>
                    )}
                </div>

                {/* Display Beds */}
                <h3 className="text-xl font-semibold mt-6 mb-2">Beds</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {room.beds.map((bed) => (
                        <div
                            key={bed.id}
                            className="p-6 border rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-300"
                        >
                            <Link href={`/home/bed/${bed.id}`} className="block">
                                {/* Image Section */}
                                <div className="overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={`/storage/bed/${bed.image}`}
                                        alt={bed.name}
                                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>

                                {/* Name and Price Section */}
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">{bed.name}</h4>
                                <div className="text-lg font-medium text-gray-900 mb-3">&#8369; {bed.price}</div>

                                {/* Sale Price (If Available) */}
                                {bed.sale_price && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <img src="/storage/system/sale-icon.png" alt="Sale" className="h-5 w-5" />
                                        <p className="text-sm text-red-500 line-through">&#8369; {bed.sale_price}</p>
                                    </div>
                                )}

                                {/* Availability Section */}
                                <div className="flex items-center text-sm text-gray-600">
                                    {bed.status === 'active' ? (
                                        <span className="flex items-center text-green-600 font-medium">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Available
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-600 font-medium">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            Occupied
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
