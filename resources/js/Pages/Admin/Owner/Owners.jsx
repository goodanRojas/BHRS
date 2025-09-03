import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { use, useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Assuming you have a Modal component
import Toast from "@/Components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil, faCheck, faBan, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@inertiajs/inertia-react";
export default function Owner({ owners }) {
    console.log(owners);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: ownerList = [], links = [], meta = {} } = owners || {};
    const [moreOwners, setMoreOwners] = useState(ownerList);
    const { flash } = usePage().props;

    useEffect(() => {
        axios.get('/admin/owners/owners')
            .then(({ data }) => {
                if (Array.isArray(data.owners)) {
                    setMoreOwners((prevOwners) => [...prevOwners, ...data.owners]);
                } else {
                    console.error("Expected data.owners to be an array", data.owners);
                }
            })
            .catch((err) => console.error("Error fetching owners:", err));
    }, []);






    const filteredOwners = moreOwners.filter((owner) =>
        owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openOwner = (id) => {
        window.location.href = `/admin/owners/${id}`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Owner" />
            {flash.success && <Toast message={flash.success} />}

            <div className="">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Owners</h1>

                    <div className="flex items-center space-x-4">
                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Add button */}
                        <Link
                            href="/admin/owner/create"
                            className="bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-700 mb-4"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </Link>


                    </div>

                </div>
                <div className="overflow-x-auto w-full">
                    {owners.data.length > 0 ? (
                        <div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Profile</th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Name</th>
                                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOwners.map((owner) => (
                                        <tr
                                            key={owner.id}
                                            onClick={() => openOwner(owner.id)}
                                            className="hover:bg-gray-50 transition cursor-pointer"
                                        >
                                            <td className="px-6 py-3">
                                                <img
                                                    src={`/storage/${owner.avatar || 'profile/default-avatar.png'}`}
                                                    alt="avatar"
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            </td>
                                            <td className="px-6 py-3 text-center">{owner.name}</td>
                                            <td className="px-6 py-3 text-center">{owner.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="fixed bottom-0 left-0 w-full py-3 shadow flex justify-center space-x-2 z-50">
                                {links?.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => link.url && (window.location.href = link.url)}
                                        className={`px-3 py-1 rounded ${link.active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mt-4 space-x-2">
                            <div className="text-center text-gray-500 py-4">
                                No results found.
                            </div>
                        </div>
                    )}
                </div>
            </div>



        </AuthenticatedLayout>
    );
}
