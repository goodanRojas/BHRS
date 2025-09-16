// Components/Breadcrumbs.js
import React from 'react';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

export default function Breadcrumbs({ links }) {
    return (
        <motion.nav
            className="breadcrumbs-container text-sm mb-6 overflow-x-auto whitespace-nowrap flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {links.map((link, index) => (
                <motion.span
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    {link.url ? (
                        <Link
                            href={link.url}
                            className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                        >
                            {link.label}
                        </Link>
                    ) : (
                        <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md shadow-sm">
                            {link.label}
                        </span>
                    )}
                    {index < links.length - 1 && (
                        <FontAwesomeIcon
                            icon={faChevronRight}
                            className="mx-2 text-slate-400 text-xs"
                        />
                    )}
                </motion.span>
            ))}
        </motion.nav>
    );
}
