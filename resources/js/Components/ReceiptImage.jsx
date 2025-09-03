import { useState } from "react";

export default function ReceiptImage({ src, alt }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <img
                src={src}
                alt={alt}
                className="w-64 min-h-64 rounded-xl shadow cursor-pointer hover:opacity-90 transition"
                onClick={() => setIsOpen(true)}
            />

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <img
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-full rounded-lg"
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
                    />
                </div>
            )}
        </>
    );
}
