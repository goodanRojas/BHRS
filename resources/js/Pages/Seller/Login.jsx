import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestSellerLayout from '@/Layouts/GuestSellerLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('seller.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestSellerLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
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

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-sm text-red-600" />
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
        </GuestSellerLayout>
    );
}
