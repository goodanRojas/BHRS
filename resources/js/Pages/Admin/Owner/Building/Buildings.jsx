import AuthenticatedLayout from "../../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Toast from "@/Components/Toast";
import { Search, Building2, User, Image as ImageIcon, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
export default function Buildings({ buildings }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: buildingList = [], links = [], meta = {} } = buildings || {};
    const [moreBuildings, setMoreBuildings] = useState(buildingList);
    const { flash } = usePage().props;


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



    const openEditModal = (building) => {
        setSelectedBuilding(building);
        setEditData({
            name: building.name,
            email: building.email,
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        editReset();
        setShowEditModal(false);
    };


    const handleEditSubmit = (e) => {
        e.preventDefault();
        editPost(route("admin.building.update", { id: selectedBuilding.id }), {
            onSuccess: () => {
                setMoreBuildings((prevBuildings) =>
                    prevBuildings.map((building) =>
                        building.id === selectedBuilding.id ?
                            {
                                ...building,
                                name: editData.name,
                                password: editData.password,
                            } :
                            building
                    )
                );
                closeEditModal();
            },
        });
    };


    const toggleBuildingStatus = async (id) => {
        try {
            const response = await axios.post(`/admin/buildings/toggle-status/${id}`);
            if (response.data.success) {
                // Update the building's status locally
                setMoreBuildings((prevBuildings) =>
                    prevBuildings.map((building) =>
                        building.id === id
                            ? { ...building, status: building.status === 1 ? 0 : 1 }
                            : building
                    )
                );
            } else {
                console.error("Error in toggling status");
            }
        } catch (error) {
            console.error("Error in toggling building status:", error);
        }
    };

    const filteredBuildings = moreBuildings.filter((building) =>
        building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        building.email.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <AuthenticatedLayout>
            <Head title="Buildings" />
            {flash.success && <Toast message={flash.success} />}

            <div className="p-6 space-y-6 overflow-hidden">
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center gap-2">
                        <Building2 className="w-7 h-7 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Buildings</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search building..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>

                {/* Table Section */}
                {filteredBuildings.length > 0 ? (
                    <motion.div
                        className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <table className="min-w-full table-auto">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Owner</th>
                                </tr>
                            </thead>

                            <motion.tbody layout>
                                {filteredBuildings.map((building, index) => (
                                    <motion.tr
                                        key={building.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() =>
                                            (window.location.href = `/admin/owner/buildings/${building.id}`)
                                        }
                                        className="group cursor-pointer hover:bg-indigo-50 transition duration-200 border-b"
                                    >
                                        <td className="px-6 py-3">{building.id}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-center">
                                                {building.image ? (
                                                    <img
                                                        src={`/storage/${building.image}`}
                                                        alt="building"
                                                        className="w-16 h-16 rounded-xl object-cover shadow-sm"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 font-medium text-gray-800 group-hover:text-indigo-700">
                                            {building.name}
                                        </td>
                                        <td className="px-6 py-3 flex items-center justify-center gap-2 text-gray-700">
                                            <User className="w-4 h-4 text-indigo-500" />
                                            {building.seller.name}
                                        </td>
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    </motion.div>
                ) : (
                    <motion.div
                        className="flex flex-col items-center justify-center py-20 text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-lg font-medium">No results found.</p>
                    </motion.div>
                )}

                {/* Pagination */}
                {filteredBuildings.length > 0 && (
                    <motion.div
                        className="flex justify-center mt-6 space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {links?.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && (window.location.href = link.url)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition ${link.active
                                        ? "bg-indigo-600 text-white shadow"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
