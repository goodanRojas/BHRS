import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import ChatLayout from "./ChatLayout";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
            >
                <FontAwesomeIcon icon={faComments} className="text-xl" />
            </button>

            {/* Chat Layout */}
            <ChatLayout isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
