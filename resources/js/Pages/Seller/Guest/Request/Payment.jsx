import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/inertia-react';
import { useState } from 'react'
import SellerLayout from '@/Layouts/SellerLayout';
import ReceiptImage from '@/Components/ReceiptImage';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
export default function Payment({ payment }) {
    console.log(payment);
    const { data, setData, post, processing, reset, errors } = useForm({
        receipt: null,
        ref_number: "",
        remarks: "",
        payment_id: payment.id,
    });

    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setData('receipt', file);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.request.payments.confirm', payment.id), {
            onSuccess: () => setSuccessModal(true),
            onError: (error) => console.error(error),
        });
    };
    return (
        <SellerLayout>
            <Head title={`${payment.booking.user.name} Payment`} />

            <div className="p-6 space-y-6">
                {/* Bed Section */}
                <section className="bg-white shadow rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Bed Information</h2>
                    <div className="flex items-center space-x-4">
                        <img
                            src={`/storage/${payment.booking.bookable.image}`}
                            alt={payment.booking.bookable.name}
                            className="w-32 h-24 object-cover rounded-xl shadow"
                        />
                        <div>
                            <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {payment.booking.bookable.name}</p>
                            <p className="text-sm text-gray-700"><span className="font-medium">Price:</span> ₱{payment.booking.bookable.price}</p>
                            <p className="text-sm text-gray-700"><span className="font-medium">Month Count:</span> {payment.booking.month_count}</p>
                            <p className="text-sm text-gray-700"><span className="font-medium">Start Date:</span> {payment.booking.start_date}</p>
                            <p className="text-sm text-gray-700"><span className="font-medium">Status:</span> {payment.booking.status}</p>
                        </div>
                    </div>
                </section>

                {/* User Payment Section */}
                <section className="bg-white shadow rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-700"><span className="font-medium">Amount:</span> ₱{payment.amount}</p>
                        <p className="text-sm text-gray-700"><span className="font-medium">Method:</span> {payment.payment_method}</p>
                        <p className="text-sm text-gray-700"><span className="font-medium">Status:</span> {payment.status}</p>
                        <p className="text-sm text-gray-700"><span className="font-medium">Paid At:</span> {new Date(payment.paid_at).toDateString()}</p>
                        <p className="text-sm text-gray-700"><span className="font-medium">Reference Number:</span> {payment.user_ref_number || '-'}</p>
                        <p className="text-sm text-gray-700"><span className="font-medium">Remarks:</span> {payment.user_remarks || '-'}</p>
                    </div>

                    {payment.user_receipt && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-800 mb-2">User Receipt:</p>
                            <ReceiptImage
                                src={`/storage/${payment.user_receipt}`}
                                alt="User Receipt"
                            />
                        </div>
                    )}

                </section>

                {/* Tenant/User Section */}
                <section className="bg-white shadow rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Tenant Information</h2>
                    <div className="flex items-center space-x-4">
                        <img
                            src={`/storage/${payment.booking.user.avatar}`}
                            alt={payment.booking.user.name}
                            className="w-20 h-20 object-cover rounded-full shadow"
                        />
                        <div>
                            <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {payment.booking.user.name}</p>
                            <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {payment.booking.user.email}</p>
                            <p className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {payment.booking.user.phone}</p>
                        </div>
                    </div>
                </section>
                {payment.booking.status === 'paid' && (
                    <section className="mt-6 flex justify-center">
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl shadow 
                       hover:bg-indigo-700 hover:shadow-md 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 
                       active:scale-95 transition duration-150 ease-in-out"
                        >
                            Confirm Payment
                        </button>
                    </section>
                )}

            </div>

            {/* Confirm Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">
                        Confirm Payment
                    </h2>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Upload your payment proof and provide the reference number for verification.
                    </p>

                    {/* Receipt Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Receipt
                        </label>

                        <div
                            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer 
                   hover:border-indigo-400 hover:bg-indigo-50 transition"
                            onClick={() => document.getElementById("receiptInput").click()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-400 mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0h2a2 2 0 012 2v10a2 2 0 01-2 2h-6l-2 2-2-2H7" />
                            </svg>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-indigo-600">Click to upload</span> or drag & drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </div>

                        <input
                            id="receiptInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {errors.receipt && (
                            <p className="text-sm text-red-600 mt-2">{errors.receipt}</p>
                        )}

                        {preview && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={preview}
                                    alt="Receipt Preview"
                                    className="max-h-64 rounded-xl shadow-lg border"
                                />
                            </div>
                        )}
                    </div>


                    {/* Reference Number */}
                    <div className="mb-4 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reference Number
                        </label>
                        <input
                            type="text"
                            value={data.ref_number}
                            onChange={(e) => setData("ref_number", e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            placeholder="Enter your payment reference number"
                        />
                        {errors.ref_number && (
                            <p className="text-sm text-red-600 mt-1">{errors.ref_number}</p>
                        )}
                    </div>

                    {/* Remarks */}
                    <div className="mb-6 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Remarks (optional)
                        </label>
                        <textarea
                            value={data.remarks}
                            onChange={(e) => setData("remarks", e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            rows="3"
                            placeholder="Add remarks if necessary"
                        ></textarea>
                        {errors.remarks && (
                            <p className="text-sm text-red-600 mt-1">{errors.remarks}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                        <SecondaryButton onClick={() => setShowModal(false)}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Submitting..." : "Submit Payment"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </SellerLayout>
    );
}
