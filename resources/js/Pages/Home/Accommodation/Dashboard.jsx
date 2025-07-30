import { Head, Link, usePage } from '@inertiajs/react';
import Layout from './Layout';
import { CheckCircle } from 'lucide-react';

export default function Dashboard({ booking }) {
    const user = usePage().props.auth.user;
    console.log(booking);
    if (!booking) {
        return (
            <Layout>
                <Head title="Accommodation Dashboard" />
                <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
                    <h2 className="text-2xl font-semibold">No current booking found</h2>
                    <Link
                        href="/home"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Browse to find your stay
                    </Link>
                </div>
            </Layout>
        );
    }

    const bookable = booking.bookable;
    const type = booking.bookable_type;

    const image = type.endsWith('Bed') ? bookable?.image : null;
    const name = bookable?.name ?? 'No Name';
    const roomName = type.endsWith('Bed') ? bookable?.room?.name : (type.endsWith('Room') ? bookable?.name : 'N/A');
    const buildingName = type.endsWith('Bed') ? bookable?.room?.building?.name : (type.endsWith('Room') ? bookable?.building?.name : 'N/A');
    const address = type.endsWith('Bed')
        ? bookable?.room?.building?.address
        : bookable?.building?.address;

    const duration = booking.start_date && booking.end_date
        ? Math.ceil((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 3600 * 24)) + " days"
        : 'N/A';

    return (
        <Layout>
            <Head title="Booking Confirmation" />
            <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Booking Summary Card */}
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-4">
                        <img
                            src={image ? `/storage/${image}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={name}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <span className='w-full h-[2px] bg-indigo-400 block'> </span>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-800">{bookable.name}</h3>
                            <p className="mt-2 text-sm text-gray-700 italic">{roomName}</p>
                            <p className="text-sm text-gray-600">{buildingName}</p>
                            <p className="text-sm text-gray-500 mb-2">{address?.street}, {address?.barangay}, {address?.city}, {address?.province}</p>
                        </div>
                    </div>

                    {/* Confirmation */}
                    <div className="flex flex-col items-center justify-center text-center space-y-3 p-4">
                        <CheckCircle className="text-green-500 w-16 h-16" />
                        <h2 className="text-xl font-semibold text-green-600">Your booking is now confirmed!</h2>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    <h4 className="text-lg font-bold text-gray-800">
                        Your trip starts {new Date(booking.start_date).toDateString()}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <p><strong>📅 Check-in:</strong> {new Date(booking.start_date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})}</p>
                            <p><strong>📅 Check-out:</strong> {new Date(booking.end_date).toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})}</p> 
                        </div>
                        <div>
                            <p><strong>🏨 Address:</strong> {address?.street}, {address?.barangay}, {address?.city}</p>
                            <p><strong>📧 Email:</strong> {bookable.room.building.seller.email}</p>
                            <p><strong>📞 Telephone:</strong> {bookable.room.building.seller.phone}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t text-sm">
                        <div>
                            <strong>Total price:</strong> ₱{booking.total_price?.toFixed(2) ?? '0.00'}{' '}
                            <span className="ml-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">paid</span>
                        </div>
                        <div className="space-x-3">
                            <Link href="#" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Contact property
                            </Link>
                            <Link href="#" className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                                Cancel reservation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
