import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        // console.log(buildings);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axios.get('/home/buildings/search', {
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
        <AuthenticatedLayout>
            <Head title="Buildings" />
            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', },
                        { label: 'Rooms', url: `/home/rooms` },
                        { label: 'Beds', url: '/home' },
                    ]}
                />


                {/* Filters */}
                <div className="flex  sm:flex-row sm:items-center sm:justify-between w-full gap-4 mb-4">
                    {/* Filter Dropdown */}
                    <div className="relative inline-block text-left">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition duration-150">
                                    <FontAwesomeIcon icon={faFilter} />
                                    <span>Filters</span>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <Dropdown.Link className="block px-4 py-2 hover:bg-gray-100">Rating</Dropdown.Link>
                                <Dropdown.Link className="block px-4 py-2 hover:bg-gray-100">Price</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    {/* Search Bar */}
                    <div className="flex w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search building name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-grow border border-indigo-600 px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                            onClick={() => setDebouncedSearch(search)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition duration-200"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>

                {/* Buildings List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {buildings.map((building) => (
                        <div
                            key={building.id}
                            className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <Link href={`/home/building/${building.id}`} className="block">
                                {/* Image Section */}
                                <div className="overflow-hidden rounded-t-lg">
                                    <img
                                        src={`/storage/${building.image}`}
                                        alt={building.name}
                                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="p-4 flex flex-col justify-between">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{building.name}</h2>
                                    <p><FontAwesomeIcon icon={faUserTie} className="mr-1 text-gray-500" />{building.seller.name}</p>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <i className="fas fa-location-arrow text-blue-500 mr-2"></i>
                                        <span>{building.address}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
