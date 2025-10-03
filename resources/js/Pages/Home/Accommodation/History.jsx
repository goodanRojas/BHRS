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
import Breadcrumbs from "@/Components/Breadcrumbs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function History({ booking, comments: initialComments, rating }) {
    console.log(initialComments);
    const [comments, setComments] = useState(initialComments);
    const [editingId, setEditingId] = useState(null);
    const [editBody, setEditBody] = useState("");
    const [editAnonymous, setEditAnonymous] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        comment: "",
        anonymous: false,
        stars: rating?.stars || 0,
    });

    const mainImage = booking.bookable.image;
    const otherImages = booking.bookable.images || [];
    const images = [
        { file_path: mainImage, alt_text: booking.bookable.name },
        ...otherImages.map(img => ({
            file_path: img.file_path,
            alt_text: img.alt_text || booking.bookable.name
        }))
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };



    const handleRating = (score) => {
        axios.post(route("feedback.bookings.rate", booking.id), { stars: score })
            .then(res => {
                console.log(res.data.message); // "Rating submitted."
            })
            .catch(err => console.error(err));
    };


    const handleCommentSubmit = (e) => {
        e.preventDefault();

        axios.post(route("feedback.bookings.comment", booking.id), {
            comment: data.comment,
            anonymous: data.anonymous,
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
                anonymous: editAnonymous
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
            <div className="p-4">
                <Breadcrumbs
                    links={[
                        { label: 'histories', url: `/accommodations/history` },
                        { label: 'history' },
                    ]}
                />
            </div>
            <div className="max-w-3xl mx-auto py-6 px-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-500" />
                    Booking Details
                </h2>

                <div className="w-full relative max-w-3xl mx-auto">
                    {/* Image container with animation */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-gray-50">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={images[currentIndex].file_path}
                                src={`/storage/${images[currentIndex].file_path}`}
                                alt={images[currentIndex].alt_text}
                                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-800" />
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex justify-center mt-4 gap-2 flex-wrap">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-16 w-20 sm:h-20 sm:w-28 rounded-lg overflow-hidden border-2 transition ${currentIndex === index
                                    ? "border-indigo-500"
                                    : "border-transparent hover:border-gray-300"
                                    }`}
                            >
                                <img
                                    src={`/storage/${img.file_path}`}
                                    alt={img.alt_text}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Caption */}
                    <p className="text-center text-gray-600 text-sm mt-3 font-medium">
                        {booking.bookable.name}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg">
                                <FontAwesomeIcon icon={faBed} className="text-indigo-500 w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Room</p>
                                <p className="font-medium">{booking.bookable?.room?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg">
                                <FontAwesomeIcon icon={faBuilding} className="text-indigo-500 w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Building</p>
                                <p className="font-medium">{booking.bookable?.room?.building?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500 w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Start Date</p>
                                <p className="font-medium">
                                    {startDate.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 p-2 rounded-lg">
                                <FontAwesomeIcon icon={faClock} className="text-indigo-500 w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Months</p>
                                <p className="font-medium">{booking.month_count}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-green-50 p-2 rounded-lg">
                                <FontAwesomeIcon icon={faFlagCheckered} className="text-green-500 w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">End Date</p>
                                <p className="font-medium">
                                    {endDate.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ⭐ Rating Section */}
                <div className="bg-white shadow-md rounded-xl border border-gray-100 p-5 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Rating</h2>
                    <div className="flex space-x-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => {
                                    setData("stars", star);
                                    handleRating(star);
                                }}
                                className={`text-3xl transition-colors duration-200 ${data.stars >= star
                                    ? "text-yellow-400 hover:text-yellow-500"
                                    : "text-gray-300 hover:text-gray-400"
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* 💬 Comment Section */}
                <div className="bg-white shadow-md rounded-xl border border-gray-100 p-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Comments</h2>

                    {/* Comment Form */}
                    <form
                        onSubmit={handleCommentSubmit}
                        className=" flex flex-col  gap-2 mb-5"
                    >
                        <div className="flex items-center gap-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.anonymous}
                                    onChange={(e) => setData("anonymous", e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div
                                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                 peer-focus:ring-indigo-400 rounded-full peer dark:bg-gray-300 
                 peer-checked:bg-indigo-600 transition
                 after:content-[''] after:absolute after:top-0.5 after:left-0.5 
                 after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                 after:transition-all peer-checked:after:translate-x-5"
                                ></div>
                                <span className="ml-2 text-sm text-gray-700">Post as Anonymous</span>
                            </label>
                        </div>
                        <div
                            className=" flex items-center gap-2 mb-5"
                        >

                            <input
                                type="text"
                                value={data.comment}
                                onChange={(e) => setData("comment", e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                placeholder="Write a comment..."
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                Post
                            </button>
                        </div>
                    </form>

                    {/* Comment List */}
                    <div className="space-y-4">
                        {comments?.length > 0 ? (
                            comments.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex items-start justify-between bg-gray-50 rounded-lg p-3"
                                >
                                    <div className="flex-1">
                                        {editingId === c.id ? (
                                            <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                {/* Anonymous toggle */}
                                                <label className="flex items-center justify-between cursor-pointer">
                                                    <span className="text-sm font-medium text-gray-700">Update as Anonymous</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={editAnonymous}
                                                        onChange={(e) => setEditAnonymous(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full relative transition peer-checked:bg-indigo-600
                  after:content-[''] after:absolute after:top-0.5 after:left-0.5 
                  after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow 
                  after:transition-all peer-checked:after:translate-x-5">
                                                    </div>
                                                </label>

                                                {/* Edit text input */}
                                                <input
                                                    type="text"
                                                    value={editBody}
                                                    onChange={(e) => setEditBody(e.target.value)}
                                                    placeholder="Edit your comment..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
               focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
               bg-white shadow-sm"
                                                />
                                            </div>

                                        ) : (
                                            <div className="relative text-sm text-gray-700">
                                                {Boolean(c.anonymous) && (
                                                    <p className="absolute bottom-5 left-0 text-xs font-medium bg-yellow-400 p-1 rounded-full text-gray-500 mb-1">Anonymous</p>
                                                )}

                                                {c.body}
                                                {c.edited !== null && (
                                                    <span className="text-xs text-gray-400 ml-2">(edited)</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3 space-x-2 flex-shrink-0">
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
                            <p className="text-sm text-gray-500 text-center">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
