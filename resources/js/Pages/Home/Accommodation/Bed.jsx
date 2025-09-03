import Layout from "./Layout";
import { Head } from "@inertiajs/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBuilding, faDoorClosed, faMoneyBill, faClock } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Bed({ bed, count }) {
    console.log(count);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const currentDate = new Date();
    const startDate = new Date(bed.start_date);
    const canRateAndComment = startDate.getMonth() < currentDate.getMonth() || startDate.getFullYear() < currentDate.getFullYear();

    const handleRatingSubmit = () => {
        console.log('Rating:', rating, 'Comment:', comment);
        alert('Thank you for your feedback!');
    };

    return (
        <Layout>
            <Head title={`Bed in ${bed.bed.name}`} />
            <div className="p-6 space-y-6">
                {/* Bed Image */}
                <div className="flex gap-6 items-center">
                    <img
                        className="w-64 h-64 rounded-md object-cover"
                        src={`/storage/${bed.bed.image}`}
                        alt={bed.bed.name}
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{bed.bed.name}</h1>
                        <p className="text-gray-700 mt-2">{bed.bed.description}</p>
                        <p className="mt-4 text-lg font-semibold">
                            Price: <span className="text-green-600">${bed.bed.price}</span>
                        </p>
                        {bed.bed.sale_price && (
                            <p className="text-lg text-red-600">
                                Sale Price: ${bed.bed.sale_price}
                            </p>
                        )}
                    </div>
                </div>

                {/* Room and Building Information */}
                <div className="border-t pt-4">
                    <h2 className="text-xl font-semibold mb-2">Room Information</h2>
                    <p><FontAwesomeIcon icon={faDoorClosed} /> Room: {bed.bed.room.name}</p>
                    <p><FontAwesomeIcon icon={faBuilding} /> Building ID: {bed.bed.room.building_id}</p>
                </div>

                {/* Booking Details */}
                <div className="border-t pt-4">
                    <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
                    <p><FontAwesomeIcon icon={faClock} /> Status: {bed.status}</p>
                    <p><FontAwesomeIcon icon={faMoneyBill} /> Total Price: ${bed.total_price}</p>
                    <p>Start Date: {bed.start_date}</p>
                    <p>Month Count: {bed.month_count}</p>
                </div>

                {/* User Information */}
                <div className="border-t pt-4">
                    <h2 className="text-xl font-semibold mb-2">User Information</h2>
                    <p>Name: {bed.name}</p>
                    <p>Email: {bed.email}</p>
                    <p>Phone: {bed.phone}</p>
                    <p>Address: {bed.address}</p>
                </div>

                {/* Rating and Comment Section */}
                {canRateAndComment ? (
                    <div className="border-t pt-4">
                        <h2 className="text-xl font-semibold mb-2">Rate and Comment</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                placeholder="Rate from 1 to 5"
                                className="p-2 border rounded-md"
                            />
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your comment here..."
                                className="p-2 border rounded-md"
                            />
                            <button
                                onClick={handleRatingSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 pt-4">You can rate and comment once your stay period has passed.</p>
                )}
            </div>
        </Layout>
    );
}
