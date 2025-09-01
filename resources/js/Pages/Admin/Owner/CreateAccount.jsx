import AdminLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from 'axios';
import Toast from "@/Components/Toast";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import ph from '@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';

export default function CreateAccount() {
    const [toastMessage, setToastMessage] = useState(null); // State to manage the toast message
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: {
            region: "",
            province: "",
            city: "",
            barangay: "",
        },
    });



    const nextStep = () => {
        setStep(step + 1);
    };
    const prevStep = () => {
        setStep(step - 1);
    };
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
                                value={data.name}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2 text-sm text-red-600" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="block text-lg font-medium text-gray-700" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="email"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-sm text-red-600" />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" value="Phone" className="block text-lg font-medium text-gray-700" />
                            <TextInput
                                id="phone"
                                type="tel"
                                name="phone"
                                value={data.phone}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="phone"
                                isFocused={true}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="mt-2 text-sm text-red-600" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" className="block text-lg font-medium text-gray-700" />

                            <div className='relative'>
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-3 right-5 text-sm text-gray-500 focus:outline-none focus:text-gray-700 hover:text-gray-700"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                    </div>
                )
            case 2:
                // cascading location lists
                const regions = Object.entries(ph);
                const provinces = data.address?.region
                    ? Object.keys(ph[data.address.region].province_list)
                    : [];
                const municipalities = data.address?.province
                    ? Object.keys(
                        ph[data.address.region].province_list[data.address.province].municipality_list
                    )
                    : [];
                const barangays = data.address?.city
                    ? ph[data.address.region].province_list[data.address.province].municipality_list[data.address.city].barangay_list
                    : [];

                return (
                    <div className="space-y-4">
                        {/* Region */}
                        <div>
                            <InputLabel htmlFor="region" value="Region" />
                            <select
                                id="region"
                                value={data.address?.region || ""}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        address: {
                                            ...data.address,
                                            region: e.target.value,
                                            province: "",
                                            city: "",
                                            barangay: "",
                                        },
                                    })
                                }
                                className="mt-1 block w-full border rounded-md"
                            >
                                <option value="">Select Region</option>
                                {regions.map(([code, region]) => (
                                    <option key={code} value={code}>
                                        {region.region_name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors["address.region"]} />
                        </div>

                        {/* Province */}
                        <div>
                            <InputLabel htmlFor="province" value="Province" />
                            <select
                                id="province"
                                value={data.address?.province || ""}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        address: {
                                            ...data.address,
                                            province: e.target.value,
                                            city: "",
                                            barangay: "",
                                        },
                                    })
                                }
                                className="mt-1 block w-full border rounded-md"
                            >
                                <option value="">Select Province</option>
                                {provinces.map((prov) => (
                                    <option key={prov} value={prov}>
                                        {prov}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors["address.province"]} />
                        </div>

                        {/* City / Municipality */}
                        <div>
                            <InputLabel htmlFor="city" value="City / Municipality" />
                            <select
                                id="city"
                                value={data.address?.city || ""}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        address: {
                                            ...data.address,
                                            city: e.target.value,
                                            barangay: "",
                                        },
                                    })
                                }
                                className="mt-1 block w-full border rounded-md"
                            >
                                <option value="">Select City / Municipality</option>
                                {municipalities.map((mun) => (
                                    <option key={mun} value={mun}>
                                        {mun}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors["address.city"]} />
                        </div>

                        {/* Barangay */}
                        <div>
                            <InputLabel htmlFor="barangay" value="Barangay" />
                            <select
                                id="barangay"
                                value={data.address?.barangay || ""}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        address: {
                                            ...data.address,
                                            barangay: e.target.value,
                                        },
                                    })
                                }
                                className="mt-1 block w-full border rounded-md"
                            >
                                <option value="">Select Barangay</option>
                                {barangays.map((brgy) => (
                                    <option key={brgy} value={brgy}>
                                        {brgy}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors["address.barangay"]} />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Review Your Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium text-gray-700">Name:</p>
                                <p className="text-gray-900">{data.name || '-'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Email:</p>
                                <p className="text-gray-900">{data.email || '-'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Phone:</p>
                                <p className="text-gray-900">{data.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Password:</p>
                                <p className="text-gray-900">{data.password || '-'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Region:</p>
                                <p className="text-gray-900">{data.address?.region || '-'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Province:</p>
                                <p className="text-gray-900">{data.address?.province || '-'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">City / Municipality:</p>
                                <p className="text-gray-900">{data.address?.city || '-'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Barangay:</p>
                                <p className="text-gray-900">{data.address?.barangay || '-'}</p>
                            </div>

                        </div>
                    </div>
                );


        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if (step < 3) {
            // 🚫 block submission until the review step
            return;
        }
        console.log("Trying to submit");
        post(route('admin.owner.create'), {
            onFinish: () => {

                reset('password', 'name', 'email', 'phone', 'address');
                window.location.href = route('admin.owners');
            }
        });
    };
    return (
        <AdminLayout>
            <Head title="Application Form" />
            <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Create Owner Account</h2>

                {step < 3 ? (
                    // Steps 1 & 2 (no <form>)
                    <div>
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
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    // Step 3 (final review inside <form>)
                    <form onSubmit={handleSubmit}>
                        {renderStep()}
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Previous
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                )}

                {toastMessage && <Toast message={toastMessage} />}
            </div>
        </AdminLayout>
    );

}