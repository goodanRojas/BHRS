import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('seller.password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <motion.div
                className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <motion.h1
                    className="text-2xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Forgot your password?
                </motion.h1>

                <motion.p
                    className="text-gray-600 text-sm leading-relaxed mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    No worries! Enter your email address below and we’ll send you a link
                    to reset your password.
                </motion.p>

                {status && (
                    <motion.div
                        className="mb-4 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg p-3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 }}
                    >
                        {status}
                    </motion.div>
                )}

                <motion.form
                    onSubmit={submit}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="you@example.com"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <motion.div
                        className="pt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <PrimaryButton
                            className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            disabled={processing}
                        >
                            Send Reset Link
                        </PrimaryButton>
                    </motion.div>
                </motion.form>
            </motion.div>
        </GuestLayout>
    );
}
