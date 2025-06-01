import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';

const GCashPaymentPage = ({ amount, bedId, gcashNumber, staticQrUrl }) => {
  const [paymentProof, setPaymentProof] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State to hold the image preview URL

  // Safely generate the payment link only if bedId is defined
  const safeBedId = bedId || 'NA';
  const paymentLink = `gcash://pay?recipient=${gcashNumber}&amount=${amount}&currency=PHP&reference=Booking${safeBedId}`;
  const fallbackUrl = 'https://www.gcash.com/';

  // Use Inertia's useForm for form handling
  const { data, setData, post, processing, errors } = useForm({
    paymentProof: null, // Start with no payment proof
    bedId: safeBedId,
  });

  // Handle opening the GCash app
  const openGCashApp = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = paymentLink;
      setTimeout(() => {
        window.location.href = fallbackUrl;
      }, 2000);
    } else {
      alert('To proceed with GCash payment, please use your mobile device.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPaymentProof(file);

    // Create a URL for the selected image and store it in state for preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setData('paymentProof', file); // Update Inertia form state
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('bed.book.confirm.gcash'), {
      onFinish: () => reset('paymentProof'),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="GCash Payment" />
      <div className="text-center p-6 max-w-md mx-auto border rounded-md">
        <h1 className="text-2xl font-bold mb-4">Complete Your GCash Payment</h1>
        <p className="mb-4 text-lg">Amount to Pay: ₱{amount}</p>

        <img src={staticQrUrl} alt="GCash QR Code" className="mx-auto mb-4 w-48 h-48" />

        <p className="mb-4">
          Scan this QR code in your GCash app and enter the amount manually.
        </p>

        <button
          onClick={openGCashApp}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition mb-6"
        >
          Open GCash App to Pay
        </button>

        <form onSubmit={submit} className="text-left">
          <h3 className="mb-2 font-semibold">Upload Payment Proof</h3>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="mb-4"
          />
          {errors.paymentProof && <p className="text-red-500">{errors.paymentProof}</p>}

          {/* Display the selected image if available */}
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Payment Proof Preview"
                className="mx-auto mb-4 w-48 h-48 object-cover"
              />
            </div>
          )}

          <PrimaryButton className="ms-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm" disabled={processing}>
            Finish
          </PrimaryButton>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          If you don't have the app, this will redirect you to the GCash website.
        </p>
      </div>
    </AuthenticatedLayout>
  );
};

export default GCashPaymentPage;
