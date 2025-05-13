import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GuestLayout from '@/Layouts/GuestLayout';
import Footer from '@/Components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  
    return (
        <>
            <GuestLayout>
                <Head title="Welcome" />
                {/* Hero Section */}
                <motion.section
                    className="relative bg-cover bg-center h-screen flex items-center justify-center"
                    style={{ backgroundImage: "url('/storage/boarding-house-hero.jpg')" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="text-center  px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the Boarding House Reservation System</h1>
                        <p className="text-lg mb-6">Easily book your stay and find the best accommodations tailored for your needs.</p>
                        <Link
                            href="/book-now"
                            className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition"
                        >
                            Book Now
                        </Link>
                    </div>
                </motion.section>

                {/* Blog Pages Section */}
                <section className="py-16 bg-white text-light-blue-600">
                    <div className="container mx-auto px-4">
                        <motion.h2
                            className="text-3xl font-semibold text-center mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            Latest Blog Posts
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Static Blog Posts */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">How to Choose the Best Boarding House</h3>
                                <p className="text-sm text-gray-600 mb-4">Choosing the best boarding house is more than just about location. Here are some tips to make your decision easier.</p>
                                <Link href="/blog/how-to-choose" className="text-indigo-600 hover:text-indigo-800">Read More</Link>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">Top 5 Affordable Boarding Houses</h3>
                                <p className="text-sm text-gray-600 mb-4">Discover the top 5 most affordable boarding houses in your area with convenient amenities.</p>
                                <Link href="/blog/top-5-affordable" className="text-indigo-600 hover:text-indigo-800">Read More</Link>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">Tips for Tenants: Making the Most of Your Boarding House Stay</h3>
                                <p className="text-sm text-gray-600 mb-4">As a tenant, your experience can be much more enjoyable with these simple tips.</p>
                                <Link href="/blog/tenant-tips" className="text-indigo-600 hover:text-indigo-800">Read More</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Flexible Layout Section with Tenants and Landlords Feedback */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <motion.h2
                            className="text-3xl font-semibold text-center mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            Feedback from Tenants and Landlords
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Larger Tenant Feedback Section */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div>
                                    <h3 className="text-3xl font-bold text-indigo-600">Tenant Feedback</h3>
                                </div>
                                <div className="flex items-center mb-4">
                                    <img src="/storage/profile/rojas.png" alt="Tenant Avatar" className="w-20 h-20 rounded-full mr-4" />
                                    <p className="font-semibold">- Dan2 Rojas</p>
                                </div>
                                <p className="text-sm text-gray-600">"The boarding house was clean, and the landlord was very friendly. I felt like home during my stay."</p>
                                <div className="flex items-center justify-end space-x-3 mt-4">
                                    <img src="/storage/profile/rojas.png" alt="Avatar 1" className="w-10 h-10 rounded-full" />
                                    <img src="/storage/profile/rojas.png" alt="Avatar 2" className="w-10 h-10 rounded-full" />
                                    <img src="/storage/profile/rojas.png" alt="Avatar 3" className="w-10 h-10 rounded-full" />
                                    <span className="text-sm">...</span>
                                </div>
                            </div>

                            {/* Landlord Feedback Section */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div>
                                    <h3 className="text-3xl font-bold text-indigo-600">Landlord Feedback</h3>
                                </div>
                                <div className="flex items-center mb-4">
                                    <img src="/storage/profile/rojas.png" alt="Landlord Avatar" className="w-20 h-20 rounded-full mr-4" />
                                    <p className="font-semibold">- John Doe</p>
                                </div>
                                <p className="text-sm text-gray-600">"I enjoy having tenants who respect the property. This system makes it easier for me to manage bookings and payments."</p>
                                <div className="flex items-center justify-end space-x-3 mt-4">
                                    <img src="/storage/profile/rojas.png" alt="Avatar 1" className="w-10 h-10 rounded-full" />
                                    <img src="/storage/profile/rojas.png" alt="Avatar 2" className="w-10 h-10 rounded-full" />
                                    <img src="/storage/profile/rojas.png" alt="Avatar 3" className="w-10 h-10 rounded-full" />
                                    <span className="text-sm">...</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Carousel Section: Best Rated Beds */}
          

                {/* Footer Section */}
                <Footer />
            </GuestLayout>
        </>
    );
}
