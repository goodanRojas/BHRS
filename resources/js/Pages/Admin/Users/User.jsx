import { Head, usePage, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "../AuthenticatedLayout";
import Table from "@/Components/Table";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Building2, DoorOpen, Mail, Lock, Phone, BedDouble, BookCheck, EllipsisVertical, Pencil } from "lucide-react";
import AddBooking from "./AddBooking";
import UserInfo from "./UserInfo";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Modal from "@/Components/Modal";
import Dropdown from "@/Components/Dropdown";

export default function User({ user }) {
    const admin = usePage().props.auth.user;
    const [buildings, setBuildings] = useState([]); // list of all buildings
    const [prevBookings, setPrevBookings] = useState([]); // list of previous bookings
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(
        sessionStorage.getItem("selectedBuilding") || null
    );

    const [selectedRoom, setSelectedRoom] = useState(
        sessionStorage.getItem("selectedRoom") || null
    );
    const [selectedBed, setSelectedBed] = useState(
        sessionStorage.getItem("selectedBed") || null
    );
    useEffect(() => {
        axios.get(`/admin/users/buildings`).then((response) => {
            setBuildings(response.data);
        });
    }, [admin?.id]);

    const { data: editData, setData: setEditData, put: editPut, post: editPost, processing: editProcessing, reset: editReset } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        password: "",
    });
    const handleEditSubmit = (e) => {
        e.preventDefault();
        editPut(route("admin.user.update", user.id), {
            onSuccess: () => {
                reset("password");
                setShowEditModal(false);
            },
        });
    };
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
            <Head title={user?.name || "User"} />
            <div className="flex items-center justify-between">
                <Breadcrumbs
                    links={[
                        { label: 'Users', url: '/admin/users' },
                        { label: `${user?.name || "User"}` },
                    ]}
                />
                <Dropdown>
                    <Dropdown.Trigger>
                        <button className="p-2 rounded-full hover:bg-gray-200 transition">
                            <EllipsisVertical className="w-5 h-5 text-gray-700" />
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        {/* Label */}
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Options
                        </div>
                        <hr className="border-gray-200 my-1" />

                        {/* Edit Button */}
                        <Dropdown.Button
                            onClick={() => {
                                setShowEditModal(!showEditModal);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150 w-full text-left">
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Dropdown.Button>
                    </Dropdown.Content>
                </Dropdown>

            </div>
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
                    ><BookCheck className="text-indigo-500" /> Previous Bookings</motion.h2>
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
                                        month_count: b.month_count,
                                        end_date: dayjs(b.start_date).add(b.month_count, 'month').format("MMMM D, YYYY"),
                                        status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
                                        rating: b.ratings_avg_stars || "-",
                                        comment: b.comments?.map(c => c.body).join(', ') || "-"
                                    }))}
                                    columns={[
                                        { key: 'start_date', label: 'Start Date' },
                                        { key: 'month_count', label: 'Month Count' },
                                        { key: 'end_date', label: 'End Date' },
                                        { key: 'status', label: 'Status' },
                                        { key: 'rating', label: 'Rating' },
                                        { key: 'comment', label: 'Comment' },
                                    ]}
                                />

                            </div>
                        )}

                        {/* Function for creating a booking, rating and comment for previous user. */}

                        <AddBooking bedId={selectedBed} userId={user.id} onBookingAdded={(newBooking) => {
                            setPrevBookings([newBooking, ...prevBookings]);
                        }} />
                    </div>
                )}
            </div>

            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
                <motion.form
                    onSubmit={handleEditSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 p-4"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData("name", e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData("email", e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={editData.phone}
                                onChange={(e) => setEditData("phone", e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                value={editData.password}
                                onChange={(e) => setEditData("password", e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Leave blank to keep current password"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEditModal(false)}
                            className="border-gray-300 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editProcessing}
                            className="bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            {editProcessing ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </motion.form>
            </Modal>


        </AuthenticatedLayout>
    );
}
