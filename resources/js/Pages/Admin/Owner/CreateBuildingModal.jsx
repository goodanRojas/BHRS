import AdminLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Toast from "@/Components/Toast";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
export default function CreateBuildingModal({ owner, isOpen, onClose }) {
    // console.log(owners);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, reset } = useForm({
        owner_id: owner.id || null,
        image: null,
        bir: null,
        business_permit: null,
        name: "",
        long: "",
        lat: "",
        number_of_floors: "",
        street: "",
        barangay: "",
        city: "",
        postal_code: "",
        province: "",
        country: "",
    });

    const nextStep = () => {
        setStep(step + 1);
    };
    const prevStep = () => {
        setStep(step - 1);
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        setData(fieldName, file);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.owner.buildings.store"), {
            onFinish: () => {
                // reset();
                setStep(1);
                onClose(); // close modal
            },
        });
    };

    if (!isOpen) return null;

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Name" className="block text-lg font-medium text-gray-700" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name || ""}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2 text-sm text-red-600" />
                        </div>
                        <div>
                            <InputLabel htmlFor="lat" value="Latitude" className="block text-lg font-medium text-gray-700" />
                            <input
                                id="lat"
                                type="number"
                                name="lat"
                                value={data.lat || ""}
                                placeholder="e.g 10.250228244691149"
                                step="any"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="lat"
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (e.target.value === "" || (val >= -90 && val <= 90)) {
                                        setData("lat", e.target.value);
                                    }
                                }}
                            />
                            <InputError message={errors.lat} className="mt-2 text-sm text-red-600" />
                        </div>

                        <div>
                            <InputLabel htmlFor="long" value="Longitude" className="block text-lg font-medium text-gray-700" />
                            <input
                                id="long"
                                type="number"
                                name="long"
                                value={data.long || ""}
                                placeholder="e.g 124.98430492779187"
                                step="any"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="long"
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (e.target.value === "" || (val >= -180 && val <= 180)) {
                                        setData("long", e.target.value);
                                    }
                                }}
                            />
                            <InputError message={errors.long} className="mt-2 text-sm text-red-600" />
                        </div>


                        <div>
                            <InputLabel htmlFor="number_of_floors" value="Number of Floors" className="block text-lg font-medium text-gray-700" />
                            <TextInput
                                id="number_of_floors"
                                type="number"
                                name="number_of_floors"
                                value={data.number_of_floors || ""}
                                min="1"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="number_of_floors"
                                isFocused={true}
                                onChange={(e) => setData('number_of_floors', e.target.value)}
                            />
                            <InputError message={errors.number_of_floors} className="mt-2 text-sm text-red-600" />
                        </div>

                    </div>
                )
            case 2: return (
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="image" value="Image" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="image"
                            type="file"
                            accept="image/*"
                            name="image"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            isFocused={true}
                            onChange={(e) => handleFileChange(e, 'image')}
                        />
                        <InputError message={errors.image} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="bir" value="BIR" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="bir"
                            type="file"
                            name="bir"
                            accept="application/pdf"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            onChange={(e) => handleFileChange(e, 'bir')}
                        />
                        <InputError message={errors.bir} className="mt-2 text-sm text-red-600" />
                    </div>

                    <div>
                        <InputLabel htmlFor="business_permit" value="Business Permit" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="business_permit"
                            type="file"
                            name="business_permit"
                            accept="application/pdf"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            onChange={(e) => handleFileChange(e, 'business_permit')}
                        />
                        <InputError message={errors.business_permit} className="mt-2 text-sm text-red-600" />
                    </div>

                </div>
            )
            case 3: return (
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="street" value="Street" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="street"
                            type="text"
                            name="street"
                            value={data.street || ""}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="street"
                            onChange={(e) => setData('street', e.target.value)}
                        />
                        <InputError message={errors.street} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="barangay" value="Barangay" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="barangay"
                            type="text"
                            name="barangay"
                            value={data.barangay || ""}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="barangay"
                            onChange={(e) => setData('barangay', e.target.value)}
                        />
                        <InputError message={errors.barangay} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="city" value="City" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="city"
                            type="text"
                            name="city"
                            value={data.city || ""}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="city"
                            onChange={(e) => setData('city', e.target.value)}
                        />
                        <InputError message={errors.city} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="province" value="Province" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="province"
                            type="text"
                            name="province"
                            value={data.province || ""}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="province"
                            onChange={(e) => setData('province', e.target.value)}
                        />
                        <InputError message={errors.province} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="postal_code" value="Postal Code" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="postal_code"
                            type="number"
                            name="postal_code"
                            value={data.postal_code || ""}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="postal_code"
                            onChange={(e) => setData('postal_code', e.target.value)}
                        />
                        <InputError message={errors.postal_code} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="country" value="Country" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="country"
                            type="text"
                            name="country"
                            value={data.country || ""}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="country"
                            onChange={(e) => setData('country', e.target.value)}
                        />
                        <InputError message={errors.country} className="mt-2 text-sm text-red-600" />
                    </div>
                </div>
            )
            case 4:
                console.log(data);
                return (
                    <div className="space-y-4 relative">
                        <h3 className="text-lg font-semibold">Review Your Information</h3>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    {/* Image Preview */}
                                    {data.image ? (
                                        <img
                                            src={URL.createObjectURL(data.image)} // Create object URL for image preview
                                            alt="Selected image"
                                            className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                        />
                                    ) : (
                                        <span className="text-gray-500">No Image Selected</span>
                                    )}

                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Name:</p>
                                    <p className="text-gray-900">{data.name || '-'}</p>
                                </div>

                                {/* Latitude */}
                                <div>
                                    <p className="font-medium text-gray-700">Latitude:</p>
                                    <p className="text-gray-900">{data.lat || '-'}</p>
                                </div>

                                {/* Longitude */}
                                <div>
                                    <p className="font-medium text-gray-700">Longitude:</p>
                                    <p className="text-gray-900">{data.long || '-'}</p>
                                </div>

                                {/* Number of Floors */}
                                <div>
                                    <p className="font-medium text-gray-700">Number of Floors:</p>
                                    <p className="text-gray-900">{data.number_of_floors || '-'}</p>
                                </div>


                                {/* BIR File Name */}
                                <div>
                                    <p className="font-medium text-gray-700">BIR:</p>
                                    {data.bir ? (
                                        <p className="text-gray-900">{data.bir.name}</p> // Display the file name
                                    ) : (
                                        <p className="text-gray-500">No BIR file selected</p>
                                    )}
                                </div>

                                {/* Business Permit File Name */}
                                <div>
                                    <p className="font-medium text-gray-700">Business Permit:</p>
                                    {data.business_permit ? (
                                        <p className="text-gray-900">{data.business_permit.name}</p> // Display the file name
                                    ) : (
                                        <p className="text-gray-500">No Business Permit file selected</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                );


        }
    }
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center overflow-y-auto items-start">
            <div
                className="bg-white p-6 rounded-lg shadow w-full max-w-2xl my-10"
                onClick={(e) => e.stopPropagation()} // prevent accidental outside click
            >
                <h2 className="text-lg font-semibold mb-4">Create Building</h2>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Step {step}</h3>
                </div>
                <form
                    onSubmit={handleSubmit}
                  /*   onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                        }
                    }} */
                >
                    {renderStep()}
                    <div className="flex justify-between mt-6">
                        {/* Previous Button */}
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`px-4 py-2 rounded-md ${step === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Previous
                        </button>

                        {/* Next Button */}
                        <button
                            type="button"
                            onClick={nextStep}
                            className={`px-4 py-2 rounded-md ${step === 4 ? 'hidden' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            Next
                        </button>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing || step !== 4}
                            className={`px-4 py-2 rounded-md ${processing? 'bg-green-400 text-gray-200': ''}  ${step === 4 ? 'bg-green-600 text-white hover:bg-green-700' : 'hidden'
                                }`}
                        >
                            Submit
                        </button>
                    </div>

                </form>

                {/* Close button */}
                <div className=" absolute top-8 right-16 flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="text-gray-600 text-sm hover:underline hover:text-black"
                    >
                        <FontAwesomeIcon icon={faTimes} className="mr-2 text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
}