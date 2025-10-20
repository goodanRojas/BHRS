import { motion } from "framer-motion";
import { Calendar, CreditCard, User, Building2, BedDouble, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SellerLayout from "@/Layouts/SellerLayout";
import { Link } from "@inertiajs/react";

export default function GuestHistory({ booking }) {
    return (
        <SellerLayout>
            <motion.div
                className="p-6 max-w-3xl mx-auto space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <motion.h1
                        className="text-2xl font-semibold text-gray-800 flex items-center gap-2"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <BedDouble className="w-6 h-6 text-indigo-500" />
                        Booking Details
                    </motion.h1>

                    <Link href={route('seller.guest.history.index')}>
                        <button variant="outline" className="flex items-center gap-2 rounded-xl">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    </Link>
                </div>

                {/* Booking Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="rounded-2xl border border-gray-200 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            {/* Status Section */}
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <BedDouble className="w-5 h-5 text-indigo-500" />
                                    <span className="font-medium">Booking #{booking.id}</span>
                                </div>
                                {booking.status === "ended" ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                            </div>

                            {/* Details Grid */}
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>
                                        <span className="text-gray-500">Tenant:</span>{" "}
                                        <span className="font-medium text-gray-800">
                                            {booking.user?.name || "Unknown"}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>
                                        <span className="text-gray-500">Start Date:</span>{" "}
                                        <span className="font-medium text-gray-800">
                                            {booking.start_date}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <span>
                                        <span className="text-gray-500">Payment:</span>{" "}
                                        <span className="capitalize text-gray-800">
                                            {booking.payment_method || "N/A"}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-400" />
                                    <span>
                                        <span className="text-gray-500">Bookable Type:</span>{" "}
                                        <span className="font-medium text-gray-800">
                                            {booking.bookable_type.replace("App\\Models\\", "")}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BedDouble className="w-4 h-4 text-gray-400" />
                                    <span>
                                        <span className="text-gray-500">Bookable ID:</span>{" "}
                                        <span className="font-medium text-gray-800">
                                            {booking.bookable_id}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>
                                        <span className="text-gray-500">Created:</span>{" "}
                                        <span className="font-medium text-gray-800">
                                            {new Date(booking.created_at).toLocaleString()}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Total Price</span>
                                <span className="text-indigo-600 font-semibold text-lg">
                                    ₱{parseFloat(booking.total_price).toLocaleString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </SellerLayout>
    );
}
