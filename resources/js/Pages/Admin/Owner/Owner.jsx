import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { use, useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Assuming you have a Modal component
import Toast from "@/Components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faCheck, faBan, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/inertia-react";
export default function Owner({ owners }) {
    console.log(owners);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: ownerList = [], links = [], meta = {} } = owners || {};
    const [moreOwners, setMoreOwners] = useState(ownerList);
    const { flash } = usePage().props;

    useEffect(() => {
        axios.get('/admin/owners/owners')
            .then(({ data }) => {
                if (Array.isArray(data.owners)) {
                    setMoreOwners((prevOwners) => [...prevOwners, ...data.owners]);
                } else {
                    console.error("Expected data.owners to be an array", data.owners);
                }
            })
            .catch((err) => console.error("Error fetching owners:", err));
    }, []);



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



    const openEditModal = (owner) => {
        setSelectedOwner(owner);
        setEditData({
            name: owner.name,
            email: owner.email,
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        editReset();
        setShowEditModal(false);
    };


    const handleEditSubmit = (e) => {
        e.preventDefault();
        editPost(route("admin.owner.update", { id: selectedOwner.id }), {
            onSuccess: () => {
                setMoreOwners((prevOwners) =>
                    prevOwners.map((owner) =>
                        owner.id === selectedOwner.id ?
                            {
                                ...owner,
                                name: editData.name,
                                password: editData.password,
                            } :
                            owner
                    )
                );
                closeEditModal();
            },
        });
    };


    const toggleOwnerStatus = async (id) => {
        try {
            const response = await axios.post(`/admin/owners/toggle-status/${id}`);
            if (response.data.success) {
                // Update the owner's status locally
                setMoreOwners((prevOwners) =>
                    prevOwners.map((owner) =>
                        owner.id === id
                            ? { ...owner, status: owner.status === 1 ? 0 : 1 }
                            : owner
                    )
                );
            } else {
                console.error("Error in toggling status");
            }
        } catch (error) {
            console.error("Error in toggling owner status:", error);
        }
    };

    const filteredOwners = moreOwners.filter((owner) =>
        owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <AuthenticatedLayout>
            <Head title="Owner" />
            {flash.success && <Toast message={flash.success} />}

            <div className="">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Owners</h1>

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
                        <Link
                            href="/admin/owner/create"
                            className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-700 mb-4"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </Link>
                      

                    </div>

                </div>
                <div className="overflow-x-auto w-full">
                    {owners.data.length > 0 ? (
                        <div>
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
                                    {filteredOwners.map((owner) => (
                                        <tr key={owner.id} className="border-t">
                                            <td className="px-6 py-2">{owner.name}</td>
                                            <td className="px-6 py-2">{owner.email}</td>
                                            <td className="px-6 py-2 text-center">
                                                <button
                                                    onClick={() => toggleOwnerStatus(owner.id)}
                                                    className={`${owner.status === 1 ? "bg-green-600" : "bg-red-600"
                                                        } rounded-full w-10 h-10 flex items-center justify-center text-white hover:bg-opacity-80`}
                                                >
                                                    {owner.status === 1 ? (
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faBan} />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="py-2 flex justify-center items-center">
                                                <button
                                                    onClick={() => openEditModal(owner)}
                                                    className="bg-blue-500 rounded-full flex items-center justify-center w-10 h-10 text-white hover:bg-blue-600"
                                                >
                                                    <FontAwesomeIcon icon={faPencil} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>

                            </table>
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
                    ) : (
                        <div className="flex justify-center mt-4 space-x-2">
                            <div className="text-center text-gray-500 py-4">
                                No results found.
                            </div>
                        </div>
                    )}
                </div>
            </div>



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
