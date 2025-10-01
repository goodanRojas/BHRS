import { motion } from "framer-motion";
import { User, Mail, Phone, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function UserInfo({ user }) {
    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col items-center">
                {/* Avatar */}
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full shadow-md object-cover"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center shadow-md">
                        <User className="w-10 h-10 text-indigo-600" />
                    </div>
                )}

                <h2 className="mt-3 text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">ID: {user.id}</p>
            </div>

            {/* Details */}
            <div className="mt-6 space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <span>{user.email}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-indigo-500" />
                    <span>{user.phone || "No phone provided"}</span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                    {user.status === 1 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-gray-700">
                        {user.status === 1 ? "Active" : "Inactive"}
                    </span>
                </div>

                {/* Online */}
                <div className="flex items-center gap-3">
                    <Clock
                        className={`w-5 h-5 ${
                            user.is_online ? "text-green-500" : "text-gray-400"
                        }`}
                    />
                    <span className="text-gray-700">
                        {user.is_online ? "Online" : "Offline"}
                    </span>
                </div>
            </div>

            {/* Dates */}
            <div className="mt-6 border-t pt-4 text-xs text-gray-500 space-y-1">
                <p>Created: {new Date(user.created_at).toLocaleString()}</p>
                <p>Updated: {new Date(user.updated_at).toLocaleString()}</p>
                {user.email_verified_at && (
                    <p>Email Verified: {new Date(user.email_verified_at).toLocaleString()}</p>
                )}
            </div>
        </motion.div>
    );
}
