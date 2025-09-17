
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ph from '@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';
import Toast from '@/Components/Toast';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '../AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
export default function CreateBuildingModal({ owner, isOpen, onClose }) {

    if (!isOpen) return null;
    const { data, setData, post, processing, errors, reset } = useForm({
        owner_id: owner.id || null,
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

    const [filePreviews, setFilePreviews] = useState({}); // preview state

    // handle file inputs with preview

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        setData(field, file);

        if (file) {
            if (file.type.startsWith("image/")) {
                setFilePreviews((prev) => ({
                    ...prev,
                    [field]: URL.createObjectURL(file),
                }));
            } else if (file.type === "application/pdf") {
                setFilePreviews((prev) => ({
                    ...prev,
                    [field]: "pdf",
                }));
            }
        }
    };

    // handle amenities
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

    // cascading locations
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
    const isValidLatitude = (lat) => {
        const num = parseFloat(lat);
        return !isNaN(num) && num >= -90 && num <= 90;
    };

    const isValidLongitude = (lng) => {
        const num = parseFloat(lng);
        return !isNaN(num) && num >= -180 && num <= 180;
    };

    // step validation
    const validateStep = () => {
        switch (step) {
            case 1: return data.buildingName && data.numberOfFloors;
            case 2:
                return (
                    data.address.region &&
                    data.address.province &&
                    data.address.municipality &&
                    data.address.barangay &&
                    isValidLatitude(data.latitude) &&
                    isValidLongitude(data.longitude)
                );
            case 3: return data.bir && data.fireSafetyCertificate;
            case 4: return data.numberOfRooms;
            default: return true;
        }
    };

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step < 5) return;

        post(route("admin.owner.buildings.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset();

                setStep(1);
                onClose(); // close modal
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

    // --- Step Indicator UI ---
    const StepIndicator = () => {
        const steps = [
            "Building Info",
            "Address",
            "Certificates",
            "Rooms & Amenities",
            "Review",
        ];
        return (
            <div className="flex justify-between mb-6">
                {steps.map((label, idx) => {
                    const stepNum = idx + 1;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                                    ${step >= stepNum ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-100 border-gray-300 text-gray-500"}
                                `}
                            >
                                {stepNum}
                            </div>
                            <span className="text-xs mt-2 text-center">{label}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <Input label="Building Name" value={data.buildingName} onChange={(e) => setData('buildingName', e.target.value)} error={errors.buildingName} />
                        <Input label="Number of Floors" type="number" value={data.numberOfFloors} onChange={(e) => setData('numberOfFloors', e.target.value)} error={errors.numberOfFloors} />
                        <FileInput label="Building Image" accept={"image/*"} field="image" error={errors.image} onFileChange={handleFileChange} />
                        {filePreviews.image && <FilePreview src={filePreviews.image} />}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        {/* Region - Province - Municipality - Barangay */}
                        <Select label="Region" value={data.address.region} onChange={(e) =>
                            setData('address', { region: e.target.value, province: '', municipality: '', barangay: '' })
                        }>
                            <option value="">Select Region</option>
                            {regions.map(([key, region]) => <option key={key} value={key}>{region.region_name}</option>)}
                        </Select>
                        <Select label="Province" value={data.address.province} onChange={(e) => setData('address', { ...data.address, province: e.target.value, municipality: '', barangay: '' })}>
                            <option value="">Select Province</option>
                            {provinces.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
                        </Select>
                        <Select label="Municipality" value={data.address.municipality} onChange={(e) => setData('address', { ...data.address, municipality: e.target.value, barangay: '' })}>
                            <option value="">Select Municipality</option>
                            {municipalities.map((mun) => <option key={mun} value={mun}>{mun}</option>)}
                        </Select>
                        <Select label="Barangay" value={data.address.barangay} onChange={(e) => setData('address', { ...data.address, barangay: e.target.value })}>
                            <option value="">Select Barangay</option>
                            {barangays.map((brgy, idx) => <option key={idx} value={brgy}>{brgy}</option>)}
                        </Select>
                        <Input
                            label="Latitude"
                            placeholder="e.g. 14.5995"
                            value={data.latitude}
                            onChange={(e) => setData("latitude", e.target.value)}
                            error={
                                data.latitude && !isValidLatitude(data.latitude)
                                    ? "Latitude must be between -90 and 90"
                                    : errors.latitude
                            }
                        />

                        <Input
                            label="Longitude"
                            placeholder="e.g. 120.9842"
                            value={data.longitude}
                            onChange={(e) => setData("longitude", e.target.value)}
                            error={
                                data.longitude && !isValidLongitude(data.longitude)
                                    ? "Longitude must be between -180 and 180"
                                    : errors.longitude
                            }
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <FileInput label="BIR" field="bir" error={errors.bir} onFileChange={handleFileChange} />
                        {filePreviews.bir && <FilePreview src={filePreviews.bir} />}
                        <FileInput label="Fire Safety Certificate" field="fireSafetyCertificate" error={errors.fireSafetyCertificate} onFileChange={handleFileChange} />
                        {filePreviews.fireSafetyCertificate && <FilePreview src={filePreviews.fireSafetyCertificate} />}
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <Input label="Number of Rooms" type="number" value={data.numberOfRooms} onChange={(e) => setData('numberOfRooms', e.target.value)} error={errors.numberOfRooms} />
                        <div>
                            <label className="block text-sm font-medium">Amenities</label>
                            <input
                                type="text"
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                onKeyDown={handleAmenityKeyDown}
                                placeholder="Type and press Enter"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.aminities.map((item, idx) => (
                                    <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                        {item}
                                        <button type="button" onClick={() => removeAmenity(item)} className="text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-2">Confirm your info</h3>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-2">
                            <p><strong>Building:</strong> {data.buildingName} ({data.numberOfFloors} floors)</p>
                            <p><strong>Address:</strong> {data.address.barangay}, {data.address.municipality}, {data.address.province} - {data.address.region}</p>
                            <p><strong>Rooms:</strong> {data.numberOfRooms}</p>
                            <p><strong>Amenities:</strong> {data.aminities.join(', ')}</p>
                            <div>
                                <strong>Files:</strong>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    {Object.entries(filePreviews).map(([field, src], idx) => (
                                        <div key={idx} className="p-2 border rounded-md text-center">
                                            <p className="text-sm font-medium mb-1">{field}</p>
                                            {src === "pdf" ? (
                                                <span className="text-red-600">📄 PDF Uploaded</span>
                                            ) : (
                                                <img src={src} alt={field} className="w-full h-32 object-cover rounded-md" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <>
            <Head title="Application Form" />
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} />

            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={onClose}
            >
                {/* Modal content */}
                <div
                    className="relative max-w-2xl w-full mx-4 bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()} // prevent backdrop click inside modal
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>

                    <h2 className="text-xl font-bold mb-4 text-gray-800">Apply Building</h2>

                    {/* Step Indicator */}
                    <StepIndicator step={step} />

                    {step < 5 ? (
                        <div>
                            {renderStep()}
                            <div className="flex justify-between mt-6">
                                {step > 1 && (
                                    <SecondaryButton onClick={() => setStep(step - 1)}>
                                        Previous
                                    </SecondaryButton>
                                )}
                                <SecondaryButton onClick={() => validateStep() && setStep(step + 1)}>
                                    Next
                                </SecondaryButton>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {renderStep()}
                            <div className="flex justify-between mt-6">
                                <SecondaryButton onClick={() => setStep(step - 1)}>
                                    Previous
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? "Processing..." : "Submit"}
                                </PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}


// Reusable Input
const Input = ({ label, error, ...props }) => (
    <label className="block">
        <span className="block text-sm font-medium">{label}</span>
        <input {...props} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        {error && <span className="text-red-500 text-sm">{error}</span>}
    </label>
);

// Reusable Select
const Select = ({ label, children, ...props }) => (
    <label className="block">
        <span className="block text-sm font-medium">{label}</span>
        <select {...props} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            {children}
        </select>
    </label>
);

const FileInput = ({ label, accept, field, error, onFileChange }) => (
    <label className="block">
        <span className="block text-sm font-medium">{label}</span>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-indigo-400 transition cursor-pointer">
            <input
                type="file"
                accept={accept || "application/pdf,image/*"}
                onChange={(e) => onFileChange(e, field)}
                className="sr-only"
            />
            <span className="text-gray-500 text-sm">Click to upload or drag and drop</span>
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
    </label>
);

// File Preview
const FilePreview = ({ src }) => (
    src === "pdf" ? (
        <span className="text-red-600">📄 PDF Uploaded</span>
    ) : (
        <img src={src} alt="Preview" className="w-full h-32 object-cover rounded-md mt-2 shadow" />
    )
);
