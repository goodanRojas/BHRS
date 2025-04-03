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
        e.preventDefault();
        try {
            const response = await axios.post(`/bed/${formData.bed_id}/book`, formData);
            if (response.status === 200) {
                setSuccessModal(true);
            }
        } catch (error) {
            console.error('Booking failed:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <AuthenticatedLayout>
            <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
                <Head title="Booking" />

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
                            href={'/beds/' + bed.id }
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

                <h1 className="text-2xl font-bold mb-6 ">Book </h1>
                <div className='flex items-center gap-6 py-6 p-4'>
                    {/* Bed Image */}
                    <img src={`/storage/${bed.image}`} alt="Bed" className="w-[5rem] h-auto rounded-lg border border-gray-300 shadow-md" />

                    {/* Bed Details Section */}
                    <div className="text-sm space-y-4 text-gray-700">
                        {/* Bed Name */}
                        <div className="flex items-center gap-3 text-lg font-semibold">
                            <FontAwesomeIcon icon={faBed} className="text-blue-500" />
                            <strong>{bed.name}</strong>
                        </div>

                        {/* Room Details */}
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faDoorOpen} className="text-green-500" />
                            <img src={`/storage/${bed.room.image}`} alt="Room" className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" />
                            <strong>{bed.room.name}</strong>
                        </div>

                        {/* Building Details */}
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faBuilding} className="text-yellow-500" />
                            <img src={`/storage/${bed.room.building.image}`} alt="Building" className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" />
                            <strong>{bed.room.building.name}</strong>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faLocationDot} className="text-red-500" />
                            <strong>{bed.room.building.address}</strong>
                        </div>

                        {/* Price */}
                        <div className="  text-blue-700">
                            Total Price: &#8369;<strong>{bed.sale_price ? bed.sale_price : bed.price}</strong>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:grid md:grid-cols-2 md:gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Booking Date */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1" htmlFor="start_date">
                                Booking Date
                            </label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                placeholder="Start Date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Number of Months */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1" htmlFor="month_count">
                                Duration <span className="text-sm text-gray-400">(Months)</span>
                            </label>
                            <input
                                type="number"
                                id="month_count"
                                name="month_count"
                                placeholder="Months"
                                value={formData.month_count}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                                required
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                        required
                    />

                    {/* Phone */}
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                        required
                    />

                    {/* Address */}
                    <textarea
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 col-span-2"
                    />



                    {/* Payment Method */}
                    <label className="text-sm font-medium text-gray-600 col-span-2">Payment Method</label>
                    <select
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                        required
                    >
                        <option value="">Select Payment Method</option>
                        <option value="1">Cash</option>
                        <option value="2">G-Cash</option>
                    </select>

                    {/* Special Requests */}
                    <textarea
                        name="specialRequests"
                        placeholder="Special Requests (Optional)"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 col-span-2"
                    />

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
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition col-span-2"
                    >
                        Submit Booking
                    </button>
                </form>

            </div>
        </AuthenticatedLayout>
    );
}
