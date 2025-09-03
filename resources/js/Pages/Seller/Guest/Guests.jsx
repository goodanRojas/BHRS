import SellerLayout from "@/Layouts/SellerLayout";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faMoneyBillWave,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function BedGuests({ bookings }) {
  return (
    <SellerLayout>
      <Head title="Guests" />

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
        {bookings.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 text-center"
          >
            No bed bookings found.
          </motion.p>
        ) : (
          <div className="overflow-x-auto">
            <motion.table
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-w-full text-sm text-gray-800 border-collapse rounded-lg overflow-hidden"
            >
              <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Bed</th>
                  <th className="px-6 py-3 text-left">Booking Dates</th>
                  <th className="px-6 py-3 text-left">Payment</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    {/* User */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={`/storage/${booking.user.avatar || "profile/default_avatar.png"
                          }`}
                        alt={booking.user.name}
                        className="w-12 h-12 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-medium">{booking.user.name}</p>
                        <p className="text-xs text-gray-500">
                          {booking.user.email}
                        </p>
                      </div>
                    </td>

                    {/* Bed */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{booking.bookable.name}</p>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <span>{booking.bookable.room.name}</span>
                        <span className="text-gray-400">•</span>
                        <span>{booking.bookable.room.building.name}</span>
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                          {new Date(booking.start_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {booking.end_date && (
                          <span className="block text-xs text-gray-500">
                            End:{" "}
                            {new Date(booking.end_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                        <p className="text-xs text-gray-400">
                          {booking.month_count} month{booking.month_count > 1 ? "s" : ""}
                        </p>
                      </div>
                    </td>


                    {/* Payment */}
                    <td className="px-6 py-4 text-sm">
                      <FontAwesomeIcon
                        icon={
                          booking.payment_method === "gcash"
                            ? faCreditCard
                            : faMoneyBillWave
                        }
                        className="text-indigo-600 mr-2"
                      />
                      {booking.payment_method.toUpperCase()}
                      <div className="text-xs text-gray-500">
                        ₱{booking.total_price.toLocaleString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${booking.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={
                            booking.status === "completed"
                              ? faCheckCircle
                              : faTimesCircle
                          }
                        />
                        {booking.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
