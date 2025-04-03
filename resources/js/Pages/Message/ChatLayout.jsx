import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faComments, faUsers, faRobot } from "@fortawesome/free-solid-svg-icons";
import DirectChat from "./DirectChat";
import GroupChat from "./GroupChat";
import BotChat from "./BotChat";

export default function ChatLayout({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("direct");

    return (
        isOpen && (
            <div className="absolute bottom-16 right-0 w-80 bg-white shadow-lg rounded-lg">
                {/* Header */}
                <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
                    <strong>Chats</strong>
                    <button className="p-1 text-gray-700 hover:text-black" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex justify-around bg-gray-100 p-2 border-b">
                    <button
                        className={`flex-1 py-2 ${activeTab === "direct" ? "bg-blue-500 text-white" : "text-gray-700"}`}
                        onClick={() => setActiveTab("direct")}
                    >
                        <FontAwesomeIcon icon={faComments} />
                    </button>
                    <button
                        className={`flex-1 py-2 ${activeTab === "group" ? "bg-blue-500 text-white" : "text-gray-700"}`}
                        onClick={() => setActiveTab("group")}
                    >
                        <FontAwesomeIcon icon={faUsers} /> 
                    </button>
                    <button
                        className={`flex-1 py-2 ${activeTab === "bot" ? "bg-blue-500 text-white" : "text-gray-700"}`}
                        onClick={() => setActiveTab("bot")}
                    >
                        <FontAwesomeIcon icon={faRobot} /> 
                    </button>
                </div>

                {/* Chat Components */}
                {activeTab === "direct" && <DirectChat />}
                {activeTab === "group" && <GroupChat />}
                {activeTab === "bot" && <BotChat />}
            </div>
        )
    );
}
