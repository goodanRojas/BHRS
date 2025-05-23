export default function RoomGuests({ bookings }) {
    // console.log(bookings);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.length === 0 ? (
                <p className="text-gray-500">No rooms bookings found.</p>
            ) : (
                bookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        {/* User Information */}
                        <div className="flex items-center mb-4">
                            <img
                                src={`/storage/profile/${booking.user.avatar ? booking.user.avatar : 'default_avatar.png'}`} // Placeholder for no image
                                alt={booking.user.name}
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <p className="font-semibold text-lg">{booking.user.name}</p>
                                <p className="text-sm text-gray-500">{booking.user.email}</p>
                                {booking.user.address && (
                                    <p className="text-sm text-gray-500">{booking.user.address}</p>
                                )}
                            </div>
                        </div>

                        {/* Rooms Information */}
                        <div className="mb-4">
                            <p className="text-xl font-semibold">{booking.bookable.name}</p>
                            {booking.bookable.image && (
                                <img
                                    src={
                                        booking.bookable.image
                                            ? booking.bookable.image.startsWith('https')
                                                ? booking.bookable.image
                                                : `/storage/room/${booking.bookable.image}`
                                            : '/storage/room/room.png'
                                    }
                                    alt={booking.bookable.name}
                                    className="w-full h-48 object-cover rounded-lg mb-2"
                                />
                            )}
                        </div>

                        <div className="flex justify-between items-start gap-6 p-4 bg-white rounded-lg shadow-sm">
                            {/* Booking Dates */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    <strong>Start:</strong> {new Date(booking.start_date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>End:</strong> {new Date(booking.end_date).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Payment Status */}
                            <div className="text-right">
                                <p className=" font-semibold text-gray-800">&#8369;{booking.payment.amount}</p>
                                <p className="text-sm text-gray-500">
                                    {booking.payment.payment_method}
                                </p>
                            </div>
                        </div>

                    </div>
                ))
            )}
        </div>
    );
}
