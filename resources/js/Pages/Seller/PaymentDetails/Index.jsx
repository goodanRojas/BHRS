import SellerLayout from '@/Layouts/SellerLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, QrCode } from 'lucide-react';
import DropZone from '@/Components/DropZone';
import Toast from '@/Components/Toast';

export default function PaymentDetails({ paymentInfo }) {
    const { data, setData, post, processing, errors } = useForm({
        gcash_name: paymentInfo?.gcash_name || '',
        gcash_number: paymentInfo?.gcash_number || '',
        qr_code: null,
    });
    const { flash } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('seller.payment-details.save'), {
            forceFormData: true,
        });
    };

    const [toast, setToast] = useState({ message: '', show: false, type: 'success', id: null });

    useEffect(() => {
        if (flash.success) {
            setToast({
                message: flash.success,
                show: true,
                type: "success",
                id: Date.now(), // 👈 force uniqueness
            });
        }
        if (flash.error) {
            setToast({
                message: flash.error,
                show: true,
                type: "error",
                id: Date.now(),
            });
        }
    }, [flash]);



    return (
        <SellerLayout>
            <Head title="Payment Details" />
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} id={toast.id} />

            <div className="p-4 max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Payment Details
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Manage your GCash information that customers will use for payments.
                    </p>

                    {/* Current Info Card */}
                    {paymentInfo?.gcash_name || paymentInfo?.gcash_number || paymentInfo?.qr_code ? (
                        <div className="mb-8 border rounded-xl p-6 bg-gray-50 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Current GCash Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">GCash Name</p>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-gray-400" />
                                        {paymentInfo?.gcash_name || '—'}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-4">GCash Number</p>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-gray-400" />
                                        {paymentInfo?.gcash_number || '—'}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center md:items-end">
                                    {paymentInfo?.qr_code && (
                                        <>
                                            <p className="text-sm text-gray-500 mb-2">Saved QR Code</p>
                                            <img
                                                src={`/storage/${paymentInfo.qr_code}`}
                                                alt="Saved GCash QR"
                                                className="w-40 h-40 object-cover border rounded-lg shadow-md"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 text-gray-500 italic">
                            No payment details saved yet.
                        </div>
                    )}

                    {/* Update Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Update Payment Details
                        </h2>

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

                        {/* QR Upload */}
                        <div className="space-y-2">
                            <DropZone
                                value={paymentInfo?.qr_code}
                                onChange={(file) => setData("qr_code", file)}
                                error={errors.qr_code}
                                label="Upload GCash QR Code"
                            />
                        </div>


                        {/* Submit */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}
