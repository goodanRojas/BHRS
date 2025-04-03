import { Head, Link, useForm } from '@inertiajs/react';
import Layout from './Layout';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faStar } from '@fortawesome/free-solid-svg-icons';

export default function History({ details }) {
    const { data, setData, post, processing, reset } = useForm({
        comment: '',
        rating: 0,
        booking_id: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/accommodations/bed/feedback', {
            onSuccess: () => reset(),
        }); 
    };

    return (
        <Layout>
            <Head title="Accommodation History" />
            <div className="p-10 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-center">Accommodation History</h1>

                {details.length > 0 ? (
                    <div className="space-y-6">
                        {details.map((booking, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-6 rounded-lg shadow-lg"
                            >
                                <div className="mb-4 border-b pb-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-semibold">{booking.name}</p>
                                        <FontAwesomeIcon icon={faHistory} className="text-gray-500 mr-2" />
                                    </div>
                                    <p className="text-sm text-gray-600">{booking.email}</p>
                                    <p className="text-sm text-gray-600">
                                        Start Date: {new Date(booking.start_date).toLocaleDateString()}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        Month Count: {booking.month_count}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Payment Method: <span className="font-bold">{booking.payment_method === 1 ? "Cash" : "Gcash"}</span>
                                    </p>
                                </div>

                                <Link href={`/beds/${booking.bed.id}`} >
                                    <div className="flex gap-6 items-start">
                                        <img
                                            src={`/storage/${booking.bed.image}`}
                                            alt={booking.bed.name}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                        <div>
                                            <p className="text-lg font-semibold">{booking.bed.name}</p>
                                            <p className="text-sm font-bold text-green-600">
                                                Price: ${booking.bed.price}
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                <div className="mt-4 border-t pt-4">
                                    <p className="text-sm font-bold">Room: {booking.bed.room.name}</p>
                                    <p className="text-sm">Building: {booking.bed.room.building.name}</p>
                                    <p className="text-sm text-gray-600">Located at: {booking.bed.room.building.address}</p>
                                    <p className="text-sm">Owner: {booking.bed.room.building.seller.name}</p>
                                </div>

                                <div className="mt-4 font-bold text-lg text-right">
                                    Total Payment: &#8369; {booking.total_price}
                                </div>

                                {/* Comment and Rating Form */}
                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <textarea
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        placeholder="Add a comment"
                                        className="w-full p-3 border rounded-lg"
                                    />

                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FontAwesomeIcon
                                                key={star}
                                                icon={faStar}
                                                className={data.rating >= star ? "text-yellow-500" : "text-gray-300"}
                                                onClick={() => setData('rating', star)}
                                            />
                                        ))}
                                    </div>

                                    <input
                                        type="hidden"
                                        value={booking.id}
                                        onChange={() => setData('booking_id', booking.id)}
                                    />

                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                        disabled={processing}
                                    >
                                        Submit Feedback
                                    </button>
                                </form>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No accommodation history available.</p>
                )}
            </div>
        </Layout>
    );
}
