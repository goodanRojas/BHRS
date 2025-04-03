import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import Stars from '@/Components/Stars';
import Breadcrumbs from '@/Components/Breadcrumbs';
export default function Bed({ bed, completed_bookings, total_booking_duration }) {
    // console.log(bed);
    // console.log(completed_bookings);
    // console.log(total_booking_duration);
    const [isFavorite, setIsFavorite] = useState(bed.is_favorite); // Assume `is_favorite` is passed from the backend
    const toggleFavorite = async () => {
        try {
            const response = await axios.post(`/beds/${bed.id}/favorite`, {
                favorite: !isFavorite, // Toggle the current state
            });

            if (response.status === 200) {
                setIsFavorite(!isFavorite); // Update state after success
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };



    return (
        <AuthenticatedLayout>
            <Head title={`Bed in ${bed.name}`} />

            <div className="p-6 space-y-6">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/buildings' },
                        { label: bed.room.building.name, url: `/buildings/${bed.room.building_id}` },
                        { label: bed.room.name, url: `/rooms/${bed.room.id}` },
                        { label: bed.name },
                    ]}
                />

                {/* Bed Image and Details */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-hidden relative">
                        <img
                            src={bed.image.startsWith("http") ? bed.image : `/storage/${bed.image} || 'bed/bed.png'`}
                            alt={bed.name}
                            className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <FontAwesomeIcon
                            icon={faHeart}
                            className={`absolute top-2 right-2 h-6 w-6 cursor-pointer transition-transform duration-200 group-hover:scale-110 ${isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"
                                }`}
                            onClick={toggleFavorite}
                        />
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl font-semibold text-gray-800">{bed.name}</h4>
                            <Link
                                className="bg-blush-500 hover:bg-blush-600 text-white font-medium py-2 px-4 rounded-md"
                                href={`/beds/${bed.room_id}/book`}>Book now!</Link>

                        </div>
                        {/* Price and Sale Price */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="mb-2">
                                    {bed.average_rating > 0 ? (
                                        <span className="text-sm text-gray-600">
                                            <p className="text-lg text-gray-700"><Stars rating={bed.average_rating} /></p>

                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-600">No ratings yet</span>
                                    )}
                                </p>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-lg font-semibold text-gray-700">
                                        &#8369; {bed.price}
                                    </p>
                                    {bed.sale_price && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <img
                                                src="/storage/system/sale-icon.png"
                                                alt="Sale"
                                                className="h-5 w-5"
                                            />
                                            <p className="text-sm text-red-500">
                                                Sale: &#8369; {bed.sale_price}
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>


                        <hr />
                        {/* Description */}
                        <p className="text-sm text-gray-600">{bed.description}</p>
                        <hr />
                    </div>


                    {/* Feedbacks */}
                    <div className="p-6 space-y-4">
                        <h4 className="text-2xl font-semibold text-gray-800">Feedbacks</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bed.feedbacks?.length > 0 ? (
                                bed.feedbacks.map((feedback) => (
                                    <div
                                        key={feedback.id}
                                        className="border rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="">
                                            <div className='flex items-center gap-4 mb-2'>
                                                <img
                                                    src={feedback.user?.profile_picture || '/storage/profile/default_avatar.png'}
                                                    alt={feedback.user?.name || 'Anonymous'}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                                <p className="text-sm text-gray-600">{feedback.user?.name || "Anonymous"}</p>
                                            </div>
                                            <div>
                                                <p className="text-lg text-gray-700"><Stars rating={bed.average_rating} /></p>

                                                <p className="text-sm text-gray-600">{feedback.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-600">No feedback yet</p>
                            )}
                        </div>

                    </div>


                </div>
            </div>
        </AuthenticatedLayout>
    );
}
