import SellerLayout from '@/Layouts/SellerLayout';
import Breadcrumbs from '@/Components/Breadcrumbs';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function BuildingDetails({ building }) {
    return (
        <SellerLayout>
            <Head title={building.name} />

            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/seller/buildings' },
                        { label: building.name },
                    ]}
                />
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
                {/* Display Rooms */}

                <h3 className="text-xl font-semibold mb-2">Rooms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {building.rooms.map((room) => (
                        <div
                            key={room.id}
                            className="p-4 border rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                            <Link href={`/rooms/${room.id}`} className="block">
                                <div className="flex flex-col">
                                    {/* Image Section */}
                                    <div className="overflow-hidden rounded-t-lg mb-4">
                                        <img
                                            src={`/storage/${room.image}`}
                                            alt={room.name}
                                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>

                                    <h4 className="text-xl font-semibold text-gray-800">{room.name}</h4>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className="text-lg text-gray-700">&#8369; {room.price}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <img src="/storage/system/sale-icon.png" alt="Sale" className="h-5 w-5" />
                                                <p className="text-sm text-red-500">{room.sale_price}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {/* Availability / Occupancy */}
                                            {room.user_id === null ? (
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-600">Beds: {room.beds.length}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Occupied: {room.beds.filter(bed => bed.user_id !== null).length}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center mt-4">
                                                    <img
                                                        src={`/storage/${room.user.image}`}
                                                        alt={room.user.name}
                                                        className="h-10 w-10 rounded-full border-2 border-gray-200"
                                                    />
                                                    <p className="ml-3 text-sm text-gray-800">{room.user.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        </div>

                    ))}
                </div>
            </div>
        </SellerLayout>
    );
}
