import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useFavorite } from '@/Contexts/FavoriteContext';
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { motion } from "framer-motion";

export default function Favorites({ favorites: initialFavorites }) {
    console.log('Favorites: ', initialFavorites);
    const [favorites, setFavorites] = useState(initialFavorites);
    const { updateFavoritesCount } = useFavorite();

    const toggleFavorite = async (id, type) => {
        try {
            await axios.post(`/beds/${id}/favorite`);

            // remove from UI
            setFavorites((prev) =>
                prev.filter((item) => {
                    const itemId = item.type === "bed" ? item.bed.id : item.room.id;
                    return !(itemId === id && item.type === type);
                })
            );
            updateFavoritesCount(-1);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <>
            <Head title="Favorites" />
            <div className="p-6 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-indigo-800">Favorites</h1>

                {favorites.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: {
                                opacity: 1,
                                y: 0,
                                transition: { staggerChildren: 0.1 },
                            },
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {favorites.map((item, index) => {
                            const image =
                                item.favoritable.image
                                    ? `/storage/${item.favoritable.image}`
                                    : `/storage/bed/default_bed.svg`;

                            const name = item.favoritable.name;
                            const price = item.favoritable.price;
                            const occupied = item.favoritable.bookings.length > 0 ? true : false;
                            const roomName = item.favoritable.room?.name;
                            const buildingName = item.favoritable.room?.building?.name;

                            return (
                                <motion.div
                                    key={index}
                                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-md shadow-md hover:shadow-xl transition flex flex-col relative 
               w-64" // 👈 make card narrower
                                >
                                    {/* Image */}
                                    <div className="relative">
                                        <img
                                            src={image}
                                            alt={name}
                                            className="w-full h-32 object-cover  rounded-t-md" // 👈 slightly smaller height
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleFavorite(isBed ? item.bed.id : item.room.id, item.type);
                                            }}
                                            className="absolute top-3 right-3  p-2 rounded-full shadow  transition"
                                            title="Remove from favorites"
                                        >
                                            <FontAwesomeIcon icon={faHeart} className="text-red-500 hover:text-red-600" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-4 p-4 flex-1 flex flex-col">
                                        <Link
                                            href={`/home/bed/${item.favoritable.id}`}
                                            className="text-lg font-semibold text-indigo-700 hover:underline"
                                        >
                                            {name}
                                        </Link>
                                        <p className="text-sm text-gray-500">{roomName} • {buildingName}</p>

                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-xl font-bold text-indigo-800">₱{price}</p>
                                            {occupied && (
                                                <span
                                                    className={`px-3 py-1 text-xs font-medium rounded-full ${occupied
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {occupied ? "Occupied" : "Available"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                            );
                        })}
                    </motion.div>
                ) : (
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-gray-500 text-center bg-white p-8 rounded-2xl shadow-md"
                        >
                            <p className="text-lg">No favorites found.</p>
                        </motion.div>
                    </div>
                )}
            </div>
        </>
    );
}

Favorites.layout = (page) => <AuthenticatedLayout children={page} />;
