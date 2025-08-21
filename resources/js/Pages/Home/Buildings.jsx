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

            <div className="p-6">

                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                        Explore Boarding Houses
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Find the perfect place that suits your needs
                    </p>
                </div>

                {/* Buildings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {buildings.map((building) => (
                        <Link
                            key={building.id}
                            href={`/home/building/${building.id}`}
                            className="group flex flex-col rounded-xl bg-white shadow-md overflow-hidden 
               hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={`/storage/${building.image}`}
                                    alt={building.name}
                                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-4">
                                {/* Title */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 truncate group-hover:text-indigo-600 transition">
                                        {building.name}
                                    </h2>
                                    <div className="h-0.5 w-12 bg-indigo-500 rounded mt-2"></div>
                                </div>

                                {/* Seller Info */}
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={
                                            building.seller?.avatar
                                                ? `/storage/${building.seller.avatar}`
                                                : '/storage/profile/default_avatar.png'
                                        }
                                        alt={building.seller?.name || 'Default Avatar'}
                                        className="w-9 h-9 rounded-full border border-gray-200 object-cover shadow-sm"
                                    />
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                        {building.seller?.name}
                                    </span>
                                </div>

                                {/* Address */}
                                <div className="flex items-start text-gray-500 text-xs space-x-2">
                                    <i className="fas fa-location-arrow text-indigo-500 mt-0.5"></i>
                                    <span className="leading-snug line-clamp-2">
                                        {[building.address?.street, building.address?.barangay, building.address?.city, building.address?.province]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </span>
                                </div>

                                {/* Ratings & Tenants */}
                                <div className="flex items-center justify-between">
                                    {/* Ratings */}
                                    <div className="flex items-center space-x-1 text-yellow-500">
                                        <FontAwesomeIcon icon={faStar} />
                                        <span className="font-semibold text-gray-700">4.2</span>
                                        <span className="text-xs text-gray-500">
                                            (<span className="font-medium">192</span> reviews)
                                        </span>
                                    </div>

                                    {/* Overlapping Tenant Avatars */}
                                    <div className="flex -space-x-2">
                                        <img
                                            src="/storage/profile/rojas.png"
                                            alt="Tenant 1"
                                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                        />
                                        <img
                                            src="/storage/profile/rojas.png"
                                            alt="Tenant 2"
                                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                        />
                                        <img
                                            src="/storage/profile/rojas.png"
                                            alt="Tenant 3"
                                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                        />
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border-2 border-white shadow-sm">
                                            +9
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                    ))}
                </div>
            </div>
        </AuthenticatedLayout>

    );
}
