import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    return (
        <div className=" min-h-screen flex flex-col items-center justify-center pt-6 sm:pt-0">
            {/* Background Image */}
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

            </nav>

            <div className="w-full   ">
                {children}
            </div>

        </div>
    );
}
