import SellerLayout from '@/Layouts/SellerLayout';

import { Link, Head } from '@inertiajs/react';
export default function Layout(props) {
    return (
        <SellerLayout>
            <div className="flex flex-col min-h-screen">
                <div className="flex space-x-4 bg-gray-100 p-4 rounded-lg shadow-md">
                    <Link
                        href="/guest/dashboard"
                        className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/guest/request"
                        className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
                    >
                        Requests
                    </Link>
                </div>

                <div className="w-full p-4">
                    {props.children}
                </div>
            </div>
        </SellerLayout>
    );
}