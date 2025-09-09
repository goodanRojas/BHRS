import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function Rooms({ room, totalCompletedBookings, ratingCount, avgRating }) {
    const images = room.images;
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

                {/* Image Section */}
                <div className="overflow-hidden rounded-t-lg">
                    <div className="relative w-full h-60 overflow-hidden rounded-md">
                        <img
                            src={
                                images && images.length > 0
                                    ? `/storage/${images[currentIndex].file_path}`
                                    : room.image
                                        ? `/storage/${room.image}`
                                        : '/images/default-room.jpg' // <-- your default placeholder path
                            }
                            alt={`Slide ${currentIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500"
                        />

                        {images && images.length > 1 && (
                            <>
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
                </div>

                {/* Content Section */}
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{room.name}</h2>

                </div>
                {/* ⭐ Rating and 📊 Booking Stats */}
                <div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-700">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                        <span className="font-semibold text-gray-800">
                            {ratingValue}
                        </span>
                        <span className="text-gray-500">
                            ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
                        </span>
                    </div>

                    {/* Completed Bookings */}
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-green-600">
                            {totalCompletedBookings}
                        </span>
                        <span className="text-gray-500">
                            {totalCompletedBookings === 1 ? "completed booking" : "completed bookings"}
                        </span>
                    </div>
                </div>


                {/* Display Beds */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-6 sm:mt-8 mb-4 sm:mb-6 text-gray-800">
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
                                    src={`/storage/${bed.image}`}
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
                                        4.5 <span className="opacity-80">(12 reviews)</span>
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
