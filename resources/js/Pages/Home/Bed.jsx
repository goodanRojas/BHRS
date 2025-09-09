import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useFavorite } from '@/Contexts/FavoriteContext'; // 👈 Add this line

import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUserCheck, faMapMarkerAlt, faStar, faDoorOpen, faBuilding, faLocationPin, faMessage, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Toast';

import Breadcrumbs from '@/Components/Breadcrumbs';
import { comment } from 'postcss';
export default function Bed({ bed, completed_bookings, total_booking_duration, sibling_beds, able_to_book, is_booked, comments, average_rating, rating_count, ratings }) {

    console.log(sibling_beds);
    const { flash } = usePage().props;
    const [isFavorite, setIsFavorite] = useState(bed.is_favorite); // Assume `is_favorite` is passed from the backend
    const [currentIndex, setCurrentIndex] = useState(0);
    const [preventBookingModal, setPreventBookingModal] = useState(false);
    const { updateFavoritesCount } = useFavorite();

    const images = bed.images;

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
    const redirectToBook = (bedId) => {
        if (able_to_book > 0) {
            setPreventBookingModal(true);
            return;
        }
        window.location.href = `/bed/book/${bedId}`;
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

    const chatWithSeller = (sellerId, bedId) => {
        // Navigate to DirectChat page with seller and bed info
        window.location.href = `/chatbot/seller/${sellerId}/bed/${bedId}`;
    };





    return (
        <>
            <Head title={`Bed in ${bed.name}`} />
            {flash?.error && <Toast message={flash.error} isType="error" isTrue={true} />}
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
                        {/* 🖼️ Image Carousel or Single Image */}
                        {images.length > 0 ? (
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
                        ) : (
                            <div className="w-full h-60 overflow-hidden rounded-md">
                                <img
                                    src={`/storage/${bed.image}`}
                                    alt="Bed"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}


                        {/* ❤️ Favorite Icon – Top Left */}
                        <div className="absolute top-3 left-3 group">
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className={`h-6 w-6 cursor-pointer transition-transform duration-200 group-hover:scale-110 ${bed.is_favorite
                                        ? 'text-red-500 hover:text-red-600'
                                        : 'text-white hover:text-gray-200 hover:border-red-500'
                                        } drop-shadow-md`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleFavorite(bed.id);
                                    }}
                                />
                                <span className="w-[130px] text-center absolute  left-[100px] -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded-md py-1 px-2 shadow-md">
                                    Add to favorites
                                </span>
                            </div>
                        </div>

                        {/* 📦 Book Now – Bottom Right */}
                        {bed.bookings.some(booking => booking.status === 'completed') ? (
                            null
                        ) : (
                            <button
                                onClick={() => redirectToBook(bed.id)}
                                className="absolute bottom-3 right-3 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-2 px-4 rounded-md shadow-sm transition"
                            >
                                Book now!
                            </button>
                        )}

                    </div>

                    {/* 🛏️ Bed Details Section */}
                    <div className="p-6 space-y-4">
                        {/* Name and Rating */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h4 className="text-2xl font-bold text-gray-800">{bed.name}</h4>

                                {average_rating > 0 ? (
                                    <div className="flex items-center gap-2 text-sm">
                                        {/* Star Icon */}
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />

                                        {/* Rating Value */}
                                        <span className="font-semibold text-gray-800">
                                            {average_rating.toFixed(1)}
                                        </span>

                                        {/* Rating Count */}
                                        <span className="text-gray-500">
                                            ({rating_count} {rating_count === 1 ? "review" : "reviews"})
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500 italic">No ratings yet</span>
                                )}

                            </div>
                            {/*  Price Section */}
                            <div className="flex items-center justify-between rounded-md p-4">
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
                        </div>




                        {/* 🏢 Room and Building */}
                        <div>
                            <p className="text-md font-semibold text-gray-700"><FontAwesomeIcon className='text-indigo-500' icon={faDoorOpen} /> {bed.room.name}</p>
                            <p className="text-sm text-gray-700"><FontAwesomeIcon className='text-indigo-500' icon={faBuilding} /> {bed.room.building.name}</p>
                            <p className="flex items-center text-gray-700 text-sm mb-2 line-clamp-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-indigo-500" />
                                {bed.room.building.address
                                    ? `${bed.room.building.address.street}, ${bed.room.building.address.barangay}, ${bed.room.building.address.city}, ${bed.room.building.address.province} ${bed.room.building.address.postal_code}, ${bed.room.building.address.country}`
                                    : "N/A"}
                            </p>
                        </div>
                        {/* Contact Seller */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Link href={`/home/building/${bed.room.building.id}`} className="flex items-center gap-1 hover:underline">
                                {bed.room.building.seller.avatar ? (
                                    <img src={`/storage/${bed.room.building.seller.avatar}`} alt={bed.room.building.name} className="h-6 w-6 rounded-full" />
                                ) : (
                                    <FontAwesomeIcon icon={faUserTie} className="h-6 w-6 rounded-full" />
                                )}
                                {bed.room.building.seller.name}
                            </Link>
                            <button onClick={() => chatWithSeller(bed.room.building.seller.id, bed.id)} className="text-gray-500 hover:text-blue-600">
                                <FontAwesomeIcon icon={faMessage} />
                            </button>
                        </div>



                        {/* 📃 Description */}
                        <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-1">Description</h5>
                            {/* <pre className="text-sm text-gray-600 whitespace-pre-wrap">{bed.description}</pre> */}
                            <div>
                                {bed.features.map((feature) => (
                                    <div
                                        key={feature.id}
                                        className="relative inline-block p-1 mb-2 mr-4 hover:bg-gray-100 rounded-md group"
                                    >
                                        {/* Feature name container with hover effect */}
                                        <span className="text-xs text-gray-600">{feature.name}</span>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>{/* 💬 Feedback Section */}
                    {/* 💬 Feedback Section */}
                    <div className="px-6 pb-6 space-y-6">
                        <h4 className="text-xl font-semibold text-gray-800">
                            Feedbacks ({comments?.length || 0})
                        </h4>

                        <div className="space-y-6">
                            {ratings.map((rating) => {
                                const userComments = comments.filter(
                                    (c) => c.user_id === rating.user_id
                                );

                                return (
                                    <div
                                        key={rating.id}
                                        className="bg-white p-4 rounded-xl shadow border border-gray-100"
                                    >
                                        {/* User Header */}
                                        <div className="flex items-center space-x-3 mb-2">
                                            <img
                                                src={`/storage/${rating.user.avatar || "profile/default-avatar.png"}`}
                                                alt={rating.user.name}
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{rating.user.name}</p>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`text-lg ${star <= rating.stars ? "text-yellow-500" : "text-gray-300"
                                                                }`}
                                                        >
                                                            <FontAwesomeIcon icon={faStar} />
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Comments */}
                                        {userComments.length > 0 ? (
                                            <ul className="ml-12 list-disc space-y-1 text-gray-700">
                                                {userComments.map((c) => (
                                                    <li key={c.id} className="text-sm">
                                                        {c.body}
                                                        {c.edited && (
                                                            <span className="ml-2 text-xs text-gray-400">(edited)</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="ml-12 text-sm text-gray-500 italic">
                                                No comments yet.
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>



                    {/* 🛏️ More Beds in This Room */}
                    <div className="px-6 pb-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-5">
                            More Beds in <span className="text-indigo-600">{bed.room.name}</span>
                        </h4>

                        {sibling_beds?.length > 0 ? (
                            <div
                                className="
                flex gap-4 overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4
                scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent pb-2
            "
                            >
                                {sibling_beds.map((b) => (
                                    <Link key={b.id} href={`/home/bed/${b.id}`}>
                                        <div
                                            className="
                            min-w-[180px] max-w-[180px] md:min-w-0
                            bg-white border rounded-lg shadow-sm p-3 flex-shrink-0
                            hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                        "
                                        >
                                            {/* Image */}
                                            <img
                                                src={b.image ? `/storage/${b.image}` : '/storage/bed/default_bed.png'}
                                                alt={b.name}
                                                className="w-full h-28 object-cover rounded-md mb-2"
                                            />

                                            {/* Title */}
                                            <h5 className="text-sm font-semibold text-gray-800 truncate">
                                                {b.name}
                                            </h5>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-1 text-xs text-yellow-500">
                                                <span className="font-medium">
                                                    {b.average_rating ? Number(b.average_rating).toFixed(1) : "0.0"}
                                                </span>
                                                <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5" />
                                            </div>

                                            {/* Price */}
                                            <p className="text-xs text-gray-600">
                                                Price:{' '}
                                                <span className="font-semibold text-gray-900">
                                                    ₱{b.price}
                                                </span>
                                            </p>

                                            {/* Bookings */}
                                            <p className="text-xs text-gray-400">
                                                {b.completed_bookings_count ?? 0} bookings
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No other beds available in this room.</p>
                        )}
                    </div>



                </div>

            </div>
            {/* Modals */}

            {preventBookingModal && (
                <Modal show={true} onClose={() => setPreventBookingModal(false)}>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Booking Not Allowed</h2>
                        <p className="mb-6">You cannot proceed with the booking while you still have ongoing bookings.</p>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => setPreventBookingModal(false)}
                        >
                            Okay
                        </button>
                    </div>
                </Modal>
            )}

        </>
    );
}

Bed.layout = (page) => <AuthenticatedLayout children={page} />;
