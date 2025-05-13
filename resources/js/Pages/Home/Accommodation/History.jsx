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

    console.log(beds);

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
        if (error.response) {
            console.error('Validation Error:', error.response.data.errors);
        } else {
            console.error('Submit error', error.message);
        }
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
            <div className="p-4 md:p-8 space-y-8 a min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render Beds */}
                    {beds.map((bed) => (
                        <div key={bed.id} className="bg-white rounded-2xl shadow p-4 space-y-2">
                            <img src={bed.image} alt={bed.name} className="rounded-lg w-full h-48 object-cover" />
                            <h2 className="text-xl font-semibold">{bed.name}</h2>
                            <p className="text-gray-600 text-sm">{bed.description}</p>
                            <div className="text-sm text-gray-700">
                                <p>Total: ₱{bed.bookings[0].payment.amount ?? bed.price}</p>
                                <p>Rating <FontAwesomeIcon icon={faStar} className="text-yellow-500" />: {Number(bed.feedbacks_avg_rating).toFixed(1) ?? 'N/A'}</p>
                            </div>
                            {bed.bookings?.length > 0 && (
                                <div className="mt-2 border-t pt-2 text-sm text-gray-700">
                                    <p><FontAwesomeIcon icon={faClock} className="mr-1 text-blue-500" /> Stay: {bed.bookings[0].start_date} → {bed.bookings[0].end_date}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-purple-500" /> Paid by: {bed.bookings[0].payment?.payment_method}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-purple-500" /> Receipt: {bed.bookings[0].payment?.receipt}</p>
                                </div>
                            )}

                            {/* Feedback Form */}
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">Your Rating:</label>
                                <div className="flex space-x-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(bed.id, star)}
                                            className={`text-xl ${(ratings[bed.id] || 0) >= star ? 'text-yellow-500' : 'text-gray-300'
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={faStar} />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    className="w-full p-2 border rounded-md mt-2"
                                    placeholder="Leave your feedback here..."
                                    value={feedbacks[bed.id] || ''}
                                    onChange={(e) => handleFeedbackChange(bed.id, e.target.value)}
                                />

                                <button
                                    onClick={() => handleSubmit(bed.id, 'bed')}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Submit Feedback
                                </button>
                            </div>


                        </div>
                    ))}

                    {/* Render Rooms */}
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-2xl shadow p-4 space-y-2">
                            <img src={'/storage/room/' + room.image} alt={room.name} className="rounded-lg w-full h-48 object-cover" />
                            <h2 className="text-xl font-semibold">{room.name}</h2>
                            <p className="text-gray-600 text-sm">{room.description}</p>
                            <div className="text-sm text-gray-700">
                                <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-green-500" /> Price: ₱{room.sale_price ?? room.price}</p>
                                <p><FontAwesomeIcon icon={faDoorClosed} className="mr-1 text-yellow-500" /> Rating: {Number(room.feedbacks_avg_rating).toFixed(1) ?? 'N/A'}</p>
                            </div>

                            {/* Display rating stars */}
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesomeIcon
                                        key={star}
                                        icon={faStar}
                                        className={`cursor-pointer ${star <= room.feedbacks_avg_rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>

                            {/* Feedback Form */}
                            <div className="mt-2">
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Leave your feedback here..."
                                    value={feedback}
                                    onChange={handleFeedbackChange}
                                />
                                <button
                                    onClick={() => handleSubmit(room.id, 'room')}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    Submit Feedback
                                </button>
                            </div>

                            {room.bookings?.length > 0 && (
                                <div className="mt-2 border-t pt-2 text-sm text-gray-700">
                                    <p><FontAwesomeIcon icon={faClock} className="mr-1 text-blue-500" /> Stay: {room.bookings[0].start_date} → {room.bookings[0].end_date}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-purple-500" /> Paid by: {room.bookings[0].payment?.payment_method}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-purple-500" /> Receipt: {room.bookings[0].payment?.receipt}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {beds.length <= 0 && rooms.length <= 0 && (
                    <div className="flex justify-center">
                        <Link href="/home" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">Browse to find your stay.</Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}
