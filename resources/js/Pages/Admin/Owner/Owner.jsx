import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, useForm,  } from "@inertiajs/react";
import { use, useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Assuming you have a Modal component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
export default function Owner({ owners }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [moreOwners, setMoreOwners] = useState(owners);

    useEffect(() => {
        axios.get('/admin/owners/owners')
            .then(({ data }) => {
                setMoreOwners((prevOwners) => [...prevOwners, ...data.owners]);

            })
            .catch((err) => console.error("Error fetching owners:", err));
    }, []);

    const {
        data: createData,
        setData: setCreateData,
        post: createPost,
        processing: createProcessing,
        reset: createReset,
    } = useForm({
        username: "",
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
        username: "",
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

    const openEditModal = (owner) => {
        setSelectedOwner(owner);
        setEditData({
            username: owner.username,
            email: owner.email,
            password: "",
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        editReset();
        setShowEditModal(false);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createPost(route("admin.owner.create"), {
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editPost(route("admin.owner.update", selectedOwner.id), {
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const toggleOwnerStatus = (id, status) => {
        // Send request to enable/disable the owner
        const action = status === "active" ? "disable" : "enable";
        // Make an API request to toggle the status
        post(route(`admin.owner.${action}`, id), {
            onSuccess: () => {
                // Handle success
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Owner" />

            <div className="">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Owners</h1>

                    <button
                        onClick={openCreateModal}
                        className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-700 mb-4"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>


                </div>
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-2 text-left">Username</th>
                                <th className="px-6 py-2 text-left">Email</th>
                                <th className="px-6 py-2 text-left">Status</th>
                                <th className="px-6 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {moreOwners?.map((owner) => (
                                <tr key={owner.id} className="border-t">
                                    <td className="px-6 py-2">{owner.username}</td>
                                    <td className="px-6 py-2">{owner.email}</td>
                                    <td className="px-6 py-2">
                                        {owner.status === "active" ? "Active" : "Inactive"}
                                    </td>
                                    <td className="px-6 py-2">
                                        <button
                                            onClick={() => openEditModal(owner)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleOwnerStatus(owner.id, owner.status)}
                                            className={`${owner.status === "active"
                                                ? "bg-red-600"
                                                : "bg-green-600"
                                                } text-white px-4 py-2 rounded hover:bg-opacity-80`}
                                        >
                                            {owner.status === "active" ? "Disable" : "Enable"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={showCreateModal} onClose={closeCreateModal}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Create Owner</h2>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={createData.username}
                                onChange={(e) => setCreateData("username", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={createData.email}
                                onChange={(e) => setCreateData("email", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={createData.password}
                                onChange={(e) => setCreateData("password", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
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
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Owner</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={editData.username}
                                onChange={(e) => setEditData("username", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData("email", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={editData.password}
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
