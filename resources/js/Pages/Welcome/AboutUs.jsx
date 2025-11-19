import { Link, Head } from '@inertiajs/react';
import { motion } from "framer-motion";
import { Users, Target, Mail, Phone, MapPin } from "lucide-react";
import ApplicationLogo from '@/Components/ApplicationLogo';
export default function AboutUs() {
    const team = [
        { name: "Daniel Rojas", role: "Programmer", image: "/storage/members/daniel.png" },
        { name: "Lean Joy Serot", role: "System Analyst", image: "/storage/members/serot.png" },
        { name: "Jenna Maika P. Odon", role: "Documenter/Technical Writer", image: "/storage/members/jenna.jpg" },
        { name: "Roxanne Kimossy Milar", role: "QA Staff/Tester", image: "/storage/members/kim.jpg" },
        { name: "Kristel Q. Sala", role: "Documenter/Technical Writer", image: "/storage/members/sala.jpg" },
        { name: "Jason A. Gozon", role: "QA Staff/Tester", image: "/storage/members/jason.jpg" },
        { name: "Rohna Mae B. Maraon", role: "Project Manager", image: "/storage/members/maraon.jpg" },

    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Head title="About Us" />
            {/* Hero Section */}
            <section className="relative h-[60vh] flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
                <div className="flex-shrink-0">
                    <Link href="/">
                        <ApplicationLogo className="h-16 w-16 md:h-20 md:w-20 fill-current text-gray-500" variant="white" />
                    </Link>
                </div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl font-bold mb-4"
                >
                    About Our Team
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="max-w-2xl text-lg"
                >
                    We are a group of passionate IT students developing a modern Boarding House Reservation System that integrates AI and advanced technology to improve convenience and accessibility.
                </motion.p>
            </section>

            <section className="py-20 px-6 md:px-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50 overflow-x-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 text-blue-600 font-semibold"
                    >
                        <Users className="w-6 h-6" />
                        Our Team
                    </motion.div>
                    <h2 className="text-3xl font-bold mt-2">Meet the Developers</h2>
                    <p className="text-gray-500 mt-2">The minds behind the innovation</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-10 gap-y-16 justify-items-center px-6 md:px-20 py-10 bg-gradient-to-b from-gray-50 to-white">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group relative w-60  bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-blue-200 transition-all duration-500 overflow-hidden"
                        >
                            {/* Image Section */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                {/* Soft overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {/* Floating role badge */}
                                <span className="absolute bottom-4 left-4 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                    {member.role}
                                </span>
                            </div>

                            {/* Info Section */}
                            <div className="p-5 text-center">
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{member.description}</p>
                            </div>

                            {/* Decorative accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 pointer-events-none group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-shadow duration-500"></div>
                        </motion.div>
                    ))}
                </div>


            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100 px-6 md:px-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="flex justify-center mb-4">
                        <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our mission is to simplify the process of finding and reserving boarding houses through a digital platform.
                        By integrating AI chatbots, KNN algorithms, and map-based navigation, we aim to provide users with
                        a seamless, intelligent, and user-friendly experience.
                    </p>
                </motion.div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-white px-6 md:px-20">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl font-bold mb-2"
                    >
                        Get in Touch
                    </motion.h2>
                    <p className="text-gray-500">We’d love to hear from you!</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
                >
                    <div className="flex flex-col items-center">
                        <Mail className="w-8 h-8 text-blue-600 mb-2" />
                        <p className="font-medium">admin@bhrs.shop</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Phone className="w-8 h-8 text-blue-600 mb-2" />
                        <p className="font-medium">+63 9505291990</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <MapPin className="w-8 h-8 text-blue-600 mb-2" />
                        <p className="font-medium">San Isidro, Tomas Oppus, Southern Leyte, Philippines</p>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
                <p>© {new Date().getFullYear()} Boarding House Reservation System | All Rights Reserved</p>
            </footer>
        </div>
    );
}
