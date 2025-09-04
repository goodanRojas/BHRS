import SellerLayout from '@/Layouts/SellerLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faFilter, faSearch, faInfo } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '@/Components/Dropdown';

export default function Buildings({ initialBuildings }) {
    const [buildings, setBuildings] = useState(initialBuildings);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axios.get('/seller/building/search', {
                    params: { search: debouncedSearch },
                });
                setBuildings(response.data);
            } catch (error) {
                console.error("Error fetching buildings:", error);
            }
        };
        fetchBuildings();
    }, [debouncedSearch]);

    return (
        <SellerLayout>
            <Head title="Buildings" />
            <div className="p-4">
                <div className="flex sm:flex-row sm:items-center sm:justify-between w-full gap-4 mb-4">
                    <div className='flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto'>
                        <Link
                            href="/seller/app"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                        >
                            <FontAwesomeIcon icon={faUserTie} className="w-4 h-4 text-white" />
                            Apply a Building
                        </Link>

                        <Link
                          href="/seller/building/requests"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                        >
                            <FontAwesomeIcon icon={faInfo} className="w-4 h-4 text-white" />
                            Requests
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex w-full sm:w-80 relative">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-600"
                        />
                        <input
                            type="text"
                            placeholder="Search building name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-grow pl-12 pr-4 py-2 border border-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                        />
                    </div>
                </div>
                {/* Buildings Table */}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto text-sm">
                        <thead className="bg-indigo-50 text-indigo-700 text-left uppercase text-xs sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3">Building Name</th>
                                <th className="px-6 py-3">Address</th>
                                <th className="px-6 py-3">Image</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {buildings.map((building) => (
                                <tr
                                    key={building.id}
                                    className="hover:bg-indigo-50 transition duration-150 ease-in-out"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {building.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{building.address}</td>
                                    <td className="px-6 py-4">
                                        <img
                                            src={`/storage/${building.image}`}
                                            alt={building.name}
                                            className="w-20 h-20 object-cover rounded-md border"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/seller/building/${building.id}`}
                                            className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow hover:bg-indigo-700 transition"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* No Buildings Found Message */}
                {buildings.length === 0 && (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">No buildings found.</p>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
