import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestSellerLayout({ children }) {
    return (
        <div className=" min-h-screen flex flex-col items-center justify-center pt-6 sm:pt-0">
            <nav className='flex justify-between items-center px-5'>
                <div className="mb-6">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>
                </div>
              
            </nav>

            <div className="w-full  bg-gray-50 ">
                {children}
            </div>

        </div>
    );
}
