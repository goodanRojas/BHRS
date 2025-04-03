import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBuilding, faDoorClosed, faMoneyBill, faClock } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard({ details }) {
    const queryParams = new URLSearchParams(window.location.search);
    const initialId = Number(queryParams.get('bedId')) || null; // Initialize from URL or null
    const [selectedId, setSelectedId] = useState(initialId); // State to control the highlight

    const calculateExpirationDate = (startDate, monthCount) => {
        const start = new Date(startDate);
        start.setMonth(start.getMonth() + monthCount);
        return start.toLocaleDateString();
    };

    // Clear highlight by setting state to null
    const handleRemoveHighlight = (id) => {
        setSelectedId(selectedId === id ? null : id);
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('bedId');
        window.history.pushState({}, '', newUrl);
    };

    return (
        <Layout>
            <Head title="Accommodation Dashboard" />
            <div className="p-4 md:p-8 space-y-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-center">Accommodation Dashboard</h1>

                {details.length > 0 ? (
                    details.map((detail) => (
                        <div
                            key={detail.id}
                            onClick={() => handleRemoveHighlight(detail.id)}
                            className={`p-4 border rounded-lg mb-4 cursor-pointer ${selectedId === detail.id ? 'border-blue-500 bg-blue-100' : ''
                                }`}
                        >
                            <div className="sm:flex sm:flex-wrap sm:gap-4 sm:items-start md:items-center">
                                <img
                                    src={`/storage/${detail.bed.image}`}
                                    alt={detail.bed.name}
                                    className="h-24 w-24 rounded-lg object-cover"
                                />
                                <Link href={`/accommodations/${detail.id}`}>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                            <Link href={`/beds/${detail.bed.id}`} className="flex-1">
                                                <h2 className="text-2xl nowrap font-semibold">{detail.bed.name}</h2>
                                            </Link>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <p className="text-gray-500 flex items-center">
                                                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                                                    {new Intl.DateTimeFormat('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }).format(new Date(detail.start_date))}
                                                </p>
                                                <span className="hidden sm:block">-</span>
                                                <p className="text-gray-500 flex items-center">
                                                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                                                    {new Intl.DateTimeFormat('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }).format(new Date(calculateExpirationDate(detail.start_date, detail.month_count)))}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <p className="text-gray-500 flex items-center">
                                                <FontAwesomeIcon icon={faDoorClosed} className="mr-2" />
                                                Room: {detail.bed.room.name}
                                            </p>
                                            <p className="text-gray-500 flex items-center">
                                                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                                Building: {detail.bed.room.building.name}
                                            </p>
                                            <p className="text-gray-500 flex items-center">
                                                <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                                                Total Price: ₱{detail.total_price}
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No accommodation details available.</p>
                )}
            </div>
        </Layout>
    );
}
