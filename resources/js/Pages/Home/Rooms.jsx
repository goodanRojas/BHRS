import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import BoardingHouseMap from "@/Components/BoardingHouseMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from '@/Components/Breadcrumbs';
export default function Rooms({ initialRooms, initialPagination, isAuthenticated, priceRange }) {
    const Layout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

    const [rooms, setRooms] = useState(initialRooms.data);
    const [pagination, setPagination] = useState(initialPagination);
    const [boardingHouses, setBoardingHouses] = useState([]);
    const [openMap, setOpenMap] = useState(false);
    // Initialize priceFilter with min and max from props
    const [priceFilter, setPriceFilter] = useState([priceRange.min, priceRange.max]);

    const [filters, setFilters] = useState({
        search: "",
        min_price: priceFilter[0],
        max_price: priceFilter[1],
        min_rating: "",
    });

    //console.log(priceRange);
    useEffect(() => {
        // Fetch boarding houses
        axios
            .get("/boarding-houses")
            .then((response) => setBoardingHouses(response.data))
            .catch((error) => console.error("Error fetching boarding houses:", error));
    }, []);

  

    const fetchMoreRooms = async () => {
        if (!pagination.has_more_pages) return;

        try {
            const { data } = await axios.get("/home/rooms/more", {
                params: { ...filters, page: pagination.current_page + 1 },
            });
            setRooms((prevRooms) => [...prevRooms, ...data.data]);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                has_more_pages: data.has_more_pages,
            });
        } catch (error) {
            console.error("Error fetching more beds:", error);
        }
    };

    return (
        <Layout>
            <Head title="Home" />
            <div className="flex flex-col p-6">
                <h1 className="text-2xl font-bold mb-4">Available Rooms</h1>

                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/buildings' },
                        { label: 'Rooms'},
                        { label: 'Beds', url: `/` },
                    ]}
                />
                <div>
                    <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        onClick={() => setOpenMap((prev) => !prev)}
                        className="cursor-pointer text-blush-500 text-2xl mb-4 hover:text-blush-500 hover:scale-105 transition"
                    />
                </div>
                {openMap && (
                    <BoardingHouseMap boardingHouses={boardingHouses} />
                )}

                <InfiniteScroll
                    dataLength={rooms.length}
                    next={fetchMoreRooms}
                    hasMore={pagination.has_more_pages}
                    loader={<p className="text-center">Loading more rooms...</p>}
                    endMessage={<p className="text-center text-gray-500">You have reached the end.</p>}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="border rounded-lg shadow p-4 hover:shadow-lg transition"
                            >
                                <Link href={`/rooms/${room.id}`}>
                                    <img
                                        src={`/storage/${room.image}`}
                                        alt={room.name}
                                        className="w-full h-40 object-cover rounded-md mb-3"
                                    />
                                    <h2 className="text-lg font-semibold mb-2">{room.name}</h2>
                                    
                                    <p className="text-gray-600 text-sm mb-2">
                                        Address: {room.building_address || "N/A"}
                                    </p>
                                    <p className="text-gray-800 font-semibold mb-2">
                                        Price: ${room.sale_price || bed.price}
                                    </p>
                                    <p className="text-yellow-500 text-sm mb-2">
                                        Rating: {room.average_rating.toFixed(1)} ★
                                    </p>
                                    <p
                                        className={`text-sm font-medium ${room.is_occupied ? "text-red-500" : "text-green-500"
                                            }`}
                                    >
                                        {room.is_occupied ? "Occupied" : "Available"}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </Layout>
    );
}
