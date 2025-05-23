import SellerLayout from '@/Layouts/SellerLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUserCheck, faStar, faDoorOpen, faBuilding, faLocationPin, faMessage, faUserTie } from '@fortawesome/free-solid-svg-icons';
import Breadcrumbs from '@/Components/Breadcrumbs';

export default function Bed({ bed, completed_bookings, total_booking_duration, sibling_beds }) {
    const images = bed.images?.map((img) => `/storage/bed/${img.file_path}`) || [];

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
        <SellerLayout>
            <Head title={`Bed in ${bed.name}`} />

            <div className="p-6 space-y-6">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: bed.room.building.name, url: `/seller/building/${bed.room.building_id}` },
                        { label: bed.room.name, url: `/seller/room/${bed.room.id}` },
                        { label: bed.name },
                    ]}
                />

                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    {/* 📸 Bed Image Section */}
                    <div className="relative group">
                        {/* 🖼️ Image Carousel */}
                        {images.length > 0 && (
                            <div className="relative w-full h-60 overflow-hidden rounded-md">
                                <img
                                    src={images[currentIndex]}
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

                    {/* 🛏️ Bed Details Section */}
                    <div className="p-6 space-y-4">
                        {/* Name and Rating */}
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl font-bold text-gray-800">{bed.name}</h4>
                            {bed.average_rating > 0 ? (
                                <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                                    <span>{bed.average_rating}</span>
                                    <span>★</span>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500">No ratings yet</span>
                            )}
                        </div>

                        {/* 🏢 Room and Building */}
                        <div>
                            <p className="text-md font-semibold text-gray-700"><FontAwesomeIcon icon={faDoorOpen} /> {bed.room.name}</p>
                            <p className="text-sm text-gray-500"><FontAwesomeIcon icon={faBuilding} /> {bed.room.building.name}</p>
                            <p className="text-sm text-gray-500"><FontAwesomeIcon icon={faLocationPin} /> {bed.room.building.address}</p>
                        </div>
                    
                        {/* Price Section */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-md p-4">
                            <div>
                                <p className="text-lg font-bold text-gray-700">&#8369; {bed.price}</p>
                                {bed.sale_price && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <img
                                            src="/storage/system/sale-icon.png"
                                            alt="Sale"
                                            className="h-5 w-5"
                                        />
                                        <p className="text-sm text-red-500 font-medium">
                                            Sale: &#8369; {bed.sale_price}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 📃 Description */}
                        <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-1">Description</h5>
                            <pre className="text-sm text-gray-600 whitespace-pre-wrap">{bed.description}</pre>
                        </div>
                    </div>

                    {/* 💬 Feedback Section */}
                    <div className="px-6 pb-6 space-y-4">
                        <h4 className="text-xl font-semibold text-gray-800">Feedbacks</h4>

                        {bed.feedbacks?.length > 0 ? (
                            <div
                                className={`
                                            space-y-4 overflow-y-auto
                                            ${bed.feedbacks.length >= 5 ? 'max-h-[400px] pr-2' : ''}`
                            }>
                                {bed.feedbacks.map((feedback) => (
                                    <div
                                        key={feedback.id}
                                        className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200 bg-white"
                                    >
                                        {/* User Info */}
                                        <div className="flex items-center gap-4 mb-2">
                                            <img
                                                src={`/storage/user/${feedback.user?.avatar}` || '/storage/user/default_profile.png'}
                                                alt={feedback.user?.name || 'Anonymous'}
                                                className="h-10 w-10 rounded-full object-cover border"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {feedback.user?.name || 'Anonymous'}
                                                </p>
                                                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                                    <span>{feedback.rating}</span>
                                                    <span><FontAwesomeIcon icon={faStar} /></span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        <p className="text-sm text-gray-600">
                                            {feedback.comment || 'No comment provided.'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No feedback yet</p>
                        )}
                    </div>

                    {/* 🛏️ More Beds in This Room */}
                    <div className="px-6 pb-8">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Beds in Room <span>{bed.room.name}</span></h4>

                        {sibling_beds?.length > 0 ? (
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
                                        {sibling_beds.map((sibling) => (
                                            <tr key={sibling.id} className="border-b">
                                                <td className="px-4 py-2">{sibling.name}</td>
                                                <td className="px-4 py-2">
                                                    <img
                                                        src={`/storage/bed/${sibling.image}`}
                                                        alt={sibling.name}
                                                        className="w-20 h-20 object-cover rounded-md"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">&#8369; {sibling.price}</td>
                                                <td className="px-4 py-2">&#8369; {sibling.sale_price}</td>
                                                <td className="px-4 py-2">
                                                    {sibling.status === 'active' ? (
                                                        <span className="text-green-600 font-medium">Available</span>
                                                    ) : (
                                                        <span className="text-red-600 font-medium">Occupied</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Link
                                                        href={`/seller/building/bed/${sibling.id}`}
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
                        ) : (
                            <p className="text-sm text-gray-500">No other beds available in this room.</p>
                        )}
                    </div>

                </div>

            </div>
        </SellerLayout>
    );
}
