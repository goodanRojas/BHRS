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

                {/* Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Main Image (spans 2 rows on desktop) */}
                    <div className="relative md:row-span-2 overflow-hidden rounded-2xl shadow-md h-[300px]">
                        <img
                            src={
                                currentIndex === -1
                                    ? (room.image ? `/storage/${room.image}` : "/storage/room/default_room.svg")
                                    : (images[currentIndex]?.file_path ? `/storage/${images[currentIndex].file_path}` : "/storage/room/default_room.svg")
                            }
                            alt={room.name}
                            className="w-full h-72 md:h-full object-cover transition-transform duration-500 hover:scale-105"
                        />

                    </div>

                    {/* Top Right: Building Name */}
                    <div className="flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 p-4 text-center">
                            {room.name}
                        </h2>
                    </div>

                    {/* Bottom Right: Mini Carousel */}
                    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex flex-col items-center">
                        {images && images.length > 0 && (
                            <>
                                {/* Small Preview Image */}
                                <div className="w-full">
                                    <img
                                        src={`/storage/${images[currentIndex === -1 ? 0 : currentIndex].file_path
                                            }`}
                                        alt={room.name}
                                        className="w-full h-28 object-cover rounded-lg"
                                    />
                                </div>

                                {/* Arrows */}
                                <div className="flex justify-between w-full mt-2 px-2">
                                    <button
                                        onClick={handlePrev}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm shadow-sm"
                                    >
                                        &#10094;
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm shadow-sm"
                                    >
                                        &#10095;
                                    </button>
                                </div>

                                {/* Dots */}
                                <div className="flex gap-1 mt-2">
                                    {/* Main Image Dot */}
                                    <button
                                        onClick={() => setCurrentIndex(-1)}
                                        className={`h-2 w-2 rounded-full ${currentIndex === -1 ? "bg-blue-600" : "bg-gray-400"
                                            }`}
                                    ></button>

                                    {/* Extra Images Dots */}
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-blue-600" : "bg-gray-400"
                                                }`}
                                        ></button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white mb-2">{room.name}</h2>

                    {/* ⭐ Rating and 📊 Booking Stats */}
                    <div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-700">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                            <span className="font-semibold text-white">
                                {ratingValue}
                            </span>
                            <span className="text-white">
                                ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
                            </span>
                        </div>

                        {/* Completed Bookings */}
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-green-600">
                                {totalCompletedBookings}
                            </span>
                            <span className="text-white">
                                {totalCompletedBookings === 1 ? "completed booking" : "completed bookings"}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Display room features: such as Aircon, steel frame, etc. */}
                {room.features?.length > 0 ? (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        {room.features.map((feature) => (
                            <span key={feature.id} className="bg-white text-indigo-800 text-xs sm:text-sm px-2 py-1 rounded-full">
                                {feature.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No features</p>
                )}

                {/* Description */}
                <div className="p-4 flex flex-col gap-4">
                    <h3 className="text-white font-semibold mb-2">Description</h3>
                    <pre className="text-slate-100 text-sm">{room.description ? room.description : "No description provided."}</pre>
                </div>



                {/* Display Beds */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-6 sm:mt-8 mb-4 sm:mb-6 text-white">
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
                                    src={`/storage/${bed.image? bed.image : "bed/default_bed.svg"}`}
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
