import SellerLayout from '@/Layouts/SellerLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faDoorOpen, faBed, faUser, faCalendarDays, faRepeat } from '@fortawesome/free-solid-svg-icons';
import BarChart from '@/Components/BarChart';
export default function Dashboard({ count, revenueData, occupancyData }) {
    console.log(count);
    console.log(revenueData);
    console.log(occupancyData);

    return (
        <SellerLayout>
            <Head title="Dashboard" />


            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 items-center">
                {/* Building Card */}
                <div className="relative p-4 w-full max-w-[225px] h-[75px] border-[1px] border-gray-800 rounded-2xl shadow-lg text-white text-center hover:scale-105 transition-transform duration-300">
                    <div className='bg-purple-600 p-2 w-10 rounded-md absolute -top-3 left-4'>
                        <FontAwesomeIcon icon={faBuilding} className="text-lg" />
                    </div>
                    <div className="flex flex-col items-end justify-center divide-y divide-gray-300">
                        <p className='text-gray-600 text-sm'>Total Buildings</p>
                        <p className="text-xl pr-2 sm:text-2xl text-gray-800 font-bold">
                            {count.buildings || 0}
                        </p>
                    </div>
                </div>

                {/* Room Card */}
                <div className="relative p-4 w-full max-w-[225px] h-[75px] border-[1px] border-gray-800 rounded-2xl shadow-lg text-white text-center hover:scale-105 transition-transform duration-300">
                    <div className='bg-purple-600 p-2 w-10 rounded-md absolute -top-3 left-4'>
                        <FontAwesomeIcon icon={faDoorOpen} className="text-lg" />
                    </div>
                    <div className="flex flex-col items-end justify-center divide-y divide-gray-300">
                        <p className='text-gray-600 text-sm'>Total Rooms</p>
                        <p className="text-xl pr-2 sm:text-2xl text-gray-800 font-bold">
                            {count.rooms || 0}
                        </p>
                    </div>
                </div>

                {/* Bed Card */}
                <div className="relative p-4 w-full max-w-[225px] h-[75px] border-[1px] border-gray-800 rounded-2xl shadow-lg text-white text-center hover:scale-105 transition-transform duration-300">
                    <div className='bg-purple-600 p-2 w-10 rounded-md absolute -top-3 left-4'>
                        <FontAwesomeIcon icon={faBed} className="text-lg" />
                    </div>
                    <div className="flex flex-col items-end justify-center divide-y divide-gray-300">
                        <p className='text-gray-600 text-sm'>Total Beds</p>
                        <p className="text-xl pr-2 sm:text-2xl text-gray-800 font-bold">
                            {count.beds || 0}
                        </p>
                    </div>
                </div>

                {/* Bookings Card */}
                <div className="relative p-4 w-full max-w-[225px] h-[75px] border-[1px] border-gray-800 rounded-2xl shadow-lg text-white text-center hover:scale-105 transition-transform duration-300">
                    <div className='bg-purple-600 p-2 w-10 rounded-md absolute -top-3 left-4'>
                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                    </div>
                    <div className="flex flex-col items-end justify-center divide-y divide-gray-300">
                        <p className='text-gray-600 text-sm'>Total Bookings</p>
                        <p className="text-xl pr-2 sm:text-2xl text-gray-800 font-bold">
                            {count.payedBookingsCount || 0}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 items-center">

                {/* Average Stay Duration */}
                <div className="p-4 w-full max-w-[250px] h-[100px] bg-orange-600 rounded-2xl shadow-lg text-white flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                    <div className="bg-white/20 p-3 rounded-full">
                        <FontAwesomeIcon icon={faCalendarDays} className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xl sm:text-2xl font-bold leading-none">{count.averageStayDuration} days</p>
                        <p className="text-sm">Average Stay</p>
                    </div>
                </div>

                {/* Booking Frequency */}
                <div className="p-4 w-full max-w-[250px] h-[100px] bg-purple-600 rounded-2xl shadow-lg text-white flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                    <div className="bg-white/20 p-3 rounded-full">
                        <FontAwesomeIcon icon={faRepeat} className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xl sm:text-2xl font-bold leading-none">{count.bookingFrequency.length}</p>
                        <p className="text-sm">Frequent Bookers</p>
                    </div>
                </div>

            </div>


            {/* Graphs Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 items-center">
                {/* Occupancy Rate Graph */}
                <div className="p-6 bg-green-600 rounded-2xl shadow-lg text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Occupancy Rate</h3>
                    <BarChart data={occupancyData} />
                </div>

                {/* Revenue Graph */}
                <div className="p-6 bg-yellow-600 rounded-2xl shadow-lg text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Total Revenue</h3>
                    <BarChart data={revenueData} />
                </div>
            </div>

        </SellerLayout>
    );
}
