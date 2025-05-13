import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBuilding, faDoorClosed, faMoneyBill, faClock } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard({ beds, rooms }) {
    const user = usePage().props.auth.user;
    console.log(user);
    // console.log(beds);
    // console.log(rooms);
    return (
        <Layout>
            <Head title="Accommodation Dashboard" />
            <div className="p-4 md:p-8 space-y-8 a min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {beds.map((bed) => (
                        <div key={bed.id} className="bg-white rounded-2xl shadow p-4 space-y-2">
                            <img src={bed.image} alt={bed.name} className="rounded-lg w-full h-48 object-cover" />

                            <h2 className="text-xl font-semibold">{bed.name}</h2>
                            <p className="text-gray-600 text-sm">{bed.description}</p>

                            <div className="text-sm text-gray-700">
                                <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-green-500" /> Price: ₱{bed.sale_price ?? bed.price}</p>
                                <p><FontAwesomeIcon icon={faBed} className="mr-1 text-yellow-500" /> Rating: {Number(bed.feedbacks_avg_rating).toFixed(1) ?? 'N/A'}</p>
                            </div>

                            {bed.bookings?.length > 0 && (
                                <div className="mt-2 border-t pt-2 text-sm text-gray-700">
                                    <p><FontAwesomeIcon icon={faClock} className="mr-1 text-blue-500" /> Stay: {bed.bookings[0].start_date} → {bed.bookings[0].end_date}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-purple-500" /> Paid by: {bed.bookings[0].payment?.payment_method}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-purple-500" /> Receipt: {bed.bookings[0].payment?.receipt}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-2xl shadow p-4 space-y-2">
                            <img src={'/storage/room/' + room.image} alt={room.name} className="rounded-lg w-full h-48 object-cover" />

                            <h2 className="text-xl font-semibold">{room.name}</h2>
                            <p className="text-gray-600 text-sm">{room.description}</p>

                            <div className="text-sm text-gray-700">
                                <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-green-500" /> Price: ₱{room.sale_price ?? room.price}</p>
                                <p><FontAwesomeIcon icon={faDoorClosed} className="mr-1 text-yellow-500" /> Rating: {Number(room.feedbacks_avg_rating).toFixed(1) ?? 'N/A'}</p>
                            </div>

                            {room.bookings?.length > 0 && (
                                <div className="mt-2 border-t pt-2 text-sm text-gray-700">
                                    <p><FontAwesomeIcon icon={faClock} className="mr-1 text-blue-500" /> Stay: {room.bookings[0].start_date} → {room.bookings[0].end_date}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-purple-500" /> Paid by: {room.bookings[0].payment?.payment_method}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBill} className="mr-1 text-purple-500" /> Receipt: {room.bookings[0].payment?.receipt}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {beds.length <= 0 && rooms.length <= 0 && (
                    <div className="flex justify-center">
                        <Link href="/home" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">Browse to find your stay.</Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}
