import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faStar, faBed, faBedPulse, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default function Building({ building, ratingStats, totalCompletedBookings }) {
    console.log(building);
    return (
        <AuthenticatedLayout>
            <Head title={building.name} />

            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/home/buildings' },
                        { label: building.name },
                    ]}
                />

                {/* Image Section */}
                <div className="overflow-hidden rounded-t-lg">
                    <img
                        src={`/storage/${building.image}`}
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
                    <p className="flex items-center text-gray-600 text-sm mb-2 line-clamp-2">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-500" />
                        {building.address
                            ? `${building.address.street}, ${building.address.barangay}, ${building.address.city}, ${building.address.province} ${building.address.postal_code}, ${building.address.country}`
                            : "N/A"}
                    </p>

                    {/* Rating and Booking Stats */}
                    <div className="flex gap-6 text-sm text-gray-700 mt-2">
                        <div>
                            <span className="font-semibold text-yellow-600"><FontAwesomeIcon icon={faStar} /> {ratingStats.average || 0}</span><span className="ml-1">
                                (
                                {ratingStats.average > 0 ? <span>from {ratingStats.total} </span> : null}
                                reviews)
                            </span>

                        </div>
                        <div>
                            <span className="font-semibold text-green-600">{totalCompletedBookings}</span>
                            <span className="ml-1">completed bookings</span>
                        </div>
                    </div>
                </div>

                {/* Display Rooms */}
                <h3 className="text-xl font-semibold mb-2 mt-4">Rooms</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5   gap-4">
                    {building.rooms.map((room) => (
                        <div
                            key={room.id}
                            className=" border rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                            <Link href={`/home/room/${room.id}`} className="block">
                                <div className="flex flex-col">
                                    {/* Image */}
                                    <div className="overflow-hidden rounded-t-lg mb-4">
                                        <img
                                            src={`/storage/${room.image}`}
                                            alt={room.name}
                                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>

                                    <div className='p-3'>
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xl font-semibold text-gray-800">{room.name}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <p className="text-sm text-gray-500">&#8369;{room.price}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <FontAwesomeIcon icon={faBed} className="mr-1 text-sm text-gray-500" />{room.beds_count}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
