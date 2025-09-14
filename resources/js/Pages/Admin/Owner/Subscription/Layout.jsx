import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import AuthenticatedLayout from "../../AuthenticatedLayout";

export default function Layout({ children }) {
    const { url, component } = usePage(); // component is the current page component
    // Or use current route if you pass it from Laravel: props.routeName

    const links = [
        { name: "Active", route: "admin.subscriptions.index" },
        { name: "Pending", route: "admin.subscriptions.pending" },
        { name: "Cancelled", route: "admin.subscriptions.cancelled" },
    ];

    return (
        <AuthenticatedLayout>
            <h1 className="text-3xl font-extrabold text-indigo-900 mb-8">
                Subscriptions
            </h1>

            <nav className="mb-6">
                <ul className="flex flex-wrap gap-4">
                    {links.map((link) => {
                        // Check if the link route matches current route
                        const isActive = route().current(link.route);

                        return (
                            <motion.li
                                key={link.route}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={route(link.route)}
                                    className={`px-5 py-2 rounded-lg font-medium transition 
                                        ${
                                            isActive
                                                ? "bg-indigo-600 text-white shadow-lg"
                                                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>

            <div className="max-w-4xl mx-auto p-6">
                {children}
            </div>
        </AuthenticatedLayout>
    );
}
