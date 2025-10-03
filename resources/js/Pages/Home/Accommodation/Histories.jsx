import { Head, Link } from '@inertiajs/react';
import Layout from './Layout';
import { motion } from "framer-motion";
import Table from '@/Components/Table';
export default function Histories({ bookings }) {
    const openHistory = (id) => { window.location.href = `/feedback/bookings/${id}`; };
    const columns = [
        { label: "Bed", key: "bed" },
        { label: "Room", key: "room" },
        { label: "Building", key: "building" },
        { label: "Owner", key: "owner" },
        { label: "Month Count", key: "month_count" },
        { label: "Start Date", key: "start_date" },
        { label: "End Date", key: "end_date" },
        { label: "Price", key: "price" },
        { label: "Action", key: "action" },
    ];
    const data = bookings.map((booking) => {
        const bed = booking.bookable;
        const room = bed?.room;
        const building = room?.building;
        const seller = building?.seller;

        return {
            __id: booking.id,
            bed: (
                <div>
                    <p className="font-semibold truncate text-gray-800">{bed?.name ?? "N/A"}</p>
                    {bed?.ratings && (
                        <p className="text-xs text-gray-500">
                            ⭐ {bed.ratings} ({bed.people_rated ?? 0} reviews)
                        </p>
                    )}
                </div>
            ),
            room: <span className="font-medium">{room?.name ?? "N/A"}</span>,
            building: <span className="font-medium">{building?.name ?? "N/A"}</span>,
            owner: (
                <div>
                    <p className="font-semibold text-gray-800">{seller?.name ?? "N/A"}</p>
                    <p className="text-xs text-gray-500">{seller?.email}</p>
                    <p className="text-xs text-gray-500">{seller?.phone}</p>
                </div>
            ),
            month_count: booking.month_count,
            start_date: new Date(booking.start_date).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
            }),
            end_date: new Date(booking.updated_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
            }),
            price: (
                <span className="font-semibold text-indigo-600">
                    ₱{booking.total_price?.toFixed(2) ?? "0.00"}
                </span>
            ),
            action: (
                <Link
                    href={`/home/bed/${booking.bookable.id}`}
                    className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-full shadow hover:bg-indigo-700 transition"
                >
                    Book
                </Link>
            ),
        };
    });

    return (
        <Layout>
            <Head title="History" />

            <Table
                legend="Bookings"
                columns={columns}
                data={data}
                footer={`Total Bookings: ${bookings.length}`}
                onRowClick={openHistory}
            />

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
