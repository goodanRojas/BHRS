import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {useFavorite} from '@/Contexts/FavoriteContext'; // 👈 Add this line

import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


export default function Favorites({ favorites }) {
    const [favoriteItems, setFavoriteItems] = useState(favorites);

    const [isFavorite, setIsFavorite] = useState(false);
    const {updateFavoritesCount} = useFavorite();

    const toggleFavorite = async (id, type) => {
        try {
            await axios.post(`/beds/${id}/favorite`);

            // Remove the item from the UI by filtering it out
            setFavoriteItems((prev) =>
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
            <div className="p-4 flex flex-col min-h-full ">
                <h1 className=" text-2xl font-bold mb-6">Favorites</h1>

                {favoriteItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoriteItems.map((item, index) => {
                            const isBed = item.type === "bed";
                            const image = isBed ? item.bed.image.startsWith('http') ? item.bed.image : `/storage/${item.bed.image}` : item.room.image.startsWith('http') ? item.room.image : `/storage/${item.room.image}`;
                            const name = isBed ? `${item.bed.name}` : item.room.name;
                            const price = isBed ? (item.bed.sale_price || item.bed.price) : item.room.price;
                            const occupied = isBed ? item.bed.is_occupied : null;
                            const roomName = isBed ? item.room?.name : item.room?.name;
                            const buildingName = item.building?.name || "Unknown Building";

                            return (
                                <div
                                    key={index}
                                    className="border rounded-lg shadow p-4 hover:shadow-lg transition"
                                >
                                    <Link href={isBed ? `/beds/${item.bed.id}` : `/rooms/${item.room.id}`}>
                                        <div className="overflow-hidden relative">
                                            <img
                                                src={image}
                                                alt={name}
                                                className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                className="absolute top-2 right-2 h-6 w-6 cursor-pointer text-red-500 hover:text-red-600"
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent link navigation
                                                    toggleFavorite(isBed ? item.bed.id : item.room.id, item.type);
                                                }}
                                            />
                                        </div>

                                        <h2 className="text-lg font-semibold mt-2">{name}</h2>
                                        <p className="text-gray-600 text-sm mb-1">Room: {roomName}</p>
                                        <p className="text-gray-600 text-sm mb-1">Building: {buildingName}</p>
                                        <p className="text-gray-800 font-semibold mb-2">Price: ₱{price}</p>

                                        {isBed && (
                                            <p className={`text-sm font-medium ${occupied ? "text-red-500" : "text-green-500"}`}>
                                                {occupied ? "Occupied" : "Available"}
                                            </p>
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="min-h-full flex-1 flex items-center justify-center">
                        <div className="text-gray-600 text-center">
                            No favorites found.
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}



Favorites.layout = (page) => <AuthenticatedLayout children={page} />;
