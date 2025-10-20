import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GuestLayout from '@/Layouts/GuestLayout';
import Footer from '@/Components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Welcome({ auth }) {
    console.log(auth);

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-slate-200 via-gray-100 to-slate-100 text-gray-900 overflow-hidden">
                {/* Navbar */}
                {!auth ? (
                    <nav className="flex flex-wrap justify-between items-center px-4 py-4 md:px-8">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <ApplicationLogo className="h-16 w-16 md:h-20 md:w-20 fill-current text-gray-500" variant="black" />
                            </Link>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center justify-end space-x-3 md:space-x-6 mt-3 md:mt-0">
                            {/* Owner Login */}
                            <Link
                                href="/seller/login"
                                className="relative text-indigo-500 px-3 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
                            >
                                Owner Login
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* Tenant Login */}
                            <Link
                                href={route('login')}
                                className="relative text-indigo-500 px-3 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
                            >
                                Log in
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* Register */}
                            <Link
                                href={route('register')}
                                className="relative text-indigo-500 px-3 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
                            >
                                Register
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            {/* About Us */}
                            <Link
                                href={route('about-us')}
                                className="relative text-indigo-500 px-3 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
                            >
                                About Us
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>
                    </nav>
                ) : (
                    <nav className="flex justify-between items-center px-4 py-4 md:px-8">
                        <div>
                            <Link href="/">
                                <ApplicationLogo className="h-16 w-16 md:h-20 md:w-20 fill-current text-gray-500" variant="black" />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('to.user.buildings')}
                                className="relative text-indigo-500 px-4 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
                            >
                                Dashboard
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>
                    </nav>
                )}

                {/* Hero Section */}
                <motion.section
                    className="relative px-5 py-16 md:py-24 overflow-hidden"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                        {/* Text Content */}
                        <div className="text-center md:text-left z-10">
                            <h1
                                className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight"
                                style={{ fontFamily: "'Satisfy', cursive" }}
                            >
                                Boarding House Reservation System
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
                                Easily book your stay and find the best accommodations tailored for your needs.
                            </p>

                            <Link
                                href="/home/buildings"
                                className="inline-block bg-yellow-500 text-indigo-800 font-semibold text-sm sm:text-base md:text-lg py-3 px-8 rounded-full shadow-md 
            hover:bg-yellow-600 transition-transform transform hover:scale-105 hover:text-white"
                            >
                                Book Now
                            </Link>
                        </div>

                        {/* Hero Images */}
                        <div className="relative flex justify-center md:justify-end w-full">
                            {/* Background */}
                            <img
                                src={'/storage/system/landingpage/hero-bg.png'}
                                alt="Hero background"
                                className="w-[300px] sm:w-[400px] md:w-[600px] lg:w-[800px] max-w-full absolute right-0 top-0 drop-shadow-lg z-0"
                            />

                            {/* Clouds */}
                            <img
                                src={'/storage/system/landingpage/clouds.svg'}
                                alt="Clouds"
                                className="w-16 sm:w-24 md:w-32 absolute left-4 -top-[120px] opacity-80 drop-shadow-sm z-10"
                            />
                            <img
                                src={'/storage/system/landingpage/clouds.svg'}
                                alt="Clouds"
                                className="w-20 sm:w-28 md:w-36 scale-x-[-1] absolute right-6 -top-[100px] opacity-80 drop-shadow-sm z-10"
                            />

                            {/* Hero Illustrations */}
                            <img
                                src={'/storage/system/landingpage/hero2.svg'}
                                alt="Hero 2"
                                className="w-28 sm:w-36 md:w-56 lg:w-64 absolute top-[80px] right-2 drop-shadow-lg z-20"
                            />
                            <img
                                src={'/storage/system/landingpage/hero1.svg'}
                                alt="Hero 1"
                                className="w-16 sm:w-20 md:w-28 drop-shadow-lg absolute top-[160px] right-[50%] z-30"
                            />
                            <img
                                src={'/storage/system/landingpage/hero3.svg'}
                                alt="Hero 3"
                                className="w-20 sm:w-28 md:w-36 drop-shadow-lg absolute top-[20px] right-[35%] z-30"
                            />
                        </div>
                    </div>
                </motion.section>
            </div>

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
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            </section>
            {/* Carousel Section: Best Rated Beds */}


            {/* Footer Section */}
            <Footer />
        </>
    );
}
