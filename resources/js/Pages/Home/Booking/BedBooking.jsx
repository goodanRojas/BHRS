import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faLocationDot, faDoorOpen, faBuilding } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import TermsAndConditionsModal from '@/Components/TermsAndConditionsModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
export default function Booking({ bed, userPreferences }) {
    // console.log(bed);
    // console.log(userPreferences);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: userPreferences?.fullname || '',
        email: userPreferences?.email || '',
        phone: userPreferences?.phone || '',
        address: {
            street: userPreferences?.address?.street || '',
            barangay: userPreferences?.address?.barangay || '',
            city: userPreferences?.address?.city || '',
            province: userPreferences?.address?.province || '',
            postal_code: userPreferences?.address?.postal_code || '',
            country: userPreferences?.address?.country || '',
        },
        start_date: userPreferences?.start_date || '',
        month_count: 1,
        message: userPreferences?.special_request || '',
        payment_method: '',
        total_price: bed.sale_price ? bed.sale_price : bed.price,
        status: userPreferences?.status || 'pending',
        agreedToTerms: userPreferences?.agreed_to_terms === 1,
        bed_id: bed.id,
    });

    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [successModal, setSuccessModal] = useState(false);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setData(data => ({
                ...data,
                address: {
                    ...data.address,
                    [addressField]: value,
                }
            }));
        } else {
            setData(name, type === 'checkbox' ? checked : value);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/bed/book/${data.bed_id}`, {
            onSuccess: () => setSuccessModal(true),
            onError: (error) => console.error(error),
        });
    };


    return (
        <AuthenticatedLayout>
            <Head title="Bed Booking" />

            {/* Success Modal */}
            <Modal show={successModal} closeable={false} onClose={() => setSuccessModal(false)}>
                <div className="flex flex-col items-center p-6 bg-indigo-100 text-indigo-700 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center font-semibold text-sm">Booking Successful! Please wait for landlord confirmation.</p>
                    <Link href={`/home/bed/${bed.id}`} className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">OK</Link>
                </div>
            </Modal>

            {/* Terms Modal */}
            {/* Terms Modal */}
            <TermsAndConditionsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAgree={() => {
                    setData('agreedToTerms', true);
                    setIsModalOpen(false);
                }}
            />


            <div className="max-w-5xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg space-y-8 mt-6">
                <h1 className="text-3xl font-bold text-gray-800">Book Your Stay</h1>

                {/* Bed Details */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={`/storage/${bed.image}`}
                        alt="Bed"
                        className="w-32 h-32 rounded-xl border object-cover shadow-md"
                    />
                    <div className="space-y-1 text-gray-700">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <FontAwesomeIcon icon={faBed} className="text-indigo-600" />
                            {bed.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FontAwesomeIcon icon={faDoorOpen} className="text-indigo-600" />
                            Room: {bed.room.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FontAwesomeIcon icon={faBuilding} className="text-indigo-600" />
                            Building: {bed.room.building.name}
                        </div>
                        <div className="text-indigo-700 font-medium text-sm mt-2">
                            Total Price: ₱{bed.sale_price ?? bed.price}
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={data.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Booking Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={data.start_date}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Duration (Months)</label>
                            <input
                                type="number"
                                name="month_count"
                                value={data.month_count}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Payment Method</label>
                            <select
                                name="payment_method"
                                value={data.payment_method}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Select</option>
                                <option value="cash">Cash</option>
                                <option value="gcash">G-Cash</option>
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["street", "barangay", "city", "province", "postal_code", "country"].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-600 capitalize">
                                    {field.replace('_', ' ')}
                                </label>
                                <input
                                    type="text"
                                    name={`address.${field}`}
                                    value={data.address[field]}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {/* Special Requests */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Special Requests (Optional)</label>
                        <textarea
                            name="message"
                            value={data.message}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            rows="3"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Terms */}
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="agreedToTerms"
                                checked={data.agreedToTerms}
                                onChange={handleChange}
                                required
                            />
                            <span>
                                I agree to the{" "}
                                <button type="button" onClick={() => setIsModalOpen(true)} className="text-indigo-500 underline">
                                    terms and conditions
                                </button>
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={` p-1 px-4 flex justify-center items-center gap-2 bg-indigo-600 text-white font-medium py-3 rounded-md transition ${processing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                                }`}
                        >
                            {processing && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            {processing ? 'Submitting...' : 'Book'}
                        </button>
                    </div>
                </form>

            </div>
        </AuthenticatedLayout>

    );
}
