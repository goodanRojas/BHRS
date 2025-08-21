import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Head, usePage, } from '@inertiajs/react';
import axios from 'axios';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faTimes, faCheckCircle, faPhone, faMapMarkerAlt, faBed, faCalendarAlt, faMoneyBillWave, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import SellerLayout from '@/Layouts/SellerLayout';
import Modal from '@/Components/Modal';

export default function BedRequest({ booking }) {
    console.log("Booking Data:", booking);

    const user = usePage().props.auth.seller;

    // State for form inputs\
    const [receiptImage, setReceiptImage] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    // Modal visibility states
    const [showModalAccept, setShowModalAccept] = useState(false);
    const [showModalReject, setShowModalReject] = useState(false);

    const { post, processing } = useForm();
    // Handle Accept submission
    const handleAccept = () => {

        post(route('seller.request.bed.accept', booking.id),);
    };

    // Handle Reject submission
    const handleReject = async () => {

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
        }
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
            <div className="max-w-5xl mx-auto space-y-8 p-6 sm:p-8">
                {/* User Info */}
                <motion.div
                    className="p-6 rounded-2xl shadow-lg border border-gray-100 bg-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img
                            src={`/storage/${booking.user.avatar ?? "profile/default_avatar.png"}`}
                            alt={booking.user.name}
                            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-md"
                        />
                        <div className="text-center sm:text-left">
                            <p className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-indigo-400" /> {booking.user.name}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-indigo-400" /> {booking.user.email}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                                <FontAwesomeIcon icon={faPhone} className="text-indigo-400" /> {booking.user.phone}
                            </p>
                            {booking.user.address && (
                                <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-400" /> {booking.user.address}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Bed Info */}
                <motion.div
                    className="p-6 rounded-2xl shadow-lg border border-gray-100 bg-white space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {booking.bookable.image && (
                        <img
                            src={
                                booking.bookable.image.startsWith("https")
                                    ? booking.bookable.image
                                    : `/storage/${booking.bookable.image}`
                            }
                            alt={booking.bookable.name}
                            className="w-full h-56 object-cover rounded-xl border border-gray-200 shadow-sm"
                        />
                    )}

                    <div>
                        <p className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBed} className="text-indigo-500" /> {booking.bookable.name}
                        </p>
                        <p className="text-gray-700">{booking.bookable.room.name}</p>
                        <p className="text-gray-500">{booking.bookable.room.building.name}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
                        <div className="space-y-2">
                            <p className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-400" />
                                <span className="font-medium text-gray-900">Duration:</span> {booking.month_count} month{booking.month_count > 1 ? "s" : ""}
                            </p>
                            <p>
                                <strong>📅 Check-in:</strong>{' '}
                                {new Date(booking.start_date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })}
                            </p>

                            <p>
                                <strong>📅 Check-out:</strong>{' '}
                                {(() => {
                                    const start = new Date(booking.start_date);
                                    const end = new Date(start);
                                    end.setMonth(end.getMonth() + booking.month_count); // add months
                                    return end.toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    });
                                })()}
                            </p>
                        </div>

                        <div>
                            <p className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500" />
                                <span className="font-medium text-gray-900">Total Price:</span> ₱{booking.total_price}
                            </p>
                            <p><span className="font-medium">     <FontAwesomeIcon icon={faCreditCard} className="text-indigo-500" /> Method:</span> {booking.payment_method}</p>
                        </div>
                    </div>
                </motion.div>


                {/* Action Buttons */}
                <motion.div
                    className="flex justify-end gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <button
                        onClick={() => setShowModalAccept(true)}
                        disabled={processing}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => setShowModalReject(true)}
                        disabled={processing}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                    >
                        Reject
                    </button>
                </motion.div>
            </div>

            {/* Accept Modal */}
            {showModalAccept && (
                <Modal show={showModalAccept} onClose={() => setShowModalAccept(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b pb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Confirm Acceptance</h2>
                        </div>

                        {/* Body */}
                        <div className="py-6 text-center space-y-3">
                            <p className="text-gray-700 text-lg">
                                Are you sure you want to <span className="font-semibold text-green-600">accept</span> this booking?
                            </p>
                            <p className="text-sm text-gray-500">
                                Once accepted, the tenant will be notified immediately.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button
                                className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition w-full sm:w-auto"
                                onClick={() => setShowModalAccept(false)}
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-300 disabled:cursor-not-allowed transition w-full sm:w-auto"
                                onClick={handleAccept}
                                disabled={processing}
                            >
                                {processing ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </motion.div>
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
        </SellerLayout>

    );
}
