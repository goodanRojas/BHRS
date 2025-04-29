import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
export default function Sidebar({ isOpen }) {
    return (
        <aside className={`bg-white shadow-md transition-all duration-300 ${isOpen ? 'w-64 block' : 'w-0 hidden md:block'}`}>
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-center h-16 shadow">
                    <span className="text-xl font-bold text-indigo-600">
                        <img src={`/storage/system/logo/logo-no-bg.png`} alt="BH Logo" className="h-20 w-20 rounded-full" />
                    </span>
                </div>
                {isOpen && (
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <div className="flex flex-col space-y-2">
                            <NavLink
                                href={route('admin.dashboard')}
                                active={route().current('admin.dashboard')}
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                href={route('admin.users')}
                                active={route().current('admin.users')}
                            >
                                Users
                            </NavLink>
                            <NavLink
                                href={route('admin.owners')}
                                active={route().current('admin.owners')}
                            >
                                Owners
                            </NavLink>

                            <NavLink
                                href={route('admin.profile')}
                                active={route().current('admin.profile')}
                            >
                                Profile
                            </NavLink>


                            <NavLink
                                href={route('admin.logout')}
                                active={route().current('admin.logout')}
                            >
                                Logout
                            </NavLink>
                        </div>


                    </nav>
                )}
            </div>
        </aside>
    );
}
