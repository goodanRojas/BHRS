import AuthenticatedLayout from '../AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, } from 'react';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt as pencil } from '@fortawesome/free-solid-svg-icons';

export default function Profile({ profile }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const { flash } = usePage().props;

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: profile.name,
        email: profile.email,
        password: '',
        password_confirmation: '',
    });

    const openEditModal = () => setShowEditModal(true);
    const closeEditModal = () => {
        reset();
        setShowEditModal(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setShowConfirmationModal(true);
    };

    const confirmUpdate = () => {
        post(route('admin.profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowConfirmationModal(false);
                closeEditModal();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />
            {flash.success && <Toast message={flash.success} />}
            <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
                    <button
                        onClick={openEditModal}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                       <FontAwesomeIcon icon={pencil} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        <p className="text-lg text-gray-800">{profile.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <p className="text-lg text-gray-800">{profile.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Updated At</label><p className="text-lg text-gray-800">
                            {new Date(profile.updated_at).toLocaleDateString('en-US', {
                                weekday: 'long', // "Monday"
                                year: 'numeric', // "2025"
                                month: 'long', // "April"
                                day: 'numeric', // "29"
                            })}{' '}
                            {new Date(profile.updated_at).toLocaleTimeString('en-US', {
                                hour: '2-digit', // "04"
                                minute: '2-digit', // "30"
                                second: '2-digit', // "15"
                                hour12: true, // AM/PM
                            })}
                        </p>

                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onClose={closeEditModal}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Profile</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Confirmation Modal */}
            <Modal show={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Update</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to update your profile? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setShowConfirmationModal(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmUpdate}
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            {processing ? 'Updating...' : 'Yes, Update'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
