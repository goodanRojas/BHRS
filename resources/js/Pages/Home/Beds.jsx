import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import BoardingHouseMap from "@/Components/BoardingHouseMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faFilter, faDoorClosed, faBed, faSearch, faHeart, faStar, faBuilding } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from '@/Components/Breadcrumbs';
import Dropdown from '@/Components/Dropdown';
function Beds({ initialBeds, initialPagination, isAuthenticated, priceRange }) {
    const Layout = isAuthenticated ? AuthenticatedLayout : GuestLayout;
    // console.log(initialBeds.data);
    const [beds, setBeds] = useState(initialBeds.data);
    const [pagination, setPagination] = useState(initialPagination);
    const [featuresFilter, setFeaturesFilter] = useState([]);

    // Initialize priceFilter with min and max from props
    const [priceFilter, setPriceFilter] = useState([priceRange.min, priceRange.max]);

    const [filters, setFilters] = useState({
        search: "",
        min_price: priceFilter[0],
        max_price: priceFilter[1],
        min_rating: "",
    });



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
            const { data } = await axios.get("/home/beds", {
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
    const toggleFavorite = async (bedId) => {
        try {
            const response = await axios.post(`/beds/${bedId}/favorite`);

            if (response.status === 200) {
                setBeds((prevBeds) =>
                    prevBeds.map((bed) =>
                        bed.id === bedId ? { ...bed, is_favorite: !bed.is_favorite } : bed
                    )
                );

            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <Layout>
            <Head title="Home" />

            <div className="flex flex-col p-2">


                <div className="flex flex-col py-4">


                    <div className="flex items-center  sm:flex-row sm:items-center sm:justify-between w-full gap-4 mb-4">
                        {/* Breadcrumbs */}
                        <Breadcrumbs
                            links={[
                                { label: 'Buildings', url: '/home/buildings' },
                                { label: 'Rooms', url: `/home/rooms` },
                                { label: 'Beds' },
                            ]}
                        />

                        {/* Search Bar */}
                        <div className="flex w-full sm:w-80">
                            <input
                                type="text"
                                placeholder="Search bed name..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') applyFilters();
                                }}
                                className="flex-grow border border-indigo-600 px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition duration-200"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </div>
                    {/* Tag Filter */}
                    <div className="flex items-center gap-4 mb-4">
                        <p className="text-sm text-gray-500">Tag Filter</p>

                    </div>

                </div>

                <InfiniteScroll
                    dataLength={beds.length}
                    next={fetchMoreBeds}
                    hasMore={pagination.has_more_pages}
                    loader={<p className="text-center">Loading more beds...</p>}
                    endMessage={<p className="text-center text-gray-500">You have reached the end.</p>}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {beds.map((bed) => (
                            <div
                                key={bed.id}
                                className="relative border rounded-lg shadow-md backdrop-blur hover:shadow-lg transition group"
                            >
                                <Link href={`/home/bed/${bed.id}`}>
                                    <img
                                        src={`/storage/${bed.image}` || '/storage/bed/default_bed.png'}
                                        alt={bed.name}
                                        className="w-full h-40 object-cover rounded-t-md mb-3"
                                    />
                                    {/* ❤️ Favorite Icon – Top Left */}
                                    <div className="absolute top-3 left-3 group">
                                        <div className="relative">
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                className={`h-6 w-6 cursor-pointer transition-transform duration-200 group-hover:scale-110 ${bed.is_favorite
                                                    ? 'text-red-500 hover:text-red-600'
                                                    : 'text-white hover:text-gray-200 hover:border-red-500'
                                                    } drop-shadow-md`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleFavorite(bed.id);
                                                }}
                                            />
                                            <span className="w-[130px] text-center absolute  left-[100px] -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded-md py-1 px-2 shadow-md">
                                                Add to favorites
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-lg font-semibold mb-2">{bed.name}</h2>
                                            <p className="text-yellow-500 text-sm mb-2">
                                                {bed.avg_rating?.toFixed(1)} ★
                                            </p>
                                        </div>
                                        <p className="flex items-center text-gray-600 text-sm mb-2">
                                            <FontAwesomeIcon icon={faDoorClosed} className="mr-1 text-gray-500" />
                                            {bed.room_name || "N/A"}
                                        </p>
                                        <p className="flex items-center text-gray-600 text-sm mb-2">
                                            <FontAwesomeIcon icon={faBuilding} className="mr-1 text-gray-500" />
                                            {bed.building_name || "N/A"}
                                        </p>
                                        <p className="flex items-center text-gray-600 text-sm mb-2 line-clamp-2">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-500" />
                                            {bed.building_address
                                                ? `${bed.building_address.street}, ${bed.building_address.barangay}, ${bed.building_address.city}, ${bed.building_address.province} ${bed.building_address.postal_code}, ${bed.building_address.country}`
                                                : "N/A"}
                                        </p>


                                        <p className="text-amber-500 font-semibold mb-2">
                                            &#8369;{bed.sale_price || bed.price}
                                        </p>

                                    </div>

                                </Link>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </Layout>
    );
}

export default Beds;
