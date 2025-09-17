import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { use, useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Assuming you have a Modal component
import Toast from "@/Components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faCheck, faBan, faSearch } from "@fortawesome/free-solid-svg-icons";
export default function Users({ users }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: ownerList = [], links = [], meta = {} } = users || {};
    const [moreUsers, setMoreUsers] = useState(ownerList);
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


    return (
        <AuthenticatedLayout>
            <Head title="user" />
            {flash.success && <Toast message={flash.success} />}
            <Toast isTrue={toast.show} isType={toast.type} message={toast.message} id={Date.now()} />
            <div className="">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>

                    <div className="flex items-center space-x-4">
                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Add button */}
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-700 mb-4"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>

                    </div>

                </div>
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-2 text-center">Username</th>
                                <th className="px-6 py-2 text-center">Email</th>
                                <th className="px-6 py-2 text-center">Status</th>
                                <th className="px-6 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="min-h-screen">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-6 py-2">{user.name}</td>
                                        <td className="px-6 py-2">{user.email}</td>
                                        <td className="px-6 py-2 text-center">
                                            <button
                                                onClick={() => toggleUserStatus(user.id)}
                                                className={`${user.status === 1 ? "bg-green-600" : "bg-red-600"
                                                    } rounded-full w-10 h-10 flex items-center justify-center text-white hover:bg-opacity-80`}
                                            >
                                                {user.status === 1 ? (
                                                    <FontAwesomeIcon icon={faCheck} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faBan} />
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-2 flex justify-center items-center">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="bg-blue-500 rounded-full flex items-center justify-center w-10 h-10 text-white hover:bg-blue-600"
                                            >
                                                <FontAwesomeIcon icon={faPencil} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center  text-gray-500 py-4">
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                    {/*  */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {links?.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && (window.location.href = link.url)}
                                className={`px-3 py-1 rounded ${link.active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>

                </div>
            </div>

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
