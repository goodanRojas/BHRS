import { motion } from "framer-motion";

export default function DefaultProfile({ size = "w-10 h-10" }) {
    return (
        <motion.img
            src="/storage/profile/default_avatar.svg"
            alt="avatar"
            className={`${size} rounded-full border border-gray-300 object-cover shadow-md bg-white`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
        />
    );
}
