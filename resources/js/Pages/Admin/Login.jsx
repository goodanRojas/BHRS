import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ApplicationLogo from '@/Components/ApplicationLogo';
export default function Login({ status, error }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.store'), {
            onFinish: () => reset('password'),
            onError: (errors) => {
                console.log('Errors from backend:', errors);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Admin Login" />
            <nav className="absolute top-0 left-0 w-full flex justify-center items-center px-5 pointer-events-none">
                <div className='flex items-center justify-center'>
                    <ApplicationLogo relative={true} />
                </div>
            </nav>

            {/* Centered Card */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 via-blue-500 to-gray-900 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-white/30 p-8"
                >
                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Admin Portal</h2>
                        <p className="text-gray-500">Secure login for administrators</p>
                    </div>

                    {/* Status */}
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-100 px-4 py-2 rounded-lg">
                            {status}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 text-sm font-medium text-red-600 bg-red-100 px-4 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="block text-sm font-semibold text-gray-700" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-sm text-red-600" />
                        </div>

                        {/* Password */}
                        <div>
                            <InputLabel htmlFor="password" value="Password" className="block text-sm font-semibold text-gray-700" />
                            <div className="relative mt-2">
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2 text-sm text-red-600" />
                        </div>

                        {/* Submit */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex justify-end">
                            <PrimaryButton
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg transition"
                                disabled={processing}
                            >
                                Log in
                            </PrimaryButton>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </GuestLayout>
    );
}
