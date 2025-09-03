export default function RoomRequests({ requests }) {
    console.log(requests);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length === 0 ? (
                <p className="text-gray-500">No rooms requests found.</p>
            ) : (
                requests.map((request) => (
                    <div key={request.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        {/* User Information */}
                        <div className="flex items-center mb-4">
                            <img
                                src={`/storage/profile/${request.user.avatar ? request.user.avatar : 'default_avatar.png'}`} // Placeholder for no image
                                alt={request.user.name}
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <p className="font-semibold text-lg">{request.user.name}</p>
                                <p className="text-sm text-gray-500">{request.user.email}</p>
                                {request.user.address && (
                                    <p className="text-sm text-gray-500">{request.user.address}</p>
                                )}
                            </div>
                        </div>

                        {/* Rooms Information */}
                        <div className="mb-4">
                            <p className="text-xl font-semibold">{request.bookable.name}</p>
                            {request.bookable.image && (
                                <img
                                    src={
                                        request.bookable.image
                                            ? request.bookable.image.startsWith('https')
                                                ? request.bookable.image
                                                : `/storage/room/${request.bookable.image}`
                                            : '/storage/room/room.png'
                                    }
                                    alt={request.bookable.name}
                                    className="w-full h-48 object-cover rounded-lg mb-2"
                                />
                            )}
                        </div>

                        <div className="flex justify-between items-start gap-6 p-4 bg-white rounded-lg shadow-sm">
                            {/* Request Dates */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    <strong>Start:</strong> {new Date(request.start_date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>End:</strong> {new Date(request.end_date).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Payment Status */}
                            <div className="text-right">
                                <p className=" font-semibold text-gray-800">&#8369;{request.payment.amount}</p>
                                <p className="text-sm text-gray-500">
                                    {request.payment.payment_method}
                                </p>
                            </div>
                        </div>

                    </div>
                ))
            )}
        </div>
    );
}
