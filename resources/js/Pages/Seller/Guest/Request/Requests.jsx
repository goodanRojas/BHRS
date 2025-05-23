import { Head } from '@inertiajs/react';
import { useState } from 'react';
import SellerLayout from '@/Layouts/SellerLayout';
import BedRequests from './BedRequests';
import RoomRequests from './RoomRequests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Request({ bedRequests = [], roomRequests = [] }) {
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

                    {/* Search Input */}
                    {/* Search Input */}
                    <div className="flex w-full sm:w-80 relative">
                        <input
                            type="text"
                            placeholder="Search by User Name, Email, or Booking Name"
                            className="p-2 pl-10 pr-4 border rounded-full w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-4 text-indigo-500 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>

                </div>


                {/* Display filtered requests */}
                {activeTab === 'beds' ? (
                    <BedRequests requests={filteredBedRequests} />
                ) : (
                    <RoomRequests requests={filteredRoomRequests} />
                )}
            </div>
        </SellerLayout>
    );
}
