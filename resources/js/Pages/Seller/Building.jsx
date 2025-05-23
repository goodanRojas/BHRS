import SellerLayout from '@/Layouts/SellerLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faStar, faBed, faBedPulse } from '@fortawesome/free-solid-svg-icons';

export default function Building({ building, ratingStats, totalCompletedBookings }) {
    console.log(building);
    return (
        <SellerLayout>
            <Head title={building.name} />

            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/seller/building/' },
                        { label: building.name },
                    ]}
                />

                {/* Image Section */}
                <div className="overflow-hidden rounded-t-lg">
                    <img
                        src={`/storage/building/${building.image}`}
                        alt={building.name}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{building.name}</h2>
                    <p>
                        <FontAwesomeIcon icon={faUserTie} className="mr-1 text-gray-500" />
                        {building.seller.name}
                    </p>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <i className="fas fa-location-arrow text-blue-500 mr-2"></i>
                        <span>{building.address}</span>
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
                </div>

                {/* Rooms Table */}
                <h3 className="text-xl font-semibold mb-2 mt-4">Rooms</h3>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Room Name</th>
                                <th className="px-4 py-2 text-left">Image</th>
                                <th className="px-4 py-2 text-left">Sale Price</th>
                                <th className="px-4 py-2 text-left">Beds Count</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {building.rooms.map((room) => (
                                <tr key={room.id} className="border-b">
                                    <td className="px-4 py-2">{room.name}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={`/storage/room/${room.image}`}
                                            alt={room.name}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-2">&#8369;{room.sale_price}</td>
                                    <td className="px-4 py-2">{room.beds_count}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/seller/room/${room.id}`}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* No Rooms Found Message */}
                {building.rooms.length === 0 && (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">No rooms found.</p>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
