import SellerLayout from '@/Layouts/SellerLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ph from '@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';
import Toast from '@/Components/Toast';

export default function MultiStepForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        buildingName: '',
        image: null,
        numberOfFloors: '',
        address: {
            region: '',
            province: '',
            municipality: '',
            barangay: '',
        },
        latitude: '',
        longitude: '',
        bir: null,
        fireSafetyCertificate: null,
        numberOfRooms: '',
        aminities: [],
    });

    const [step, setStep] = useState(1);
    const [amenityInput, setAmenityInput] = useState('');

    // handle file inputs
    const handleFileChange = (e, field) => {
        setData(field, e.target.files[0]);
    };

    // handle amenities add/remove
    const handleAmenityKeyDown = (e) => {
        if (e.key === 'Enter' && amenityInput.trim() !== '') {
            e.preventDefault();
            if (!data.aminities.includes(amenityInput.trim())) {
                setData('aminities', [...data.aminities, amenityInput.trim()]);
            }
            setAmenityInput('');
        }
    };

    const removeAmenity = (item) => {
        setData('aminities', data.aminities.filter((a) => a !== item));
    };

    // handle cascading location changes
    const regions = Object.entries(ph);
    const provinces = data.address.region
        ? Object.keys(ph[data.address.region].province_list)
        : [];
    const municipalities = data.address.province
        ? Object.keys(
            ph[data.address.region].province_list[data.address.province].municipality_list
        )
        : [];
    const barangays = data.address.municipality
        ? ph[data.address.region].province_list[data.address.province].municipality_list[
            data.address.municipality
        ].barangay_list
        : [];

    // step validation
    const validateStep = () => {
        switch (step) {
            case 1:
                return data.buildingName && data.numberOfFloors;
            case 2:
                return (
                    data.address.region &&
                    data.address.province &&
                    data.address.municipality &&
                    data.address.barangay
                );
            case 3:
                return data.bir && data.fireSafetyCertificate;
            case 4:
                return data.numberOfRooms;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const [toast, setToast] = useState({
        'show': false,
        'message': '',
        'type': 'success',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/seller/app/submit', {
            forceFormData: true, // ensure file upload works
            onSuccess: () => {
                reset();

                setToast({
                    show: true,
                    message: "Thanks for applying! Our staff will review your application.",
                    type: "success",
                });
            },
            onError: () => {
                setToast({
                    show: true,
                    message: "Sorry, there was an error submitting your application. Please try again later.",
                    type: "error",
                });
            }
        });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <label className="block">
                            <span>Building Name</span>
                            <input
                                type="text"
                                value={data.buildingName}
                                onChange={(e) => setData('buildingName', e.target.value)}
                                className="mt-1 block w-full rounded border-gray-300"
                            />
                            {errors.buildingName && (
                                <span className="text-red-500 text-sm">
                                    {errors.buildingName}
                                </span>
                            )}
                        </label>

                        <label className="block">
                            <span>Number of Floors</span>
                            <input
                                type="number"
                                value={data.numberOfFloors}
                                onChange={(e) => setData('numberOfFloors', e.target.value)}
                                className="mt-1 block w-full rounded border-gray-300"
                            />
                            {errors.numberOfFloors && (
                                <span className="text-red-500 text-sm">
                                    {errors.numberOfFloors}
                                </span>
                            )}
                        </label>

                        {/* 👇 New field for image */}
                        <label className="block">
                            <span>Building Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'image')}
                                className="mt-1 block w-full"
                            />
                            {errors.image && (
                                <span className="text-red-500 text-sm">{errors.image}</span>
                            )}
                        </label>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <label className="block">
                            <span>Region</span>
                            <select
                                value={data.address.region}
                                onChange={(e) =>
                                    setData('address', {
                                        region: e.target.value,
                                        province: '',
                                        municipality: '',
                                        barangay: '',
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

                        <label className="block">
                            <span>Province</span>
                            <select
                                value={data.address.province}
                                onChange={(e) =>
                                    setData('address', {
                                        ...data.address,
                                        province: e.target.value,
                                        municipality: '',
                                        barangay: '',
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

                        <label className="block">
                            <span>Municipality</span>
                            <select
                                value={data.address.municipality}
                                onChange={(e) =>
                                    setData('address', {
                                        ...data.address,
                                        municipality: e.target.value,
                                        barangay: '',
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

                        <label className="block">
                            <span>Barangay</span>
                            <select
                                value={data.address.barangay}
                                onChange={(e) =>
                                    setData('address', {
                                        ...data.address,
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

                        <label className="block">
                            <span>Latitude</span>
                            <input
                                type="text"
                                value={data.latitude}
                                onChange={(e) => setData("latitude", e.target.value)}
                                className="mt-1 block w-full rounded border-gray-300"
                                placeholder="e.g. 14.5995"
                            />
                            {errors.latitude && (
                                <span className="text-red-500 text-sm">{errors.latitude}</span>
                            )}
                        </label>

                        <label className="block">
                            <span>Longitude</span>
                            <input
                                type="text"
                                value={data.longitude}
                                onChange={(e) => setData("longitude", e.target.value)}
                                className="mt-1 block w-full rounded border-gray-300"
                                placeholder="e.g. 120.9842"
                            />
                            {errors.longitude && (
                                <span className="text-red-500 text-sm">{errors.longitude}</span>
                            )}
                        </label>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <label className="block">
                            <span>BIR</span>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'bir')}
                                className="mt-1 block w-full"
                            />
                            {errors.bir && (
                                <span className="text-red-500 text-sm">{errors.bir}</span>
                            )}
                        </label>
                        <label className="block">
                            <span>Fire Safety Certificate</span>
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'fireSafetyCertificate')}
                                className="mt-1 block w-full"
                            />
                            {errors.fireSafetyCertificate && (
                                <span className="text-red-500 text-sm">
                                    {errors.fireSafetyCertificate}
                                </span>
                            )}
                        </label>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <label className="block">
                            <span>Number of Rooms</span>
                            <input
                                type="number"
                                value={data.numberOfRooms}
                                onChange={(e) => setData('numberOfRooms', e.target.value)}
                                className="mt-1 block w-full rounded border-gray-300"
                            />
                            {errors.numberOfRooms && (
                                <span className="text-red-500 text-sm">
                                    {errors.numberOfRooms}
                                </span>
                            )}
                        </label>
                        <label className="block">
                            <span>Amenities</span>
                            <input
                                type="text"
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                onKeyDown={handleAmenityKeyDown}
                                placeholder="Type and press Enter"
                                className="mt-1 block w-full rounded border-gray-300"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.aminities.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => removeAmenity(item)}
                                            className="text-red-500"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </label>
                    </div>
                );
            case 5:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Confirm your info</h3>
                        <p>
                            <strong>Building:</strong> {data.buildingName} (
                            {data.numberOfFloors} floors)
                        </p>
                        <p>
                            <strong>Address:</strong> {data.address.barangay},{' '}
                            {data.address.municipality}, {data.address.province} -{' '}
                            {data.address.region}
                        </p>
                        <p>
                            <strong>Rooms:</strong> {data.numberOfRooms}
                        </p>
                        <p>
                            <strong>Amenities:</strong> {data.aminities.join(', ')}
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
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} />
            <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderStep()}

                    <div className="flex justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Previous
                            </button>
                        )}
                        {step < 5 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                {processing ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </SellerLayout>
    );
}
