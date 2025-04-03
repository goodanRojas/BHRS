import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import React from 'react';

export default function Rooms({ room }) {
    console.log(room); // Debugging line to check the room data
    return (
        <AuthenticatedLayout>
            <Head title={`Room: ${room.name}`} />

            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/buildings' },
                        { label: room.building.name, url: `/buildings/${room.building.id}` },
                        { label: room.name },
                    ]}
                />

                {/* Image Section */}
                <div className="overflow-hidden rounded-t-lg">
                    <img
                        src={room.image.startsWith('http') ? room.image : `/storage/${room.image}`}
                        alt={room.name}
                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{room.name}</h2>

                    <div>
                        <p className="text-lg text-gray-700">&#8369; {room.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <img src="/storage/system/sale-icon.png" alt="Sale" className="h-5 w-5" />
                            <p className="text-sm text-red-500">{room.sale_price}</p>
                        </div>
                    </div>
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

                {/* Display Beds */}
                <h3 className="text-xl font-semibold mt-6 mb-2">Beds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {room.beds.map((bed) => (
                        <div
                            key={bed.id}
                            className="p-4 border rounded shadow hover:bg-gray-100 cursor-pointer"
                        >
                            <Link href={`/beds/${bed.id}`} className="block">
                            <div className="flex flex-col">
                                    {/* Image Section */}
                                    <div className="overflow-hidden rounded-t-lg mb-4">
                                        <img
                                            src={`/storage/${bed.image}`}
                                            alt={bed.name}
                                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>

                                    <h4 className="text-xl font-semibold text-gray-800">{bed.name}</h4>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className="text-lg text-gray-700">&#8369; {bed.price}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <img src="/storage/system/sale-icon.png" alt="Sale" className="h-5 w-5" />
                                                <p className="text-sm text-red-500">{bed.sale_price}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {/* Availability / Occupancy */}
                                            {room.user_id === null ? (
                                                <div className="mt-4">
                                                   <p>Unoccupied</p>
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
        </AuthenticatedLayout>
    );
}
