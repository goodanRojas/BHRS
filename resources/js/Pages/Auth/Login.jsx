import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
export default function Login({ status, canResetPassword }) {

    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remeber: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="w-full backdrop-blur max-w-lg mx-auto p-6 rounded-lg shadow-md space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="block text-lg font-medium text-gray-700" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-sm text-red-600" />
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

                    <InputError message={errors.password} className="mt-2 text-sm text-red-600" />
                </div>
                <div className="flex items-center gap-3 mt-4">
                    <input
                        type="checkbox"
                        name="remember"
                        value="1"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <label htmlFor="remember">Remember Me</label>

                </div>
                <div className="mt-4 flex items-center justify-between">
                    <Link
                        href={route('password.request')}
                        className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                    >
                        Forgot your password?
                    </Link>
                    <PrimaryButton className="ms-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}