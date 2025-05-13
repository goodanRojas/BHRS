import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

const NotificationPopup = ({
    message,
    tenantName,
    tenantEmail,
    tenantAvatar,
    roomName,
    roomImage,
    startDate,
    monthCount,
    paymentMethod,
    onClose, // Passed from parent to handle close
}) => {
    const [isVisible, setIsVisible] = useState(true);  // Control visibility

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();  // Notify parent if needed
    };

    if (!isVisible) return null;  // Don't render if not visible

    return (
        <div className="fixed top-5 right-5 bg-white shadow-lg rounded-lg max-w-xs z-50">
            <div className="flex justify-between items-center bg-green-500 text-white rounded-t-lg p-2">
                <h2 className="text-lg font-semibold flex items-center">
                    <FontAwesomeIcon icon={faBell} className="mr-2" />
                    New Booking
                </h2>
                <button
                    className="text-white font-bold text-xl"
                    onClick={handleClose}
                    aria-label="Close"
                >
                <FontAwesomeIcon icon={['fas', 'times']} />
                </button>

            </div>
            <div className="flex items-center p-4">
                <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                        <img
                            src={roomImage || '/storage/bed/default_beds.png'}
                            alt={roomName}
                            className="h-8 w-8 rounded-lg mr-2"
                        />
                        <span className="font-medium">{roomName}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <img
                            src={tenantAvatar ? `/storage/user/${tenantAvatar}` : '/storage/user/default_avatar.png'}
                            alt="Tenant Avatar"
                            className="h-10 w-10 rounded-full mr-3"
                        />
                        <p className="font-semibold">{tenantName}</p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        <p>Email: {tenantEmail}</p>
                        <p>Booking Date: {startDate}</p>
                        <p>Duration: {monthCount} month(s)</p>
                        <p>Payment Method: {paymentMethod}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;
