import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faStar, faBed, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default function Building({ building, ratingStats, totalCompletedBookings }) {
    return (
        <AuthenticatedLayout>
            <Head title={building.name} />

            <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/home/buildings' },
                        { label: building.name },
                    ]}
                />

                {/* Building Header */}
                <div className="overflow-hidden rounded-xl shadow-lg mb-6">
                    <img
                        src={`/storage/${building.image}`}
                        alt={building.name}
                        className="w-full h-40 sm:h-48 md:h-72 object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Building Info */}
                <div className="bg-white rounded-xl shadow p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                        {building.name}
                    </h2>

                    {/* Seller */}
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                        <FontAwesomeIcon icon={faUserTie} className="mr-2 text-gray-500" />
                        <span className="font-medium">{building.seller.name}</span>
                    </div>

                    {/* Address */}
                    <Link 
                        href={route('map.index', building.id)}>
                        <p className="flex items-start text-gray-600 text-xs sm:text-sm leading-relaxed">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-500 mt-0.5" />
                            {building.address
                                ? `${building.address.street}, ${building.address.barangay}, ${building.address.city}, ${building.address.province} ${building.address.postal_code}, ${building.address.country}`
                                : "N/A"}
                        </p>
                    </Link>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700 mt-3 sm:mt-4">
                        <div className="flex items-center">
                            <span className="font-semibold text-yellow-500 flex items-center">
                                <FontAwesomeIcon icon={faStar} className="mr-1" /> {ratingStats.average || 0}
                            </span>
                            <span className="ml-1">
                                ({ratingStats.average > 0 ? <>from {ratingStats.total} </> : null}reviews)
                            </span>
                        </div>

                        <div className="flex items-center">
                            <span className="font-semibold text-green-600">{totalCompletedBookings}</span>
                            <span className="ml-1">completed bookings</span>
                        </div>
                    </div>
                </div>
                {/* Rooms Section */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-6 sm:mt-8 mb-4 sm:mb-6 text-gray-800">
                    Rooms
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
                    {building.rooms.map((room) => (
                        <Link
                            key={room.id}
                            href={`/home/room/${room.id}`}
                            className="group rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-200 overflow-hidden"
                        >
                            {/* Room Image */}
                            <div className="relative">
                                <img
                                    src={`/storage/${room.image}`}
                                    alt={room.name}
                                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                                    ₱{room.price}
                                </span>
                            </div>

                            {/* Room Content */}
                            <div className="p-3 sm:p-4 bg-white">
                                <div className="flex items-center justify-between mb-2 pb-2">
                                    <h4 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                                        {room.name}
                                    </h4>

                                    {/* Beds count */}
                                    <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                                        <FontAwesomeIcon icon={faBed} className="mr-1 text-indigo-500" />
                                        {room.beds_count} {room.beds_count > 1 ? 'beds' : 'bed'}
                                    </div>
                                </div>

                                <div className='flex items-center justify-between'>
                                    {/* Ratings */}
                                    <div className="flex items-center space-x-1 mb-3">
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                        <span className="text-[11px] sm:text-xs text-gray-600">4.5 (12 reviews)</span>
                                    </div>

                                    {/* Overlapping Tenant Avatars */}
                                    <div className="flex -space-x-3">
                                        <img
                                            src="/storage/profile/rojas.png"
                                            alt="Tenant 1"
                                            className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                                        />
                                        <img
                                            src="/storage/profile/rojas.png"
                                            alt="Tenant 2"
                                            className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                                        />
                                        <img
                                            src="/storage/profile/rojas.png"
                                            alt="Tenant 3"
                                            className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                                        />
                                        <div className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border-2 border-white shadow-sm">
                                            +9
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
