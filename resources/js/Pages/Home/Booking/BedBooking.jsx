import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faLocationDot, faDoorOpen, faBuilding } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import TermsAndConditionsModal from '@/Components/TermsAndConditionsModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
export default function Booking({ bed }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        start_date: '',
        month_count: 1,
        message: '',  // Corrected from specialRequests to message
        payment_method: '',  // Changed to match the model field
        total_price: bed.sale_price ? bed.sale_price : bed.price,  // Added total_price
        status: 'pending',  // Added default status
        agreedToTerms: false,
        bed_id: bed.id
    });


    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [successModal, setSuccessModal] = useState(false);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
         console.log(formData);
        e.preventDefault();
        try {
            const response = await axios.post(`/bed/book/${formData.bed_id}`, formData);
            if (response.status === 200) {
                setSuccessModal(true);
            }
        } catch (error) {
            console.error('Booking failed:', error.response ? error.response.data : error.message);
        }
    };
    return (
        <AuthenticatedLayout>
            <Head title="Bed Booking" />

            {/* Success Modal Component */}
            <Modal
                show={successModal}
                closeable={false}
                onClose={() => setSuccessModal(false)}
            >
                <div className="flex flex-col items-center justify-center p-4 bg-green-100 text-green-600 rounded-lg shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-sm font-medium text-center">
                        Booking Successful! <br />
                        Please wait for the landlord to confirm your booking.
                    </p>
                    <Link
                        href={'/beds/' + bed.id}
                        onClick={() => setSuccessModal(false)}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        OK
                    </Link>
                </div>
            </Modal>

            {/* Terms Modal Component */}
            <TermsAndConditionsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAgree={() => {
                    setFormData((prev) => ({ ...prev, agreedToTerms: true }));
                    setIsModalOpen(false);
                }}
            />

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Book Your Stay</h1>

                <div className="flex items-center gap-8 py-6 px-6 bg-white rounded-lg shadow-md">
                    {/* Bed Image */}
                    <img
                        src={`${bed.image.startsWith('http') ? bed.image : `/storage/bed/${bed.image}`}`}
                        alt="Bed"
                        className="w-[6rem] h-[6rem] rounded-lg border border-gray-300 shadow-md object-cover"
                    />

                    {/* Bed Details Section */}
                    <div className="space-y-6 text-gray-700">
                        {/* Bed Name */}
                        <div className="flex items-center gap-3 text-lg font-semibold">
                            <FontAwesomeIcon icon={faBed} className="text-blue-600" />
                            <strong>{bed.name}</strong>
                        </div>

                        {/* Room Details */}
                        <div className="flex items-center gap-3 text-sm">
                            <FontAwesomeIcon icon={faDoorOpen} className="text-green-600" />
                       

                            <strong>{bed.room.name}</strong>
                        </div>

                        {/* Build
                        ing Details */}
                        <div className="flex items-center gap-3 text-sm">
                            <FontAwesomeIcon icon={faBuilding} className="text-yellow-600" />
                          
                            <strong>{bed.room.building.name}</strong>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <FontAwesomeIcon icon={faLocationDot} className="text-red-600" />
                            <strong>{bed.room.building.address}</strong>
                        </div>

                        {/* Price */}
                        <div className="text-lg text-blue-700">
                            <span className="font-medium">Total Price: </span>₱<strong>{bed.sale_price ? bed.sale_price : bed.price}</strong>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Booking Date */}
                    <div className="flex flex-col">
                        <label htmlFor="start_date" className="text-sm font-medium text-gray-600 mb-1">
                            Booking Date
                        </label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Duration (Months) */}
                    <div className="flex flex-col">
                        <label htmlFor="month_count" className="text-sm font-medium text-gray-600 mb-1">
                            Duration (Months)
                        </label>
                        <input
                            type="number"
                            id="month_count"
                            name="month_count"
                            value={formData.month_count}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-600 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-600 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="address" className="text-sm font-medium text-gray-600 mb-1">Address</label>
                        <textarea
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="payment_method" className="text-sm font-medium text-gray-600 mb-1">Payment Method</label>
                        <select
                            name="payment_method"
                            id="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                            required
                        >
                            <option value="">Select Payment Method</option>
                            <option value="cash">Cash</option>
                            <option value="gcash">G-Cash</option>
                        </select>
                    </div>

                    {/* Special Requests */}
                    <div className="flex flex-col col-span-2">
                        <label htmlFor="specialRequests" className="text-sm font-medium text-gray-600 mb-1">Special Requests (Optional)</label>
                        <textarea
                            name="specialRequests"
                            id="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>

                    {/* Terms Checkbox with Modal Trigger */}
                    <div className="flex items-center col-span-2 text-sm">
                        <input
                            type="checkbox"
                            name="agreedToTerms"
                            checked={formData.agreedToTerms}
                            onChange={handleChange}
                            className="mr-2"
                            required
                        />
                        <span className="text-gray-700">
                            I agree to the{" "}
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="text-blue-500 underline"
                            >
                                terms and conditions
                            </button>
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition col-span-2"
                    >
                        Submit Booking
                    </button>
                </form>
            </div>


        </AuthenticatedLayout>
    );
}
