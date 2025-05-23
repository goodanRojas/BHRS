import SellerLayout from '@/Layouts/SellerLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
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
                    <Link href={'/seller/app'} className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-indigo-600 transition duration-150">
                        Apply a building
                    </Link>

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
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Building Name</th>
                                <th className="px-4 py-2 text-left">Address</th>
                                <th className="px-4 py-2 text-left">Image</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buildings.map((building) => (
                                <tr key={building.id} className="border-b">
                                    <td className="px-4 py-2">{building.name}</td>
                                    <td className="px-4 py-2">{building.address}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={`/storage/building/${building.image}`}
                                            alt={building.name}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/seller/building/${building.id}`}
                                            className="text-indigo-600 hover:text-indigo-800"
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
