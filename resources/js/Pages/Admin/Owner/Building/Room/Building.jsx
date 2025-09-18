import AuthenticatedLayout from "../../../AuthenticatedLayout";
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
import RulesAndRegulation from './RulesAndRegulation';
import { motion, AnimatePresence } from 'framer-motion';
export default function Building({ building }) {

    console.log(building);
    const [showFeatureInput, setShowFeatureInput] = useState(false);
    const [featureName, setFeatureName] = useState('');
    const [featureDescription, setFeatureDescription] = useState('');
    const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
    const [features, setFeatures] = useState(building?.features || []);
    const [rooms, setRooms] = useState(building?.rooms || []);
    const [images, setImages] = useState(building?.images || []);
    const [roomPreview, setRoomPreview] = useState(null);
    const [toastMessage, setToastMessage] = useState({
        'message': '',
        'isTrue': false,
        'isType': '',
    });

    const [openSettings, setOpensettings] = useState(false);
    const optionButtonRef = useRef(null);
    const optionPopupRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [duplicateError, setDuplicateError] = useState('');

    const fileInputRef = useRef(null);
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
        bir: '',
        business_permit: ''
    });
    const [showEditBuildingDetails, setShowEditBuildingDetails] = useState(false);


    const handleFileChange = async (e) => {
        const file = e.target.files[0]; // only take first file
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file); // note: key "image" (not array)
        formData.append('id', building.id);

        try {
            const response = await axios.post("/admin/owner/buildings/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response);
            // backend returns single image object
            const uploadedImage = response.data.uploadedImages;
            setImages((prevImages) => [...prevImages, uploadedImage]);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
        // clear input so user can upload same file again if needed
        e.target.value = null;
    };

    const handleImageButtonClick = () => {
        if (images.length >= 5) {
            // Show a toast or alert instead of opening the file picker
            setToastMessage({
                message: "You can only upload up to 5 images.",
                isTrue: true,
                isType: "error",
            });
            return;
        }
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }

    };


    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
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
                const response = await axios.post('/admin/owner/buildings/add-feature', {
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
        // Handle form submission for creating a new room
        try {
            const formData = new FormData();
            formData.append('name', data.name);
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
                    },
                ]);
            }

            // Close the modal and reset the form
            setAddRoomModalOpen(false);
            setRoomPreview(null);
            reset();
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const handleUpdateBuilding = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("id", building.id);
        formData.append("name", buildingData.name);
        formData.append("latitude", buildingData.latitude);
        formData.append("longitude", buildingData.longitude);

        // address
        formData.append("address[region]", buildingData.address.region);
        formData.append("address[province]", buildingData.address.province);
        formData.append("address[municipality]", buildingData.address.municipality);
        formData.append("address[barangay]", buildingData.address.barangay);

        // files
        if (buildingData.bir) formData.append("bir", buildingData.bir);
        if (buildingData.business_permit) formData.append("business_permit", buildingData.business_permit);
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await axios.post(`/admin/owner/buildings/update/${building.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            resetBuilding();
            setShowEditBuildingDetails(false);
            setToastMessage({
                message: "Building updated successfully",
                isTrue: true,
                isType: "success",
            });
        } catch (error) {
            console.error("Error updating building:", error);
        }
    };


    const handleUpdateFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // store the file in buildingData under the correct type
        setBuildingData((prev) => ({
            ...prev,
            [type]: file,
        }));

        // clear input so same file can be re-selected
        e.target.value = null;
    };



    // EDIT MAIN IMAGE
    const handleEditMainImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(`/admin/owner/buildings/update-main-image/${building.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            building.image = response.data.image; // backend should return new file path
            setToastMessage({ message: "Main image updated.", isTrue: true, isType: "success" });
        } catch (error) {
            console.error("Error updating main image:", error);
        }
    };

    // DELETE CAROUSEL IMAGE
    const handleDeleteCarouselImage = async (imageId) => {
        try {
            const response = await axios.post(`/admin/owner/buildings/delete-image/${imageId}`);
            if (response.data.success) {
                setImages((prev) => prev.filter((img) => img.id !== imageId));
                setToastMessage({ message: "Image deleted.", isTrue: true, isType: "success" });
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    // EDIT CAROUSEL IMAGE
    const handleEditCarouselImage = async (e, imageId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(`/admin/owner/buildings/update-image/${imageId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // update state
            setImages((prev) =>
                prev.map((img) => (img.id === imageId ? { ...img, file_path: response.data.image } : img))
            );
            setToastMessage({ message: "Image updated.", isTrue: true, isType: "success" });
        } catch (error) {
            console.error("Error updating carousel image:", error);
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
        <AuthenticatedLayout>
            <Head title={building.name} />
            {toastMessage && <Toast message={toastMessage.message} isTrue={toastMessage.isTrue} isType={toastMessage.isType} id={Date.now()} />}
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
                                        onClick={() => {
                                            setShowEditBuildingDetails(true);
                                        }}
                                        className=" group block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <FontAwesomeIcon className='group-hover:text-gray-900 transition-all duration-200' icon={faPen} /> Edit
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Image Section */}
                    <div className="relative overflow-hidden rounded-lg shadow-md group">
                        {building.image ? (
                            <>
                                <img
                                    src={`/storage/${building.image}`}
                                    alt={building.name}
                                    className="w-full h-56 md:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Edit button */}
                                <label className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-black/50 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-black/70 transition">
                                    <FontAwesomeIcon icon={faPen} className="text-sm" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditMainImage}
                                        className="hidden"
                                    />
                                </label>
                            </>
                        ) : (
                            <div className="w-full h-56 md:h-72 flex items-center justify-center bg-gray-100 rounded-lg">
                                <p className="text-gray-400">No main image</p>
                            </div>
                        )}
                    </div>

                    {/* Image Carousel Section */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h4 className="text-gray-700 font-medium">Additional Images</h4>

                            {/* Upload Button */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    name="image-carousel"
                                    accept="image/*"
                                    multiple
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    onClick={handleImageButtonClick}
                                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="text-gray-500 text-xs" />
                                    Add (max 5)
                                </button>
                            </div>
                        </div>

                        {/* Carousel */}
                        <div className="overflow-x-hidden hover:overflow-x-auto mt-4 flex gap-4 pb-2">
                            {images.length > 0 ? (
                                images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative min-w-[96px] h-24 rounded-md overflow-hidden shadow group"
                                    >
                                        <img
                                            src={`/storage/${image.file_path}`}
                                            alt={`uploaded-${image.id}`}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />

                                        {/* Hover Controls */}
                                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => handleDeleteCarouselImage(image.id)}
                                                className="bg-white text-red-600 p-1.5 rounded-full shadow hover:bg-red-50 transition"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                            </button>
                                            <label className="bg-white text-indigo-600 p-1.5 rounded-full shadow cursor-pointer hover:bg-indigo-50 transition">
                                                <FontAwesomeIcon icon={faPen} className="text-xs" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleEditCarouselImage(e, image.id)}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">No additional images</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between">
                    {!isEditing && (
                        <>
                            <div className='flex items-center justify-between'>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">{building.name}</h2>
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
                                        <>
                                            <FontAwesomeIcon
                                                icon={faCheckSquare}
                                                className="mr-1 text-green-500"
                                            />
                                            <a
                                                href={`/storage/${building.bir}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                <span className="ml-1">BIR</span>
                                            </a>
                                        </>
                                    ) : (<>
                                        <FontAwesomeIcon icon={faTimes} className="mr-1 text-red-500" />
                                        <span className="ml-1">BIR</span>
                                    </>
                                    )}
                                </div>
                                <div className="flex items-center mb-2 sm:mb-0 mr-4">
                                    {building.business_permit ? (
                                        <>
                                            <FontAwesomeIcon
                                                icon={faCheckSquare}
                                                className="mr-1 text-green-500"
                                            />
                                            <a
                                                href={`/storage/${building.business_permit}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                <span className="ml-1">Fire Safety Certificate</span>
                                            </a>
                                        </>
                                    ) : (<>
                                        <FontAwesomeIcon icon={faTimes} className="mr-1 text-red-500" />
                                        <span className="ml-1">Fire Safety Certificate</span>
                                    </>
                                    )}
                                </div>


                            </div>

                            {/* Features */}
                            <div >
                                <div className='flex items-center gap-2'>
                                    <p className='text-sm text-gray-900'>Features</p>

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
                                    <motion.div
                                        className="relative p-4 flex flex-wrap gap-3"
                                        initial="hidden"
                                        animate="show"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
                                        }}
                                    >
                                        {features.map((feature) => (
                                            <motion.div
                                                key={feature.id}
                                                className="relative group cursor-pointer"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {/* Feature Card */}
                                                <div className="bg-gradient-to-r from-indigo-50 to-white border border-gray-200 shadow-sm rounded-xl px-3 py-2 transition-all group-hover:shadow-md group-hover:border-indigo-200">
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                                                        {feature.name}
                                                    </span>
                                                </div>

                                                {/* Delete button (X) */}
                                                <motion.button
                                                    onClick={() => handleDeleteFeature(feature.id)}
                                                    className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.p
                                        className="text-gray-500 py-6 text-center text-sm"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        No features added yet ✨
                                    </motion.p>
                                )}
                            </div>


                            {/* Rules And Regulations */}
                            <RulesAndRegulation sellerId={building.seller_id} buildingId={building.id} />
                        </>
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
                        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3">Room Name</th>
                                        <th className="px-6 py-3">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room, idx) => (
                                        <tr
                                            key={room.id}
                                            onClick={() => (window.location.href = `/admin/owner/building/room/show/${room.id}`)}
                                            className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } border-t border-gray-100 hover:bg-indigo-50/50 hover:cursor-pointer transition-colors`}
                                        >
                                            <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                {room.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={`/storage/${room.image}`}
                                                    alt={room.name}
                                                    className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-6 text-sm">
                            No rooms found.
                        </div>
                    )}

                </div>

            </div>



            {/* Add Room Modal */}
            <Modal show={addRoomModalOpen} onClose={() => setAddRoomModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Room</h2>

                    <form onSubmit={handleRoomCreateSubmit} className="space-y-5">
                        {/* Image Upload with Drag & Drop + Preview */}
                        <div>
                            <InputLabel
                                htmlFor="image"
                                value="Room Image"
                                className="block text-sm font-medium text-gray-600 mb-2"
                            />

                            <div
                                className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        setData("image", file);
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                                onClick={() => document.getElementById("imageInput").click()}
                            >
                                {roomPreview ? (
                                    <img
                                        src={roomPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <p className="text-gray-400 text-sm">
                                        Drag & drop an image here, or click to select
                                    </p>
                                )}
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setData("image", file);
                                            setRoomPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </div>

                            <InputError message={errors.image} className="mt-2 text-sm text-red-500" />
                        </div>

                        {/* Room Name */}
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Room Name"
                                className="block text-sm font-medium text-gray-600 mb-1"
                            />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="w-full border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => {
                                    setData("name", e.target.value);

                                    // check for duplicate
                                    const isDuplicate = rooms.some(
                                        (room) => room.name.toLowerCase() === e.target.value.toLowerCase()
                                    );
                                    setDuplicateError(isDuplicate ? 'Room name must be unique.' : '');
                                }}
                            />
                            <InputError message={duplicateError || errors.name} className="mt-1 text-sm text-red-500" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setAddRoomModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 rounded-lg text-white transition ${processing
                                    ? "bg-indigo-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                                    }`}
                            >
                                {processing ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/*Edit Building Details Modal  */}
            <Modal show={showEditBuildingDetails} onClose={() => setShowEditBuildingDetails(false)}>
                <div className="space-y-3">
                    <form onSubmit={handleUpdateBuilding} method="POST">
                        {/* Close Button */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                                onClick={() => setShowEditBuildingDetails(false)}
                            >
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>

                        {/* Name */}
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

                        {/* BIR Upload */}
                        <div>
                            <label className="block text-sm font-medium">BIR Document</label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleUpdateFileChange(e, "bir")}
                                className="mt-1 block w-full border rounded-lg p-2"
                            />
                            {buildingData.bir && (
                                <div className="mt-2">
                                    {buildingData.bir.type?.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(buildingData.bir)}
                                            alt="BIR Preview"
                                            className="w-32 h-32 object-cover rounded-lg border"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">PDF Selected</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Business Permit Upload */}
                        <div>
                            <label className="block text-sm font-medium">Business Permit</label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleUpdateFileChange(e, "business_permit")}
                                className="mt-1 block w-full border rounded-lg p-2"
                            />
                            {buildingData.business_permit && (
                                <div className="mt-2">
                                    {buildingData.business_permit.type?.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(buildingData.business_permit)}
                                            alt="Business Permit Preview"
                                            className="w-32 h-32 object-cover rounded-lg border"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">PDF Selected</p>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowEditBuildingDetails(false)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={buildingProcessing}
                                className={`px-4 py-2 rounded-lg text-white transition ${buildingProcessing
                                    ? "bg-indigo-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                                    }`}
                            >
                                {buildingProcessing ? "Saving..." : "Save"}
                            </button>
                        </div>


                    </form>
                </div>

            </Modal>

        </AuthenticatedLayout >
    );


}


