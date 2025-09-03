import React from 'react';
import { Link } from '@inertiajs/react';

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h1>
      <p className="mt-4 text-gray-700">Thank you for your booking. We’ve received your payment.</p>
      <Link href="/" className="mt-6 text-blue-500 underline">
        Back to Home
      </Link>
    </div>
  );
}
