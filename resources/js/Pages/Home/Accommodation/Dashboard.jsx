import { Head, Link, usePage } from '@inertiajs/react';
import Layout from './Layout';
import { CheckCircle, Clock, MapPin, CalendarDays, Mail, Phone } from 'lucide-react';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/inertia-react';
import { useState, useEffect } from 'react';
export default function Dashboard({ booking }) {


    const user = usePage().props.auth.user;
    /* Booking Approved Channel */
    useEffect(() => {

        const channel = window.Echo.private(`user_booking_approved.${user?.id}`)
            .listen('.UserBookingApproved', (e) => {
                console.log('🔔 New booking approved received!', e);
                setBookingStatus(e.booking.status);
            });

        return () => {
            channel.stopListening('.UserBookingApproved');
        };
    }, [user?.id]);
    useEffect(() => {

        const channel = window.Echo.private(`user_payment_confirmed.${user?.id}`)
            .listen('.UserPaymentConfirmed', (e) => {
                console.log('🔔 New booking approved received!', e);
                setBookingStatus(e.booking.status);
            });

        return () => {
            channel.stopListening('.UserPaymentConfirmed');
        };
    }, [user?.id]);
  
    useEffect(() => {

        const channel = window.Echo.private(`user_booking_expired.${user?.id}`)
            .listen('.UserBookingExpiredEvent', (e) => {
                console.log('Booking is expired', e);
                setBookingStatus(e.booking.status);
            });

        return () => {
            channel.stopListening('.UserBookingExpiredEvent');
        };
    }, [user?.id]);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(booking?.status);
    const { post, processing, errors, data, reset } = useForm({
        reason: '',
        booking_id: booking?.id ?? null,
    });

    const handleCancelSubmit = (e) => {
        e.preventDefault();
        post(route('booking.cancel', booking.id), {
            onSuccess: () => setShowCancelModal(false),
            onError: (error) => console.error(error),
        });
    };
    if (!booking) {
        return (
            <Layout>
                <Head title="Accommodation Dashboard" />
                <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800">No current booking found</h2>
                    <Link
                        href="/home/buildings"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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

    return (
        <Layout>
            <Head title="Booking Dashboard" />

            <div className="space-y-8">
                {/* Booking Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Image + Details */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <img
                            src={image ? `/storage/${image}` : 'https://via.placeholder.com/600x400?text=No+Image'}
                            alt={name}
                            className="w-full h-56 md:h-64 object-cover"
                        />
                        <div className="p-5 space-y-2">
                            <h3 className="text-xl font-bold text-gray-800">{bookable.name}</h3>
                            <p className="text-gray-600">{roomName} • {buildingName}</p>
                            <p className="text-sm text-gray-500 leading-snug">
                                {address?.street}, {address?.barangay}, {address?.city}, {address?.province}
                            </p>
                        </div>
                    </div>

                    {/* Right: Status */}
                    <div className="flex items-center justify-center">
                        {bookingStatus === 'confirmed' && (
                            <div className="text-center space-y-3">
                                <CheckCircle className="text-green-500 w-14 h-14 mx-auto" />
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                                    Confirmed
                                </span>
                                <p className="text-gray-600">Your booking is confirmed.</p>
                            </div>
                        )}

                        {(bookingStatus === 'waiting' || bookingStatus === 'pending' || bookingStatus === 'paid') && (
                            <div className="text-center space-y-3">
                                <Clock className="text-yellow-500 w-14 h-14 mx-auto" />
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
                                    Awaiting Confirmation
                                </span>
                                <p className="text-gray-600">Thanks! Please wait for the owner’s response.</p>
                            </div>
                        )}

                        {bookingStatus === 'approved' && (
                            <div className="text-center space-y-3">
                                <CheckCircle className="text-green-500 w-14 h-14 mx-auto" />
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                                    Approved
                                </span>
                                <p className="text-gray-600">Please proceed with your GCash payment.</p>
                                <Link
                                    href={route('gcash.payment.page', booking.id)}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Pay with GCash →
                                </Link>
                            </div>
                        )}

                        {bookingStatus === 'ended' && (
                            <div className="text-center space-y-3">
                                <CheckCircle className="text-green-500 w-14 h-14 mx-auto" />
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                                    Booking Expired
                                </span>
                                <p className="text-gray-600">Your booking has expired.</p>
                            </div>
                        )}

                        {bookingStatus === 'completed' && (
                            <div className="text-center space-y-3">
                                <CheckCircle className="text-green-500 w-14 h-14 mx-auto" />
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                                    Completed
                                </span>
                                <p className="text-gray-600">Congrats! Your booking has been booked successfully.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trip Details */}
                <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
                    <h4 className="text-lg md:text-xl font-bold text-gray-800 border-b pb-3">
                        Trip Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                        <div className="space-y-3">
                            <p className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-gray-500" />
                                <strong>Check-in:</strong>{' '}
                                {new Date(booking.start_date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })}
                            </p>

                            <p className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-gray-500" />
                                <strong>Check-out:</strong>{' '}
                                {(() => {
                                    const start = new Date(booking.start_date);
                                    const end = new Date(start);
                                    end.setMonth(end.getMonth() + booking.month_count);
                                    return end.toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    });
                                })()}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <strong>Address:</strong> {address?.street}, {address?.barangay}, {address?.city}
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <strong>Email:</strong> {bookable.room.building.seller.email}
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <strong>Telephone:</strong> {bookable.room.building.seller.phone}
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="font-semibold">Total price:</span>
                            <span className="text-lg font-bold text-gray-800">
                                ₱{booking.total_price?.toFixed(2) ?? '0.00'}
                            </span>
                            {bookingStatus === 'paid' && (
                                <span className="ml-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                                    Paid
                                </span>
                            )}
                        </div>

                        <div className="flex w-full flex-wrap justify-end gap-2">
                            <Link
                                href="#"
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition text-sm"
                            >
                                Contact
                            </Link>
                            {bookingStatus !== 'completed' && bookingStatus !== 'paid' && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 transition text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showCancelModal} onClose={() => setShowCancelModal(false)}>
                <div className="p-6 text-center">
                    <h2 className="text-lg font-bold mb-4">Cancel Booking</h2>
                    <p className="mb-6">Are you sure you want to cancel this booking?</p>

                    <div className="flex justify-end space-x-3">
                        <button
                            className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition w-full sm:w-auto"
                            onClick={() => setShowCancelModal(false)}
                            disabled={processing}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-300 disabled:cursor-not-allowed transition w-full sm:w-auto"
                            onClick={handleCancelSubmit}
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
}
