import { Head, usePage } from "@inertiajs/react";
import { use, useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "../AuthenticatedLayout";
import Table from "@/Components/Table";
import dayjs from "dayjs";
import {motion} from "framer-motion";
import { Building2, DoorOpen, BedDouble, BookCheck } from "lucide-react";
import AddBooking from "./AddBooking";
import UserInfo from "./UserInfo";
import Breadcrumbs from "@/Components/Breadcrumbs";

export default function User({ user }) {
    const admin = usePage().props.auth.user;
    const [buildings, setBuildings] = useState([]); // list of all buildings
    const [prevBookings, setPrevBookings] = useState([]); // list of previous bookings
    const [selectedBuilding, setSelectedBuilding] = useState(
        sessionStorage.getItem("selectedBuilding") || null
    );
    const [selectedRoom, setSelectedRoom] = useState(
        sessionStorage.getItem("selectedRoom") || null
    );
    const [selectedBed, setSelectedBed] = useState(
        sessionStorage.getItem("selectedBed") || null
    );
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        axios.get(`/admin/users/buildings`).then((response) => {
            setBuildings(response.data);
        });
    }, [admin?.id]);

    useEffect(() => {
        if (!selectedBed) return;
        axios.get(`/admin/users/${user.id}/${selectedBed}/bookings`).then((response) => {
            setPrevBookings(response.data);
            console.log(response.data);
        });
    }, [selectedBed]);

    useEffect(() => {
        if (selectedBuilding) {
            sessionStorage.setItem("selectedBuilding", selectedBuilding);
        }
        if (selectedRoom) {
            sessionStorage.setItem("selectedRoom", selectedRoom);
        }
        if (selectedBed) {
            sessionStorage.setItem("selectedBed", selectedBed);
        }
    }, [selectedBuilding, selectedRoom, selectedBed]);


    return (
        <AuthenticatedLayout>
            <Head title={user.name} />
            <Breadcrumbs 
                links={[
                    { label: 'Users', url: '/admin/users' },
                    { label: `${user.name}` },
                ]}
            />
            <div className="max-w-2xl mx-auto space-y-6 p-6">
                <UserInfo user={user} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 bg-white shadow-lg rounded-2xl p-6"
                >
                    <motion.h2
                    
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-bold text-gray-800 flex items-center gap-2"
                    ><BookCheck className="text-indigo-500"/> Previous Bookings</motion.h2>
                    {/* Building dropdown */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-2"
                    >
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Building2 className="w-4 h-4 text-indigo-500" />
                            Select Building
                        </label>
                        <select
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={selectedBuilding || ""}
                            onChange={(e) => {
                                setSelectedBuilding(e.target.value);
                                setSelectedRoom(null);
                                setSelectedBed(null);
                            }}
                        >
                            <option value="">-- Select Building --</option>
                            {buildings.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>

                    {/* Room dropdown */}
                    {selectedBuilding && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col gap-2"
                        >
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <DoorOpen className="w-4 h-4 text-indigo-500" />
                                Select Room
                            </label>
                            <select
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={selectedRoom || ""}
                                onChange={(e) => {
                                    setSelectedRoom(e.target.value);
                                    setSelectedBed(null);
                                }}
                            >
                                <option value="">-- Select Room --</option>
                                {buildings
                                    .find((b) => b.id == selectedBuilding)
                                    ?.rooms.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                            </select>
                        </motion.div>
                    )}

                    {/* Bed dropdown */}
                    {selectedRoom && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col gap-2"
                        >
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <BedDouble className="w-4 h-4 text-indigo-500" />
                                Select Bed
                            </label>
                            <select
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={selectedBed || ""}
                                onChange={(e) => setSelectedBed(e.target.value)}
                            >
                                <option value="">-- Select Bed --</option>
                                {buildings
                                    .find((b) => b.id == selectedBuilding)
                                    ?.rooms.find((r) => r.id == selectedRoom)
                                    ?.beds.map((bed) => (
                                        <option key={bed.id} value={bed.id}>
                                            {bed.name}
                                        </option>
                                    ))}
                            </select>
                        </motion.div>
                    )}
                </motion.div>
                {/* Rating + Comment */}
                {selectedBed && (
                    <div>
                        {/* If the user has previous bookings, show it in here. */}
                        {prevBookings && prevBookings.length > 0 && (
                            <div className="">
                                <Table
                                    legend={'Previous Bookings'}
                                    data={prevBookings.map((b) => ({
                                        start_date: dayjs(b.start_date).format("MMMM D, YYYY"),
                                        end_date: dayjs(b.start_date).add(b.month_count, 'month').format("MMMM D, YYYY"),
                                        rating: b.ratings_avg_stars || "-",
                                        comment: b.comments?.map(c => c.body).join(', ') || "-"
                                    }))}
                                    columns={[
                                        { key: 'start_date', label: 'Start Date' },
                                        { key: 'end_date', label: 'End Date' },
                                        { key: 'rating', label: 'Rating' },
                                        { key: 'comment', label: 'Comment' },
                                    ]}
                                />

                            </div>
                        )}

                        {/* Function for creating a booking, rating and comment for previous user. */}

                        <AddBooking bedId={selectedBed} userId={user.id} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
