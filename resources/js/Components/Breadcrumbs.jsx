// Components/Breadcrumbs.js
import React from 'react';
import { Link } from '@inertiajs/react';
import '../../css/breadcrumb.css'; // Import the custom CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
export default function Breadcrumbs({ links }) {
    return (
        <nav
            className="breadcrumbs-container text-sm text-slate-100 mb-4 overflow-x-auto whitespace-nowrap flex items-center space-x-2"
        >
            {links.map((link, index) => (
                <span key={index}>
                    {link.url ? (
                        <Link href={link.url} className="text-slate-300 hover:underline cursor-pointer">
                            {link.label}
                        </Link>
                    ) : (
                        <span className='text-white'>{link.label}</span>
                    )}
                    {index < links.length - 1 && <span className="mx-2 "><FontAwesomeIcon icon={faChevronRight} className=" text-sm text-slate-100" /></span>}
                </span>
            ))}
        </nav>
    );
}
