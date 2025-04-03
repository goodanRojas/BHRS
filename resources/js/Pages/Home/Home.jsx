import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import BoardingHouseMap from "@/Components/BoardingHouseMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faFilter } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from '@/Components/Breadcrumbs';
import Dropdown from '@/Components/Dropdown';
function Home({ initialBeds, initialPagination, isAuthenticated, priceRange }) {
    const Layout = isAuthenticated ? AuthenticatedLayout : GuestLayout;
    // console.log(initialBeds);
    const [beds, setBeds] = useState(initialBeds.data);
    const [pagination, setPagination] = useState(initialPagination);
    const [boardingHouses, setBoardingHouses] = useState([]);
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

    const applyFilters = async () => {
        try {
            const { data } = await axios.get(route("beds.show"), {
                params: { ...filters, min_price: priceFilter[0], max_price: priceFilter[1] },
            });
            setBeds(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                has_more_pages: data.has_more_pages,
            });
        } catch (error) {
            console.error("Error applying filters:", error);
        }
    };

    const fetchMoreBeds = async () => {
        if (!pagination.has_more_pages) return;

        try {
            const { data } = await axios.get("/beds", {
                params: { ...filters, page: pagination.current_page + 1 },
            });
            setBeds((prevBeds) => [...prevBeds, ...data.data]);
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
                <h1 className="text-2xl font-bold mb-4">Available Beds</h1>

                {/* Breadcrumbs */}
                <Breadcrumbs
                    links={[
                        { label: 'Buildings', url: '/home/buildings' },
                        { label: 'Rooms', url: `/home/rooms` },
                        { label: 'Beds' },
                    ]}
                />
          

                {/* Filters */}
                <div className="relative inline-block text-left w-[11em]">

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center space-x-2">
                                <FontAwesomeIcon icon={faFilter} />
                                <span>Filters</span>
                            </button>
                        </Dropdown.Trigger>

                        {/* Adjust the position with absolute and left-0 */}
                        <Dropdown.Content className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <Dropdown.Link className="block px-4 py-2 hover:bg-gray-100">Rating</Dropdown.Link>
                            <Dropdown.Link className="block px-4 py-2 hover:bg-gray-100">Price</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>


                <InfiniteScroll
                    dataLength={beds.length}
                    next={fetchMoreBeds}
                    hasMore={pagination.has_more_pages}
                    loader={<p className="text-center">Loading more beds...</p>}
                    endMessage={<p className="text-center text-gray-500">You have reached the end.</p>}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {beds.map((bed) => (
                            <div
                                key={bed.id}
                                className="border rounded-lg shadow p-4 hover:shadow-lg transition"
                            >
                                <Link href={`/beds/${bed.id}`}>
                                    <img
                                        src={bed.image.startsWith('https')? bed.image : `/storage/${bed.image}`}
                                        alt={bed.name}
                                        className="w-full h-40 object-cover rounded-md mb-3"
                                    />
                                    <h2 className="text-lg font-semibold mb-2">{bed.name}</h2>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Room: {bed.room_name || "N/A"}
                                    </p>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Address: {bed.building_address || "N/A"}
                                    </p>
                                    <p className="text-gray-800 font-semibold mb-2">
                                        Price: ${bed.sale_price || bed.price}
                                    </p>
                                    <p className="text-yellow-500 text-sm mb-2">
                                        {/* Rating: {bed.average_rating.toFixed(1)} ★ */}
                                    </p>
                                    <p
                                        className={`text-sm font-medium ${bed.is_occupied ? "text-red-500" : "text-green-500"
                                            }`}
                                    >
                                        {bed.is_occupied ? "Occupied" : "Available"}
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

export default Home;
