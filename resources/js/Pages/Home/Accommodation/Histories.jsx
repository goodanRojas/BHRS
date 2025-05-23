import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBuilding, faDoorClosed, faMoneyBill, faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function History({ beds, rooms }) {
    const [feedbacks, setFeedbacks] = useState({});
    const [ratings, setRatings] = useState({});
    const [roomFeedbacks, setRoomFeedbacks] = useState({});
    const [roomRatings, setRoomRatings] = useState({});

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based index, so add 1)
        const day = String(date.getDate()).padStart(2, '0'); // Get day
        return `${month}/${day}`; // Return in mm/dd format
    };


    const handleRatingChange = (id, value) => {
        setRatings(prev => ({ ...prev, [id]: value }));
    };

    const handleFeedbackChange = (id, value) => {
        setFeedbacks(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (id, type) => {
        const data = {
            rating: ratings[id],
            feedback: feedbacks[id],
        };

        try {
            const response = await axios.post(`/accommodation/${type}/${id}/feedback`, data);
            console.log('Feedback submitted:', response.data);
        } catch (error) {
            console.error('Submit error', error.message);
        }
    };

    const handleRoomRatingChange = (id, value) => {
        setRoomRatings(prev => ({ ...prev, [id]: value }));
    };

    const handleRoomFeedbackChange = (id, value) => {
        setRoomFeedbacks(prev => ({ ...prev, [id]: value }));
    };

    useEffect(() => {
        // Preload feedback if already exists
        beds.forEach(bed => {
            if (bed.feedbacks?.[0]) {
                setRatings(prev => ({ ...prev, [bed.id]: bed.feedbacks[0].rating }));
                setFeedbacks(prev => ({ ...prev, [bed.id]: bed.feedbacks[0].comment }));
            }
        });
    }, [beds]);

    useEffect(() => {
        rooms.forEach(room => {
            if (room.feedbacks?.[0]) {
                setRoomRatings(prev => ({ ...prev, [room.id]: room.feedbacks[0].rating }));
                setRoomFeedbacks(prev => ({ ...prev, [room.id]: room.feedbacks[0].comment }));
            }
        });
    }, [rooms]);

    return (
        <Layout>
            <Head title="Accommodation Dashboard" />
            <div className="p-4 md:p-8 space-y-8 min-h-screen">
                {/* Table for Beds */}
                {beds.length > 0 && (

                    <div className="overflow-x-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Beds</h2>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left font-medium text-gray-700">Bed Name</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-700">Description</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-700">Price</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-700">Rating</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-700">Stay Dates</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-700">Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beds.map((bed) => (
                                    <tr key={bed.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="py-3 px-4">
                                            <Link href={`/home/bed/${bed.id}`} className="text-blue-500 hover:text-blue-700 font-semibold">
                                                {bed.name}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {bed.description.length > 100 ? `${bed.description.slice(0, 50)}...` : bed.description}
                                        </td>
                                        <td className="py-3 px-4 text-gray-800">₱{bed.bookings[0]?.payment.amount ?? bed.price}</td>
                                        <td className="py-3 px-4 text-gray-800">
                                            {bed.feedbacks_avg_rating ? (
                                                <>
                                                    {Number(bed.feedbacks_avg_rating).toFixed(1)}{' '}
                                                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                                </>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-800">
                                            {bed.bookings?.length > 0 ? (
                                                <>
                                                    {formatDate(bed.bookings[0].start_date)} → {formatDate(bed.bookings[0].end_date)}
                                                </>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <textarea
                                                className="w-full p-2 border border-gray-300 rounded-md mt-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Leave your feedback"
                                                value={feedbacks[bed.id] || ''}
                                                onChange={(e) => handleFeedbackChange(bed.id, e.target.value)}
                                            />
                                            <div className="mt-2 flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => handleRatingChange(bed.id, star)}
                                                        className={`text-xl ${ratings[bed.id] >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                                    >
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleSubmit(bed.id, 'bed')}
                                                className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                                            >
                                                Submit 
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}

                {/* Table for Rooms */}
                {rooms.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">Rooms</h2>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">Room Name</th>
                                    <th className="py-2 px-4 text-left">Description</th>
                                    <th className="py-2 px-4 text-left">Price</th>
                                    <th className="py-2 px-4 text-left">Rating</th>
                                    <th className="py-2 px-4 text-left">Stay Dates</th>
                                    <th className="py-2 px-4 text-left">Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room.id} className="border-b">
                                        <td className="py-2 px-4">{room.name}</td>
                                        <td className="py-2 px-4">{room.description}</td>
                                        <td className="py-2 px-4">₱{room.sale_price ?? room.price}</td>
                                        <td className="py-2 px-4">
                                            {room.feedbacks_avg_rating ? (
                                                <>
                                                    {Number(room.feedbacks_avg_rating).toFixed(1)}{' '}
                                                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                                </>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4">
                                            {room.bookings?.length > 0 ? (
                                                <>
                                                    {room.bookings[0].start_date} → {room.bookings[0].end_date}
                                                </>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4">
                                            <textarea
                                                className="w-full p-2 border rounded-md mt-2"
                                                placeholder="Leave your feedback"
                                                value={roomFeedbacks[room.id] || ''}
                                                onChange={(e) => handleRoomFeedbackChange(room.id, e.target.value)}
                                            />
                                            <div className="mt-2 flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => handleRoomRatingChange(room.id, star)}
                                                        className={`text-xl ${roomRatings[room.id] >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                                    >
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleSubmit(room.id, 'room')}
                                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                            >
                                                Submit 
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {beds.length <= 0 && rooms.length <= 0 && (
                    <div className="flex justify-center">
                        <Link href="/home" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                            Browse to find your stay.
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}
