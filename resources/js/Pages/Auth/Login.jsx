import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // rotating welcome text
    const messages = [
        "Welcome to BHRS",
        "Find your perfect stay",
        "Fast, easy, and reliable booking",
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <nav className="absolute top-0 left-0 w-full flex justify-center items-center px-5 ">
                <div className='flex items-center justify-center cursor-pointer'
                    onClick={() => window.location.href = '/'}
                >
                    <ApplicationLogo relative={true} />
                </div>

            </nav>
            {/* Gradient background wrapper */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 via-blue-500 to-gray-900 px-4">
                {/* Card container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-lg border border-white/30"
                >

                    {/* LEFT WELCOME CARD */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        className="hidden md:flex flex-col justify-center items-center w-1/2 p-10 text-white bg-gradient-to-br from-indigo-600/80 to-purple-600/80"
                    >
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6 }}
                                className="text-3xl font-bold mb-4 text-center"
                            >
                                {messages[index]}
                            </motion.h2>
                        </AnimatePresence>
                        <p className="text-lg opacity-90 text-center">
                            Book your boarding house with ease and comfort.
                        </p>
                    </motion.div>

                    {/* LOGIN CARD */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="
        w-full max-w-md md:max-w-lg lg:w-1/2
        p-6 sm:p-8 md:p-10
        bg-white/80 backdrop-blur-xl
        rounded-2xl md:rounded-r-2xl
        mx-auto shadow-lg
    "
                    >
                        <form onSubmit={submit} className="space-y-6">
                            {/* Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-center mb-6"
                            >
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                    Welcome Back!
                                </h2>
                                <p className="text-gray-500 text-sm sm:text-base">
                                    Login to continue your journey
                                </p>
                            </motion.div>

                            {/* Status message */}
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mb-4 text-sm font-medium text-green-600 bg-green-100 px-4 py-2 rounded-lg"
                                >
                                    {status}
                                </motion.div>
                            )}

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
                            <div className="mt-4">
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

                            {/* Remember + Register */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        value="1"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="remember" className="text-sm text-gray-600">Remember Me</label>
                                </div>
                                <p className="text-sm text-gray-500  sm:text-right">
                                    Not a member?{" "}
                                    <Link href={route('register')} className="text-indigo-600 font-semibold hover:underline">
                                        Register
                                    </Link>
                                </p>
                            </div>

                            {/* Forgot + Login button */}
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <PrimaryButton
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg transition w-full sm:w-auto"
                                        disabled={processing}
                                    >
                                        Log in
                                    </PrimaryButton>
                                </motion.div>
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </form>
                    </motion.div>

                </motion.div>
            </div>
        </GuestLayout>
    );
}
