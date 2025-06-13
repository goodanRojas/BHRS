// resources/js/Components/Toast.jsx
import { useEffect, useState } from 'react';

export default function Toast({ message, isTrue, isType = 'success' }) {
    const typeColors = {
        error: 'red',
        warning: 'yellow',
        success: 'green'
    };

    const type = typeColors[isType] || 'green'; // Default to 'green' for success
    const [show, setShow] = useState(isTrue || false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!show || !message) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`bg-${type}-500 text-white px-4 py-2 rounded shadow-md`}>
                {message}
            </div>
        </div>
    );
}
