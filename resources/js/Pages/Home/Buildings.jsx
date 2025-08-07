import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faFilter, faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '@/Components/Dropdown';
export default function Buildings({ initialBuildings }) {
    const [buildings, setBuildings] = useState(initialBuildings);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    console.log(buildings);

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

                {/* Title */}
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold mb-4">Explore Boarding Houses</h1>
                </div>

                {/* Buildings List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {buildings.map((building) => (
                        <div
                            key={building.id}
                            className="flex flex-col  border border-gray-200 rounded-2xl shadow hover:shadow-lg transition duration-300"
                        >
                            <Link href={`/home/building/${building.id}`} className="block">
                                {/* Image */}
                                <div className="overflow-hidden rounded-t-2xl">
                                    <img
                                        src={`/storage/${building.image}`}
                                        alt={building.name}
                                        className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3 bg-gradient-to-t from-indigo-700 to-gray-300 backdrop-blur-sm rounded-md">
                                    {/* Title */}
                                    <div className='relative'>
                                        <h2 className="text-xl font-semibold text-gray-600 truncate">{building.name}</h2>
                                        <span className='absolute bg-opacity-90 top-7 left-1 block bg-white rounded shadow-md h-1 w-40'></span>
                                    </div>
                                    {/* Seller Info */}
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={building.seller?.avatar ? `/storage/${building.seller.avatar}` : '/storage/profile/default_avatar.png'}
                                            alt={building.seller?.name || 'Default Avatar'}
                                            className="w-8 h-8 rounded-full border-2 border-white"
                                        />
                                        <span className="text-sm text-gray-100 font-medium truncate">{building.seller?.name}</span>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-center text-white text-xs">
                                        <i className="fas fa-location-arrow text-green-500 mr-2"></i>
                                        <span>
                                            {building.address?.street || ''}, {building.address?.barangay || ''}, {building.address?.city || ''}, {building.address?.province || ''}
                                        </span>

                                    </div>

                                    {/* Ratings and Tenants */}
                                    <div className="flex items-center justify-between text-white">
                                        {/* Ratings */}
                                        <div className="text-sm text-yellow-500 flex items-center space-x-1">
                                            <FontAwesomeIcon icon={faStar} />
                                            <span className="text-white  text-sm font-bold">4.2</span>
                                            <span className="text-white text-sm">(<span className='font-bold'>192</span> reviews)</span>
                                        </div>

                                        {/* Overlapping Tenant Avatars */}
                                        <div className="flex -space-x-3">
                                            <img src="/storage/profile/rojas.png" alt="Avatar 1" className="w-8 h-8 rounded-full border-2 border-white" />
                                            <img src="/storage/profile/rojas.png" alt="Avatar 2" className="w-8 h-8 rounded-full border-2 border-white" />
                                            <img src="/storage/profile/rojas.png" alt="Avatar 3" className="w-8 h-8 rounded-full border-2 border-white" />
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-semibold rounded-full border-2 border-white">
                                                +9
                                            </div>
                                        </div>
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
