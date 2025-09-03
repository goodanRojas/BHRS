import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    address
}) {
    const {seller} = usePage().props.auth;
    console.log('Seller:', seller);
    const [preview, setPreview] = useState(seller.avatar ? `/storage/${seller.avatar}` : '/storage/profile/default_avatar.png');
    const { data, setData, patch, post, errors, processing, recentlySuccessful } =
        useForm({
            name: seller.name,
            email: seller.email,
            avatar: seller.avatar || null, // Initialize avatar to null if not set
            phone: seller.phone || '', // Ensure phone is initialized
            address: {
                street: address?.street || '',
                barangay: address?.barangay || '',
                city: address?.city || '',
                province: address?.province || '',
                postal_code: address?.postal_code || '',
                country: address?.country || '',
            },
        });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone || ''); // Ensure phone is added

        // If avatar is set, append it to FormData
        if (data.avatar) {
            formData.append('avatar', data.avatar);
            console.log('Avatar file selected:', data.avatar);  // Log file data for debugging
        } else {
            formData.append('avatar', '');  // Ensure avatar field is always included
        }

        formData.append('address', JSON.stringify(data.address)); // Ensure address is correctly appended

        // Send the form data to the backend using a POST request
        post(route('seller.profile.update'),formData);
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file); // Update with the selected file
            setPreview(URL.createObjectURL(file)); // Set preview image
        }
    };

    const handleAddressChange = (field, value) => {
        setData('address', { ...data.address, [field]: value });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} encType="multipart/form-data" className="mt-6 space-y-6">
                {/* Profile Picture */}
                <div>
                    <InputLabel htmlFor="avatar" value="Profile Picture" />
                    <div className="flex items-center gap-4">
                        {/* Display current profile picture if exists, or display default profile */}
                        <img
                            src={preview}
                            alt="Profile Picture"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <label htmlFor="avatar">
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                            />
                        </label>
                        {/* File input for profile picture */}
                        <input
                            type="file"
                            id="avatar"
                            name="avatar"
                            onChange={handleProfilePictureChange}
                            className="mt-1 hidden"
                            accept="image/*"
                        />
                    </div>
                    <InputError className="mt-2" message={errors.avatar} />
                </div>


                {/* Name Field */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>
                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="sellername"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>
                {/* Phone Field */}
                <div>
                    <InputLabel htmlFor="phone" value="Phone" />

                    <TextInput
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                        autoComplete="phone"
                    />

                    <InputError className="mt-2" message={errors.phone} />
                </div>
                {/* Address Fields */}
                <div className="space-y-6 items-center justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Street Field */}
                    <div>
                        <InputLabel htmlFor="street" value="Street" />
                        <TextInput
                            id="street"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.address.street}
                            onChange={(e) => handleAddressChange('street', e.target.value)}
                            required
                            autoComplete="address-line1"
                        />
                        <InputError className="mt-2" message={errors.address?.street} />
                    </div>

                    {/* Barangay Field */}
                    <div>
                        <InputLabel htmlFor="barangay" value="Barangay" />
                        <TextInput
                            id="barangay"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.address.barangay}
                            onChange={(e) => handleAddressChange('barangay', e.target.value)}
                            required
                            autoComplete="address-line1"
                        />
                        <InputError className="mt-2" message={errors.address?.barangay} />
                    </div>

                    {/* City Field */}
                    <div>
                        <InputLabel htmlFor="city" value="City" />
                        <TextInput
                            id="city"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.address.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            required
                            autoComplete="address-level2"
                        />
                        <InputError className="mt-2" message={errors.address?.city} />
                    </div>

                    {/* Province Field */}
                    <div>
                        <InputLabel htmlFor="province" value="Province" />
                        <TextInput
                            id="province"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.address.province}
                            onChange={(e) => handleAddressChange('province', e.target.value)}
                            required
                            autoComplete="address-level2"
                        />
                        <InputError className="mt-2" message={errors.address?.province} />
                    </div>

                    {/* Postal Code Field */}
                    <div>
                        <InputLabel htmlFor="postal_code" value="Postal Code" />
                        <TextInput
                            id="postal_code"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.address.postal_code}
                            onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                            required
                            autoComplete="postal-code"
                        />
                        <InputError className="mt-2" message={errors.address?.postal_code} />
                    </div>

                    {/* Country Field */}
                    <div>
                        <InputLabel htmlFor="country" value="Country" />
                        <TextInput
                            id="country"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.address.country}
                            onChange={(e) => handleAddressChange('country', e.target.value)}
                            required
                            autoComplete="country"
                        />
                        <InputError className="mt-2" message={errors.address?.country} />
                    </div>
                </div>

                {/* Verification Logic */}
                {mustVerifyEmail && seller.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
