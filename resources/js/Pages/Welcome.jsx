import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">

                <div className="relative selection:bg-[#da667b] selection:text-white">
                    <div className="relative w-full bg-gradient-to-r from-champagne-600 to-khaki-900 ">
                        <header className="  flex  items-center p-4 w-full  z-50 absolute top-0 right-0 z-1">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <ApplicationLogo />
                            </div>
                            <nav className="-mx-3 flex flex-1 gap-4 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blush text-center text-champagne-900 p-2 rounded-md hover:bg-blush/80 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="bg-blush  text-champagne-900 p-2 rounded-md hover:bg-blush/80 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white cursor-pointer"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blush text-center text-champagne-900 p-2 rounded-md hover:bg-blush/80 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"

                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>
                        {/* Hero Section */}
                        <div className="relative min-h-screen z-0 overflow-hidden ">
                            <div className="absolute top-[18em] left-10] p-4 z-50 ">
                                <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 z-10  font-playfair">
                                    Welcome to BH Reservation
                                </h1>
                                <p className="text-2xl md:text-3xl text-gray-600 mb-10 z-20">
                                    Find your comfort as you stay.
                                </p>
                            </div>
                            <img src="/storage/system/bed.png" alt="Bed" className="w-[40em] h-auto absolute top-[17em] z-0 right-[-10em] " />
                        </div>
                    </div>

                    <main className="mt-6">

                    </main>

                    <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                        BH Reservation @ Rojas &copy; {new Date().getFullYear()}
                    </footer>
                </div>
            </div>
        </>
    );
}
