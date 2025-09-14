import SellerLayout from '@/Layouts/SellerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faTimes,faPen, faTrash, faBed, faBedPulse, faCheckSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Toast from '@/Components/Toast';
import axios from 'axios';
export default function Bed({ bed }) {
    console.log(bed)
    const [showFeatureInput, setShowFeatureInput] = useState(false);
    const [featureName, setFeatureName] = useState('');
    const [featureDescription, setFeatureDescription] = useState('');
    const [features, setFeatures] = useState(bed.features);
    const [description, setDescription] = useState(bed.description || '');
    const [images, setImages] = useState(bed.images);
    const [toastMessage, setToastMessage] = useState({
        'message': '',
        'isTrue': false,
        'isType': '',
    });
    const fileInputRef = useRef(null);
    const handleFileChange = async (e) => {
        const file = e.target.files[0]; // only take first file
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file); // note: key "image" (not array)
        formData.append('id', bed.id);

        try {
            const response = await axios.post("/seller/bed/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
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
    const handleDescriptionSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        console.log("Description saved:", description);
        try {
            const response = await axios.post('/seller/bed/update-description', {
                description,
                id: bed.id,
            });
            setDescription(response.data.description);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputSubmit = (e) => {
        setFeatureName(e.target.value);
    };
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && featureName.trim()) {
            console.log('Feature saved:', featureName);
            try {
                const response = await axios.post('/seller/bed/add-feature', {
                    name: featureName,
                    description: featureDescription,
                    featureable_id: bed.id,
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
            const response = await axios.delete(`/seller/bed/delete-feature/${id}`);
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


    // EDIT MAIN IMAGE
    const handleEditMainImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(`/seller/bed/update-main-image/${bed.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            bed.image = response.data.image; // backend should return new file path
            setToastMessage({ message: "Main image updated.", isTrue: true, isType: "success" });
        } catch (error) {
            console.error("Error updating main image:", error);
        }
    };

    // DELETE CAROUSEL IMAGE
    const handleDeleteCarouselImage = async (imageId) => {
        try {
            const response = await axios.post(`/seller/bed/delete-image/${imageId}`);
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
            const response = await axios.post(`/seller/bed/update-image/${imageId}`, formData, {
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

    return (
        <SellerLayout>
            <div className='p-4'>
                <Head title={bed.name} />
                {toastMessage && <Toast message={toastMessage.message} isTrue={toastMessage.isTrue} isType={toastMessage.isType} id={Date.now()} />}

                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/seller/building' },
                        { label: bed.room.building.name, url: `/seller/building/${bed.room.building_id}` },
                        { label: bed.room.name, url: `/seller/room/${bed.room.id}` },
                        { label: bed.name },
                    ]} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Image Section */}
                    <div className="relative overflow-hidden rounded-lg shadow-md group">
                        {bed.image ? (
                            <>
                                <img
                                    src={`/storage/${bed.image}`}
                                    alt={bed.name}
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
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{bed.name}</h2>
                    <p className='text-gray-500 text-sm'>&#8369;{bed.price}</p>


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

                    {/* Description */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-semibold mb-2">Description</h3>
                        <form onSubmit={handleDescriptionSubmit}>
                            <textarea
                                name="description"
                                className="p-2 border rounded-md w-full mb-4"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Save
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </SellerLayout>
    );
}