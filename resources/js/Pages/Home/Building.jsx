import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faStar, faBed, faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function Building({ building, totalCompletedBookings, ratingCount, avgRating }) {
    const [showRules, setShowRules] = useState(false);
    const [images, setImages] = useState(building.images);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1 === building.images.length ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? building.images.length - 1 : prevIndex - 1));
    };

    return (
        <AuthenticatedLayout>
            <Head title={building.name} />

            <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/home/buildings' },
                        { label: building.name },
                    ]}
                />

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    {/* Left Section: Image + Thumbnails */}
                    <div className="flex flex-col items-start gap-5">
                        {/* Main Image */}
                        <div className="relative overflow-hidden rounded-2xl shadow-lg h-[320px] w-full max-w-[550px] bg-white">
                            <img
                                src={
                                    currentIndex === -1
                                        ? `/storage/${building.image}`
                                        : `/storage/${images[currentIndex].file_path}`
                                }
                                alt={building.name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {images &&
                                images.length > 0 &&
                                images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`/storage/${image.file_path}`}
                                        alt={`${building.name} ${index + 1}`}
                                        className={`w-20 h-20 object-cover rounded-xl shadow-md flex-shrink-0 cursor-pointer border-2 transition 
              ${currentIndex === index
                                                ? "border-blue-500"
                                                : "border-transparent hover:border-blue-300"
                                            }`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
                        </div>
                    </div>

                    {/* Right Section: Info */}
                    <div className="flex flex-col items-center md:items-start gap-5">
                        {/* Building Name */}
                        <div className="w-full bg-white rounded-2xl shadow-md p-5">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
                                {building.name}
                            </h2>
                        </div>

                        {/* Details */}
                        <div className="w-full bg-white rounded-2xl shadow-md p-5 space-y-4">
                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                    <span className="font-semibold text-gray-800">
                                        {avgRating ? Number(avgRating).toFixed(1) : "0.0"}
                                    </span>
                                    <span className="text-gray-500">
                                        ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-green-600">
                                        {totalCompletedBookings || 0}
                                    </span>
                                    <span className="text-gray-500">
                                        {totalCompletedBookings === 1
                                            ? "completed booking"
                                            : "completed bookings"}
                                    </span>
                                </div>
                            </div>

                            {/* Seller */}
                            <div className="flex items-center text-sm text-gray-700">
                                <FontAwesomeIcon icon={faUserTie} className="mr-2 text-gray-500" />
                                <span className="font-medium">{building.seller.name}</span>
                            </div>

                            {/* Address */}
                            <Link href={route("map.index", building.id)}>
                                <p className="flex items-start text-gray-700 text-sm leading-relaxed hover:text-blue-600 transition">
                                    <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                        className="mr-2 text-gray-500 mt-0.5"
                                    />
                                    {building.address ? (
                                        building.address.address ? (
                                            <span>
                                                {[building.address.barangay, building.address.municipality, building.address.province]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </span>
                                        ) : (
                                            <span>No Address Provided</span>
                                        )
                                    ) : (
                                        <span>No Address Provided</span>
                                    )}
                                </p>
                            </Link>

                            {/* Features */}
                            {building.features && building.features.length > 0 && (
                                <div>
                                    <h2 className='text-md sm:text-lg font-semibold mb-2'>Features</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {building.features.map((feature) => (
                                            <span
                                                key={feature.id}
                                                className="bg-indigo-50 text-indigo-800 text-xs sm:text-sm px-3 py-1 rounded-full border border-indigo-200"
                                            >
                                                {feature.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rules & Regulations */}
                <div className="col-span-2 bg-white rounded-2xl shadow-md p-5 md:p-6 mt-6">
                    <h2
                        className="text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer flex items-center gap-2"
                        onClick={() => setShowRules(!showRules)}
                    >
                        <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" /> Rules & Regulations
                    </h2>

                    {showRules && (
                        <div className="mt-4 space-y-3">
                            {building.rules_and_regulations && building.rules_and_regulations.length > 0 ? (
                                building.rules_and_regulations.map((rule) => (
                                    <div key={rule.id} className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-gray-800 font-semibold">{rule.title}</p>
                                        <p className="text-gray-600 text-sm italic">{rule.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic mt-2">
                                    No rules and regulations provided.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Rooms Section */}
                <h3 className="text-xl md:text-2xl font-bold mt-8 mb-5 text-white">Rooms</h3>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {building.rooms.map((room) => (
                        <Link
                            key={room.id}
                            href={`/home/room/${room.id}`}
                            className="group rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 overflow-hidden bg-white"
                        >
                            <div className="relative">
                                <img
                                    src={`/storage/${room.image ? room.image : "room/default_room.svg"}`}
                                    alt={room.name}
                                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                                        {room.name}
                                    </h4>

                                    <div className="flex items-center text-gray-500 text-xs">
                                        <FontAwesomeIcon icon={faBed} className="mr-1 text-indigo-500" />
                                        {room.beds_count} {room.beds_count > 1 ? 'beds' : 'bed'}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                                    <span className="text-xs text-gray-600">4.5 (12 reviews)</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
