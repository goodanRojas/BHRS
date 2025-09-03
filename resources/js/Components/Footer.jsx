import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 z-100">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} BH Reservation. All rights reserved.</p>
                <div className="mt-4">
                    <a href="#" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-white mx-2">Terms of Service</a>
                    <a href="#" className="text-gray-400 hover:text-white mx-2">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};
