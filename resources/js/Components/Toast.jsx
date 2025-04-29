// resources/js/Components/Toast.jsx
import { useEffect, useState } from 'react';

export default function Toast({ message }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!show || !message) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-500 text-white px-4 py-2 rounded shadow-md">
                {message}
            </div>
        </div>
    );
}
