import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Buildings({  buildings }) {
    return (
        <AuthenticatedLayout>
            <Head title="Buildings" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Buildings</h1>

                {/* Buildings List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {buildings.map((building) => (
                        <div
                            key={building.id}
                            className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <Link href={`/buildings/${building.id}`} className="block">
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
