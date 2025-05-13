import SellerLayout from '@/Layouts/SellerLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faDoorOpen, faBed, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard({ count }) {

    return (
        <SellerLayout>
            <Head title="Dashboard" />


            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 items-center">
                {/* Building Card */}
                <div className="p-6 w-full max-w-[250px] h-[75px] bg-blue-600 rounded-2xl shadow-lg text-white text-center flex flex-row gap-4 items-center justify-center hover:scale-105 transition-transform duration-300">
                    <FontAwesomeIcon icon={faBuilding} className="text-lg" />
                    <p className="text-xl sm:text-2xl font-bold">{count.buildings || 0}</p>
                </div>

                {/* Room Card */}
                <div className="p-6 w-full max-w-[250px] h-[75px] bg-blue-600 rounded-2xl shadow-lg text-white text-center flex flex-row gap-4 items-center justify-center hover:scale-105 transition-transform duration-300">
                    <FontAwesomeIcon icon={faDoorOpen} className="text-lg" />
                    <p className="text-xl sm:text-2xl font-bold">{count.rooms || 0}</p>
                </div>

                {/* Bed Card */}
                <div className="p-6 w-full max-w-[250px] h-[75px] bg-blue-600 rounded-2xl shadow-lg text-white text-center flex flex-row gap-4 items-center justify-center hover:scale-105 transition-transform duration-300">
                    <FontAwesomeIcon icon={faBed} className="text-lg" />
                    <p className="text-xl sm:text-2xl font-bold">{count.beds || 0}</p>
                </div>

                {/* Bookings Card */}
                <div className="p-6 w-full max-w-[250px] h-[75px] bg-blue-600 rounded-2xl shadow-lg text-white text-center flex flex-row gap-4 items-center justify-center hover:scale-105 transition-transform duration-300">
                    <FontAwesomeIcon icon={faUser} className="text-lg" />
                    <p className="text-xl sm:text-2xl font-bold">{count.payedBookingsCount || 0}</p>
                </div>
            </div>
        </SellerLayout>
    );
}
