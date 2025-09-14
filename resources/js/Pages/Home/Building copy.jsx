import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faStar, faBed, faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function Building({ building, totalCompletedBookings, ratingCount, avgRating }) {
    const [showRules, setShowRules] = useState(false);
    const [images, setImages] = useState(building.images);
    console.log(building);
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

            <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/home/buildings' },
                        { label: building.name },
                    ]}
                />

                <div className='grid grid-cols-2 grid-rows-2 gap-2'>
                    {/* Building Header */}
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                        <img
                            src={`/storage/${building.image}`}
                            alt={building.name}
                            className="w-full h-64 md:h-80 object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <h2 className="absolute bottom-3 left-4 text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                            {building.name}
                        </h2>
                    </div>

                    {/* Display here the rest of the building images */}
                    <div className='relative'>
                        {images && images.length > 0 && (
                            <>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                    {building.name}
                                </h2>
                                <img src={`/storage/${images[currentIndex].file_path}`} alt={building.name} className="w-full h-full sm:h-48 object-cover transition-transform duration-500" />
                                {/* Arrows */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                >
                                    &#10094;
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                >
                                    &#10095;
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleImageClick(index)}
                                            className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'} transition duration-300`}
                                        ></button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    
                    {/* Building Info */}
                    <div className=" col-span-2 bg-blue-900/75 rounded-xl shadow p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">


                        {/* Seller */}
                        <div className="flex items-center text-white text-xs sm:text-sm">
                            <FontAwesomeIcon icon={faUserTie} className="mr-2 text-slate-100" />
                            <span className="font-medium">{building.seller.name}</span>
                        </div>

                        {/* Address */}
                        <Link
                            href={route('map.index', building.id)}>
                            <p className="flex items-start text-slate-100 text-xs sm:text-sm leading-relaxed">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-white mt-0.5" />
                                {building.address ? (
                                    building.address.address ? (
                                        <span>
                                            {[
                                                building.address.barangay ?? building.address?.address?.barangay,
                                                building.address.municipality ?? building.address?.address?.municipality,
                                                building.address.province ?? building.address?.address?.province
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    ) : (
                                        <p>No Address Provided</p>
                                    )
                                ) : (
                                    <p>No Address Provided</p>
                                )}A
                            </p>
                        </Link>

                        {/* Features */}
                        <h2 className='text-md sm:text-lg font-semibold text-white mt-4 hover:cursor-pointer'>Features</h2>
                        {building.features && building.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {building.features.map((feature) => (
                                    <span
                                        key={feature.id}
                                        className="bg-white text-indigo-800 text-xs sm:text-sm px-2 py-1 rounded-full"
                                    >
                                        {feature.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Rules And Regulations */}
                        <h2 className='text-md sm:text-lg font-semibold text-white mt-4 hover:cursor-pointer'
                            onClick={() => { setShowRules(!showRules) }}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />  Rules And Regulations
                        </h2>


                        {showRules && (
                            building.rules_and_regulations && building.rules_and_regulations.length > 0 ? (
                                building.rules_and_regulations.map((rule) => (
                                    <div key={rule.id} className="mt-2 flex  items-center">
                                        <p className="text-white font-bold px-2 text-sm sm:text-base leading-relaxed">
                                            {rule.title}:
                                        </p>
                                        <p className="text-slate-100 text-sm italic mt-1">
                                            {rule.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white text-sm italic mt-2">
                                    No rules and regulations provided.
                                </p>
                            )
                        )}




                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700 mt-3 sm:mt-4">
                            {/* ⭐ Rating */}
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                <span className="font-semibold text-slate-100">
                                    {avgRating ? Number(avgRating).toFixed(1) : "0.0"}
                                </span>
                                <span className="text-slate-200">
                                    ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
                                </span>
                            </div>

                            {/* 📊 Completed Bookings */}
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-green-600">
                                    {totalCompletedBookings || 0}
                                </span>
                                <span className="text-slate-100">
                                    {totalCompletedBookings === 1 ? "completed booking" : "completed bookings"}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>


                {/* Rooms Section */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-6 sm:mt-8 mb-4 sm:mb-6 text-white">
                    Rooms
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
                    {building.rooms.map((room) => (
                        <Link
                            key={room.id}
                            href={`/home/room/${room.id}`}
                            className="group rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 overflow-hidden"
                        >
                            {/* Room Image */}
                            <div className="relative">
                                <img
                                    src={`/storage/${room.image}`}
                                    alt={room.name}
                                    className="w-full h-28 sm:h-36 md:h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Room Content */}
                            <div className="p-2 sm:p-3 bg-white">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                                        {room.name}
                                    </h4>

                                    {/* Beds count */}
                                    <div className="flex items-center text-gray-500 text-[10px] sm:text-xs">
                                        <FontAwesomeIcon icon={faBed} className="mr-1 text-indigo-500" />
                                        {room.beds_count} {room.beds_count > 1 ? 'beds' : 'bed'}
                                    </div>
                                </div>

                                <div className='flex items-center justify-between'>
                                    {/* Ratings */}
                                    <div className="flex items-center space-x-1 mb-1">
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                                        <span className="text-[10px] sm:text-xs text-gray-600">4.5 (12 reviews)</span>
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
