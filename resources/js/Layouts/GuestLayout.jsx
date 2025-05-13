import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="pt-6 sm:pt-0 ">
            <div
                className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center bg-no-repeat -z-10"
                style={{ backgroundImage: "url('/storage/system/background/background.webp')" }}
            ></div>

            <nav className='flex justify-between items-center px-5'>
                <div className="mb-6">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>
                </div>
                <div className="mt-6 flex space-x-4 justify-center">
                    <Link
                        href={route('login')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-white dark:hover:bg-indigo-800 dark:focus-visible:ring-white"
                    >
                        Log in
                    </Link>
                    <Link
                        href={route('register')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-white dark:hover:bg-indigo-800 dark:focus-visible:ring-white"
                    >
                        Register
                    </Link>
                </div>

            </nav>

            <div className="w-full px-6 ">
                {children}
            </div>

        </div>
    );
}
