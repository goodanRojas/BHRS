import AuthenticatedLayout from '../../../AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faTimes, faBed, faBedPulse, faCheckSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Breadcrumbs from '@/Components/Breadcrumbs';
export default function Room({ room }) {
    console.log(room);
    const [showFeatureInput, setShowFeatureInput] = useState(false);
    const [featureName, setFeatureName] = useState('');
    const [featureDescription, setFeatureDescription] = useState('');
    const [addBedModalOpen, setAddBedModalOpen] = useState(false);
    const [features, setFeatures] = useState(room.features);
    const [beds, setBeds] = useState(room.beds);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        image: '',
        room_id: room.id,
    });
    const handleInputSubmit = (e) => {
        setFeatureName(e.target.value);
    };
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && featureName.trim()) {
            console.log('Feature saved:', featureName);
            try {
                const response = await axios.post('/admin/owner/buildings/room/add-feature', {
                    name: featureName,
                    description: featureDescription,
                    featureable_id: room.id,
                });
                setFeatures((prev) => [
                    ...prev,
                    {
                        id: response.data.feature.id,
                        name: response.data.feature.name,
                        description: response.data.feature.description,
                        featureable_id: response.data.feature.featureable_id,
                    }
                ]);
                setFeatureName('');
                setFeatureDescription('');
                setShowFeatureInput(false);
            } catch (error) {
                console.error('Error:', error);
            }

        }

    };
    const handleDeleteFeature = async (id) => {
        setFeatures((prevFeatures) => prevFeatures.filter((feature) => feature.id !== id));
        try {
            const response = await axios.delete(`/admin/owner/buildings/delete-feature/${id}`);
            if (response.data.success) {
                // Update the features array
                setFeatures((prevFeatures) =>
                    prevFeatures.filter((feature) => feature.id !== id)
                );
            } else {
                console.error('Error in deleting feature:', response.data.message);
            }
        } catch (error) {
            console.error('Error in deleting feature:', error);
        }
    };
    const handleBedCreateSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission for creating a new room
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('price', data.price);
            formData.append('image', data.image);
            formData.append('room_id', room.id);

            const response = await axios.post('/admin/owner/buildings/add-bed', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.bed) {


                // Append the new room to the existing rooms array in the state
                setBeds((prevBeds) => [
                    ...prevBeds,
                    {
                        id: response.data.bed.id,
                        name: response.data.bed.name,
                        image: response.data.bed.image,
                        price: response.data.bed.price,
                    },
                ]);
            }

            // Close the modal and reset the form
            setAddBedModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error creating bed:', error);
        }
    };
    return (
        <AuthenticatedLayout>
            <Head title={room.name} />
            <Breadcrumbs
                links={[
                    { label: 'Buildings', url: '/admin/owner/buildings' },
                    { label: room.building.name, url: `/admin/owner/buildings/${room.building_id}` },
                    { label: room.name },
                ]} />
            <div>
                <h2 className='text-lg font-semibold mb-4'>{room.name}</h2>
            </div>
            {/* Image Section */}
            <div className="overflow-hidden rounded-t-lg">
                <img
                    src={`/storage/${room.image}`}
                    alt={room.name}
                    className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col justify-between">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{room.name}</h2>
                <p className='text-gray-500 text-sm'>&#8369;{room.price}</p>


                {/* Features */}
                <div >
                    <div className='flex items-center gap-2'>
                        <p className='text-sm text-gray-500'>Features</p>

                        {/* Button with hover effect */}
                        <button
                            onClick={() => setShowFeatureInput(!showFeatureInput)}
                            className="hover:bg-gray-300 rounded-md p-2 "
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-gray-500 text-sm" />
                        </button>

                        {/* Conditionally show the input field when button is clicked */}
                        {showFeatureInput && (
                            <input
                                type="text"
                                value={featureName}
                                onChange={handleInputSubmit}
                                onKeyDown={handleKeyPress}
                                className="p-2 text-sm border border-gray-300 rounded-md"
                                placeholder="Enter feature"
                                autoFocus
                            />
                        )}
                    </div>
                    {features.length > 0 ? (
                        <div className="relative p-4">
                            {features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="relative inline-block p-2 mb-2 mr-4 hover:bg-gray-100 rounded-md group"
                                >
                                    {/* Feature name container with hover effect */}
                                    <div className="bg-gray-100 rounded-lg p-2 relative group-hover:bg-gray-200 transition-all">
                                        <span className="text-xs text-gray-600">{feature.name}</span>
                                    </div>

                                    {/* Delete button (X) appears only on hover */}
                                    <button
                                        onClick={() => handleDeleteFeature(feature.id)}
                                        className="absolute top-1 right-1 p-1 text-gray-500 group-hover:text-red-500 focus:outline-none hidden group-hover:block"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className=" text-gray-500 py-4">
                            No features
                        </p>
                    )}
                </div>


            </div>

            {/* Display Beds */}
            <div className='min-h-80'>
                <div className='flex items-center justify-between'>
                    <h3 className="text-xl font-semibold mb-2 mt-4">Beds</h3>
                    <button
                        onClick={setAddBedModalOpen}
                        className="bg-indigo-500 text-white p-2 w-10 h-10 rounded-full flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-white text-lg" />
                    </button>

                </div>
                {beds.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">Bed Name</th>
                                    <th className="px-4 py-2 text-left">Image</th>
                                    <th className="px-4 py-2 text-left">Price</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beds.map((bed) => (
                                    <tr key={bed.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                            {bed.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            <img
                                                src={`/storage/${bed.image}`}
                                                alt={bed.name}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                        </td>

                                        <td className="px-4 py-2">
                                            <p className="text-gray-500 font-semibold">₱{bed.price}</p>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Link href={`/admin/owner/buildings/show-bed/${bed.id}`} className="text-blue-500 hover:underline">
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center  text-gray-500 py-4">
                        No beds found.
                    </div>
                )}
            </div>
            {/* Add Room Modal */}
            <Modal show={addBedModalOpen} onClose={() => setAddBedModalOpen(false)}>
                <div>
                    <h2>Add Room</h2>
                    <form onSubmit={handleBedCreateSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="image" value="Image" className="block text-lg font-medium text-gray-700" />
                            <TextInput
                                id="imagea"
                                type="file"
                                name="image"
                                accept="image/*"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={(e) => setData('image', e.target.files[0])}
                            />
                            <InputError message={errors.image} className="mt-2 text-sm text-red-600" />
                        </div>
                        <div>
                            <InputLabel htmlFor="name" value="Name" className="block text-lg font-medium text-gray-700" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2 text-sm text-red-600" />
                        </div>
                        <div>
                            <InputLabel htmlFor="price" value="Price" className="block text-lg font-medium text-gray-700" />
                            <TextInput
                                id="price"
                                type="number"
                                name="price"
                                value={data.price}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="price"
                                isFocused={true}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            <InputError message={errors.price} className="mt-2 text-sm text-red-600" />
                        </div>
                        <div className='flex items-center justify-end gap-4'>
                            <button
                                type='button'
                                onClick={() => setAddBedModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Save
                            </button>
                        </div>

                    </form>

                </div>
            </Modal >
        </AuthenticatedLayout>
    );
}