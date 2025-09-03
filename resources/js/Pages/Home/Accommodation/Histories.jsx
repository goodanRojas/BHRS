import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBuilding, faDoorClosed, faMoneyBill, faClock, faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { motion } from "framer-motion";
import Rate from "./Rate";

export default function Histories({ bookings }) {

    const openHistory = (id) => {
        window.location.href = `/feedback/bookings/${id}`;
    };
    return (
        <Layout>
            <Head title="History" />

            {/* Page Title */}
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                History
            </h1>

            {/* Table Container */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                            <th className="p-4">Bed</th>
                            <th className="p-4">Room</th>
                            <th className="p-4">Building</th>
                            <th className="p-4">Owner</th>
                            <th className="p-4">Month Count</th>
                            <th className="p-4">Start Date</th>
                            <th className="p-4">End Date</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                        {bookings.map((booking, index) => {
                            const bed = booking.bookable;
                            const room = bed?.room;
                            const building = room?.building;
                            const seller = building?.seller;

                            return (
                                <motion.tr
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{
                                        scale: 1.01,
                                        backgroundColor: "#f9fafb",
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openHistory(booking.id)
                                    }}
                                    className="transition hover:cursor-pointer"
                                >
                                    {/* Bed */}
                                    <td className="p-4">

                                        <div>
                                            <p className="font-semibold truncate text-gray-800">
                                                {bed?.name ?? "N/A"}
                                            </p>
                                            {bed?.ratings ? (
                                                <p className="text-xs text-gray-500">
                                                    ⭐ {bed.ratings} (
                                                    {bed.people_rated ?? 0} reviews)
                                                </p>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </td>

                                    {/* Room */}
                                    <td className="p-4">

                                        <span className="font-medium truncate text-gray-700">
                                            {room?.name ?? "N/A"}
                                        </span>
                                    </td>

                                    {/* Building */}
                                    <td className="p-4">

                                        <span className="font-medium truncate text-gray-700">
                                            {building?.name ?? "N/A"}
                                        </span>
                                    </td>

                                    {/* Owner */}
                                    <td className="p-4">

                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {seller?.name ?? "N/A"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {seller?.email}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {seller?.phone}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        {booking.month_count}
                                    </td>
                                    <td className="p-4 truncate text-gray-600">
                                        {new Date(booking.start_date).toLocaleString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                            }
                                        )}
                                    </td>
                                    <td className="p-4 truncate text-gray-600">
                                        {new Date(booking.updated_at).toLocaleString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                            }
                                        )}
                                    </td>

                                    {/* Price */}
                                    <td className="p-4 font-semibold text-indigo-600">
                                        ₱
                                        {booking.total_price?.toFixed(2) ?? "0.00"}
                                    </td>

                                    {/* Action */}
                                    <td className="p-4 text-center">
                                        <Link
                                            href={`/home/bed/${booking.bookable.id}`}
                                            className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-full shadow hover:bg-indigo-700 transition"
                                        >
                                            Book
                                        </Link>
                                    </td>

                                </motion.tr>
                            );
                        })}

                    </tbody>
                </table>
            </div>

            {/* Empty State Action */}
            {bookings.length <= 0 && (
                <div className="flex justify-center">
                    <Link
                        href="/buildings/home"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
                    >
                        Browse to find your stay
                    </Link>
                </div>
            )}



        </Layout>
    );
}
