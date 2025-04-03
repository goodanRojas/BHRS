// Components/Breadcrumbs.js
import React from 'react';
import { Link } from '@inertiajs/react';
import '../../css/breadcrumb.css'; // Import the custom CSS file

export default function Breadcrumbs({ links }) {
    return (
        <nav
            className="breadcrumbs-container text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap flex items-center space-x-2"
        >
            {links.map((link, index) => (
                <span key={index}>
                    {link.url ? (
                        <Link href={link.url} className="text-blue-500 hover:underline cursor-pointer">
                            {link.label}
                        </Link>
                    ) : (
                        <span>{link.label}</span>
                    )}
                    {index < links.length - 1 && <span className="mx-2">/</span>}
                </span>
            ))}
        </nav>
    );
}
