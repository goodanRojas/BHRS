import React, { useState, useEffect } from 'react';

const GCashPayment = ({ bookingId, gcashUrl }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate the process of redirecting to the GCash payment gateway
        const timer = setTimeout(() => {
            setLoading(false);
            window.location.href = gcashUrl; // Redirect to GCash payment page
        }, 2000); // Simulate a delay before redirection

        return () => clearTimeout(timer);
    }, [gcashUrl]);

    return (
        <div className="gcash-payment">
            <h3>GCash Payment</h3>
            {loading ? (
                <p>Redirecting you to GCash...</p>
            ) : (
                <p>If you are not redirected, <a href={gcashUrl}>click here</a> to proceed with your GCash payment.</p>
            )}
        </div>
    );
};

export default GCashPayment;
    