import { Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';
import { Link } from '@inertiajs/react';

export default function Request({ requests }) {
    return (
        <Layout>
            <Head title="Requests" />
            <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
                <h1 className="text-xl font-bold text-center text-blue-700">Requests</h1>

                {requests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((request, index) => (
                            <div
                                key={index}
                                className="border bg-white p-4 rounded-lg shadow-lg space-y-4 hover:scale-105 transition-transform duration-300 ease-in-out"
                            >
                                <Link href={`/guest/request/${request.id}`}>
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={`/storage/${request.user.image}`}
                                            alt={request.user.name}
                                            className="w-16 h-16 object-cover rounded-full border-2 border-blue-300"
                                        />
                                        <h2 className="text-lg font-semibold mt-3">{request.user.name}</h2>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <p><FontAwesomeIcon icon={faEnvelope} className="text-blue-500" /> <strong>{request.email}</strong></p>
                                        <p><FontAwesomeIcon icon={faPhone} className="text-blue-500" /> <strong>{request.phone}</strong></p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm font-medium text-gray-500">No requests available.</p>
                )}
            </div>
        </Layout>
    );
}
