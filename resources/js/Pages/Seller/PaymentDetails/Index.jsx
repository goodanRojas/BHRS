import SellerLayout from '@/Layouts/SellerLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function PaymentDetails({ paymentInfo }) {
    const { data, setData, post, processing, errors } = useForm({
        gcash_name: paymentInfo?.gcash_name || '',
        gcash_number: paymentInfo?.gcash_number || '',
        gcash_qr: null,
    });

    const [preview, setPreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.payment-details.save'), {
            forceFormData: true,
        });
    };

    return (
        <SellerLayout>
            <Head title="Payment Details" />

            <div className="p-4 max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Payment Details
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Add or update your GCash payment information below.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Number side-by-side on desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* GCash Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    GCash Name
                                </label>
                                <input
                                    type="text"
                                    value={data.gcash_name}
                                    onChange={(e) => setData('gcash_name', e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 text-gray-900"
                                    placeholder="Juan Dela Cruz"
                                />
                                {errors.gcash_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gcash_name}</p>
                                )}
                            </div>

                            {/* GCash Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    GCash Number
                                </label>
                                <input
                                    type="text"
                                    value={data.gcash_number}
                                    onChange={(e) => setData('gcash_number', e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 text-gray-900"
                                    placeholder="09XXXXXXXXX"
                                />
                                {errors.gcash_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gcash_number}</p>
                                )}
                            </div>
                        </div>

                        {/* QR Code Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                GCash QR Code
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setData('gcash_qr', file);
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:ring-blue-500"
                            />

                            {/* QR Preview */}
                            <div className="mt-4">
                                {(preview || paymentInfo?.gcash_qr) && (
                                    <img
                                        src={preview || `/storage/${paymentInfo?.gcash_qr}`}
                                        alt="GCash QR Preview"
                                        className="w-40 h-40 object-cover border rounded-lg shadow-sm mx-auto md:mx-0"
                                    />
                                )}
                            </div>

                            {errors.gcash_qr && (
                                <p className="text-red-500 text-sm mt-1">{errors.gcash_qr}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition"
                            >
                                {processing ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}
