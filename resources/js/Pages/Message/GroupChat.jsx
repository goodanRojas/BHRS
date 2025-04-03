import { useState, useContext } from "react";
import { ChatContext } from "@/Layouts/AuthenticatedLayout";
import axios from "axios";

export default function GroupChat({ auth }) {
    const { groupMessages, setGroupMessages } = useContext(ChatContext);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messageInput, setMessageInput] = useState("");

    const sendMessage = () => {
        if (!messageInput.trim() || !selectedGroup) return;

        axios.post("/group-messages/send", {
            group_id: selectedGroup,
            content: messageInput,
        }).then(({ data }) => {
            setGroupMessages((prev) => ({
                ...prev,
                [selectedGroup]: [...(prev[selectedGroup] || []), data.message],
            }));
            setMessageInput("");
        });
    };

    return (
        <div className="flex h-60">
            <div className="w-1/3 border-r overflow-y-auto">
                {Object.keys(groupMessages || {}).map((groupId) => (
                    <div key={groupId} className="p-3 cursor-pointer" onClick={() => setSelectedGroup(groupId)}>
                        Group {groupId}
                    </div>
                ))}
            </div>
            <div className="w-2/3 flex flex-col h-full">
                {selectedGroup && (
                    <>
                        <p>Group {selectedGroup}</p>
                        <button onClick={sendMessage}>Send</button>
                    </>
                )}
            </div>
        </div>
    );
}
