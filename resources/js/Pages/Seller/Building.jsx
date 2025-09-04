import SellerLayout from '@/Layouts/SellerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ph from '@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';
import { faUserTie, faTimes, faGear, faCheckSquare, faRoute, faPen, faTrash, faPlus, faEllipsisV, faClose } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Toast from '@/Components/Toast';
export default function Building({ building }) {
    
    if (!building) {
        return <div>Loading...</div>; // or null
    }
    console.log(building);
    const [showFeatureInput, setShowFeatureInput] = useState(false);
    const [featureName, setFeatureName] = useState('');
    const [featureDescription, setFeatureDescription] = useState('');
    const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
    const [features, setFeatures] = useState(building?.features || []);
    const [rooms, setRooms] = useState(building?.rooms || []);

    const [toastMessage, setToastMessage] = useState({
        'message': '',
        'isTrue': false,
        'isType': '',
    });

    const [openSettings, setOpensettings] = useState(false);
    const optionButtonRef = useRef(null);
    const optionPopupRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const { data: buildingData, setData: setBuildingData, post: postBuilding, processing: buildingProcessing, errors: buildingErrors, reset: resetBuilding } = useForm({
        name: building?.name || '',
        images: building?.images || [],
        address: building?.address || {
            region: '',
            province: '',
            municipality: '',
            barangay: '',
        },
        latitude: building?.latitude || '',
        longitude: building?.longitude || '',
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setImages((prevImages) => [...prevImages, e.target.result]);
        };
        reader.readAsDataURL(file);
    }

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

    const handleUpdateBuilding = async (e) => {
        e.preventDefault();
        console.log(buildingData);
        try {
            const response = await axios.put(`/seller/building/update/${building.id}`, {
                id: building.id,
                name: buildingData.name,
                image: buildingData.image,
                address: {
                    region: buildingData.address.region,
                    province: buildingData.address.province,
                    municipality: buildingData.address.municipality,
                    barangay: buildingData.address.barangay,
                },
                latitude: buildingData.latitude,
                longitude: buildingData.longitude,
            });

            setToastMessage({
                'message': 'Building updated successfully',
                'isTrue': true,
                'isType': 'success',
            });
        } catch (error) {
            console.error('Error updating building:', error);
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                optionPopupRef.current &&
                !optionPopupRef.current.contains(event.target) &&
                !optionButtonRef.current.contains(event.target)
            ) {
                setOpensettings(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    // handle cascading location changes
    const regions = Object.entries(ph);

    const provinces = buildingData.address.region
        ? Object.keys(ph[buildingData.address.region].province_list)
        : [];

    const municipalities = buildingData.address.province
        ? Object.keys(
            ph[buildingData.address.region].province_list[buildingData.address.province].municipality_list
        )
        : [];

    const barangays = buildingData.address.municipality
        ? ph[buildingData.address.region].province_list[buildingData.address.province].municipality_list[
            buildingData.address.municipality
        ].barangay_list
        : [];

    return (
        <SellerLayout>
            <Head title={building.name} />
            {toastMessage && <Toast message={toastMessage.message} isTrue={toastMessage.isTrue} isType={toastMessage.isType} />}
            <div className="p-4">
                <div className='relative flex justify-end p-2'>
                    <button
                        ref={optionButtonRef}
                        className="p-2 hover:font-bold hover:text-[17px] overflow-hidden transition-all duration-300"
                        onClick={() => setOpensettings(true)}
                    > <FontAwesomeIcon icon={faEllipsisV} /></button>

                    {openSettings && (
                        <div
                            ref={optionPopupRef}
                            className={`absolute right-0 top-7 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50   `}
                        >
                            <div className='p-2'>
                                <h2 className='text-sm font-semibold text-gray-800 m-2'><FontAwesomeIcon icon={faGear} /> Options</h2>
                                <hr className='border-gray-200 mt-2' />
                                {/* Option content */}
                                <div className="pt-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className=" group block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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


                {/* Image Section */}
                <div className="overflow-hidden rounded-t-lg">
                    <img
                        src={`/storage/${building.image}`}
                        alt={building.name}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                {/* Image Carousel */}
                {buildingData.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                        {buildingData.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt="Building"
                                className="w-28 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                        ))}
                    </div>
                )}

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between">
                    {!isEditing ? (
                        <>
                            <div className='flex items-center justify-between'>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">{building.name}</h2>
                                <Link
                                    href={`/seller/building/map/${building.id}`}
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
                                {building.address.address ? (
                                    <span>
                                        {building.address.address.barangay},{" "}
                                        {building.address.address.municipality}, {building.address.address.province},
                                    </span>
                                ) : (
                                    <span>No Address Provided</span>
                                )}

                            </div>


                            <div className="flex flex-col sm:flex-row items-start sm:items-center text-gray-600 text-sm mb-4">
                                <span className="mr-4">
                                    {building.number_of_floors} Floor
                                    {building.number_of_floors > 1 ? "s" : ""}
                                </span>

                                <div className="flex items-center mb-2 sm:mb-0 mr-4">
                                    {building.bir ? (
                                        <FontAwesomeIcon
                                            icon={faCheckSquare}
                                            className="mr-1 text-green-500"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} className="mr-1 text-red-500" />
                                    )}
                                    BIR
                                </div>

                                <div className="flex items-center">
                                    {building.business_permit ? (
                                        <FontAwesomeIcon
                                            icon={faCheckSquare}
                                            className="mr-1 text-green-500"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} className="mr-1 text-red-500" />
                                    )}
                                    Business Permit
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">Features</p>

                                    <button
                                        onClick={() => setShowFeatureInput(!showFeatureInput)}
                                        className="hover:bg-gray-300 rounded-md p-2 "
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className="text-gray-500 text-sm"
                                        />
                                    </button>

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
                                                className="relative inline-block p-2 mb-2 mr-4 group"
                                            >
                                                <div className="bg-gray-100 rounded-lg p-2 relative group-hover:bg-gray-200 transition-all">
                                                    <span className="text-xs text-gray-600">
                                                        {feature.name}
                                                    </span>
                                                </div>

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
                                    <p className=" text-gray-500 py-4">No features</p>
                                )}
                            </div>
                        </>
                    ) : (
                        // Edit Form
                        <div className="space-y-3">
                            <form onSubmit={handleUpdateBuilding} method="POST">

                                {/* Name */}
                                <div className='flex justify-end' >
                                    <button className='text-gray-500 hover:text-gray-600 focus:outline-none' onClick={() => setIsEditing(false)}>
                                        <FontAwesomeIcon icon={faClose} />
                                    </button>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        value={buildingData.name}
                                        onChange={(e) => setBuildingData("name", e.target.value)}
                                        className="w-full border rounded-lg p-2 mt-1"
                                    />
                                </div>

                                {/* Address fields */}
                                <div className="space-y-4">
                                    {/* Region */}
                                    <label className="block">
                                        <span>Region</span>
                                        <select
                                            value={buildingData.address.region}
                                            onChange={(e) =>
                                                setBuildingData("address", {
                                                    region: e.target.value,
                                                    province: "",
                                                    municipality: "",
                                                    barangay: "",
                                                })
                                            }
                                            className="mt-1 block w-full rounded border-gray-300"
                                        >
                                            <option value="">Select Region</option>
                                            {regions.map(([key, region]) => (
                                                <option key={key} value={key}>
                                                    {region.region_name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    {/* Province */}
                                    <label className="block">
                                        <span>Province</span>
                                        <select
                                            value={buildingData.address.province}
                                            onChange={(e) =>
                                                setBuildingData("address", {
                                                    ...buildingData.address,
                                                    province: e.target.value,
                                                    municipality: "",
                                                    barangay: "",
                                                })
                                            }
                                            className="mt-1 block w-full rounded border-gray-300"
                                        >
                                            <option value="">Select Province</option>
                                            {provinces.map((prov) => (
                                                <option key={prov} value={prov}>
                                                    {prov}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    {/* Municipality */}
                                    <label className="block">
                                        <span>Municipality</span>
                                        <select
                                            value={buildingData.address.municipality}
                                            onChange={(e) =>
                                                setBuildingData("address", {
                                                    ...buildingData.address,
                                                    municipality: e.target.value,
                                                    barangay: "",
                                                })
                                            }
                                            className="mt-1 block w-full rounded border-gray-300"
                                        >
                                            <option value="">Select Municipality</option>
                                            {municipalities.map((mun) => (
                                                <option key={mun} value={mun}>
                                                    {mun}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    {/* Barangay */}
                                    <label className="block">
                                        <span>Barangay</span>
                                        <select
                                            value={buildingData.address.barangay}
                                            onChange={(e) =>
                                                setBuildingData("address", {
                                                    ...buildingData.address,
                                                    barangay: e.target.value,
                                                })
                                            }
                                            className="mt-1 block w-full rounded border-gray-300"
                                        >
                                            <option value="">Select Barangay</option>
                                            {barangays.map((brgy, idx) => (
                                                <option key={idx} value={brgy}>
                                                    {brgy}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    {/* Latitude */}
                                    <label className="block">
                                        <span>Latitude</span>
                                        <input
                                            type="text"
                                            value={buildingData.latitude}
                                            onChange={(e) => setBuildingData("latitude", e.target.value)}
                                            className="mt-1 block w-full rounded border-gray-300"
                                            placeholder="e.g. 14.5995"
                                        />
                                        {buildingErrors.latitude && (
                                            <span className="text-red-500 text-sm">{buildingErrors.latitude}</span>
                                        )}
                                    </label>

                                    {/* Longitude */}
                                    <label className="block">
                                        <span>Longitude</span>
                                        <input
                                            type="text"
                                            value={buildingData.longitude}
                                            onChange={(e) => setBuildingData("longitude", e.target.value)}
                                            className="mt-1 block w-full rounded border-gray-300"
                                            placeholder="e.g. 120.9842"
                                        />
                                        {buildingErrors.longitude && (
                                            <span className="text-red-500 text-sm">{buildingErrors.longitude}</span>
                                        )}
                                    </label>
                                </div>

                                {/* Save button */}
                                <button
                                    type="submit"
                                    disabled={buildingProcessing}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                                >
                                    {buildingProcessing ? "Saving..." : "Save Changes"}
                                </button>

                            </form>
                        </div>
                    )}
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
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="min-w-full text-sm text-gray-800">
                                <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Room Name</th>
                                        <th className="px-6 py-3 text-left">Image</th>
                                        <th className="px-6 py-3 text-left">Price</th>
                                        <th className="px-6 py-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <tr
                                            key={room.id}
                                            className="border-t border-gray-200 hover:bg-indigo-50 transition"
                                        >
                                            <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                <Link
                                                    href={`/home/room/${room.id}`}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    {room.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={`/storage/${room.image}`}
                                                    alt={room.name}
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700 font-semibold">₱{room.price}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/seller/room/${room.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-full shadow hover:bg-indigo-700 transition"
                                                >
                                                    View Details
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


