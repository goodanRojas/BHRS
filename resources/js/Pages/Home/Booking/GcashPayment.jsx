import React, { useState, useRef } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear, faMobileScreen, faQrcode, faUser } from '@fortawesome/free-solid-svg-icons';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
const GCashPaymentPage = ({ amount, booking, paymentInfo }) => {
  console.log(booking);
  const [preview, setPreview] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const fileInputRef = useRef(null);

  const { data, setData, post, processing, errors } = useForm({
    payment_proof: null,
    remarks: '',
    ref_number: '',
    booking_id: booking.id,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmModal(true); // open modal instead of posting directly
  };
  const handleConfirmSubmit = () => {
    setConfirmModal(false);
    post(`/bed/book/gcash/confirm`, data, {
      onSuccess: () => setSuccessModal(true),
      onError: (error) => console.error(error),
    });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setData('payment_proof', file);
    }
  }
  return (
    <AuthenticatedLayout>
      <Head title="GCash Payment" />

      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full text-center"
        >
          {/* Sad Icon */}
          <FontAwesomeIcon icon={faFaceSadTear} className="text-blue-400 text-5xl mb-4" />

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">GCash Payment</h1>
          <p className="text-gray-600 mb-6">
            Sorry, we don’t have instant GCash integration yet.
            Please send your payment manually using the details below.
          </p>

          {/* Owner Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 bg-blue-50 py-2 px-4 rounded-lg mb-3"
          >
            <FontAwesomeIcon icon={faUser} className="text-blue-500" />
            <span className="font-semibold text-gray-800">{paymentInfo.gcash_name}</span>
          </motion.div>

          {/* GCash Number */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 bg-blue-50 py-2 px-4 rounded-lg mb-4"
          >
            <FontAwesomeIcon icon={faMobileScreen} className="text-green-500" />
            <span className="font-semibold text-gray-800">{paymentInfo.gcash_number}</span>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <FontAwesomeIcon icon={faQrcode} className="text-gray-500 mb-2 text-xl" />
            <img
              src={`/storage/qrcodes/${paymentInfo.qr_code}`}
              alt="GCash QR Code"
              className="mx-auto w-48 h-48 object-cover border rounded-lg shadow-md"
            />
          </motion.div>

          {/* Amount Notice */}
          <p className="text-lg font-semibold text-gray-700 mb-6">
            Amount to Pay: <span className="text-blue-600">₱{amount}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <PrimaryButton type="button" onClick={() => fileInputRef.current.click()}>
                Upload Payment Proof
              </PrimaryButton>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {preview && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Payment Proof Preview"
                    className="rounded-lg border max-w-xs"
                  />
                </div>
              )}
              <textarea
                className={`w-full h-24 p-3 border rounded-lg ${errors.remarks ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Remarks (optional)"
                value={data.remarks}
                onChange={(e) => setData('remarks', e.target.value)}
                disabled={processing}
              />
              {errors.remarks && (
                <p className="text-sm text-red-500 mt-1">{errors.remarks}</p>
              )}

              <input
                className={`w-full p-3 border rounded-lg ${errors.ref_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Reference Number (optional)"
                value={data.ref_number}
                onChange={(e) => setData('ref_number', e.target.value)}
                disabled={processing}
                type="number"
              />
              {errors.ref_number && (
                <p className="text-sm text-red-500 mt-1">{errors.ref_number}</p>
              )}


            </div>
            <PrimaryButton type="submit" disabled={processing} className="w-full">
              {processing ? 'Processing...' : 'Confirm Payment'}
            </PrimaryButton>
            {errors.payment_proof && (
              <div className="text-red-500 text-sm mt-2">
                {errors.payment_proof}
              </div>
            )}
          </form>

        </motion.div>
      </div>


      {/* Confirm Modal */}
      <Modal show={confirmModal} onClose={() => setConfirmModal(false)}>
        <div className="p-6 text-center">
          <h2 className="text-lg font-bold mb-4">Confirm Payment</h2>
          <p className="mb-6">Make sure you upload the right payment proof. Otherwise, you will not be able to process your booking.</p>

          <div className="flex justify-center gap-4">
            <PrimaryButton onClick={handleConfirmSubmit} disabled={processing}>
              {processing ? 'Processing...' : 'Yes, Submit'}
            </PrimaryButton>
            <PrimaryButton type="button" onClick={() => setConfirmModal(false)}>
              Cancel
            </PrimaryButton>
          </div>
        </div>
      </Modal>

    </AuthenticatedLayout>
  );
};

export default GCashPaymentPage;
