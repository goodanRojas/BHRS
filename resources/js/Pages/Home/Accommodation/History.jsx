import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Link, Head } from "@inertiajs/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBed,
    faBuilding,
    faCalendarAlt,
    faClock,
    faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
export default function History({ booking, comments: initialComments, rating }) {
    console.log(initialComments);
    const [comments, setComments] = useState(initialComments);
    const [editingId, setEditingId] = useState(null);
    const [editBody, setEditBody] = useState("");
    const { data, setData, post, processing, reset } = useForm({
        comment: "",
        stars: rating?.stars || 0,
    });

    const handleRating = (score) => {
        console.log('trying to submit rating...');
        post(route("feedback.bookings.rate", booking.id), { stars: data.stars }, { preserveScroll: true });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        axios.post(route("feedback.bookings.comment", booking.id), {
            comment: data.comment,
            preserveScroll: true,
        })
            .then((response) => {
                console.log(response);
                // Append new comment from backend
                setComments((prev) => [...prev, response.data]);

                reset("comment");
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const handleEditStart = (comment) => {
        if (comment.edited) return; // already edited once
        setEditingId(comment.id);
        setEditBody(comment.body);
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await axios.put(`/feedback/bookings/${id}/comments/edit/`, {
                body: editBody,
            });

            setComments(
                comments.map((c) =>
                    c.id === id ? response.data.comment : c
                )
            );

            setEditingId(null);
            setEditBody("");
        } catch (error) {
            console.error("Error saving comment:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/feedback/bookings/${id}/comments/delete/`);
            setComments(comments.filter((c) => c.id !== id));
        }
        catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    const startDate = new Date(booking.start_date);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + booking.month_count);


    return (
        <AuthenticatedLayout>
            <Head title={booking.bookable.name + ` Booking Details`} />
            <div className="max-w-3xl mx-auto py-6 px-4">
                <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
                    Booking Details
                </h2>


                <div>
                    <img src={`/storage/${booking.bookable.image}`} alt={booking.bookable.name} className="w-full h-56 object-cover rounded-xl border border-gray-200 shadow-sm" />
                    <p className="text-center text-gray-500 text-sm">{booking.bookable.name}</p>
                </div>

                <div className="space-y-3 text-gray-700">
                    <p className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faBed} className="text-indigo-500" />
                        <span className="font-medium">Room:</span> {booking.bookable?.room?.name}
                    </p>

                    <p className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faBuilding} className="text-indigo-500" />
                        <span className="font-medium">Building:</span> {booking.bookable?.room?.building?.name}
                    </p>

                    <p className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500" />
                        <span className="font-medium">Start Date:</span>{" "}{startDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>

                    <p className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
                        <span className="font-medium">Months:</span> {booking.month_count}
                    </p>

                    <p className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFlagCheckered} className="text-green-500" />
                        <span className="font-medium">End Date:</span>{" "}{endDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                </div>
                {/* ⭐ Rating Section */}
                <div className="bg-white shadow rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-2">Your Rating</h2>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => {
                                    setData("stars", star);
                                    handleRating(star);
                                }}

                                className={`text-2xl ${data.stars >= star ? "text-yellow-500" : "text-gray-300"
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* 💬 Comment Section */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-2">Comments</h2>
                    <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={data.comment}
                            onChange={(e) => setData("comment", e.target.value)}
                            className="flex-1 border rounded p-2"
                            placeholder="Write a comment..."
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Post
                        </button>
                    </form>

                    <div className="space-y-2">
                        {comments?.length > 0 ? (
                            comments.map((c) => (
                                <div
                                    key={c.id}
                                    className="border-b pb-2 flex items-center justify-between"
                                >
                                    <div className="flex-1">
                                        {editingId === c.id ? (
                                            <input
                                                type="text"
                                                value={editBody}
                                                onChange={(e) => setEditBody(e.target.value)}
                                                className="border rounded px-2 py-1 text-sm w-full"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-700">
                                                {c.body}
                                                {c.edited !== null  && (
                                                    <span className="text-xs text-gray-400 ml-2">
                                                        (edited)
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <div className="ml-4 space-x-2">
                                        {editingId === c.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveEdit(c.id)}
                                                    className="text-xs text-green-600 hover:underline"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {!c.edited && (
                                                    <button
                                                        onClick={() => handleEditStart(c)}
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No comments yet.</p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
