import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function Rooms({ room, ratingStats, totalCompletedBookings, bedAvailability, roomAvailablity }) {
    // console.log(room); // Debugging line to check the room data
    const images = room.images;
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1 === bed.images.length ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? bed.images.length - 1 : prevIndex - 1));
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
                    {images.length > 0 && (
                        <div className="relative w-full h-60 overflow-hidden rounded-md">
                            <img
                                src={`/storage/${images[currentIndex].file_path}`}
                                alt={`Slide ${currentIndex + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500"
                            />

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
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{room.name}</h2>

                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-gray-700">&#8369;{room.price}</p>
                    </div>
                </div>
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
                <div className="text-sm text-gray-600">
                    {roomAvailablity === 0 ? (
                        <span className="text-green-600 font-medium">Room Available</span>
                    ) : (
                        <span className="text-red-600 font-medium">Room Occupied</span>
                    )}
                </div>

                {/* Display Beds */}
                <h3 className="text-lg font-semibold mt-4 mb-1">Beds</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {room.beds.map((bed) => (
                        <div
                            key={bed.id}
                            className=" border rounded-md shadow hover:bg-gray-50 transition-colors duration-300"
                        >
                            <Link href={`/home/bed/${bed.id}`} className="block">
                                {/* Image Section */}
                                <div className="overflow-hidden rounded-t-md mb-3">
                                    <img
                                        src={`/storage/${bed.image}`}
                                        alt={bed.name}
                                        className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>

                                <div className='p-3 flex flex-col justify-between'>

                                    {/* Name and Price Section */}
                                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{bed.name}</h4>
                                    <div className="text-base font-medium text-gray-900 mb-2">&#8369; {bed.price}</div>

                                    {/* Sale Price (If Available) */}
                                    {bed.sale_price && (
                                        <div className="flex items-center gap-1 mb-2">
                                            <img src="/storage/system/sale-icon.png" alt="Sale" className="h-4 w-4" />
                                            <p className="text-xs text-red-500 line-through">&#8369; {bed.sale_price}</p>
                                        </div>
                                    )}

                                    {/* Availability Section */}
                                    <div className="flex items-center text-xs text-gray-600">
                                        {bed.status === 'active' ? (
                                            <span className="flex items-center text-green-600 font-medium">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Available
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-red-600 font-medium">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Occupied
                                            </span>
                                        )}
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
