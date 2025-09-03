import SellerLayout from '@/Layouts/SellerLayout';
import { Head } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import React from 'react';

export default function Bed({ bed }) {
    return (
        <SellerLayout>
            <Head title={`Bed in ${bed.name}`} />

            <div className="p-6 space-y-6">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/seller/buildings' },
                        { label: bed.room.building.name, url: `/seller/buildings/${bed.room.building.id}` },
                        { label: bed.room.name, url: `/seller/rooms/${bed.room.id}` },
                        { label: bed.name },
                    ]}
                />

                {/* Bed Image and Details */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-hidden">
                        <img
                            src={`/storage/${bed.image}`}
                            alt={bed.name}
                            className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                    <div className="p-6 space-y-4">
                        <h4 className="text-2xl font-semibold text-gray-800">{bed.name}</h4>

                        {/* Price and Sale Price */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-semibold text-gray-700">
                                    &#8369; {bed.price}
                                </p>
                                {bed.sale_price && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <img
                                            src="/storage/system/sale-icon.png"
                                            alt="Sale"
                                            className="h-5 w-5"
                                        />
                                        <p className="text-sm text-red-500">
                                            Sale: &#8369; {bed.sale_price}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Availability / Occupancy */}
                        <div>
                            {bed.user_id === null ? (
                                <p className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-md">
                                    Unoccupied
                                </p>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={`/storage/${bed.user.image}`}
                                        alt={bed.user.name}
                                        className="h-12 w-12 rounded-full border-2 border-gray-300"
                                    />
                                    <p className="text-md text-gray-800 font-medium">
                                        Occupied by: {bed.user.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
