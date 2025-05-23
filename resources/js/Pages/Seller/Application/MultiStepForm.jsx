import SellerLayout from '@/Layouts/SellerLayout';
import axios from 'axios';
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Toast from '@/Components/Toast';


function MultiStepForm() {
    const [toastMessage, setToastMessage] = useState(null); // State to manage the toast message
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        buildingName: '',
        numberOfFloors: '',
        address: '',
        bir: null,
        fireSafetyCertificate: null,
        numberOfRooms: '',
        numberOfBeds: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        setFormData({ ...formData, [fieldName]: file });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = new FormData();
        // Append all the form data
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                dataToSubmit.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post('/seller/app/submit', dataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setToastMessage(response.data.message);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Building Name
                            <input
                                type="text"
                                name="buildingName"
                                value={formData.buildingName || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            Number of floors
                            <input
                                type="number"
                                name="numberOfFloors"
                                value={formData.numberOfFloors || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            BIR
                            <input
                                type="file"
                                name="bir"
                                onChange={(e) => handleFileChange(e, 'bir')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            Fire Safety Certificate
                            <input
                                type="file"
                                name="fireSafetyCertificate"
                                onChange={(e) => handleFileChange(e, 'fireSafetyCertificate')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Number of rooms
                            <input
                                type="number"
                                name="numberOfRooms"
                                value={formData.numberOfRooms || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700">
                            Number of beds
                            <input
                                type="number"
                                name="numberOfBeds"
                                value={formData.numberOfBeds || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </label>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <p>Confirm your information:</p>
                        <p>Building Name: {formData.buildingName}</p>
                        <p>Number of Floors: {formData.numberOfFloors}</p>
                        <p>Number of Rooms: {formData.numberOfRooms}</p>
                        <p>Number of Beds: {formData.numberOfBeds}</p>
                        <p>
                            Building Permit: {formData.bir ? 'Uploaded' : 'Not Uploaded'}
                        </p>
                        <p>
                            Fire Safety Certificate: {formData.fireSafetyCertificate ? 'Uploaded' : 'Not Uploaded'}
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <SellerLayout>
            <Head title="Application Form" />
            <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Application Form</h2>
                <form onSubmit={handleSubmit}>
                    {/* Render the current step */}
                    {renderStep()}

                    <div className="flex justify-between mt-6">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Previous
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
                  {toastMessage && <Toast message={toastMessage} />}
            </div>
        </SellerLayout>
    );
}

export default MultiStepForm;
