import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useFavorite } from '@/Contexts/FavoriteContext'; // 👈 Add this line

import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


export default function Favorites({ favorites }) {
    const [favoriteItems, setFavoriteItems] = useState(favorites);

    const [isFavorite, setIsFavorite] = useState(false);
    const { updateFavoritesCount } = useFavorite();

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
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-300 bg-gray-50">
                                    <th className="px-4 py-2 text-left text-gray-600">Image</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Name</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Room</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Building</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Price</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Status</th>
                                    <th className="px-4 py-2 text-left text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {favoriteItems.map((item, index) => {
                                    const isBed = item.type === "bed";
                                    const image = isBed
                                        ? item.bed.image.startsWith('http')
                                            ? item.bed.image
                                            : `/storage/${item.bed.image}`
                                        : item.room.image.startsWith('http')
                                            ? item.room.image
                                            : `/storage/${item.room.image}`;
                                    const name = isBed ? item.bed.name : item.room.name;
                                    const price = isBed ? (item.bed.sale_price || item.bed.price) : item.room.price;
                                    const occupied = isBed ? item.bed.is_occupied : null;
                                    const roomName = isBed ? item.room?.name : item.room?.name;
                                    const buildingName = item.building?.name || "Unknown Building";

                                    return (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <img
                                                    src={image}
                                                    alt={name}
                                                    className="w-24 h-16 object-cover rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-blue-600 hover:underline">
                                                <a href={isBed ? `/beds/${item.bed.id}` : `/rooms/${item.room.id}`}>
                                                    {name}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">{roomName}</td>
                                            <td className="px-4 py-3">{buildingName}</td>
                                            <td className="px-4 py-3 font-semibold">₱{price}</td>
                                            <td className={`px-4 py-3 font-medium ${occupied ? "text-red-500" : "text-green-500"}`}>
                                                {isBed ? (occupied ? "Occupied" : "Available") : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavorite(isBed ? item.bed.id : item.room.id, item.type);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Remove from favorites"
                                                >
                                                    <FontAwesomeIcon icon={faHeart} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
                    : (
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
