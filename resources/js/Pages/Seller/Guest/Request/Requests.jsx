import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import SellerLayout from '@/Layouts/SellerLayout';
import BedRequests from './BedRequests';
import RoomRequests from './RoomRequests';
import Payments from './Payments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Request({ bedRequests = [], roomRequests = [], payments = {} }) {
    const [activeTab, setActiveTab] = useState('beds');
    const [searchQuery, setSearchQuery] = useState(''); // Added state for search query

    // Filtered bed and room requests based on the search query
    const filteredBedRequests = bedRequests.filter((request) => {
        const userName = request.user.name.toLowerCase();
        const userEmail = request.user.email.toLowerCase();
        const bookableName = request.bookable.name.toLowerCase();

        return (
            userName.includes(searchQuery.toLowerCase()) ||
            userEmail.includes(searchQuery.toLowerCase()) ||
            bookableName.includes(searchQuery.toLowerCase())
        );
    });

    const filteredRoomRequests = roomRequests.filter((request) => {
        const userName = request.user.name.toLowerCase();
        const userEmail = request.user.email.toLowerCase();
        const bookableName = request.bookable.name.toLowerCase();

        return (
            userName.includes(searchQuery.toLowerCase()) ||
            userEmail.includes(searchQuery.toLowerCase()) ||
            bookableName.includes(searchQuery.toLowerCase())
        );
    });

    return (
        <SellerLayout>
            <Head title="Current Guests" />
            <div className="p-8 space-y-8 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    {/* Tab Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('beds')}
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ease-in-out ${activeTab === 'beds' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            Bed
                        </button>
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ease-in-out ${activeTab === 'rooms' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            Room
                        </button>
                      
                        <Link
                            href={route('seller.request.payments.index')}
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ease-in-out ${activeTab === 'payments' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            Payments
                        </Link>
                    </div>


                    {/* Search Input */}
                    <div className="flex w-full sm:w-64 relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="p-2 pl-8 pr-3 border rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-3 text-indigo-500 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faSearch} className="text-sm" />
                        </button>
                    </div>

                </div>

                {/* Tab Content */}
                {
                    activeTab === 'beds' ? (
                        <BedRequests requests={filteredBedRequests} />
                    ) :
                        activeTab === 'rooms' ? (
                            <RoomRequests requests={filteredRoomRequests} />
                        ) :
                            activeTab === 'payment' ? (
                                <Payments payments={payments} />
                            ) : null
                }
            </div>
        </SellerLayout>

    );
}
