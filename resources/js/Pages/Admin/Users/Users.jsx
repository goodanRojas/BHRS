import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Assuming you have a Modal component
import Toast from "@/Components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faPlus,
    faCheck,
    faBan,
    faPencil,
    faUsers,
    faWifi,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { motion } from "framer-motion";
export default function Users({ users }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: ownerList = [], links = [], meta = {} } = users || {};
    const [moreUsers, setMoreUsers] = useState(ownerList);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [onlineCount, setOnlineCount] = useState(0);
    const { flash } = usePage().props;
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });


    const {
        data: createData,
        setData: setCreateData,
        post: createPost,
        processing: createProcessing,
        reset: createReset,
        errors: createErrors,
    } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const {
        data: editData,
        setData: setEditData,
        post: editPost,
        processing: editProcessing,
        reset: editReset,
    } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        createReset();
        setShowCreateModal(false);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditData({
            name: user.name,
            email: user.email,
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        editReset();
        setShowEditModal(false);
    };
    const handleCreateSubmit = (e) => {
        e.preventDefault();

        createPost(route("admin.users.create"), {
            onSuccess: (page) => {
                setToast({
                    show: true,
                    message: "User created successfully",
                    type: "success",
                });
                closeCreateModal();
            },
        });
    };


    const handleEditSubmit = (e) => {
        e.preventDefault();
        editPost(route("admin.users.update", { id: selectedUser.id }), {
            onSuccess: () => {
                setMoreUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === selectedUser.id ?
                            {
                                ...user,
                                name: editData.name,
                                password: editData.password,
                            } :
                            user
                    )
                );
                closeEditModal();
            },
        });
    };


    const toggleUserStatus = async (id) => {
        try {
            const response = await axios.post(`/admin/users/toggle-status/${id}`);
            if (response.data.success) {
                // Update the user's status locally
                setToast({
                    show: true,
                    message: "User status updated",
                    type: "success",
                });
                setMoreUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === id
                            ? { ...user, status: user.status === 1 ? 0 : 1 }
                            : user
                    )

                );
            } else {
                console.error("Error in toggling status");
            }
        } catch (error) {
            console.error("Error in toggling user status:", error);
        }
    };

    const filteredUsers = moreUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const channel = window.Echo.join('online-users')
            .here((users) => {
                setOnlineUsers(users.map((u) => u.id));
                setOnlineCount(users.length);
            })
            .joining((user) => {
                setOnlineUsers((prev) => [...prev, user.id]);
                setOnlineCount((prev) => prev + 1);
            })
            .leaving((user) => {
                setOnlineUsers((prev) => prev.filter((id) => id !== user.id));
                setOnlineCount((prev) => prev - 1);
            });
        return () => {
            window.Echo.leave('online-users');
        }
    }, []);


    return (
        <AuthenticatedLayout>
            <Head title="user" />
            {flash.success && <Toast message={flash.success} />}
            <Toast isTrue={toast.show} isType={toast.type} message={toast.message} id={Date.now()} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 md:p-8"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        <motion.div
                            initial={{ rotate: -10, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-indigo-100 text-indigo-600 p-3 rounded-full shadow-sm"
                        >
                            <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
                        </motion.div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Users
                            </h1>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <FontAwesomeIcon icon={faWifi} className="text-green-500" />
                                Online: {onlineCount}
                            </p>
                        </div>
                    </div>

                    {/* Right Section: Search + Add */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-64">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Add Button */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={openCreateModal}
                            className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-indigo-700 transition"
                            title="Add New User"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </motion.button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wide">
                                <th className="px-6 py-3 text-left">Username</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-center">Online</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="border-t text-gray-700 hover:bg-gray-50 cursor-pointer"
                                        onClick={() =>
                                            (window.location.href = route("admin.users.show", { id: user.id }))
                                        }
                                    >
                                        <td className="px-6 py-3 font-medium">{user.name}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3 text-center">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleUserStatus(user.id);
                                                }}
                                                className={`${user.status === 1
                                                        ? "bg-green-500 hover:bg-green-600"
                                                        : "bg-red-500 hover:bg-red-600"
                                                    } w-9 h-9 rounded-full flex items-center justify-center text-white shadow`}
                                                title={user.status === 1 ? "Active" : "Inactive"}
                                            >
                                                <FontAwesomeIcon
                                                    icon={user.status === 1 ? faCheck : faBan}
                                                />
                                            </motion.button>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {onlineUsers.includes(user.id) ? (
                                                <span className="text-green-600 font-semibold">Online</span>
                                            ) : (
                                                <span className="text-gray-400">Offline</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditModal(user);
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center text-white shadow"
                                                title="Edit User"
                                            >
                                                <FontAwesomeIcon icon={faPencil} />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-6 text-gray-500 italic"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 space-x-2">
                    {links?.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && (window.location.href = link.url)}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${link.active
                                    ? "bg-indigo-600 text-white shadow"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Create Modal */}
            <Modal show={showCreateModal} onClose={closeCreateModal}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Create user</h2>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={createData.name}
                                onChange={(e) => setCreateData("name", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {createErrors.name && <span className="text-red-500">{createErrors.name}</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={createData.email}
                                onChange={(e) => setCreateData("email", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {createErrors.email && <span className="text-red-500">{createErrors.email}</span>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={createData.password}
                                onChange={(e) => setCreateData("password", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {createErrors.password && <span className="text-red-500">{createErrors.password}</span>}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={closeCreateModal}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createProcessing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                {createProcessing ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onClose={closeEditModal}>
                <div className="p-6">
                    <div className="flex items-center gap-2 pb-4 text-lg font-semibold text-gray-800">
                        <FontAwesomeIcon icon={faPencil} className="text-blue-600" />
                        <h3>{editData.email}</h3>
                    </div>
                    <form onSubmit={handleEditSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData("name", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="text"
                                placeholder='New password'
                                onChange={(e) => setEditData("password", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={editProcessing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                {editProcessing ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
