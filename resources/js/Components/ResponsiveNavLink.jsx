import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-indigo-400 bg-gray-800 text-indigo-300 focus:border-indigo-500 focus:bg-gray-700 focus:text-indigo-200'
                    : 'border-transparent text-gray-300 hover:border-gray-600 hover:bg-gray-800 hover:text-white focus:border-gray-600 focus:bg-gray-800 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
