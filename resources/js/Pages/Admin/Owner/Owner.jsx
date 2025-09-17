import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "../AuthenticatedLayout";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faPhone, faMailBulk, faEnvelope, faAd, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import CreateBuildingModal from "./CreateBuildingModal";
export default function Owner({ owner }) {
    console.log(owner);
    const [showBuildingModal, setShowBuildingModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const showBuilding = (id) => {
        window.location.href = `/admin/owner/buildings/${id}`;
    };
    return (
        <AuthenticatedLayout>
            <Head title={owner.name} />

            <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
                {/* Owner Welcome */}
                <section className="bg-white shadow rounded p-6 relative">
                    <button
                        className="absolute top-2 right-2 text-indigo-600 hover:text-indigo-800"
                        onClick={() => setShowProfileModal(true)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <div>
                        <img src={`/storage/${owner.avatar ? owner.avatar : 'profile/default_avatar.png'}`} alt="avatar" className="rounded-full w-20 h-20 border-indigo-500 border-2 p-1 shadow-lg mb-4" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2"> {owner.name}</h2>
                    <p className="text-gray-700"><FontAwesomeIcon icon={faEnvelope} /> : {owner.email}</p>
                    <p className="text-gray-700"><FontAwesomeIcon icon={faPhone} /> : {owner.phone}</p>
                    <p><FontAwesomeIcon icon={faAddressCard} /> : {owner.address?.address.barangay}, {owner.address?.address.city}, {owner.address?.address.province}</p>
                </section>

                {/* Add Building Button */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold"> Buildings</h3>
                    <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-indigo-700"
                        onClick={() => setShowBuildingModal(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} />

                    </button>
                </div>

                {/* Buildings Table */}
                <section className="bg-white shadow-md rounded-xl p-6">
                    {owner.buildings.length === 0 ? (
                        <p className="text-gray-500 text-center">No buildings added yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-sm font-semibold text-gray-700">
                                        <th className="px-4 py-3 border-b">#</th>
                                        <th className="px-4 py-3 border-b">Image</th>
                                        <th className="px-4 py-3 border-b text-center">Name</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-600 divide-y">
                                    {owner.buildings.map((building, index) => (
                                        <tr
                                            key={building.id}
                                            onClick={() => showBuilding(building.id)}
                                            className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                                        >
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className=" p-3 flex items-center justify-center"> <img src={`/storage/${building.image? building.image : 'building/building.png'}`} alt="avatar" className="rounded-full w-10 h-10 border-indigo-500 border-2 p-1 shadow-lg mb-4" /> </td>
                                            <td className="px-4 py-3 text-center">{building.name}</td>
                                       
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

            </div>

            {/* Add Building Modal */}
            <CreateBuildingModal
                owner={owner}
                isOpen={showBuildingModal}
                onClose={() => setShowBuildingModal(false)}
            />


            {/* Edit Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Full Name</label>
                                <input type="text" defaultValue={owner.name} className="w-full border rounded px-3 py-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Phone</label>
                                <input type="text" defaultValue={owner.phone} className="w-full border rounded px-3 py-2" />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-black"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
