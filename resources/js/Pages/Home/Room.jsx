import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function Rooms({ room, totalCompletedBookings, ratingCount, avgRating }) {
    const images = room.images;
    console.log(room);
    // Normalize avgRating at the top of your component
    const ratingValue = avgRating ? Number(parseFloat(avgRating).toFixed(1)) : 0;

    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1 === room.images.length ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? room.images.length - 1 : prevIndex - 1));
    };

    const handleImageClick = (index) => {
        setCurrentIndex(index);
    };


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


                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    {/* Left Section: Image + Thumbnails */}
                    <div className="flex flex-col items-start gap-5">
                        {/* Main Image */}
                        <div className="relative overflow-hidden rounded-2xl shadow-lg h-[320px] w-full max-w-[550px] bg-white">
                            <img
                                src={
                                    currentIndex === -1
                                        ? `/storage/${room.image? room.image  : "room/default_room.svg"}`
                                        : `/storage/${images[currentIndex]?.file_path}`
                                }
                                alt={room.name}
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
                                        alt={`${room.name} ${index + 1}`}
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
                                {room.name}
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


                            {/* Features */}
                            {room.features && room.features.length > 0 && (
                                <div>
                                    <h2 className='text-md sm:text-lg font-semibold mb-2'>Features</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {room.features.map((feature) => (
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

                            {/* Description */}
                            {room.description && (
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-md sm:text-lg font-semibold mb-2">Description</h2>
                                    <pre className="text-sm sm:text-base text-gray-700">{room.description}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Display Beds */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-6 sm:mt-8 mb-4 sm:mb-6 text-gray-900">
                    Beds
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
                    {room.beds.map((bed) => (
                        <Link
                            key={bed.id}
                            href={`/home/bed/${bed.id}`}
                            className="group rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-200 overflow-hidden"
                        >
                            {/* Bed Image */}
                            <div className="relative">
                                <img
                                    src={`/storage/${bed.image ? bed.image : "bed/default_bed.svg"}`}
                                    alt={bed.name}
                                    className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                                    ₱{bed.price}
                                </span>
                            </div>

                            {/* Bed Content */}
                            <div className="p-4 sm:p-5 bg-white">
                                {/* Header: Bed name + Status */}
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                                        {bed.name}
                                    </h4>

                                    {bed.bookings.some(booking => booking.status === 'completed') ? (
                                        <span className="px-2.5 py-1 text-[11px] sm:text-xs font-medium text-white bg-gray-500 rounded-full shadow-sm">
                                            Occupied
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 text-[11px] sm:text-xs font-medium text-white bg-green-500 rounded-full shadow-sm">
                                            Available
                                        </span>
                                    )}
                                </div>

                                {/* Ratings */}
                                <div className="flex items-center space-x-1 mb-3">
                                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 h-4 w-4" />
                                    <span className="text-[11px] sm:text-xs text-gray-600">
                                        {bed.avg_rating} <span className="opacity-80">({bed.rating_count} review{bed.rating_count > 1 ? 's' : ''})</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>


            </div>
        </AuthenticatedLayout>
    );
}
