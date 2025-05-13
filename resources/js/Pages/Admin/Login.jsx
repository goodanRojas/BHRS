import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from './AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AdminLayout>
            <Head title="Log in" />
            {/* Background Image */}
            <div
                className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center bg-no-repeat -z-10"
                style={{ backgroundImage: "url('/storage/system/background/background.webp')" }}
            ></div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="w-full max-w-lg mx-auto p-6  backdrop-blur rounded-lg shadow-md space-y-6">
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

                <div className="mt-4 flex items-center justify-end">

                    <PrimaryButton className="ms-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
