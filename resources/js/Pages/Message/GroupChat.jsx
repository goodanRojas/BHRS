import { useState, useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import Modal from "@/Components/Modal"; // your custom modal
import Dropdown from '@/Components/Dropdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPen, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
export default function GroupChat() {
  const { auth } = usePage().props;
  const { groupMessages, setGroupMessages } = useContext(ChatContext);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);


  const [groups, setGroups] = useState([]);
  const [selectedGC, setSelectedGC] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupName, setEditGroupName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // const container = messagesContainerRef.current;
  // if (!container) return;
  // const previousScrollHeight = container.scrollHeight;


  // setGroupMessages((prev) => [
  //   ...response.data.messages,
  //   ...prev
  // ]);

  // setTimeout(() => {
  //   const newScrollHeight = container.scrollHeight;
  //   container.scrollTop = newScrollHeight - previousScrollHeight + container.scrollTop;
  // }, 0);

  useEffect(() => {
    axios.get("/group-message").then(({ data }) => setGroups(data.groups));
  }, []);

  useEffect(() => {
    if (selectedGC) {
      axios.get(`/group-message/selected-gc/${selectedGC.id}`).then(({ data }) => {
        setGroupMessages(prev => ({ ...prev, [selectedGC.id]: data.group }));
        setSelectedGC(prev => ({ ...prev, groups: data }));

      });
    }
  }, [selectedGC?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages, selectedGC]);
/* 
  useEffect(() => {
    const container = messagesContainerRef.current;

    const handleScroll = () => {
      if (container.scrollTop < 100 && !isLoading && hasMoreMessages) {
        loadOlderMessages();
      }
    };
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMoreMessages]);

  const loadOlderMessages = async () => {
    setIsLoading(true);

    const response = await axios.get(`/group-message/older-messages`, {
      params: {
        before: earliestMessageId, // get messages older than this ID
      }
    });

    if (response.data.messages.length > 0) {
      setGroupMessages((prev) => [
        ...response.data.messages,
        ...prev,
      ]);
      setEarliestMessageId(response.data.message[0].id);
    }
    else {
      setHasMoreMessages(false);
    }
    setIsLoading(false);

  }; */

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedGC) return;

    axios.post("/group-messages/send", {
      group_id: selectedGC.id,
      content: messageInput,
    }).then(({ data }) => {
      selectedGC.messages.push(data.message);
      setSelectedGC({ ...selectedGC });  // force re-render
      setMessageInput("");
    });
  };

  const createGroup = () => {
    if (!newGroupName.trim()) return;

    axios.post("/group-message/create", { name: newGroupName }).then(({ data }) => {
      setGroups(prev => [...prev, data.group]);
      setNewGroupName("");
      setShowCreateModal(false);
    });
  };

  const updateGroup = () => {
    if (!selectedGC || !editGroupName.trim()) return;

    axios.put(`/group-message/update/${selectedGC.id}`, { name: editGroupName })
      .then(({ data }) => {
        setGroups(prev => prev.map(group => group.id === selectedGC.id ? data.group : group));
        setSelectedGC(data.group);
        setEditGroupName("");
        setShowEditModal(false);
      });
  };

  const deleteGroup = () => {
    if (!selectedGC) return;

    axios.delete(`/group-message/delete/${selectedGC.id}`)
      .then(() => {
        setGroups(prev => prev.filter(group => group.id !== selectedGC.id));
        setSelectedGC(null);
        setDeleteConfirm(false);
      });
  };

  const addUserToGroup = () => {

    axios.post(`/group-message/${selectedGC.id}/add-member`, { id: addUserEmail })
      .then(() => {
        // things after adding user
      });
  };

  const removeUserFromGroup = (userId) => {
    axios.post(`/group-message/${selectedGC.id}/remove-member`, { user_id: userId })
      .then(() => {
        alert("User removed!");
      });
  };

  const isCreator = selectedGC && selectedGC.creator_id === auth.user.id;

  return (
    <div className="h-80 border rounded shadow-lg overflow-hidden flex flex-col">

      {selectedGC === null && (
        <div className="flex justify-between items-center gap-4 p-4">
          <h2 className="text-lg font-bold">GC</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-full w-10 h-10 bg-blue-500 text-white py-1"
          >
            +
          </button>
        </div>
      )}

      {/* Chat window */}
      {selectedGC ? (

        <div className="flex flex-col flex-1 relative overflow-y-auto">
          <div className=" flex items-center justify-between sticky top-0 left-0 right-0 bg-white p-4">
            <button
              onClick={() => {
                setSelectedGC(null);
              }}
              className="text-gray-700 hover:text-gray-900"
            >
              ←
            </button>
            <p>{selectedGC.name}</p>
            {/* Option Dropdown */}
            <div className="relative group">
              <Dropdown>
                <Dropdown.Trigger>
                  <div
                    className="relative inline-flex items-center justify-center p-2 text-gray-600 cursor-pointer hover:scale-105 transition-transform duration-200"

                  >
                    <FontAwesomeIcon
                      icon={faEllipsisV}
                      className="h-5 w-5 text-gray-400 hover:text-gray-500 focus:outline-none"
                    />
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Content className="flex flex-col w-64 bg-white shadow-lg rounded-lg border border-gray-200 p-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                  >
                    <FontAwesomeIcon icon={faPen} className="text-gray-500" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                    Delete
                  </button>
                  <button
                    onClick={() => setAddUserModal(true)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="text-gray-500" />
                    Add User
                  </button>
                </Dropdown.Content>
              </Dropdown>
              <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                options
              </span>
            </div>


          </div>

          {/* Messages Section */}
          <div>
            {/* MESSAGES */}
            <div

              ref={messagesContainerRef}
              className="flex-1 p-4 space-y-3 overflow-y-auto min-h-full">
              {selectedGC.messages.length === 0 ? (
                <div className="text-gray-400 text-center">No messages yet</div>
              ) :
                selectedGC.messages.map((message, index) => {
                  const sender = selectedGC.members.find(member => member.id === message.sender_id);
                  return (
                    <div
                      key={index}
                      className={`flex gap-2 p-3 rounded-lg max-w-xs ${message.sender_id === auth.user.id
                        ? "ml-auto bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={sender.avatar ? `/storage/${sender.avatar}` : '/storage/profile/default_avatar.png'}
                        alt="avatar"
                      />

                      <div className="flex flex-col">
                        <h2 className="text-sm font-semibold">
                          {sender ? sender.name : 'User'}
                        </h2>
                        <p className="text-sm mt-0.5">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70 text-right">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                  )
                }
                )
              }
              <div ref={messagesEndRef} />
            </div>
           {/*  {isLoading && (
              <div className="text-center text-gray-500">Loading older messages…</div>
            )} */}

            {/* INPUT FOR SENDING MESSAGE */}
            <div className="border-t p-3 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Send
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="border-r p-3 space-y-3 ">

          <div className="overflow-y-auto h-80 space-y-2">
            {groups.map(group => (
              <div
                key={group.id}
                onClick={() => {
                  setSelectedGC(group)
                }}
                className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              >
                <div className="font-semibold">{group.name}</div>
                <div className="text-sm text-gray-600 truncate">
                  {(group.messages && group.messages.length > 0)
                    ? group.messages[group.messages.length - 1].content :
                    "No messages yet"
                  }
                </div>

              </div>
            ))}
          </div>
        </div>

      )}

      {/* Create Group Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Create Group Chat</h2>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group name"
            className="w-full p-2 border rounded mb-3"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreateModal(false)} className="text-gray-500">Cancel</button>
            <button onClick={createGroup} className="bg-blue-500 text-white px-3 py-1 rounded">Create</button>
          </div>
        </div>
      </Modal>

      {/* Edit Group Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Edit Group Chat</h2>
          <input
            type="text"
            value={editGroupName}
            onChange={(e) => setEditGroupName(e.target.value)}
            placeholder="New group name"
            className="w-full p-2 border rounded mb-3"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowEditModal(false)} className="text-gray-500">Cancel</button>
            <button onClick={updateGroup} className="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Prompt */}
      {deleteConfirm && (
        <Modal show={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-3">Delete Group</h2>
            <p>Are you sure you want to delete <strong>{selectedGC.name}</strong>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setDeleteConfirm(false)} className="text-gray-500">Cancel</button>
              <button onClick={deleteGroup} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
