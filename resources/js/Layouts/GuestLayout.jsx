import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="  pt-6 sm:pt-0">
            <nav className='flex justify-between items-center px-5'>
                <div className="mb-6">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>
                </div>
                <div className="mt-6 flex space-x-4">
                    <Link
                        href={route('login')}
                        className="bg-blush text-champagne-900 px-4 py-2 rounded-md hover:bg-blush/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                    >
                        Log in
                    </Link>
                    <Link
                        href={route('register')}
                        className="bg-blush text-champagne-900 px-4 py-2 rounded-md hover:bg-blush/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            <div className="w-full px-6 py-4">
                {children}
            </div>

        </div>
    );
}
