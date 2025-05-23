import AuthenticatedLayout from "../../AuthenticatedLayout";
import { useState } from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import Modal from '@/Components/Modal';
import axios from 'axios';

export default function BuildingApplication({ applications }) {
    console.log(applications);
    const [approveModal, setApproveModal] = useState(false);
    const [confirmApproveModal, setConfirmApproveModal] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [image, setImage] = useState(null); // File state for the image
    const [additionalInfoModal, setAdditionalInfoModal] = useState(false); // New modal for additional info

    // Convert row data to CSV with headers
    const generateCSV = (application) => {
        const headers = [
            "Building Name",
            "Number of Floors",
            "Rooms",
            "Beds",
            "Address"
        ];

        const row = [
            application.building_name,
            application.number_of_floors,
            application.number_of_rooms,
            application.number_of_beds,
            application.address,
        ];

        // Create CSV string with headers
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + row.join(",") + "\n";

        return csvContent; // Return the CSV content for inclusion in ZIP
    };

    // Download the BIR and Fire Safety Certificate files as a ZIP
    const downloadAsZip = async (application) => {
        const zip = new JSZip();

        // Add the CSV content to the zip
        const csvContent = generateCSV(application);
        zip.file(`${application.building_name}_application.csv`, csvContent);

        // Add BIR and Fire Safety Certificate files to the zip
        const birFilePath = `/storage/${application.bir}`;
        const fireSafetyFilePath = `/storage/${application.fire_safety_certificate}`;

        // Fetch and add files to ZIP
        const birFileResponse = await fetch(birFilePath);
        const fireSafetyFileResponse = await fetch(fireSafetyFilePath);

        const birBlob = await birFileResponse.blob();
        const fireSafetyBlob = await fireSafetyFileResponse.blob();

        zip.file("BIR.pdf", birBlob);
        zip.file("Fire_Safety_Certificate.pdf", fireSafetyBlob);

        // Generate the zip file
        zip.generateAsync({ type: "blob" }).then((content) => {
            // Trigger download of the zip file
            FileSaver.saveAs(content, `${application.building_name}_documents.zip`);
        });
    };

    // Save additional information after approval
    const handleSaveAdditionalInfo = async () => {
        try {
            const response = await axios.post('/admin/owner/building/application/approve', {
                id: selectedApplicationId,
                latitude,
                longitude,
                image
            });
            console.log(response);
            // Handle success, maybe close the modal
            setAdditionalInfoModal(false);
        } catch (error) {
            console.error("Error saving additional info:", error);
        }
    };

    // Approve the application and open the additional info modal
    const handleApproveClick = () => {
        setAdditionalInfoModal(true);
        setApproveModal(false); // Close the approve modal
    };

    return (
        <AuthenticatedLayout>
            <div className="p-4">
                <h1 className="text-2xl font-semibold">Building Applications</h1>

            {applications.length > 0 ? (
                    <table className="min-w-full mt-4 table-auto">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-2 text-left">Building Name</th>
                            <th className="px-4 py-2 text-left">Number of Floors</th>
                            <th className="px-4 py-2 text-left">Rooms</th>
                            <th className="px-4 py-2 text-left">Beds</th>
                            <th className="px-4 py-2 text-left">Address</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application.id} className="border-b">
                                <td className="px-4 py-2">{application.building_name}</td>
                                <td className="px-4 py-2">{application.number_of_floors}</td>
                                <td className="px-4 py-2">{application.number_of_rooms}</td>
                                <td className="px-4 py-2">{application.number_of_beds}</td>
                                <td className="px-4 py-2">{application.address}</td>
                                <td className="px-4 py-2">
                                    {/* Approve button */}
                                    <button
                                        onClick={() => {
                                            setSelectedApplicationId(application.id); // Set selected application id
                                            setApproveModal(true); // Open modal
                                        }}
                                        className="bg-blue-500 text-white px-2 py-1 rounded">
                                        Approve
                                    </button>
                                    {/* Download CSV and ZIP button */}
                                    <button
                                        onClick={() => downloadAsZip(application)}
                                        className="ml-2 bg-green-500 text-white px-2 py-1 rounded">
                                        Download CSV & ZIP
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex justify-center mt-4 space-x-2">
                    <div className="text-center text-gray-500 py-4">
                        No results found.
                    </div>
                </div>
            )}
            </div>

            {/* Approve Modal */}
            <Modal show={approveModal} onClose={() => setApproveModal(false)}>
                <div>
                    <h2>Are you sure you want to approve this application?</h2>
                    <button 
                        onClick={handleApproveClick} // Corrected the onClick handler
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        Approve
                    </button>
                    <button onClick={() => setApproveModal(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </Modal>

            {/* Additional Info Modal */}
            <Modal show={additionalInfoModal} onClose={() => setAdditionalInfoModal(false)}>
                <div>
                    <h2>Enter Additional Information</h2>
                    <div className="mb-4">
                        <label>Latitude</label>
                        <input
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Longitude</label>
                        <input
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Image</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <button 
                        onClick={handleSaveAdditionalInfo} 
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save Information
                    </button>
                    <button 
                        onClick={() => setAdditionalInfoModal(false)} 
                        className="bg-red-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
