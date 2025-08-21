import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="pt-6 sm:pt-0 ">
            <div
                className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center bg-no-repeat -z-10"
                style={{ backgroundImage: "url('/storage/system/background/background.webp')" }}
            ></div>


            <div className="w-full">
                {children}
            </div>

        </div>
    );
}
