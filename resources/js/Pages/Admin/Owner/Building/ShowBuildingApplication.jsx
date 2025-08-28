import AuthenticatedLayout from "../../AuthenticatedLayout";
import { Link } from "@inertiajs/react";

export default function ShowApplication({ application }) {
    console.log(application);
    const address = typeof application.address === "string"
        ? JSON.parse(application.address)
        : application.address;

    const amenities = Array.isArray(application.amenities)
        ? application.amenities
        : JSON.parse(application.amenities ?? "[]");

    return (
        <AuthenticatedLayout>
            <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">
                    Building Application Review
                </h1>

                {/* Owner Info */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Owner</h2>
                    <p>{application.seller?.name}</p>
                    <p className="text-sm text-gray-600">{application.seller?.email}</p>
                </div>

                {/* Building Info */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Building Information</h2>
                    <p><strong>Name:</strong> {application.name}</p>
                    <p><strong>Floors:</strong> {application.number_of_floors}</p>
                    <p><strong>Rooms:</strong> {application.number_of_rooms}</p>
                </div>

                {/* Address */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Address</h2>
                    {address ? (
                        <p>
                            {address.barangay}, {address.municipality},{" "}
                            {address.province}, {address.region}
                        </p>
                    ) : (
                        <p className="text-gray-500">No address provided</p>
                    )}
                </div>

                {/* Amenities */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Amenities</h2>
                    {amenities.length > 0 ? (
                        <ul className="list-disc ml-6">
                            {amenities.map((a, idx) => (
                                <li key={idx}>{a}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No amenities listed</p>
                    )}
                </div>

                {/* Documents */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Documents</h2>
                    <p>
                        <strong>BIR:</strong>{" "}
                        <a
                            href={`/storage/${application.bir}`}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                        >
                            View File
                        </a>
                    </p>
                    <p>
                        <strong>Fire Safety Certificate:</strong>{" "}
                        <a
                            href={`/storage/${application.fire_safety_certificate}`}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                        >
                            View File
                        </a>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Approve
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Reject
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
