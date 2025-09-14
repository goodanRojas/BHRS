import Layout from "./Layout";
import {motion} from "framer-motion";
export default function Pending({ subscriptions }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const rowVariant = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    return (
        <Layout>
            <div className="p-6">
          

                <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
                    <motion.table
                        className="min-w-full divide-y divide-gray-200"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Seller
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Receipt
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Reference #
                                </th>
                            </tr>
                        </thead>
                        <motion.tbody className="bg-white divide-y divide-gray-200">
                            {subscriptions.map((sub) => (
                                <motion.tr
                                    key={sub.id}
                                    onClick={() => window.location.href = `/admin/subscriptions/pending/${sub.id}/show`}
                                    variants={rowVariant}
                                    className="hover:bg-indigo-50 hover:cursor-pointer transition"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.seller.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.plan.plan}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{sub.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(sub.start_date).toLocaleDateString("en-PH", { weekday:"short", year:"numeric", month:"short", day:"numeric" })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.end_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {sub.seller_receipt_path ? (
                                            <a
                                                href={`/storage/${sub.seller_receipt_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.seller_ref_num || "-"}</td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </motion.table>
                </div>
            </div>
        </Layout>
    );
}
