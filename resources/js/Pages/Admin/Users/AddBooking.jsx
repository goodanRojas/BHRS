import PrimaryButton from "@/Components/PrimaryButton";
import ph from "@/Pages/Data/philippine_provinces_cities_municipalities_and_barangays_2019v2.json";
import { useForm } from "@inertiajs/react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { router } from "@inertiajs/react";
import { Calendar, Hash, MapPin, Map, Building2, Home } from "lucide-react";
export default function AddBooking({ bedId, userId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        address: {
            region: "",
            province: "",
            municipality: "",
            barangay: "",
        },
        startDate: dayjs().format("YYYY-MM-DD"),
        monthCount: 1,
        bedId: bedId,
        userId: userId,
    });

    const regions = Object.entries(ph);

    const provinces = data.address.region
        ? Object.keys(ph[data.address.region].province_list)
        : [];

    const municipalities = data.address.province
        ? Object.keys(
            ph[data.address.region].province_list[data.address.province]
                .municipality_list
        )
        : [];

    const barangays = data.address.municipality
        ? ph[data.address.region].province_list[data.address.province]
            .municipality_list[data.address.municipality].barangay_list
        : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.add.booking'), {
            onSuccess: () => {
                router.reload({ only: ["bookings"] });
            }
        });
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto"
        >
            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-2xl font-bold text-gray-800 flex items-center gap-2"
            >
                <Calendar className="w-6 h-6 text-indigo-600" />
                Add Booking
            </motion.h1>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Start Date */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col gap-2"
                >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        Start Date
                    </label>
                    <input
                        type="date"
                        className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        name="startDate"
                        value={data.startDate}
                        min={dayjs().format("YYYY-MM-DD")}
                        onChange={(e) => setData("startDate", e.target.value)}
                    />
                </motion.div>

                {/* Month Count */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-col gap-2"
                >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Hash className="w-4 h-4 text-indigo-500" />
                        Month Count
                    </label>
                    <input
                        type="number"
                        className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        name="monthCount"
                        value={data.monthCount}
                        onChange={(e) => setData("monthCount", e.target.value)}
                    />
                </motion.div>

                {/* User Address */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4"
                >
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        User Address
                    </h2>

                    {/* Region */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Map className="w-4 h-4 text-indigo-500" />
                            Region
                        </label>
                        <select
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.address.region}
                            onChange={(e) =>
                                setData("address", {
                                    ...data.address,
                                    region: e.target.value,
                                    province: "",
                                    municipality: "",
                                    barangay: "",
                                })
                            }
                        >
                            <option value="">-- Select Region --</option>
                            {regions.map(([key, region]) => (
                                <option key={key} value={key}>
                                    {region.region_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Province */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Building2 className="w-4 h-4 text-indigo-500" />
                            Province
                        </label>
                        <select
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.address.province}
                            onChange={(e) =>
                                setData("address", {
                                    ...data.address,
                                    province: e.target.value,
                                    municipality: "",
                                    barangay: "",
                                })
                            }
                        >
                            <option value="">-- Select Province --</option>
                            {provinces.map((prov) => (
                                <option key={prov} value={prov}>
                                    {prov}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Municipality */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            Municipality
                        </label>
                        <select
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.address.municipality}
                            onChange={(e) =>
                                setData("address", {
                                    ...data.address,
                                    municipality: e.target.value,
                                    barangay: "",
                                })
                            }
                        >
                            <option value="">-- Select Municipality --</option>
                            {municipalities.map((mun) => (
                                <option key={mun} value={mun}>
                                    {mun}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Barangay */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Home className="w-4 h-4 text-indigo-500" />
                            Barangay
                        </label>
                        <select
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.address.barangay}
                            onChange={(e) =>
                                setData("address", {
                                    ...data.address,
                                    barangay: e.target.value,
                                })
                            }
                        >
                            <option value="">-- Select Barangay --</option>
                            {barangays.map((brgy, idx) => (
                                <option key={idx} value={brgy}>
                                    {brgy}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="flex justify-end"
                >
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className={`${processing ? "opacity-50 cursor-not-allowed" : ""} px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2`}
                    >
                        <Calendar className="w-4 h-4" />
                        Submit
                    </PrimaryButton>
                </motion.div>
            </form>
        </motion.div>
    );
}
