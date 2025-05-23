import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Head, usePage } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import Modal from '@/Components/Modal';

export default function BedRequest({ booking }) {
    // console.log(booking);
     const user = usePage().props.auth.seller;
       
    const { data, setData, post, processing, errors } = useForm({
        paymentStatus: booking.status, // Assuming there's a payment status to track
        receiptImage: null, // Image of the manual receipt
        transactionId: '', // For storing transaction ID input
        rejectReason: '', // Reason for rejecting the booking
        payment_method: booking.payment_method,
        user_id: booking.user_id,
        total_price: booking.total_price,
        bookingId: booking.id,
    });

    const [showModalAccept, setShowModalAccept] = useState(false); // State for controlling accept modal visibility
    const [showModalReject, setShowModalReject] = useState(false); // State for controlling reject modal visibility

    // Handle accept action
    const handleAccept = () => {
        setData('paymentStatus', 'completed'); // Mark payment as completed
        setData('transactionId', data.transactionId || null); // Use transaction ID or set it as null
        post(route('seller.request.bed.accept', booking.id), {
            onSuccess: () => {
                console.log('Booking accepted');
                setShowModalAccept(false); // Close the modal on success
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    // Handle reject action
    const handleReject = () => {
        setData('paymentStatus', 'rejected'); // Mark payment as rejected
        post(route('seller.request.bed.reject'), {
            onSuccess: () => {
                console.log('Booking rejected');
                setShowModalReject(false); // Close the modal on success
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    // Show modal for accept
    const handleShowModalAccept = () => {
        setShowModalAccept(true);
    };

    // Show modal for reject
    const handleShowModalReject = () => {
        setShowModalReject(true);
    };

    // Close modals
    const handleCloseModalAccept = () => {
        setShowModalAccept(false);
    };

    const handleCloseModalReject = () => {
        setShowModalReject(false);
    };


     useEffect(() => {
            const landlordId = user?.id; // however you get it
    
            if (!landlordId) return;
    
            const channel = window.Echo.private(`landlord.${landlordId}`)
                .listen('.NewBookingCreated', (e) => {
                    console.log('🔔 New booking received!', e);
                    
    
    
                    // Hide notification after 5 seconds
                    setTimeout(() => setNotification(null), 15000);
                });
    
            return () => {
                channel.stopListening('.NewBookingCreated');
            };
        }, [user?.id]);
    

    return (
        <SellerLayout>
            <Head title="Bed Request" />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Booking ID: {booking.id}</h3>

                {/* User Information */}
                <div className="flex items-center mb-4">
                    <img
                        src={`/storage/user/${booking.user.avatar ? booking.user.avatar : 'default_avatar.png'}`} // Placeholder for no image
                        alt={booking.user.name}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                        <p className="font-semibold text-lg">{booking.user.name}</p>
                        <p className="text-sm text-gray-500">{booking.user.email}</p>
                        <p className="text-sm text-gray-500">{booking.user.phone}</p>
                        {booking.user.address && (
                            <p className="text-sm text-gray-500">{booking.user.address}</p>
                        )}
                    </div>
                </div>

                {/* Bed Information */}
                <div className="mb-4">
                    <p className="text-xl font-semibold">{booking.bookable.name}</p>
                    {booking.bookable.image && (
                        <img
                            src={
                                booking.bookable.image.startsWith('https')
                                    ? booking.bookable.image
                                    : `/storage/bed/${booking.bookable.image}`
                            }
                            alt={booking.bookable.name}
                            className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                    )}
                    <p className="text-sm text-gray-500">Duration: {calculateMonths(booking.start_date, booking.end_date)} month(s)</p>
                    <p className="text-sm text-gray-500">Start Date: {new Date(booking.start_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">End Date: {new Date(booking.end_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Total Payment: &#8369;{booking.total_price}</p>
                </div>

                {/* Accept/Reject Buttons */}
                <div className="mt-4">
                    {booking.payment_method === 'cash' && (
                        <div>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={handleShowModalAccept}
                                disabled={processing}
                            >
                                Accept
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md ml-4"
                                onClick={handleShowModalReject}
                                disabled={processing}
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal for Receipt Upload (Accept Modal) */}
                {showModalAccept && (
                    <Modal show={showModalAccept} onClose={handleCloseModalAccept}>
                        <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('receiptImage', e.target.files[0])}
                            className="mb-4 p-2 border rounded-md w-full"
                        />
                        <input
                            type="text"
                            value={data.transactionId}
                            onChange={(e) => setData('transactionId', e.target.value)}
                            placeholder="Transaction ID (optional)"
                            className="mb-4 p-2 border rounded-md w-full"
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                onClick={handleCloseModalAccept}
                            >
                                Close
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={handleAccept}
                            >
                                Submit
                            </button>
                        </div>
                    </Modal>
                )}

                {/* Modal for Reject (Reject Modal) */}
                {showModalReject && (
                    <Modal show={showModalReject} onClose={handleCloseModalReject}>
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to reject this booking?</h2>
                        <textarea
                            className="p-2 border rounded-md w-full mb-4"
                            placeholder="Reason for rejection"
                            value={data.rejectReason}
                            onChange={(e) => setData('rejectReason', e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                onClick={handleCloseModalReject}
                            >
                                Close
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </div>
                    </Modal>
                )}

                {/* For accepted bookings, show the manual receipt */}
                {booking.status === 'completed' && booking.payment.receipt_image && (
                    <div className="mt-4">
                        <p>Manual receipt:</p>
                        <img
                            src={`/storage/receipts/${booking.payment.receipt_image}`}
                            alt="Manual Receipt"
                            className="w-full h-auto mt-2"
                        />
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}

// Helper function to calculate the month difference
const calculateMonths = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const yearsDifference = end.getFullYear() - start.getFullYear();
    const monthsDifference = end.getMonth() - start.getMonth();
    return yearsDifference * 12 + monthsDifference;
};
