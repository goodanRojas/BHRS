import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumbs from '@/Components/Breadcrumbs';
import Recommendations from '@/Pages/Home/Recommendations/Recommendations';
import Keywords from '@/Pages/Home/Keyword/Keywords';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faFilter, faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '@/Components/Dropdown';
export default function Buildings({ initialBuildings }) {
    // console.log(initialBuildings);
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
                const response = await axios.get('/home/buildings/search', {
                    params: { search: debouncedSearch },

                });
                console.log(response.data);
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
                    <h1 className="text-3xl font-bold tracking-tight text-white italic [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]">
                        Boarding House Reservation
                    </h1>

                    <p className="text-slate-100 text-sm">
                        Find the perfect place that suits your needs
                    </p>
                </div>
                {/* Keywords */}
                <div className="mb-6">
                    <h3 className="py-2 font-bold tracking-tight text-gray-800 uppercase">
                        Keywords
                    </h3>
                    <Keywords
                        keywords={["Aircon", "Wi-Fi", "Parking", "Laundry", "CCTV"]}
                        size="md"
                        variant="light"
                        max={5}
                    />
                </div>
                {/* Recommendations */}
                <section>
                    <Recommendations />
                </section>

                {/* Buildings */}
                <section>
                    <h1
                        className=" font-bold text-gray-800 uppercase tracking-tight py-4"
                    >Buildings</h1>
                    {/* Buildings Grid */}
                    <div className="flex flex-wrap justify-center sm:justify-start md:justify-start lg:justify-start xl:justify-start gap-3">
                        {buildings.map((building) => (
                            <Link
                                key={building.id}
                                href={`/home/building/${building.id}`}
                                className="group flex flex-col rounded-lg w-[250px] bg-white shadow overflow-hidden 
                 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`/storage/${building.image}`}
                                        alt={building.name}
                                        className="w-full h-28 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="p-3 space-y-2">
                                    {/* Title */}
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition">
                                            {building.name}
                                        </h2>
                                        <div className="h-0.5 w-8 bg-indigo-500 rounded mt-1"></div>
                                    </div>

                                    {/* Seller Info */}
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={
                                                building.seller?.avatar
                                                    ? `/storage/${building.seller.avatar}`
                                                    : '/storage/profile/default_avatar.png'
                                            }
                                            alt={building.seller?.name || 'Default Avatar'}
                                            className="w-7 h-7 rounded-full border border-gray-200 object-cover shadow-sm"
                                        />
                                        <span className="text-xs font-medium text-gray-700 truncate">
                                            {building.seller?.name}
                                        </span>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start text-gray-500 text-[10px] space-x-1">
                                        <i className="fas fa-location-arrow text-indigo-500 mt-0.5"></i>
                                        {building.address ? (
                                            building.address.address ? (
                                                <span>
                                                    {[
                                                        building.address.barangay ?? building.address?.address?.barangay,
                                                        building.address.municipality ?? building.address?.address?.municipality,
                                                        building.address.province ?? building.address?.address?.province
                                                    ]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </span>
                                            ) : (
                                                <p>No Address Provided</p>
                                            )
                                        ) : (
                                            <p>No Address Provided</p>
                                        )}

                                    </div>

                                    {/* Ratings & Tenants */}
                                    <div className="flex items-center justify-between">
                                        {/* Ratings */}
                                        <div className="flex items-center space-x-1 text-yellow-500">
                                            <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                                            <span className="text-xs font-semibold text-gray-700">
                                                {building.avg_rating ? Number(building.avg_rating).toFixed(1) : "0.0"}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                (<span className="font-medium">{building.rating_count || 0}</span>)
                                            </span>
                                        </div>

                                        {/* Overlapping Tenant Avatars */}
                                        <div className="flex -space-x-1">
                                            {building.user_images?.slice(0, 3).map((user, idx) => (
                                                <img
                                                    key={idx}
                                                    src={`/storage/${user.avatar}`}
                                                    alt={user.name}
                                                    title={user.name}
                                                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm object-cover"
                                                />
                                            ))}

                                            {building.rating_count > 3 && (
                                                <div className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-700 text-[10px] font-semibold rounded-full border-2 border-white shadow-sm">
                                                    +{building.rating_count - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        ))}
                    </div>

                </section>
            </div>
        </AuthenticatedLayout>

    );
}
