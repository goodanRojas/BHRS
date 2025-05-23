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
export default function Bed({ bed }) {
    const [showFeatureInput, setShowFeatureInput] = useState(false);
    const [featureName, setFeatureName] = useState('');
    const [featureDescription, setFeatureDescription] = useState('');
    const [features, setFeatures] = useState(bed.features);
  
    const handleInputSubmit = (e) => {
        setFeatureName(e.target.value);
    };
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && featureName.trim()) {
            console.log('Feature saved:', featureName);
            try {
                const response = await axios.post('/admin/owner/buildings/bed/add-feature', {
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
  
    return (
        <AuthenticatedLayout>
            <Head title={bed.name} />
            <Breadcrumbs
                links={[
                    { label: 'Buildings', url: '/admin/owner/buildings' },
                    { label: bed.room.building.name, url: `/admin/owner/buildings/${bed.room.building_id}` },
                    { label: bed.name },
                ]} />
            <div>
                <h2 className='text-lg font-semibold mb-4'>{bed.name}</h2>
            </div>
            {/* Image Section */}
            <div className="overflow-hidden rounded-t-lg">
                <img
                    src={`/storage/${bed.image}`}
                    alt={bed.name}
                    className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                />
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


            </div>

           
       
        </AuthenticatedLayout>
    );
}