import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBed, faBuilding, faDoorClosed, faPhone, faClock, faMoneyBill, faHandshake } from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import axios from 'axios';

export default function Request({ request }) {
    const [showModal, setShowModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const handleConfirm = async () => {
        // Add your confirmation logic here
        try{
            const response = await axios.post(`/guest/request/${request.id}`);
            if(response.status === 200){
                setShowModal(false);
                setSuccessModal(true);
            }
        }
        catch(error){
            console.log(error);
        }
    };

    return (
        <Layout>
            <Head title="Requests" />
            <div className="p-8 space-y-8 bg-gray-100 min-h-screen">

                <div className="flex flex-col items-center">
                    <img
                        src={`/storage/${request.user.image}`}
                        alt={request.user.name}
                        className="w-24 h-24 object-cover rounded-full border-4 border-blue-300 shadow-lg"
                    />
                    <h2 className="text-3xl font-bold mt-4 text-gray-800">{request.user.name}</h2>
                </div>

                <div className="space-y-4 text-lg bg-white p-6 rounded-lg shadow-md">
                    <p><FontAwesomeIcon icon={faEnvelope} className="text-blue-500" /> <strong>{request.email}</strong></p>
                    <p><FontAwesomeIcon icon={faPhone} className="text-blue-500" /> <strong>{request.phone}</strong></p>
                    <p>
                        <FontAwesomeIcon icon={faClock} className="text-blue-500" />
                        <strong>
                            {new Date(request.start_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </strong>
                    </p>
                    <p><FontAwesomeIcon icon={faMoneyBill} className="text-blue-500" /> <strong>₱{request.total_price.toLocaleString()}</strong></p>
                    <p><FontAwesomeIcon icon={faHandshake} className="text-blue-500" /> <strong>{request.status}</strong></p>
                    <p><strong>Month Count:</strong> {request.month_count}</p>
                    <p><strong>Payment Method:</strong> {request.payment_method == 1 ? 'Cash' : 'G-Cash'}</p>
                </div>

                <div className="border-t pt-4 space-y-4">
                    <img
                        src={`/storage/${request.bed.image}`}
                        alt={request.bed.name}
                        className="w-20 h-20 object-cover rounded-lg border shadow-md"
                    />
                    <p className="text-lg font-semibold text-gray-700 flex items-center"> <FontAwesomeIcon icon={faBed} className="mr-2"/> {request.bed.name}</p>
                    <p className="text-lg font-semibold text-gray-700 flex items-center"> <FontAwesomeIcon icon={faDoorClosed} className="mr-2"/> {request.bed.room.name}</p>
                    <p className="text-lg font-semibold text-gray-700 flex items-center"> <FontAwesomeIcon icon={faBuilding} className="mr-2"/> {request.bed.room.building.name}</p>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Confirm Request
                    </button>
                </div>

                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold mb-4">Confirm Your Request</h2>
                        <p className="text-lg text-gray-600 mb-6">Are you sure you want to confirm this request?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal show={successModal} onClose={() => setSuccessModal(false)}>
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold mb-4">Request Confirmed</h2>
                        <p className="text-lg text-gray-600 mb-6">Your request has been confirmed successfully.</p>
                        <div className="flex justify-center">
                            <Link
                              href={route('seller.guest.request.index')}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Done!
                            </Link>
                        </div>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}
