import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { use, useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Assuming you have a Modal component
import Toast from "@/Components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faWifi, faPencil, faCheck, faBan, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/inertia-react";
import { motion } from "framer-motion";
import { UserCircle2, Wifi, Plus, Search } from "lucide-react";
import DefaultProfile from "@/Components/DefaultProfile";
export default function Owner({ owners }) {
    console.log(owners);
    const [searchQuery, setSearchQuery] = useState("");
    const [onlineOwners, setOnlineOwners] = useState([]);

    const { data: ownerList = [], links = [], meta = {} } = owners || {};
    const [onlineCount, setOnlineCount] = useState(0);
    const { flash } = usePage().props;

    const filteredOwners = owners.data.filter((owner) =>
        owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    useEffect(() => {
        const channel = window.Echo.join('online-sellers')
            .here((sellers) => {
                setOnlineOwners(sellers.map((s) => s.id));
                setOnlineCount(sellers.length);
            })
            .joining((seller) => {
                setOnlineOwners((prev) => [...prev, seller.id]);
                setOnlineCount((prev) => prev + 1);
            })
            .leaving((seller) => {
                setOnlineOwners((prev) => prev.filter((id) => id !== seller.id));
                setOnlineCount((prev) => prev - 1);
            });
        return () => {
            window.Echo.leave('online-sellers');
        }
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Owners" />
            {flash.success && <Toast message={flash.success} />}

            <motion.div
                className="p-6 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <UserCircle2 className="w-7 h-7 text-indigo-600" />
                            Owners
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Wifi className="w-4 h-4 text-green-500" />
                            Online: {onlineCount}
                        </p>
                    </div>

                    {/* Search + Add Button */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search owners..."
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 transition"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/admin/owner/create"
                                className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-700 shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                    {owners.data.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
                                        Profile
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
                                        Online
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOwners.map((owner, index) => (
                                    <motion.tr
                                        key={owner.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => (window.location.href = `/admin/owners/${owner.id}`)}
                                        className="hover:bg-indigo-50 cursor-pointer transition duration-200"
                                    >
                                        <td className="px-6 py-3 flex items-center">
                                            {owner.avatar ? (
                                                <img
                                                    src={`/storage/${owner.avatar}`}
                                                    alt={owner.name}
                                                    className="w-10 h-10 rounded-full object-cover border"
                                                />
                                            ) : (
                                                <DefaultProfile className="w-10 h-10" />
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-center text-gray-800 font-medium">
                                            {owner.name}
                                        </td>
                                        <td className="px-6 py-3 text-center text-gray-600">{owner.email}</td>
                                        <td className="px-6 py-3 text-center">
                                            {onlineOwners.includes(owner.id) ? (
                                                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full font-medium">
                                                    Online
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-full">
                                                    Offline
                                                </span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            No results found.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {links?.length > 0 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && (window.location.href = link.url)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${link.active
                                        ? "bg-indigo-600 text-white shadow"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </AuthenticatedLayout>
    );
}
