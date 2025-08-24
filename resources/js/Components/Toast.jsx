// resources/js/Components/Toast.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Toast({ message, isTrue, isType = "success" }) {
    const typeColors = {
        error: "red",
        warning: "yellow",
        success: "green",
    };

    const type = typeColors[isType] || "green";
    const [show, setShow] = useState(isTrue || false);

    useEffect(() => {
        if (!show) return;
        const timer = setTimeout(() => setShow(false), 3000);
        return () => clearTimeout(timer);
    }, [show]);

    if (!message) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed top-4 right-4 z-50"
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <div
                        className={`flex items-center gap-2 bg-${type}-500 text-white text-sm px-3 py-2 rounded-lg shadow-md`}
                    >
                        <span>{message}</span>
                        <button
                            className="ml-2 hover:text-gray-200"
                            onClick={() => setShow(false)}
                        >
                            <FontAwesomeIcon icon={faTimes} size="sm" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
