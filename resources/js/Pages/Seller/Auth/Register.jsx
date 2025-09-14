import SellerLayout from '@/Layouts/SellerLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ph from '@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';
import Toast from '@/Components/Toast';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Register({ applicationCount, approvedCount }) {
    console.log(approvedCount);
    const { data, setData, post, processing, errors, reset } = useForm({
        image: null,
        fullname: '',
        password: '',
        email: '',
        phone: '',
        password_confirmation: '',
        address: {
            region: '',
            province: '',
            municipality: '',
            barangay: '',
        },
        landOwnerPaper: null,
        bir: null,
    });

    const { flash } = usePage().props;
    const [step, setStep] = useState(1);
    const [filePreviews, setFilePreviews] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    // file preview handler
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

    // cascaded location data
    const regions = Object.entries(ph);
    const provinces = data.address.region
        ? Object.keys(ph[data.address.region].province_list)
        : [];
    const municipalities = data.address.province
        ? Object.keys(ph[data.address.region].province_list[data.address.province].municipality_list)
        : [];
    const barangays = data.address.municipality
        ? ph[data.address.region].province_list[data.address.province].municipality_list[data.address.municipality].barangay_list
        : [];


    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push("At least 8 characters");
        if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
        if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
        if (!/[0-9]/.test(password)) errors.push("At least one number");
        if (!/[^A-Za-z0-9]/.test(password)) errors.push("At least one special character");
        return errors;
    };

    // step validation
    const validateStep = () => {
        switch (step) {
            case 1:
                return data.image && data.phone && data.email && data.fullname && data.password && data.password_confirmation;
            case 2:
                return (
                    data.address.region &&
                    data.address.province &&
                    data.address.municipality &&
                    data.address.barangay
                );
            case 3:
                return data.landOwnerPaper && data.bir;
            default:
                return true;
        }
    };

    const nextStep = () => validateStep() && setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step < 4) return;

        post('/seller/register', {
            forceFormData: true,
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
    useEffect(() => {
        if (flash.success) {
            setToast({
                show: true,
                message: flash.success,
                type: "success",
            });
            setStep(1);
            reset();
        }
        if (flash.error) {
            setToast({
                show: true,
                message: flash.error,
                type: "error",
            });
        }
    }, [flash]);
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0]; // get the first error message
            setToast({
                show: true,
                message: firstError,
                type: "error",
            });
        }
    }, [errors]);

    // step indicator
    const StepIndicator = () => {
        const steps = ["Profile", "Address", "Documents", "Review"];
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

    // render step form
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <FileInput label="Profile Image" accept={"image/*"} field="image" error={errors.image} onFileChange={handleFileChange} />
                        {filePreviews.image && <FilePreview src={filePreviews.image} />}
                        <Input label="Full Name" value={data.fullname} onChange={(e) => setData('fullname', e.target.value)} error={errors.fullname} />
                        <Input label="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} />
                        <Input label="Phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={errors.phone} />
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                error={
                                    data.password && validatePassword(data.password).length > 0
                                        ? "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
                                        : errors.password
                                }
                            />


                            <button
                                type="button"
                                className="absolute right-3 top-[45px] -translate-y-1/2 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirm ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                error={
                                    data.password_confirmation && data.password_confirmation !== data.password
                                        ? "Passwords do not match"
                                        : errors.password_confirmation
                                }
                            />


                            <button
                                type="button"
                                className="absolute right-3 top-[45px] -translate-y-1/2 text-gray-500"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                            </button>
                        </div>

                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <Select label="Region" value={data.address.region} onChange={(e) =>
                            setData('address', { region: e.target.value, province: '', municipality: '', barangay: '' })
                        }>
                            <option value="">Select Region</option>
                            {regions.map(([key, region]) => <option key={key} value={key}>{region.region_name}</option>)}
                        </Select>
                        <Select label="Province" value={data.address.province} onChange={(e) =>
                            setData('address', { ...data.address, province: e.target.value, municipality: '', barangay: '' })
                        }>
                            <option value="">Select Province</option>
                            {provinces.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
                        </Select>
                        <Select label="Municipality" value={data.address.municipality} onChange={(e) =>
                            setData('address', { ...data.address, municipality: e.target.value, barangay: '' })
                        }>
                            <option value="">Select Municipality</option>
                            {municipalities.map((mun) => <option key={mun} value={mun}>{mun}</option>)}
                        </Select>
                        <Select label="Barangay" value={data.address.barangay} onChange={(e) =>
                            setData('address', { ...data.address, barangay: e.target.value })
                        }>
                            <option value="">Select Barangay</option>
                            {barangays.map((brgy, idx) => <option key={idx} value={brgy}>{brgy}</option>)}
                        </Select>

                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <FileInput label="Land Owner Paper" field="landOwnerPaper" error={errors.landOwnerPaper} onFileChange={handleFileChange} />
                        {filePreviews.landOwnerPaper && <FilePreview src={filePreviews.landOwnerPaper} />}
                        <FileInput label="BIR" field="bir" error={errors.bir} onFileChange={handleFileChange} />
                        {filePreviews.bir && <FilePreview src={filePreviews.bir} />}
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-2">Review your info</h3>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-2">
                            <p><strong>Full Name:</strong> {data.fullname}</p>
                            <p><strong>Address:</strong> {data.address.barangay}, {data.address.municipality}, {data.address.province} - {data.address.region}</p>
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
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Application Form" />
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} />
            <div className="flex justify-center items-center px-6 mt-6">
                {applicationCount > 0 && (
                    <Link
                        href={route('seller.register.show')}
                        className="text-sm text-indigo-600 font-bold bg-white px-4 py-2 rounded-md shadow">
                        You have {applicationCount} pending applications.
                    </Link>
                )}
                {approvedCount > 0 && (
                    <Link
                        href={route('seller.register.approved')}
                        className="text-sm text-indigo-600 font-bold bg-white px-4 py-2 rounded-md shadow">
                        You have {approvedCount} approved application{approvedCount > 1 ? 's' : ''}.
                    </Link>
                )}
            </div>


            <div className="flex justify-center px-6 mt-6 mb-6">
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg w-full min-w-[250px]">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Application Form</h2>

                    <StepIndicator />

                    {step < 4 ? (
                        <div>
                            {renderStep()}
                            <div className="flex justify-between mt-6">
                                {step > 1 && (
                                    <SecondaryButton type="button" onClick={prevStep}>
                                        Previous
                                    </SecondaryButton>
                                )}
                                <SecondaryButton type="button" onClick={nextStep}>
                                    Next
                                </SecondaryButton>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {renderStep()}
                            <div className="flex justify-between mt-6">
                                <SecondaryButton type="button" onClick={prevStep}>
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
        </AuthenticatedLayout>
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

// File Input
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
