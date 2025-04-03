import { useEffect, useState } from "react";
import axios from "axios";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
export default function Favorites({ favorites }) {
    console.log(favorites);
    const toggleFavorite = async (id) => {
        try {
            const response = await axios.post(`/beds/${id}/favorite`, {
               /* refresh the page after toggling the favorite */
            });

       
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };
    return (
        <AuthenticatedLayout>
            <Head title="Favorites" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Favorites</h1>
                {/* <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Favorites" }]} /> */}
                {/* Favorites List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.length > 0 ? favorites.map((favorite) => (
                        <div
                            key={favorite.id}
                            className="border rounded-lg shadow p-4 hover:shadow-lg transition"
                        >
                            <Link href={`/beds/${favorite.bed_id}`}>
                                <div className="overflow-hidden relative">
                                    <img
                                        src={`/storage/${favorite.bed.image}`}
                                        alt={favorite.bed.name}
                                        className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className={`absolute top-2 right-2 h-6 w-6 cursor-pointer transition-transform duration-200 group-hover:scale-110 text-red-500 hover:text-red-600`}
                                        onClick={() => toggleFavorite(favorite.bed_id)}
                                    />
                                </div>
                                <h2 className="text-lg font-semibold mb-2">{favorite.bed.name}</h2>
                                <p className="text-gray-600 text-sm mb-2">
                                    Room: {favorite.bed.room_name || "N/A"}
                                </p>
                                <p className="text-gray-600 text-sm mb-2">
                                    Address: {favorite.bed.building_address || "N/A"}
                                </p>
                                <p className="text-gray-800 font-semibold mb-2">
                                    Price: ${favorite.bed.sale_price || favorite.bed.price}
                                </p>
                                <p
                                    className={`text-sm font-medium ${favorite.bed.is_occupied ? "text-red-500" : "text-green-500"
                                        }`}
                                >
                                    {favorite.bed.is_occupied ? "Occupied" : "Available"}
                                </p>
                            </Link>
                        </div>
                    )) : (
                        <div className="text-gray-600 text-center w-full">
                            No favorites found.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}