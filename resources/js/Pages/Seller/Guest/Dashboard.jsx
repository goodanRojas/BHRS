import { Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBed, faBuilding, faDoorClosed, faPhone, faClock, faMoneyBill, faHandshake, faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';

export default function Dashboard({ guests }) {
    const calculateExpirationDate = (startDate, monthCount) => {
        const start = new Date(startDate);
        start.setMonth(start.getMonth() + monthCount);
        return start.toLocaleDateString();
    };

    return (
        <Layout>
            <Head title="Current Guests" />
            <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Current Guests</h1>
                {guests.length > 0 ? (
                    guests.map((guest, index) => (
                        <div key={index} className="mb-6 border-b pb-4 bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src={`/storage/${guest.user.image}`}
                                    alt={guest.user.name}
                                    className="h-20 w-20 rounded-full mr-4"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">{guest.user.name}</h2>
                                    <p className="text-sm text-gray-500">{guest.user.email}</p>
                                    <p className="text-sm text-gray-500"><FontAwesomeIcon icon={faPhone} /> {guest.phone}</p>
                                    <p className="text-sm text-gray-500"><FontAwesomeIcon icon={faClock} /> Start Date: {new Date(guest.start_date).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500"><FontAwesomeIcon icon={faCalendarTimes} /> Expiration Date: {calculateExpirationDate(guest.start_date, guest.month_count)}</p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-gray-700 flex items-center"> <FontAwesomeIcon icon={faBed} className="mr-2"/> Bed: {guest.bed.name}</p>
                            <p className="text-lg font-semibold text-gray-700 flex items-center"> <FontAwesomeIcon icon={faDoorClosed} className="mr-2"/> Room: {guest.bed.room.name}</p>
                            <p className="text-lg font-semibold text-gray-700 flex items-center"> <FontAwesomeIcon icon={faBuilding} className="mr-2"/> Building: {guest.bed.room.building.name}</p>
                            <p className="text-lg font-semibold text-gray-700 flex items-center"> <FontAwesomeIcon icon={faMoneyBill} className="mr-2"/> Total Price: ₱{guest.total_price}</p>
                            <p className="text-lg font-semibold text-gray-700 flex items-center"> <FontAwesomeIcon icon={faHandshake} className="mr-2"/> Status: {guest.status}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No guests available.</p>
                )}
            </div>
        </Layout>
    );
}
