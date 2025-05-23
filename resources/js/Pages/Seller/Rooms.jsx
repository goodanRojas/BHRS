import SellerLayout from '@/Layouts/SellerLayout';
import { Head, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import React from 'react';

export default function Rooms({ room }) {
    return (
        <SellerLayout>
            <Head title={`Room: ${room.name}`} />

            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/seller/buildings' },
                        { label: room.building.name, url: `/seller/buildings/${room.building.id}` },
                        { label: room.name },
                    ]}
                />

                {/* Image Section */}
                <div className="overflow-hidden rounded-t-lg">
                    <img
                        src={`/storage/${room.image}`}
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

                {/* Display Beds in Table */}
                <h3 className="text-xl font-semibold mt-6 mb-2">Beds</h3>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Bed Name</th>
                                <th className="px-4 py-2 text-left">Image</th>
                                <th className="px-4 py-2 text-left">Price</th>
                                <th className="px-4 py-2 text-left">Sale Price</th>
                                <th className="px-4 py-2 text-left">Availability</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {room.beds.map((bed) => (
                                <tr key={bed.id} className="border-b">
                                    <td className="px-4 py-2">{bed.name}</td>
                                    <td className="px-4 py-2">
                                        <img
                                            src={`/storage/${bed.image}`}
                                            alt={bed.name}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-2">&#8369; {bed.price}</td>
                                    <td className="px-4 py-2">&#8369; {bed.sale_price}</td>
                                    <td className="px-4 py-2">
                                        {bed.user_id === null ? (
                                            <p className="text-sm text-green-600">Unoccupied</p>
                                        ) : (
                                            <div className="flex items-center">
                                                <img
                                                    src={`/storage/${bed.user.image}`}
                                                    alt={bed.user.name}
                                                    className="h-10 w-10 rounded-full border-2 border-gray-200"
                                                />
                                                <p className="ml-3 text-sm text-gray-800">{bed.user.name}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/beds/${bed.id}`}
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
            </div>
        </SellerLayout>
    );
}
