import AuthenticatedLayout from '../../../AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faTimes, faBed, faBedPulse, faCheckSquare, faPlus, faRoute, faEllipsisV, faGear, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
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
    const [clientErrors, setClientErrors] = useState({});
    /* This is for the option menu */
    const [isOptionOpen, setIsOptionOpen] = useState(false);
    const optionButtonRef = useRef(null);
    const optionPopupRef = useRef(null);

    /* Deletion of Boarding House */
    const [deleteBHModalOpen, setDeleteBHModalOpen] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const handleDelete = async () => {
        try {
            const response = await axios.post(route('admin.confirm-password'), {
                password: adminPassword,
            });

            if (response.data.confirmed) {
                // Proceed to delete the boarding house
                await axios.delete(route('admin.buildings.destroy', buildingId));
                setDeleteBHModalOpen(false);
                setAdminPassword('');
                // Optional: show success toast or reload
            } else {
                setPasswordError("Incorrect password. Please try again.");
            }
        } catch (error) {
            setPasswordError("An error occurred. Please try again.");
            console.error(error);
        }
    };


    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        image: '',
        building_id: building.id,
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                optionPopupRef.current &&
                !optionPopupRef.current.contains(event.target) &&
                !optionButtonRef.current.contains(event.target)
            ) {
                setIsOptionOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleInputSubmit = (e) => {
        setFeatureName(e.target.value);
    };
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && featureName.trim()) {
            console.log('Feature saved:', featureName);
            try {
                const response = await axios.post('/admin/owner/buildings/add-feature', {
                    name: featureName,
                    description: featureDescription,
                    featureable_id: building.id,
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


    const handleRoomCreateSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!data.image) newErrors.image = "Please upload an image";
        if (!data.name) newErrors.name = "Please enter a name";
        if (!data.price) newErrors.price = "Please enter a price";
        else if (isNaN(data.price) || Number(data.price) <= 0) newErrors.price = "Please enter a valid price";

        if (Object.keys(newErrors).length > 0) {
            setClientErrors(newErrors);
            return;
        }
        setClientErrors({});
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('price', data.price);
            formData.append('image', data.image);
            formData.append('building_id', building.id);

            const response = await axios.post('/admin/owner/buildings/add-room', formData, {
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
        <AuthenticatedLayout>
            <Head title={building.name} />

            <div className="p-4">
                <div className='flex items-center justify-end'>
                    <div className="relative inline-block text-left">
                        <button
                            ref={optionButtonRef}
                            onClick={() => setIsOptionOpen((prev) => !prev)}
                            className="p-2 hover:font-bold hover:text-[17px] overflow-hidden transition-all duration-300"
                        >
                            <FontAwesomeIcon icon={faEllipsisV} className="text-gray-700 font-bold" />
                        </button>

                        {isOptionOpen && (
                            <div
                                ref={optionPopupRef}
                                className={`absolute right-0 top-7 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50   `}
                            >
                                <div className='p-2'>
                                    <h2 className='text-sm font-semibold text-gray-800 m-2'><FontAwesomeIcon icon={faGear} /> Options</h2>
                                    <hr className='border-gray-200 mt-2' />
                                    {/* Option content */}
                                    <div className="pt-2">
                                        <button className=" group block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <FontAwesomeIcon className='group-hover:text-gray-900 transition-all duration-200' icon={faPen} /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteBHModalOpen(true)}
                                            className="group block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <FontAwesomeIcon className='group-hover:text-red-500 transition-all duration-200' icon={faTrash} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

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
                    <div className='flex items-center justify-between'>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">{building.name}</h2>
                        <Link
                            href={`/admin/route/building/${building.id}/route-map`}
                        >
                            <FontAwesomeIcon icon={faRoute} className="text-blue-500 mr-2" />
                        </Link>
                    </div>
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
                                        <th className="px-4 py-2 text-left">Id</th>
                                        <th className="px-4 py-2 text-left">Image</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <tr
                                            key={room.id}
                                            onClick={() => window.location.href = `/admin/owner/buildings/show-room/${room.id}`}
                                            className="border-t hover:bg-gray-50 cursor-pointer group"
                                        >
                                            <td className="px-4 py-2">{room.id}</td>
                                            <td className="px-4 py-2">
                                                <img
                                                    src={`/storage/${room.image}`}
                                                    alt={room.name}
                                                    className="w-20 h-20 object-cover rounded-md"
                                                />
                                            </td>
                                            <td className="px-4 py-2 group-hover:font-bold">{room.name}</td>

                                            <td className="px-4 py-2">
                                                <p className="text-gray-500 font-semibold">₱{room.price}</p>
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
                            <InputError message={clientErrors.image || errors.image} className="mt-2 text-sm text-red-600" />
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
                            <InputError message={clientErrors.name || errors.name} className="mt-2 text-sm text-red-600" />
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
                            <InputError message={clientErrors.price || errors.price} className="mt-2 text-sm text-red-600" />
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

            <Modal show={deleteBHModalOpen} onClose={() => setDeleteBHModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete this boarding house? This action cannot be undone.
                    </p>

                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Admin Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter admin password"
                    />
                    {passwordError && (
                        <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                    )}

                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            onClick={() => setDeleteBHModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </Modal>


        </AuthenticatedLayout >
    );


}


