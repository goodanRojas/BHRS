import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, DollarSign, SlidersHorizontal } from "lucide-react";
import ph from "@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json";
import axios from "axios";

export default function Filter({ setBuildings, setLoading }) {
    // Filter states
    const [hovered, setHovered] = useState(null);
    const [priceRange, setPriceRange] = useState("");
    const [rating, setRating] = useState(0);
    const [address, setAddress] = useState({
        region: "",
        province: "",
        municipality: "",
        barangay: "",
    });
    const minPrice = 0;
    const maxPrice = 5000;


    // Derive cascading options
    const regions = Object.entries(ph);
    const provinces = address.region ? Object.keys(ph[address.region].province_list) : [];
    const municipalities =
        address.province && address.region
            ? Object.keys(ph[address.region].province_list[address.province].municipality_list)
            : [];
    const barangays =
        address.municipality && address.region && address.province
            ? ph[address.region].province_list[address.province].municipality_list[address.municipality].barangay_list
            : [];

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            price: priceRange === 0 || priceRange === "" ? null : priceRange,
            rating: rating === 0 || rating === "" ? null : rating,
            address: !address || address === "" ? null : address,
        }
        setLoading(true);
        axios.post("/user/filter", {
            payload: payload,
        })
            .then((response) => {
                setBuildings(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error filtering the buildings!", error);
            });

    };

    const hasFilter =
        priceRange !== "" ||
        rating !== 0 ||
        address.region !== "" ||
        address.province !== "" ||
        address.municipality !== "" ||
        address.barangay !== "";

    const clearFilter = () => {
        setPriceRange("");
        setRating(0);
        setAddress({
            region: "",
            province: "",
            municipality: "",
            barangay: "",
        });
        axios.get("/home/buildings/search")
            .then((res) => setBuildings(res.data))
            .catch((error) => console.error(error));
    };
    return (
        <>
            <motion.form
                onSubmit={(e) => {
                    handleSubmit(e);
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col mt-4 relative
            md:flex-row md:flex-wrap md:justify-between
            lg:flex-row lg:flex-wrap lg:justify-between
            xl:flex-row xl:flex-wrap xl:justify-between
            gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200 text-sm"
            >
                {/* Header */}
                <div className="flex items-center gap-2 border-b pb-2 w-full">
                    <SlidersHorizontal className="text-blue-600" size={18} />
                    <h2 className="text-base font-semibold text-gray-800">Filters</h2>
                </div>
                {/* Price Filter */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex-1 min-w-[230px] md:max-w-[32%] space-y-2 border border-gray-100 p-3 rounded-lg"
                >
                    <label className="flex items-center gap-1 text-[13px] font-medium text-gray-700">
                        <DollarSign className="text-blue-500" size={14} />
                        Price
                    </label>

                    <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={100}
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer h-[4px]"
                    />

                    <div className="flex justify-between text-[11px] text-gray-500">
                        <span>₱{minPrice.toLocaleString()}</span>
                        <span>₱{maxPrice.toLocaleString()}</span>
                    </div>

                    <p className="text-xs text-gray-600">
                        ₱<span className="font-semibold text-blue-600">{priceRange.toLocaleString()}</span>
                    </p>
                </motion.div>

                {/* Location Filter */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex-1 min-w-[230px] md:max-w-[32%] space-y-2 border border-gray-100 p-3 rounded-lg"
                >
                    <label className="flex items-center gap-1 text-[13px] font-medium text-gray-700">
                        <MapPin className="text-blue-500" size={14} />
                        Address
                    </label>

                    {/* Region */}
                    <select
                        value={address.region}
                        onChange={(e) =>
                            setAddress({
                                region: e.target.value,
                                province: "",
                                municipality: "",
                                barangay: "",
                            })
                        }
                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs p-1.5"
                    >
                        <option value="">Region</option>
                        {regions.map(([regionName]) => (
                            <option key={regionName} value={regionName}>
                                {regionName}
                            </option>
                        ))}
                    </select>

                    {/* Province */}
                    {provinces.length > 0 && (
                        <select
                            value={address.province}
                            onChange={(e) =>
                                setAddress({
                                    ...address,
                                    province: e.target.value,
                                    municipality: "",
                                    barangay: "",
                                })
                            }
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs p-1.5"
                        >
                            <option value="">Province</option>
                            {provinces.map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Municipality */}
                    {municipalities.length > 0 && (
                        <select
                            value={address.municipality}
                            onChange={(e) =>
                                setAddress({
                                    ...address,
                                    municipality: e.target.value,
                                    barangay: "",
                                })
                            }
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs p-1.5"
                        >
                            <option value="">Municipality</option>
                            {municipalities.map((mun) => (
                                <option key={mun} value={mun}>
                                    {mun}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Barangay */}
                    {barangays.length > 0 && (
                        <select
                            value={address.barangay}
                            onChange={(e) =>
                                setAddress({
                                    ...address,
                                    barangay: e.target.value,
                                })
                            }
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs p-1.5"
                        >
                            <option value="">Barangay</option>
                            {barangays.map((brgy) => (
                                <option key={brgy} value={brgy}>
                                    {brgy}
                                </option>
                            ))}
                        </select>
                    )}
                </motion.div>

                {/* Rating Filter */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex-1 min-w-[230px] md:max-w-[32%] space-y-2 border border-gray-100 p-3 rounded-lg"
                >
                    <label className="flex items-center gap-1 text-[13px] font-medium text-gray-700">
                        <Star className="text-yellow-500" size={14} />
                        Rating
                    </label>

                    <div className="flex items-center justify-between gap-1">
                        {/* Add a '0' or 'None' button before stars */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setRating(0)}
                            className={`text-xs px-2 py-1 rounded-md border ${rating === 0
                                ? "bg-yellow-500 text-white border-yellow-500"
                                : "border-gray-300 text-gray-600 hover:border-yellow-400"
                                }`}
                        >
                            None
                        </motion.button>

                        {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                                key={star}
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.1 }}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(null)}
                                className="focus:outline-none"
                            >
                                <Star
                                    size={18}
                                    className={`transition-colors duration-200 ${star <= (hovered || rating)
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-gray-300"
                                        }`}
                                />
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* 
                TODO: Add a clear Filter button
                    */}
                <div
                    className="
        flex flex-col gap-2 w-full mt-2 
        static
        md:absolute md:bottom-4 md:right-4 md:flex-row md:w-auto md:mt-0
    "
                >
                    {hasFilter && (
                        <button
                            type="button"
                            className="
        bg-slate-100 text-gray-600 
        px-3 py-1.5 rounded-md shadow 
        hover:bg-slate-200 transition
        text-sm
        w-full md:w-auto
    "
                            onClick={clearFilter}
                        >
                            Clear
                        </button>
                    )}
                    <button
                        className="
        bg-indigo-600 text-white 
        px-3 py-1.5 rounded-md shadow 
        hover:bg-indigo-700 transition
        text-sm
        w-full md:w-auto
    "
                    >
                        Apply
                    </button>

                </div>

            </motion.form>
        </>

    );
}
