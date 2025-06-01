import SellerLayout from '@/Layouts/SellerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faTimes, faBed, faBedPulse, faCheckSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
export default function Building({ building }) {
    const [showFeatureInput, setShowFeatureInput] = useState(false);
    const [featureName, setFeatureName] = useState('');
    const [featureDescription, setFeatureDescription] = useState('');
    const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
    const [features, setFeatures] = useState(building.features);
    const [rooms, setRooms] = useState(building.rooms);
    console.log(building.rooms);


    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        image: '',
        building_id: building.id,
    });
    const handleInputSubmit = (e) => {
        setFeatureName(e.target.value);
    };
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && featureName.trim()) {
            console.log('Feature saved:', featureName);
            try {
                const response = await axios.post('/seller/building/add-feature', {
                    name: featureName,
                    description: featureDescription,
                    featureable_id: building.id,
                });
                console.log(response.data);
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
            const response = await axios.delete(`/seller/building/delete-feature/${id}`);
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


    const handleRoomCreateSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission for creating a new room
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('price', data.price);
            formData.append('image', data.image);
            formData.append('building_id', building.id);

            const response = await axios.post('/seller/building/add-room', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.room) {


                // Append the new room to the existing rooms array in the state
                setRooms((prevRooms) => [
                    ...prevRooms,
                    {
                        id: response.data.room.id,
                        name: response.data.room.name,
                        image: response.data.room.image,
                        price: response.data.room.price,
                    },
                ]);
            }

            // Close the modal and reset the form
            setAddRoomModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };
    return (
        <SellerLayout>
            <Head title={building.name} />

            <div className="p-4">


                {/* Image Section */}
                <div className="overflow-hidden rounded-t-lg">
                    <img
                        src={`/storage/${building.image}`}
                        alt={building.name}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{building.name}</h2>
                    <p>
                        <FontAwesomeIcon icon={faUserTie} className="mr-1 text-gray-500" />
                        {building.seller.name}
                    </p>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <i className="fas fa-location-arrow text-blue-500 mr-2"></i>
                        <span>{building.address.street}, {building.address.barangay}, {building.address.city}, {building.address.province}, {building.address.postal_code}, {building.address.country}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center text-gray-600 text-sm mb-4">
                        <span className="mr-4">{building.number_of_floors} Floor{building.number_of_floors > 1 ? 's' : ''}</span>

                        <div className="flex items-center mb-2 sm:mb-0 mr-4">
                            {building.bir ? (
                                <FontAwesomeIcon icon={faCheckSquare} className="mr-1 text-green-500" />
                            ) : (
                                <FontAwesomeIcon icon={faTimes} className="mr-1 text-red-500" />
                            )}
                            BIR
                        </div>

                        <div className="flex items-center">
                            {building.business_permit ? (
                                <FontAwesomeIcon icon={faCheckSquare} className="mr-1 text-green-500" />
                            ) : (
                                <FontAwesomeIcon icon={faTimes} className="mr-1 text-red-500" />
                            )}
                            Business Permit
                        </div>
                    </div>
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

                {/* Display Rooms */}
                <div className='min-h-80'>
                    <div className='flex items-center justify-between'>
                        <h3 className="text-xl font-semibold mb-2 mt-4">Rooms</h3>
                        <button
                            onClick={setAddRoomModalOpen}
                            className="bg-indigo-500 text-white p-2 w-10 h-10 rounded-full flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-white text-lg" />
                        </button>

                    </div>
                    {rooms.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Room Name</th>
                                        <th className="px-4 py-2 text-left">Image</th>
                                        <th className="px-4 py-2 text-left">Price</th>
                                        <th className="px-4 py-2 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <tr key={room.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                <Link href={`/home/room/${room.id}`} className="text-blue-500 hover:underline">
                                                    {room.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2">
                                                <img
                                                    src={`/storage/${room.image}`}
                                                    alt={room.name}
                                                    className="w-20 h-20 object-cover rounded-md"
                                                />
                                            </td>
                                           
                                            <td className="px-4 py-2">
                                                <p className="text-gray-500 font-semibold">₱{room.price}</p>
                                            </td>
                                            <td className="px-4 py-2">
                                                <Link href={`/seller/room/${room.id}`} className="text-blue-500 hover:underline">
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
                            No rooms found.
                        </div>
                    )}
                </div>

            </div>



            {/* Add Room Modal */}
            <Modal show={addRoomModalOpen} onClose={() => setAddRoomModalOpen(false)}>
                <div>
                    <h2>Add Room</h2>
                    <form onSubmit={handleRoomCreateSubmit} className="space-y-4">
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
                                onClick={() => setAddRoomModalOpen(false)}
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

        </SellerLayout >
    );


}


