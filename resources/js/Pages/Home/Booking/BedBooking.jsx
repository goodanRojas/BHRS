import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faLocationDot, faDoorOpen, faBuilding } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import InputField from '@/Components/InputField';
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
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
                    {/* Image */}
                    <div className="flex-shrink-0">
                        <img
                            src={`/storage/${bed.image}`}
                            alt="Bed"
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg border object-cover shadow-md"
                        />
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-gray-800 w-full">
                        <div className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
                            <FontAwesomeIcon icon={faBed} />
                            <span>{bed.name}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faDoorOpen} className="text-indigo-500" />
                                <span className="text-gray-700">Room: {bed.room.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faBuilding} className="text-indigo-500" />
                                <span className="text-gray-700">Building: {bed.room.building.name}</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                                Total Price: ₱{bed.sale_price ?? bed.price}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Full Name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Phone"
                            name="phone"
                            type="tel"
                            value={data.phone}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Booking Date"
                            name="start_date"
                            type="date"
                            value={data.start_date}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Duration (Months)"
                            name="month_count"
                            type="number"
                            value={data.month_count}
                            onChange={handleChange}
                            required
                        />
                        <div className="relative w-full">
                            <label htmlFor="payment_method" className="absolute -top-2 left-3 text-xs bg-white px-1 text-gray-500 z-10">
                                Payment Method
                            </label>
                            <select
                                name="payment_method"
                                value={data.payment_method === 'gcash' ? 'gcash' : 'cash'}
                                onChange={handleChange}
                                className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
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
                            <InputField
                                key={field}
                                label={field.replace('_', ' ')}
                                name={`address.${field}`}
                                value={data.address[field]}
                                onChange={handleChange}
                                required
                            />
                        ))}
                    </div>

                    {/* Special Requests */}
                    <div>
                        <InputField label="Special Requests"  name="message" value={data.message} onChange={handleChange} type={'textarea'} />
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Terms */}
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="agreedToTerms"
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
                            className={`inline-flex items-center justify-center w-[100px] gap-2 px-6 py-2 text-sm sm:text-base font-semibold rounded-full 
                                    transition-colors duration-200 
                                    ${processing
                                                                    ? 'bg-indigo-400 text-white cursor-not-allowed'
                                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                                `}
                                >
                            {processing && (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
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
