import SellerLayout from '@/Layouts/SellerLayout';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
export default function Dashboard({ count }) {
    const [cardColors, setCardColors] = useState([]);

    // Generate random colors for each card
    useEffect(() => {
        const generateRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 60%, 80%)`;
        const colors = Array(4).fill(null).map(() => generateRandomColor());
        setCardColors(colors);
    }, []);
    return (
        <SellerLayout>
            <Head title="Dashboard" />
            
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-3xl font-bold mb-8 text-gray-800">Dashboard</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                <div
                    className="p-6 rounded-lg shadow-lg text-center text-white text-xl font-semibold"
                    style={{ backgroundColor: cardColors[0] }}
                >
                    Buildings: <span>{count.buildings}</span>
                </div>
                <div
                    className="p-6 rounded-lg shadow-lg text-center text-white text-xl font-semibold"
                    style={{ backgroundColor: cardColors[1] }}
                >
                    Rooms: <span>{count.rooms}</span> <br />
                    <small>(with {count.roomsWithUser}  guests)</small>
                </div>
                <div
                    className="p-6 rounded-lg shadow-lg text-center text-white text-xl font-semibold"
                    style={{ backgroundColor: cardColors[2] }}
                >
                    Beds: <span>{count.beds}</span> <br />
                    <small>(with {count.bedsWithUser} guests)</small>
                </div>
                <div
                    className="p-6 rounded-lg shadow-lg text-center text-white text-xl font-semibold"
                    style={{ backgroundColor: cardColors[3] }}
                >
                    Guests: <span>{count.roomsWithUser + count.bedsWithUser}</span>
                </div>
            </div>
        </div>
        </SellerLayout>
    );
}