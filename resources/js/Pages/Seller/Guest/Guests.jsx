import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SellerLayout from '@/Layouts/SellerLayout';
import BedGuests from './BedGuests';
import RoomGuests from './RoomGuests';

export default function Guests({ bedBookings = [], roomBookings = [] }) {
    const [activeTab, setActiveTab] = useState('beds');
    console.log('bedBookings', bedBookings);
    console.log('roomBookings', roomBookings);
    const {auth} = usePage().props;
    const seller = auth.seller;

    console.log('seller', seller);

    return (
        <SellerLayout>
            <Head title="Current Guests" />
            <div className="p-8 space-y-8  min-h-screen">
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('beds')}
                        className={`px-4 py-2 rounded ${activeTab === 'beds' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                    >
                        Bed
                    </button>
                    <button
                        onClick={() => setActiveTab('rooms')}
                        className={`px-4 py-2 rounded ${activeTab === 'rooms' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                    >
                        Room
                    </button>
                </div>

                {activeTab === 'beds' ? (
                    <BedGuests bookings={bedBookings} />
                ) : (
                    <RoomGuests bookings={roomBookings} />
                )}
            </div>
        </SellerLayout>
    );
}
