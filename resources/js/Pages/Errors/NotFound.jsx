import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Page Not Found" />
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-100">
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <p className="text-xl mt-4 text-gray-700">Sorry, the page you're looking for can't be found.</p>
                <Link
                    href="/home"
                    className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Go back to Home
                </Link>
            </div>
        </>
    );
}
