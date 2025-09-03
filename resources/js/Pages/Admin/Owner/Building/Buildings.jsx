import AuthenticatedLayout from "../../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { use, useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Assuming you have a Modal component
import Toast from "@/Components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faCheck, faBan, faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/inertia-react";
export default function Buildings({ buildings }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: buildingList = [], links = [], meta = {} } = buildings || {};
    const [moreBuildings, setMoreBuildings] = useState(buildingList);
    const { flash } = usePage().props;

    useEffect(() => {
        axios.get('/admin/buildings/buildings')
            .then(({ data }) => {
                if (Array.isArray(data.buildings)) {
                    setMoreBuildings((prevBuildings) => [...prevBuildings, ...data.buildings]);
                } else {
                    console.error("Expected data.buildings to be an array", data.buildings);
                }
            })
            .catch((err) => console.error("Error fetching buildings:", err));
    }, []);

    const openBuilding = (id) => {
        window.location.href = `/admin/owner/buildings/${id}`;
    };



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
            <Head title="Building" />
            {flash.success && <Toast message={flash.success} />}

            <div className="flex items-center justify-between overflow-hidden">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Buildings</h1>

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
                            className="pl-10 mr-10 pr-4 py-2 border border-indigo-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>



                </div>

            </div>
            {buildings.data.length > 0 ? (
                <div>
                    <table className="min-w-full table-auto border-collapse overflow-hidden">
                        <thead>
                            <tr className="bg-gray-500 text-white">
                                <th className="px-6 py-2 text-center">Id</th>
                                <th className="px-6 py-2 text-center">Image</th>
                                <th className="px-6 py-2 text-center">Name</th>
                                <th className="px-6 py-2 text-center">Owner</th>
                            </tr>
                        </thead>
                        <tbody className="min-h-screen">
                            {filteredBuildings.map((building) => (
                                <tr
                                    onClick={() => openBuilding(building.id)}
                                    className="border cursor-pointer hover:bg-gray-50 transition-colors duration-200 group">
                                    <td className="px-6 py-2 text-center">{building.id}</td>
                                    <td className="px-6 py-2">
                                        <img src={`/storage/${building.image}`} alt="building" className="w-16 h-16 rounded-md" />
                                    </td>
                                    <td className="px-6 py-2 text-center group-hover:font-bold">{building.name}</td>
                                    <td className="px-6 py-2 text-center">{building.seller.name}</td>



                                </tr>
                            ))}
                        </tbody>

                    </table>
                    <div className="flex justify-center mt-4 space-x-2 fixed bottom-2 left-1/2 right-0">
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



        </AuthenticatedLayout>
    );
}
