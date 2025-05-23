import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBuilding, faMoneyBill, faClock } from '@fortawesome/free-solid-svg-icons';

export default function Cancelled({ beds, rooms }) {
    const user = usePage().props.auth.user;
    console.log(beds); // Ensure you have the correct data

    return (
        <Layout>
            <Head title="Accommodation Dashboard" />
            <div className="p-4 md:p-8 space-y-8 min-h-screen">
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    {/* Table for Beds */}
                    {beds.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Beds</h2>
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Image</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Address</th>
                                        <th className="px-4 py-2 text-left">Total Price</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Month Count</th>
                                        <th className="px-4 py-2 text-left">Start Date</th>
                                        <th className="px-4 py-2 text-left">End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {beds.map((bed) => (
                                        <tr key={bed.id} className="border-b">
                                            <td className="px-4 py-2">
                                                <img src={`/storage/bed/${bed.image}`} alt={bed.name} className="w-16 h-16 object-cover" />
                                            </td>
                                            <td className="px-4 py-2">{bed.name}</td>
                                            <td className="px-4 py-2">
                                                {bed.room?.building?.address?.street ?? 'No Address'}
                                            </td>
                                            <td className="px-4 py-2">₱{bed.bookings[0]?.total_price.toFixed(2)}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-sm ${bed.bookings[0]?.status === 'approved' ? 'bg-green-200 text-green-600' : 'bg-yellow-200 text-yellow-600'}`}>
                                                    {bed.bookings[0]?.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">{bed.bookings[0]?.start_date}</td>
                                            <td className="px-4 py-2">{bed.bookings[0]?.end_date}</td>
                                            <td className="px-4 py-2">
                                                {bed.bookings[0]?.start_date && bed.bookings[0]?.end_date
                                                    ? Math.ceil((new Date(bed.bookings[0]?.end_date) - new Date(bed.bookings[0]?.start_date)) / (1000 * 3600 * 24)) + " days"
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Table for Rooms */}
                    {rooms.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">Rooms</h2>
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Image</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Address</th>
                                        <th className="px-4 py-2 text-left">Total Price</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Month Count</th>
                                        <th className="px-4 py-2 text-left">Start Date</th>
                                        <th className="px-4 py-2 text-left">End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <tr key={room.id} className="border-b">
                                            <td className="px-4 py-2">
                                                <img src={`/storage/room/${room.image}`} alt={room.name} className="w-16 h-16 object-cover rounded-lg" />
                                            </td>
                                            <td className="px-4 py-2">{room.name}</td>
                                            <td className="px-4 py-2">
                                                {room.building?.address?.street ?? 'No Address'}
                                            </td>
                                            <td className="px-4 py-2">₱{room.bookings[0]?.total_price.toFixed(2)}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-sm ${room.bookings[0]?.status === 'approved' ? 'bg-green-200 text-green-600' : 'bg-yellow-200 text-yellow-600'}`}>
                                                    {room.bookings[0]?.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">{room.bookings[0]?.start_date}</td>
                                            <td className="px-4 py-2">{room.bookings[0]?.end_date}</td>
                                            <td className="px-4 py-2">
                                                {room.bookings[0]?.start_date && room.bookings[0]?.end_date
                                                    ? Math.ceil((new Date(room.bookings[0]?.end_date) - new Date(room.bookings[0]?.start_date)) / (1000 * 3600 * 24)) + " days"
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>)}
                </div>

                {(beds.length <= 0 && rooms.length <= 0) && (
                    <div className="flex justify-center mt-6">
                        <Link href="/home" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                            Browse to find your stay.
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}
