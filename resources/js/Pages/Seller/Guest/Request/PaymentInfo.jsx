import SellerLayout from "@/Layouts/SellerLayout";
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputField from "@/Components/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export default function PaymentInfo({ paymentInfo }) {
    console.log('Payment Info:', paymentInfo); // Log the paymentInfo prop to check its structure
    const { data, setData, post, processing, errors } = useForm({
        gcash_number: paymentInfo?.gcash_number || '',
        qr_code: paymentInfo?.qr_code || '', // Keep qr_code value from backend
    });

    const [filePreview, setFilePreview] = useState(null); // State for file preview

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('gcash_number', data.gcash_number);

        // Only append qr_code if there's a new file (use filePreview)
        if (filePreview) {
            form.append('qr_code', filePreview);
        } else if (data.qr_code) {
            // If no new file, append the existing qr_code value
            form.append('qr_code', data.qr_code);
        }

        // Post the form data
        post(`/seller/request/info/update`, form, {
            onSuccess: () => {
                setSuccessModal(true); // Success modal or any other action on success
            },
            onError: (error) => {
                console.error(error); // Handle error case
            },
        });
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setData(name, value);

        // Handle file input specifically for image previews
        if (type === 'file') {
            const file = e.target.files[0];
            setData(name, file); // Store file data
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl); // Set file preview URL
        }
    };

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Payment Info</h1>
            <div className="bg-white w-full max-w-xl mx-auto shadow-lg rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-group">
                        <InputField
                            label="Gcash Number"
                            name="gcash_number"
                            value={data.gcash_number}
                            type="tel"
                            inputMode="numeric"  // Suggest numeric keyboard
                            pattern="\d*"        // Restrict input to numbers
                            onChange={handleChange}  // Handle filtering
                            required
                            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="form-group flex items-center space-x-4">
                        <div>
                            <label htmlFor="qr_code" className="block text-sm font-medium text-gray-700">
                                QR Code
                            </label>
                            {/* Display the existing QR code or a default image */}
                            <div className="mt-4">
                                <img
                                    src={filePreview || (data.qr_code ? `/storage/qrcodes/${data.qr_code}` : '/storage/qrcodes/default-qr-code.webp')}
                                    alt="QR Code"
                                    className="w-48 h-48 object-cover rounded-md border border-gray-300"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            {/* Edit Button for File Input */}
                            <label
                                htmlFor="file-input"
                                className="cursor-pointer text-blue-500 text-lg"
                            >
                                <FontAwesomeIcon className="text-blue-500" icon={faEdit} />
                            </label>
                            <input
                                id="file-input"
                                name="qr_code"
                                type="file"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
