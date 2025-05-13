import { Head } from '@inertiajs/react';
import { useState } from 'react';
import SellerLayout from '@/Layouts/SellerLayout';
import BedRequests from './BedRequests';
import RoomRequests from './RoomRequests';

export default function Request({ bedRequests = [], roomRequests = [] }) {
    const [activeTab, setActiveTab] = useState('beds');
    console.log(bedRequests);
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
                    <BedRequests requests={bedRequests} />
                ) : (
                    <RoomRequests requests={roomRequests} />
                )}
            </div>
        </SellerLayout>
    );
}
