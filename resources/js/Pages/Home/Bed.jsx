import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useFavorite } from '@/Contexts/FavoriteContext'; // 👈 Add this line

import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUserCheck, faStar, faDoorOpen, faBuilding, faLocationPin, faMessage, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Breadcrumbs from '@/Components/Breadcrumbs';
export default function Bed({ bed, completed_bookings, total_booking_duration, sibling_beds }) {
    const [isFavorite, setIsFavorite] = useState(bed.is_favorite); // Assume `is_favorite` is passed from the backend
    const { updateFavoritesCount } = useFavorite();
    const images = bed.images?.map((img) => `/storage/bed/${img.file_path}`) || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const toggleFavorite = async () => {
        try {
            const response = await axios.post(`/beds/${bed.id}/favorite`, {
                favorite: !isFavorite, // Toggle the current state
            });

            if (response.status === 200) {
                setIsFavorite(!isFavorite); // Update stfte after success
                updateFavoritesCount(response.data.favorites_count);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

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
        <>
            <Head title={`Bed in ${bed.name}`} />

            <div className="p-6 space-y-6">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: bed.room.building.name, url: `/home/building/${bed.room.building_id}` },
                        { label: bed.room.name, url: `/home/room/${bed.room.id}` },
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

                        {/* ❤️ Favorite Icon – Top Left */}
                        <div className="absolute top-3 left-3 group">
                            <FontAwesomeIcon
                                icon={faHeart}
                                className={`h-6 w-6 cursor-pointer transition-transform duration-200 group-hover:scale-110 ${isFavorite
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-white hover:text-gray-200'
                                    } drop-shadow-md`}
                                onClick={toggleFavorite}
                            />
                            <span className="absolute top-8 left-6 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded-md py-1 px-2 shadow-md">
                                Add to favorites
                            </span>
                        </div>

                        {/* 📦 Book Now – Bottom Right */}
                        <Link
                            href={`/bed/book/${bed.id}`}
                            className="absolute bottom-3 right-3 bg-indigo-500 hover:bg-blush-600 text-white text-xs font-semibold py-2 px-4 rounded-md shadow-sm transition"
                        >
                            Book now!
                        </Link>
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
                        {/* Contact Seller */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Link href={`/home/building/${bed.room.building.id}`} className="flex items-center gap-1 hover:underline">
                                <img src={`/storage/seller/${bed.room.building.seller.image}`} alt={bed.room.building.seller.name} className="h-6 w-6 rounded-full" />
                                {bed.room.building.seller.name}
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-blue-600">
                                <FontAwesomeIcon icon={faMessage} />
                            </Link>
                        </div>

                        {/*  Price Section */}
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
                                            ${bed.feedbacks.length >= 5 ? 'max-h-[400px] pr-2' : ''}
                                        `}
                            >
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
                            <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                                {sibling_beds.map((b) => (
                                    <div
                                        key={b.id}
                                        className="min-w-[250px] max-w-[250px] bg-white border rounded-lg shadow-sm p-4 flex-shrink-0 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <Link href={`/home/bed/${b.id}`}>
                                            <img
                                                src={`/storage/bed/${b.image}` || '/storage/bed/default_bed.png'}
                                                alt={b.name}
                                                className="w-full h-36 object-cover rounded-md mb-3"
                                            />
                                            <h5 className="text-lg font-semibold text-gray-700 truncate">{b.name}</h5>

                                            <div className="text-yellow-500 text-sm flex items-center gap-1 mb-1">
                                                <span>{b.average_rating ?? 'N/A'}</span>
                                                <span>★</span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-1">
                                                Price: <span className="font-medium text-gray-800">₱{b.price}</span>
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Completed Bookings: {b.bookings_count ?? 0}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No other beds available in this room.</p>
                        )}
                    </div>



                </div>

            </div>
        </>
    );
}

Bed.layout = (page) => <AuthenticatedLayout children={page} />;
