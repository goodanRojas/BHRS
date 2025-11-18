import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GuestLayout from '@/Layouts/GuestLayout';
import Footer from '@/Components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Welcome({ auth }) {

    const buildings = [
        "/storage/building_images/building1.jpg",
        "/storage/building_images/building1.jpg",
        "/storage/building_images/building1.jpg",
        "/storage/building_images/building1.jpg",
    ];
    const [hoveredIndex, setHoveredIndex] = useState(null);
    return (
        <>
            <Head title="Welcome" />

            <motion.section
                className="relative min-h-screen flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >

                {/* NAVBAR */}
                <nav className="relative z-20 ">
                    {!auth ? (
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-4 md:px-8 gap-4 sm:gap-0">

                            {/* Logo */}
                            <Link href="/"  className="flex justify-center sm:justify-start">
                                <ApplicationLogo
                                    className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 fill-current text-gray-800"
                                    variant="white"
                                />
                            </Link>

                            {/* Nav Links */}
                            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4">
                                {[
                                    { label: "Owner Login", href: "/seller/login" },
                                    { label: "Log in", href: route('login') },
                                    { label: "Register", href: route('register') },
                                    { label: "About Us", href: route('about-us') }
                                ].map((item, i) => (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className="relative text-slate-100 font-semibold text-sm px-3 py-2 hover:text-white transition group"
                                    >
                                        {item.label}
                                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4 md:px-8">
                            <Link href="/">
                                <ApplicationLogo className="h-16 w-16 md:h-20 md:w-20 fill-current text-gray-800" variant="white" />
                            </Link>

                            <Link
                                href={route('to.user.buildings')}
                                className="relative text-slate-100 font-semibold text-sm px-4 py-2 hover:text-indigo-800 transition group"
                            >
                                Dashboard
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>
                    )}
                </nav>

                {/* BACKGROUND */}
                <div className="absolute inset-0 -z-10">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center brightness-[0.5]"
                        style={{
                            backgroundImage: "url('/storage/building_images/building1.jpg')"
                        }}
                    ></div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/30"></div>
                </div>

                {/* HERO CONTENT */}
                <div className="flex-grow flex items-center">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-4 md:px-8 z-10">

                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="text-center md:text-left space-y-6"
                        >
                            <h1
                                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-xl"
                                style={{ fontFamily: "'Satisfy', cursive" }}
                            >
                                Boarding House Reservation System
                            </h1>

                            <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                                Easily book your stay and find the best accommodations tailored for your needs.
                            </p>

                            <Link
                                href="/home/buildings"
                                className="inline-block bg-yellow-500 text-gray-900 font-semibold text-sm sm:text-base md:text-lg py-3 px-8 rounded-full shadow-lg 
                               hover:bg-yellow-600 transition-transform transform hover:scale-105"
                            >
                                Book Now
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Blog Pages Section */}
            < section className="min-h-screen py-16 bg-white text-light-blue-600"
            >

                <div className="container mx-auto px-4"

                >
                    <motion.h2
                        className="text-3xl font-semibold text-center mb-8 text-white"
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
            </section >

            {/* Flexible Layout Section with Tenants and Landlords Feedback */}
            < section className="py-20 bg-gradient-to-b from-gray-50 to-white" >
                <div className="container mx-auto px-6 lg:px-12">


                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Intro Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h3 className="text-3xl font-bold text-indigo-600 mb-4">
                                Tenant Feedback
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Hear directly from our valued tenants about their
                                living and hosting experience. Genuine voices, real stories.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                        >
                            <div className="flex items-center mb-5">
                                <img
                                    src="/storage/profile/jenna.jpg"
                                    alt="Tenant Avatar"
                                    className="w-16 h-16 rounded-full mr-4 border-2 border-indigo-100"
                                />
                                <p className="font-semibold text-gray-800 text-lg">Jenna</p>
                            </div>
                            <blockquote className="relative border-l-4 border-gray-300 pl-6 italic text-xl md:text-2xl text-gray-700">
                                <span className="absolute -left-1 -top-2 text-5xl text-gray-300 leading-none">“</span>
                                Our Boarding House provides a welcoming and convenient place to
                                live, offering comfort and easy access to daily needs.
                                <span className="align-text-top text-6xl text-gray-300 leading-none">”</span>
                            </blockquote>
                        </motion.div>

                        {/* Feedback Card 2 */}
                        <motion.div
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.5 }}
                        >
                            <div className="flex items-center mb-5">
                                <img
                                    src="/storage/profile/kim.jpg"
                                    alt="Tenant Avatar"
                                    className="w-16 h-16 rounded-full mr-4 border-2 border-indigo-100"
                                />
                                <p className="font-semibold text-gray-800 text-lg"> - Kim</p>
                                <span></span>
                            </div>
                            <blockquote className="relative border-l-4 border-gray-300 pl-6 italic text-xl md:text-2xl text-gray-700">
                                <span className="absolute -left-1 -top-2 text-5xl text-gray-300 leading-none">“</span>
                                Living here has been a great experience — the community feels safe and the amenities are well maintained.
                                <span className="align-text-top text-6xl text-gray-300 leading-none">”</span>
                            </blockquote>

                        </motion.div>
                    </div>
                </div>
            </section >
            {/* Carousel Section: Best Rated Beds */}


            {/* Footer Section */}
            <Footer />
        </>
    );
}
