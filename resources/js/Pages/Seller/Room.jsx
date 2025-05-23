import SellerLayout from '@/Layouts/SellerLayout';
import { Head, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function Rooms({ room, ratingStats, totalCompletedBookings, bedAvailability, roomAvailablity }) {
    console.log(room); // Debugging line to check the room data
    return (
        <SellerLayout>
            <Head title={`Room: ${room.name}`} />

            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/seller/building' },
                        { label: room.building.name, url: `/seller/building/${room.building.id}` },
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

                {/* Display Beds in Table */}
                <h3 className="text-xl font-semibold mt-6 mb-2">Beds</h3>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Bed Name</th>
                                <th className="px-4 py-2 text-left">Image</th>
                                <th className="px-4 py-2 text-left">Price</th>
                                <th className="px-4 py-2 text-left">Sale Price</th>
                                <th className="px-4 py-2 text-left">Availability</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {room.beds.map((bed) => (
                                <tr key={bed.id} className="border-b">
                                    <td className="px-4 py-2">{bed.name}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={`/storage/${bed.image}`}
                                            alt={bed.name}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-2">&#8369; {bed.price}</td>
                                    <td className="px-4 py-2">
                                        {bed.sale_price && (
                                            <p className="text-sm text-red-500 line-through">&#8369; {bed.sale_price}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {bed.status === 'active' ? (
                                            <span className="text-green-600 font-medium">Available</span>
                                        ) : (
                                            <span className="text-red-600 font-medium">Occupied</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/seller/building/bed/${bed.id}`}
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
            </div>
        </SellerLayout>
    );
}
