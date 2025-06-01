import { Head, Link, usePage } from '@inertiajs/react';
import Layout from './Layout';

export default function Dashboard({ bookings }) {
    const user = usePage().props.auth.user;

    return (
        <Layout>
            <Head title="Accommodation Dashboard" />
            <div className="p-4 md:p-8 space-y-8 min-h-screen">
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    {/* Bookings Table */}
                    {bookings.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Image</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Room</th>
                                        <th className="px-4 py-2 text-left">Building</th>
                                        <th className="px-4 py-2 text-left">Address</th>
                                        <th className="px-4 py-2 text-left">Total Price</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Start Date</th>
                                        <th className="px-4 py-2 text-left">End Date</th>
                                        <th className="px-4 py-2 text-left">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => {
                                        const bookable = booking.bookable;
                                        const type = booking.bookable_type; // full class name like 'App\\Models\\Bed'

                                        // Determine nested relations depending on type
                                        // For Bed: bookable.room.building.address
                                        // For Room: bookable.building.address
                                        const bedImage = type.endsWith('Bed') ? bookable?.image : null;
                                        const name = bookable?.name ?? 'No Name';
                                        const roomName = type.endsWith('Bed') ? bookable?.room?.name : (type.endsWith('Room') ? bookable?.name : 'N/A');
                                        const buildingName = type.endsWith('Bed') ? bookable?.room?.building?.name : (type.endsWith('Room') ? bookable?.building?.name : 'N/A');
                                        const addressStreet = type.endsWith('Bed')
                                            ? bookable?.room?.building?.address?.street
                                            : type.endsWith('Room')
                                            ? bookable?.building?.address?.street
                                            : 'No Address';

                                        // Calculate duration in days
                                        const duration = booking.start_date && booking.end_date
                                            ? Math.ceil((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 3600 * 24)) + " days"
                                            : 'N/A';

                                        return (
                                            <tr key={booking.id} className="border-b">
                                                <td className="px-4 py-2">
                                                    {bedImage ? (
                                                        <img
                                                            src={`/storage/${bedImage}`}
                                                            alt={name}
                                                            className="w-16 h-16 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500">
                                                            No Image
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">{name}</td>
                                                <td className="px-4 py-2">{roomName ?? 'N/A'}</td>
                                                <td className="px-4 py-2">{buildingName ?? 'N/A'}</td>
                                                <td className="px-4 py-2">{addressStreet ?? 'No Address'}</td>
                                                <td className="px-4 py-2">₱{booking.total_price?.toFixed(2) ?? '0.00'}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                                        booking.status === 'approved'
                                                            ? 'bg-green-200 text-green-600'
                                                            : 'bg-yellow-200 text-yellow-600'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{booking.start_date ?? 'N/A'}</td>
                                                <td className="px-4 py-2">{booking.end_date ?? 'N/A'}</td>
                                                <td className="px-4 py-2">{duration}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex justify-center mt-6">
                            <Link
                                href="/home"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Browse to find your stay.
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
