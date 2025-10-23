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
export default function Bed({ bed, completed_bookings, total_booking_duration, sibling_beds, able_to_book, is_booked, comments, average_rating, rating_count, ratings }) {

    const { flash } = usePage().props;
    const [isFavorite, setIsFavorite] = useState(bed.is_favorite); // Assume `is_favorite` is passed from the backend
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [preventBookingModal, setPreventBookingModal] = useState(false);
    const { updateFavoritesCount } = useFavorite();
    const images = bed.images;

    const toggleFavorite = async () => {
        try {
            const response = await axios.post(`/favorite/bed/${bed.id}`, {
                favorite: !isFavorite, // Toggle the current state
            });

            if (response.status === 200) {
                if (isFavorite) {
                    updateFavoritesCount(-1);
                } else {
                    updateFavoritesCount(1);
                }
                setIsFavorite(!isFavorite); // Update stfte after success
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };
    const redirectToBook = (bedId) => {
        if (able_to_book > 0) {
            setPreventBookingModal(true);
            return;
        } else if (bed.is_occupied) {
            alert("This bed is already occupied. Please try again later.");
            return;
        }

        window.location.href = `/bed/book/${bedId}`;
    };


    return (
        <>
            <Head title={`Bed in ${bed.name}`} />
            {flash?.error && <Toast message={flash.error} isType="error" isTrue={true} />}
            <div className="p-4 ">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: `/home/building/${bed.room.building_id}` },
                        { label: bed.room.building.name, url: `/home/building/${bed.room.building_id}` },
                        { label: bed.room.name, url: `/home/room/${bed.room.id}` },
                        { label: bed.name },
                    ]}
                />

                <div className=" overflow-hidden">

                    {/* Top Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                        {/* Left Section: Image + Thumbnails */}
                        <div className="flex flex-col items-start gap-5">
                            {/* Main Image */}
                            <div className="relative overflow-hidden rounded-2xl shadow-lg h-[320px] w-full max-w-[550px] bg-white">
                                <img
                                    src={
                                        currentIndex === -1
                                            ? (bed.image ? `/storage/${bed.image}` : "/storage/bed/default_bed.svg")
                                            : (images[currentIndex]?.file_path
                                                ? `/storage/${images[currentIndex].file_path}`
                                                : "/storage/bed/default_bed.svg")
                                    }
                                    alt={bed.name || "Bed"}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                {/* Bed status */}
                                <div className="absolute bottom-4 left-4 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-md">
                                    {bed.is_occupied ? 'Occupied' : 'Available'}
                                </div>

                                {/* 📦 Book Now – Bottom Right */}
                                {bed.is_occupied ? (
                                    null
                                ) : (
                                    <button
                                        onClick={() => redirectToBook(bed.id)}
                                        className="absolute bottom-4 right-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-2 px-4 rounded-md shadow-sm transition"
                                    >
                                        Book now!
                                    </button>
                                )}

                                {/* ❤️ Favorite Icon – Top Left */}
                                <div className="absolute top-3 left-3 group">
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className={`h-6 w-6 cursor-pointer transition-transform duration-200 group-hover:scale-110 ${isFavorite
                                                ? 'text-red-500 hover:text-red-600'
                                                : 'text-red-100 hover:text-red-200 hover:border-red-500'
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
                            </div>

                            {/* Thumbnails */}
                            <div className="w-full flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                {images &&
                                    images.length > 0 &&
                                    images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`/storage/${image.file_path}`}
                                            alt={`${bed.name} ${index + 1}`}
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
                        <div className=" relative flex flex-col items-center md:items-start gap-5">

                            {/* Details */}
                            <div className="w-full bg-white rounded-2xl shadow-md p-5 space-y-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800  md:text-left">
                                    {bed.name}
                                </h2>
                                {/* Stats */}
                                <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                        <span className="font-semibold text-gray-800">
                                            {average_rating ? Number(average_rating).toFixed(1) : "0.0"}
                                        </span>
                                        <span className="text-gray-500">
                                            ({rating_count} {rating_count === 1 ? "review" : "reviews"})
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-green-600">
                                            {completed_bookings || 0}
                                        </span>
                                        <span className="text-gray-500">
                                            {completed_bookings === 1
                                                ? "completed booking"
                                                : "completed bookings"}
                                        </span>
                                    </div>
                                </div>



                                {/* Features */}
                                {bed.features && bed.features.length > 0 ? (
                                    <div>
                                        <h2 className='text-md sm:text-lg font-semibold mb-2'>Features</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {bed.features.map((feature) => (
                                                <span
                                                    key={feature.id}
                                                    className="bg-indigo-50 text-indigo-800 text-xs sm:text-sm px-3 py-1 rounded-full border border-indigo-200"
                                                >
                                                    {feature.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">- No features available.</p>
                                )}

                                {/* Description */}
                                {bed.description ? (
                                    <pre className="mt-4 text-sm text-gray-500">{bed.description}</pre>
                                ) : (
                                    <p className="text-gray-500 text-sm">- No description available.</p>
                                )}
                            </div>




                        </div>
                    </div>
                    {/* 💬 Feedback Section */}
                    <div className="px-6 pb-10 space-y-8">
                        <h4 className="text-2xl font-bold text-gray-900 border-b pb-3">
                            Feedback ({comments?.length || 0})
                        </h4>

                        <div className="space-y-6">
                            {/* Non-anonymous feedback */}
                            {ratings.map((rating) => {
                                const normalComments = comments.filter(
                                    (c) => c.user_id === rating.user_id && !c.anonymous
                                );
                                if (normalComments.length === 0) return null;

                                return (
                                    <div
                                        key={`rating-${rating.id}`}
                                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
                                    >
                                        {/* User Header */}
                                        <div className="flex items-center space-x-4 mb-3">
                                            <img
                                                src={`/storage/${rating.user.avatar || "profile/default-avatar.png"}`}
                                                alt={rating.user.name}
                                                className="w-12 h-12 rounded-full object-cover border"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">{rating.user.name}</p>
                                                <div className="flex items-center space-x-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FontAwesomeIcon
                                                            key={star}
                                                            icon={faStar}
                                                            className={`h-4 w-4 ${star <= rating.stars ? "text-yellow-500" : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Grouped Comments */}
                                        <ul className="ml-14 list-disc space-y-1 text-gray-700">
                                            {normalComments.map((c) => (
                                                <li key={c.id} className="text-sm leading-relaxed">
                                                    {c.body}
                                                    {c.edited && (
                                                        <span className="ml-2 text-xs text-gray-400 italic">
                                                            (edited)
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}

                            {/* Anonymous feedback */}
                            {comments
                                .filter((c) => c.anonymous)
                                .map((c) => {
                                    const rating = ratings.find((r) => r.user_id === c.user_id);
                                    if (!rating) return null;

                                    return (
                                        <div
                                            key={`anon-${c.id}`}
                                            className="bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
                                        >
                                            {/* Anonymous Header */}
                                            <div className="flex items-center space-x-4 mb-3">
                                                <img
                                                    src={`/storage/profile/default-avatar.png`}
                                                    alt="Anonymous"
                                                    className="w-12 h-12 rounded-full object-cover border"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-800">Anonymous</p>
                                                    <div className="flex items-center space-x-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <FontAwesomeIcon
                                                                key={star}
                                                                icon={faStar}
                                                                className={`h-4 w-4 ${star <= rating.stars ? "text-yellow-500" : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="ml-14 text-sm text-gray-700 leading-relaxed">
                                                {c.body}
                                                {c.edited && (
                                                    <span className="ml-2 text-xs text-gray-400 italic">(edited)</span>
                                                )}
                                            </p>
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
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {sibling_beds.map((b) => (
                                    <Link key={b.id} href={`/home/bed/${b.id}`}
                                        className="group rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-200 overflow-hidden"
                                    >
                                        {/* Bed Image */}
                                        <div className="relative">
                                            <img
                                                src={`/storage/${b.image ? b.image : "bed/default_bed.svg"}`}
                                                alt={b.name}
                                                className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                                                ₱{b.price}
                                            </span>
                                        </div>

                                        {/* Bed Content */}
                                        <div className="p-4 sm:p-5 bg-white">
                                            {/* Header: Bed name + Status */}
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                                                    {b.name}
                                                </h4>

                                                {b.is_occupied ? (
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
                                                    {b.avg_rating} <span className="opacity-80">({b.rating_count} review{bed.rating_count > 1 ? 's' : ''})</span>
                                                </span>
                                            </div>
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
