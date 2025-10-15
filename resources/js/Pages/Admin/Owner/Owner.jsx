import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "../AuthenticatedLayout";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@/Components/Modal";
import ph from '@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';
import { faPlus, faEdit, faPhone, faEnvelope, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import CreateBuildingModal from "./CreateBuildingModal";
import InputField from "@/Components/InputField";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FileInput from "@/Components/FileInput"; // <-- Make sure you have this


export default function Owner({ owner }) {
    const [showBuildingModal, setShowBuildingModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [preview, setPreview] = useState(
        owner.avatar ? `/storage/${owner.avatar}` : '/storage/profile/default_avatar.png'
    );

    const showBuilding = (id) => {
        window.location.href = `/admin/owner/buildings/${id}`;
    };

    const {
        data: editData,
        setData,
        post: postEdit,
        put: putEdit,
        errors: editErrors,
        processing: editProcessing,
        recentlySuccessful: editRecentlySuccessful
    } = useForm({
        name: owner.name,
        avatar: owner.avatar || null,
        phone: owner.phone,
        address: {
            region: owner.address?.region || '',
            province: owner.address?.province || '',
            municipality: owner.address?.municipality || '',
            barangay: owner.address?.barangay || '',
        },
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
        }
    };

    const handleEditProfile = (e) => {
        e.preventDefault();
        putEdit(`/admin/owner/${owner.id}`); // adjust the route if needed
    };

    return (
        <AuthenticatedLayout>
            <Head title={owner.name} />
            <Breadcrumbs
                links={[
                    { label: 'Owners', url: '/admin/owners' },
                    { label: `${owner.name}` },
                ]}
            />
            <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
                {/* Owner Welcome */}
                <section className="bg-white shadow rounded p-6 relative">
                    <button
                        className="absolute top-2 right-2 text-indigo-600 hover:text-indigo-800"
                        onClick={() => setShowEditProfileModal(true)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <div>
                        <img
                            src={`/storage/${owner.avatar ? owner.avatar : 'profile/default_avatar.png'}`}
                            alt="avatar"
                            className="rounded-full w-20 h-20 border-indigo-500 border-2 p-1 shadow-lg mb-4"
                        />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{owner.name}</h2>
                    <p className="text-gray-700"><FontAwesomeIcon icon={faEnvelope} /> : {owner.email}</p>
                    <p className="text-gray-700"><FontAwesomeIcon icon={faPhone} /> : {owner.phone}</p>
                    <p>
                        <FontAwesomeIcon icon={faAddressCard} /> :
                        {owner.address?.barangay}, {owner.address?.municipality}, {owner.address?.province}
                    </p>
                </section>

                {/* Add Building Button */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Buildings</h3>
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
                                            <td className="p-3 flex items-center justify-center">
                                                <img
                                                    src={`/storage/${building.image ? building.image : 'building/building.png'}`}
                                                    alt="building"
                                                    className="rounded-full w-10 h-10 border-indigo-500 border-2 p-1 shadow-lg mb-4"
                                                />
                                            </td>
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
            <Modal show={showEditProfileModal} onClose={() => setShowEditProfileModal(false)}>
                <div>
                    <form onSubmit={handleEditProfile}>
                        <div className="space-y-4">
                            <InputField label="Name" value={editData.name} onChange={(e) => setData('name', e.target.value)} error={editErrors.name} />
                            <InputField label="Phone" value={editData.phone} onChange={(e) => setData('phone', e.target.value)} error={editErrors.phone} />
                            <FileInput
                                label="Profile Picture"
                                accept="image/*"
                                field="avatar"
                                error={editErrors.avatar}
                                onFileChange={handleAvatarChange}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowEditProfileModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-black"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={editProcessing}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
