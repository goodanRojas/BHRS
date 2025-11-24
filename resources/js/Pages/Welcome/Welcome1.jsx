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
            <div className="min-h-screen bg-gradient-to-br from-slate-200 via-gray-100 to-slate-100 text-gray-900 overflow-hidden">
                {/* Navbar */}
                {!auth ? (
                    <nav className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center px-4 py-4 md:px-8 gap-4 sm:gap-0">
                        {/* Logo */}
                        <div className="flex justify-center sm:justify-start flex-shrink-0">
                            <Link href="/">
                                <ApplicationLogo
                                    className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 fill-current text-gray-500"
                                    variant="black"
                                />
                            </Link>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap justify-center sm:justify-end items-center space-x-2 sm:space-x-4 md:space-x-6">
                            {/* Owner Login */}
                            <Link
                                href="/seller/login"
                                className="relative text-indigo-500 px-2 sm:px-3 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
                            >
                                Owner Login
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* Tenant Login */}
                            <Link
                                href={route('login')}
                                className="relative text-indigo-500 px-2 sm:px-3 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
                            >
                                Log in
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* Register */}
                            <Link
                                href={route('register')}
                                className="relative text-indigo-500 px-2 sm:px-3 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
                            >
                                Register
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* About Us */}
                            <Link
                                href={route('about-us')}
                                className="relative text-indigo-500 px-2 sm:px-3 py-2 text-sm font-semibold hover:text-indigo-700 transition group"
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
                    className="relative px-5  overflow-hidden"
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
                                Explore Now
                            </Link>
                        </div>

                        <section className="relative flex flex-wrap justify-center md:justify-end w-full gap-10 py-16">
                            {buildings.map((src, index) => (
                                <motion.div
                                    key={index}
                                    className="relative group transition-all duration-700"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: false, amount: 0.4 }}
                                    transition={{
                                        delay: index * 0.2,
                                        duration: 0.6,
                                        ease: [0.25, 0.8, 0.25, 1],
                                    }}
                                >
                                    {/* Backdrop glow (only strong when hovered) */}
                                    <div
                                        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700
                                                ${hoveredIndex === index
                                                ? "opacity-90 bg-gradient-to-tr from-blue-400/30 via-purple-400/30 to-pink-400/30 scale-110"
                                                : "opacity-0"
                                            }`}
                                    />

                                    {/* Image */}
                                    <motion.img
                                        src={src}
                                        alt={`Building ${index + 1}`}
                                        className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full object-cover border-[3px] border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-700
                                                ${hoveredIndex !== null && hoveredIndex !== index
                                                ? "blur-sm brightness-75 scale-95"
                                                : hoveredIndex === index
                                                    ? "scale-110 brightness-110"
                                                    : ""
                                            }`}
                                        whileHover={{
                                            rotate: [0, 1.5, -1.5, 0],
                                            transition: { duration: 0.6, ease: "easeInOut" },
                                        }}
                                    />

                                    {/* Highlight ring */}
                                    <div
                                        className={`absolute inset-0 rounded-full border-[2.5px] transition-all duration-700 ${hoveredIndex === index
                                            ? "border-blue-400/60 blur-sm shadow-[0_0_30px_rgba(96,165,250,0.5)]"
                                            : "border-transparent"
                                            }`}
                                    />
                                </motion.div>
                            ))}
                        </section>

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
