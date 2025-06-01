import AdminLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from 'axios';
import Toast from "@/Components/Toast";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
export default function CreateAccount() {
    const [toastMessage, setToastMessage] = useState(null); // State to manage the toast message
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        street: "",
        barangay: "",
        city: "",
        postalCode: "",
        province: "",
        country: "",
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
                        <div>
                            <InputLabel htmlFor="password" value="Password" className="block text-lg font-medium text-gray-700" />
                            <TextInput
                                id="password"
                                type="text"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-sm text-red-600" />
                        </div>

                    </div>
                )
            case 2: return (
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="street" value="Street" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="street"
                            type="text"
                            name="street"
                            value={data.street}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="street"
                            isFocused={true}
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
                            value={data.barangay}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="barangay"
                            isFocused={true}
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
                            value={data.city}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="city"
                            isFocused={true}
                            onChange={(e) => setData('city', e.target.value)}
                        />
                        <InputError message={errors.city} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="postalCode" value="Postal Code" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="postalCode"
                            type="number"
                            name="postalCode"
                            value={data.postalCode}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="postralCode"
                            isFocused={true}
                            onChange={(e) => setData('postalCode', e.target.value)}
                        />
                        <InputError message={errors.postalCode} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="province" value="Province" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="province"
                            type="text"
                            name="province"
                            value={data.province}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="province"
                            isFocused={true}
                            onChange={(e) => setData('province', e.target.value)}
                        />
                        <InputError message={errors.province} className="mt-2 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel htmlFor="country" value="Country" className="block text-lg font-medium text-gray-700" />
                        <TextInput
                            id="country"
                            type="text"
                            name="country"
                            value={data.country}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoComplete="country"
                            isFocused={true}
                            onChange={(e) => setData('country', e.target.value)}
                        />
                        <InputError message={errors.country} className="mt-2 text-sm text-red-600" />
                    </div>

                </div>
            )
            case 3: return (
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
                            <p className="font-medium text-gray-700">Street:</p>
                            <p className="text-gray-900">{data.street || '-'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Barangay:</p>
                            <p className="text-gray-900">{data.barangay || '-'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">City:</p>
                            <p className="text-gray-900">{data.city || '-'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Postal Code:</p>
                            <p className="text-gray-900">{data.postalCode || '-'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Province:</p>
                            <p className="text-gray-900">{data.province || '-'}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Country:</p>
                            <p className="text-gray-900">{data.country || '-'}</p>
                        </div>
                    </div>
                </div>
            );


        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.owner.create'), {
            onFinish: () => reset(['password', 'name', 'email', 'phone', 'street', 'barangay', 'city', 'postalCode', 'province', 'country']),
        });
    };
    return (
        <AdminLayout>
            <Head title="Application Form" />
            <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Create Owner Account</h2>
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
        </AdminLayout>
    );
}