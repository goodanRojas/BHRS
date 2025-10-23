import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useFavorite } from '@/Contexts/FavoriteContext';
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, Building2, BedDouble, MapPin } from "lucide-react";
export default function Favorites({ favorites: initialFavorites }) {
    console.log('Favorites: ', initialFavorites);
    const [favorites, setFavorites] = useState(initialFavorites);
    const { updateFavoritesCount } = useFavorite();

    const toggleFavorite = async (id, type) => {
        try {
            await axios.post(`/favorite/${id}/toggle`);

            // remove from UI
            setFavorites((prev) =>
                prev.filter((item) => {
                    const itemId = item.favoritable_id
                    return !(itemId === id);
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
            <div className="p-8 min-h-screen bg-gray-50">
                {/* Page Header */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-4xl font-bold mb-10 text-indigo-700 flex items-center gap-3"
                >
                    <Heart className="text-red-500 w-8 h-8" />
                    Favorites
                </motion.h1>

                {favorites.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            show: {
                                opacity: 1,
                                y: 0,
                                transition: { staggerChildren: 0.1 },
                            },
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {favorites.map((item, index) => {
                            const image =
                                item.favoritable.image
                                    ? `/storage/${item.favoritable.image}`
                                    : `/storage/bed/default_bed.svg`;

                            const name = item.favoritable.name;
                            const price = item.favoritable.price;
                            const occupied = item.favoritable.bookings.length > 0;
                            const roomName = item.favoritable.room?.name;
                            const buildingName = item.favoritable.room?.building?.name;

                            return (
                                <motion.div
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: { opacity: 1, y: 0 },
                                    }}
                                    whileHover={{ scale: 1.03 }}
                                    onClick={() => window.location.href = `/home/bed/${item.favoritable.id}`}
                                    className="bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden group"
                                >
                                    {/* Image */}
                                    <div className="relative">
                                        <img
                                            src={image}
                                            alt={name}
                                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleFavorite(
                                                    item.favoritable_id,
                                                    item.favoritable_type
                                                );
                                            }}
                                            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition"
                                            title="Remove from favorites"
                                        >
                                            <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 space-y-3">
                                       <p
                                            className="text-lg font-semibold text-indigo-700 hover:underline line-clamp-1"
                                        >
                                            {name}
                                        </p>

                                        <div className="flex items-center text-gray-500 text-sm gap-2">
                                            <BedDouble className="w-4 h-4" />
                                            <span>{roomName}</span>
                                            <Building2 className="w-4 h-4 ml-2" />
                                            <span>{buildingName}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3">
                                            <p className="text-xl font-bold text-indigo-800">
                                                ₱{price}
                                            </p>
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full ${occupied
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {occupied ? "Occupied" : "Available"}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="min-h-[60vh] flex items-center justify-center"
                    >
                        <div className="text-gray-500 text-center bg-white p-10 rounded-3xl shadow-lg">
                            <Heart className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-lg font-medium">
                                No favorites found.
                            </p>
                            <p className="text-sm text-gray-400">
                                Start exploring and add your favorite spots!
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
}

Favorites.layout = (page) => <AuthenticatedLayout children={page} />;
