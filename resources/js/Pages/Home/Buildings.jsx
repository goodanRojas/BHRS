import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Recommendations from '@/Pages/Home/Recommendations/Recommendations';
import Features from '@/Pages/Home/Keyword/Features';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faFilter, faSearch, faStar, faEye } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '@/Components/Dropdown';
import Filter from './Filter/Filter';
export default function Buildings({ initialBuildings }) {
    console.log(initialBuildings);
    const [buildings, setBuildings] = useState(initialBuildings);
    const [keywords, setKeywords] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [suggestions, setSuggestions] = useState([]);
    // debounce search
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
                    params: {
                        search: debouncedSearch,
                        keywords: keywords,
                    },

                });
                console.log(response.data);
                setBuildings(response.data);
            } catch (error) {
                console.error("Error fetching buildings:", error);
            }
        };
        fetchBuildings();
    }, [debouncedSearch, keywords]);

    return (
        <AuthenticatedLayout>
            <Head title="Buildings" />

            <div className="p-6 overflow-hidden">
                <div
                    className='flex flex-col lg:flex-row gap-6 '
                >

                    <div className='w-full lg:w-[300px] space-y-6'>
                        {/* Search */}
                        <div className="w-full relative">
                            <div className="relative flex items-center">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-3 text-indigo-500 h-4 w-4"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        if (e.target.value.length > 0) {
                                            fetch(`/home/buildings/suggestions?query=${e.target.value}`)
                                                .then((res) => res.json())
                                                .then((data) => setSuggestions(data));
                                        } else {
                                            setSuggestions([]);
                                        }
                                    }}
                                    placeholder="Search..."
                                    className="w-[500px] pl-10 pr-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                                />
                            </div>

                            {/* Suggestions Dropdown */}
                            {suggestions.length > 0 && (
                                <div className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 w-fit min-w-full">
                                    {suggestions.map((name, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSearch(name);
                                                setSuggestions([]);
                                            }}
                                            className="block text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Filters */}
                        <Filter setBuildings={(buildings) => {
                            setBuildings(buildings);
                        }} />

                        {/* Keywords */}
                        <div className="mb-6">
                            <h3 className="py-2 font-bold tracking-tight text-gray-800 uppercase">
                                Features
                            </h3>
                            <Features
                                keywords={["Aircon", "Wi-Fi", "Parking", "Laundry", "CCTV"]}
                                size="md"
                                variant="light"
                                max={5}
                                onSelectionChange={(selectedKeywords) => setKeywords(selectedKeywords)}
                            />
                        </div>
                    </div>
                    <div className='flex-1 min-w-0 '>
                        {/* Recommendations */}
                        <section>
                            <Recommendations className='flex-1 ' />
                        </section>

                        {/* Buildings */}
                        <section>
                            <h1 className="text-xl font-semibold text-indigo-600 py-4 tracking-tight">
                                Buildings
                            </h1>

                            {/* Buildings Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                                {buildings.map((building) => (
                                    <Link
                                        key={building.id}
                                        href={`/home/building/${building.id}`}
                                        className="
        group flex flex-col w-[220px] 
        bg-white/90 rounded-2xl shadow-md border border-gray-100 
        hover:shadow-xl hover:border-gray-200 hover:-translate-y-2 
        transition-all duration-300 backdrop-blur-sm
    "
                                    >
                                        {/* Image */}
                                        <div className="relative h-[150px] overflow-hidden rounded-t-2xl">
                                            <img
                                                src={`/storage/${building.image}`}
                                                alt={building.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />

                                            {/* View Count */}
                                            {building.building_view_count_count > 0 && (
                                                <div className="absolute top-2 left-2 z-20 flex items-center gap-1 
                bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                                                    <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                                                    <span className="text-[10px] font-semibold">
                                                        {building.building_view_count_count}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Rating */}
                                            {building.rating_count > 0 && (
                                                <div className="absolute top-2 right-2 z-20 flex items-center gap-1 
                bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                                                    <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-yellow-400" />
                                                    <span className="text-[10px] font-semibold">
                                                        {building.avg_rating ? Number(building.avg_rating).toFixed(1) : "0.0"}
                                                    </span>
                                                    <span className="text-[9px] text-slate-200">
                                                        ({building.rating_count})
                                                    </span>
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-3">

                                            {/* Title */}
                                            <div>
                                                <h2 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                                    {building.name}
                                                </h2>
                                                <div className="h-0.5 w-8 bg-indigo-500 rounded mt-1"></div>
                                            </div>

                                            {/* Seller Info */}
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        building.seller?.avatar
                                                            ? `/storage/${building.seller.avatar}`
                                                            : "/storage/profile/default_avatar.png"
                                                    }
                                                    alt={building.seller?.name || "Default Avatar"}
                                                    className="w-7 h-7 rounded-full border border-gray-200 object-cover shadow-sm"
                                                />
                                                <span className="text-xs font-medium text-gray-700 truncate">
                                                    {building.seller?.name}
                                                </span>
                                            </div>

                                            {/* Address */}
                                            <div className="flex items-start text-gray-500 text-[10px] gap-1 leading-tight">
                                                <i className="fas fa-location-arrow text-indigo-500 mt-0.5"></i>
                                                {building.address ? (
                                                    building.address.address ? (
                                                        <span className="truncate block max-w-[170px]">
                                                            {[
                                                                building.address.barangay ?? building.address?.address?.barangay,
                                                                building.address.municipality ?? building.address?.address?.municipality,
                                                                building.address.province ?? building.address?.address?.province,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        </span>
                                                    ) : (
                                                        <p>No Address Provided</p>
                                                    )
                                                ) : (
                                                    <p>No Address Provided</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>


            </div>
        </AuthenticatedLayout>

    );
}
