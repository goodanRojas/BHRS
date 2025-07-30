import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Head, usePage, } from '@inertiajs/react';
import axios from 'axios';
import SellerLayout from '@/Layouts/SellerLayout';
import Modal from '@/Components/Modal';

export default function BedRequest({ booking }) {
    console.log(booking);
    const user = usePage().props.auth.seller;


    // State for form inputs
    const [paymentStatus, setPaymentStatus] = useState(booking.status);
    const [receiptImage, setReceiptImage] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Modal visibility states
    const [showModalAccept, setShowModalAccept] = useState(false);
    const [showModalReject, setShowModalReject] = useState(false);

    // Handle file input change
    const handleFileChange = (e) => {
        setReceiptImage(e.target.files[0]);
    };

    // Handle Accept submission
    const handleAccept = async () => {
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('paymentStatus', 'confirmed');
        formData.append('transactionId', transactionId || '');
        formData.append('payment_method', booking.payment_method);
        formData.append('user_id', booking.user_id);
        formData.append('total_price', booking.total_price);
        formData.append('bookingId', booking.id);

        if (receiptImage) {
            formData.append('receiptImage', receiptImage);
        }

        try {
            await axios.post(route('seller.request.bed.accept', booking.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowModalAccept(false);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error(error);
            }
        } finally {
            setProcessing(false);
        }
    };

    // Handle Reject submission
    const handleReject = async () => {
        setProcessing(true);
        setErrors({});

        try {
            await axios.post(route('seller.request.bed.reject'), {
                paymentStatus: 'rejected',
                rejectReason,
                bookingId: booking.id,
            });
            setShowModalReject(false);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error(error);
            }
        } finally {
            setProcessing(false);
        }
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
            <div className="max-w-5xl mx-auto space-y-8 p-8 bg-white rounded-2xl shadow-lg">

                {/* Booking Header */}
                <div className="border-b pb-4 mb-6">
                    <h3 className="text-3xl font-bold text-gray-900">
                        Booking ID: <span className="text-indigo-600">{booking.id}</span>
                    </h3>
                </div>

                {/* User Info */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center gap-6">
                        <img
                            src={`/storage/${booking.user.avatar ?? 'profile/default_avatar.png'}`}
                            alt={booking.user.name}
                            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
                        />
                        <div>
                            <p className="text-xl font-semibold text-gray-900">{booking.user.name}</p>
                            <p className="text-gray-600 text-sm">{booking.user.email}</p>
                            <p className="text-gray-600 text-sm">{booking.user.phone}</p>
                            {booking.user.address && (
                                <p className="text-gray-600 text-sm mt-1">{booking.user.address}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bed Info */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                    <p className="text-2xl font-semibold text-gray-900">{booking.bookable.name}</p>

                    {booking.bookable.image && (
                        <img
                            src={
                                booking.bookable.image.startsWith('https')
                                    ? booking.bookable.image
                                    : `/storage/${booking.bookable.image}`
                            }
                            alt={booking.bookable.name}
                            className="w-full h-56 object-cover rounded-lg border border-gray-300"
                        />
                    )}

                    <div className="space-y-4">
                        <img
                            src={`/storage/${booking.payment.receipt}`}
                            alt="receipt"
                            className="w-full max-w-xs mx-auto rounded-md border"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
                        <p><span className="font-medium text-gray-900">Duration:</span> {calculateMonths(booking.start_date, booking.end_date)} month(s)</p>
                        <p><span className="font-medium text-gray-900">Start Date:</span> {new Date(booking.start_date).toLocaleDateString()}</p>
                        <p><span className="font-medium text-gray-900">End Date:</span> {new Date(booking.end_date).toLocaleDateString()}</p>
                        <p><span className="font-medium text-gray-900">Total Payment:</span> ₱{booking.total_price}</p>
                        <p><span className="font-medium text-gray-900">Payment Method:</span> {booking.payment_method}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                {booking.payment_method === 'gcash' && (
                    <div className="flex justify-end gap-6">
                        <button
                            onClick={() => setShowModalAccept(true)}
                            disabled={processing}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => setShowModalReject(true)}
                            disabled={processing}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                        >
                            Reject
                        </button>
                    </div>
                )}

                {/* Accept Modal */}
                {showModalAccept && (
                    <Modal show={showModalAccept} onClose={() => setShowModalAccept(false)}>
                        <div className="bg-white  rounded-lg  max-w-lg mx-auto space-y-6">
                            <h2 className="text-3xl font-semibold text-gray-900">Accept Booking</h2>
                            <p className="text-lg text-gray-800">Do you want to proceed with this booking?</p>

                            <p className="text-sm text-gray-500">
                                Ensure that the payment has been received before accepting the booking.
                            </p>

                            <div className="flex justify-between items-center gap-4 mt-6">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                                    onClick={() => setShowModalAccept(false)}
                                    disabled={processing}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    onClick={handleAccept}
                                    disabled={processing}
                                >
                                    Confirm
                                </button>
                            </div>

                        </div>
                    </Modal>

                )}

                {/* Reject Modal */}
                {showModalReject && (
                    <Modal show={showModalReject} onClose={() => setShowModalReject(false)}>
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Reject Booking</h2>
                            <textarea
                                className="p-3 border border-gray-300 rounded-lg w-full h-24"
                                placeholder="Reason for rejection"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                disabled={processing}
                            />
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-gray-500 text-white px-6 py-3 rounded-md"
                                    onClick={() => setShowModalReject(false)}
                                    disabled={processing}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-red-600 text-white px-6 py-3 rounded-md"
                                    onClick={handleReject}
                                    disabled={processing}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </Modal>
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
