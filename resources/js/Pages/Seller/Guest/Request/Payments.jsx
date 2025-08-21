import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
export default function Payments({ payments }) {
    console.log(payments);
    return (

        <SellerLayout>
            <Head title="Payments" />
            <div className="p-8 space-y-8 min-h-screen">
                <h3 className='text-2xl font-semibold text-gray-900'>Payments</h3>
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3 text-left">User</th>
                            <th className="px-6 py-3 text-left">Booking Details</th>
                            <th className="px-6 py-3 text-left">Payment Method</th>
                            <th className="px-6 py-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => {
                            const startDate = new Date(payment.booking.start_date);
                            const endDate = new Date(startDate);
                            const monthCount = payment.booking.month_count;
                            endDate.setMonth(endDate.getMonth() + monthCount);


                            return (
                                <tr key={payment.id} className="border-t border-gray-200 hover:bg-indigo-50 transition">
                                    {/* User Information */}
                                    <td className="px-6 py-4 flex items-center gap-4 whitespace-nowrap">
                                        <img
                                            src={`/storage/${payment.booking.user.avatar || 'profile/default_avatar.png'}`}
                                            alt={payment.booking.user.name}
                                            className="w-12 h-12 rounded-full border object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{payment.booking.user.name}</p>
                                            <p className="text-xs text-gray-500">{payment.booking.user.email}</p>
                                            {payment.booking.user.address && (
                                                <p className="text-xs text-gray-400">{payment.booking.user.address}</p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Booking Information */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="font-semibold">{payment.booking.bookable.name}</p>
                                        <p className="text-xs text-gray-500">Start: {startDate.toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-500">End: {endDate.toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-500">Duration: {monthCount} month{monthCount > 1 ? 's' : ''}</p>
                                    </td>

                                    {/* Payment Info */}<td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-semibold text-gray-800">
                                                {payment.booking.payment_method}
                                            </span>
                                            <span className="text-sm text-blue-600 font-medium">
                                                ₱{Number(payment.booking.total_price).toLocaleString()}
                                            </span>
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                                                      ${payment.booking.status === 'paid'
                                                        ? 'bg-green-100 text-green-700'
                                                        : payment.booking.status === 'waiting'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : payment.booking.status === 'canceled' || payment.booking.status === 'rejected'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {payment.booking.status}
                                            </span>
                                        </div>
                                    </td>


                                    {/* Action Button */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/seller/request/payments/${payment.id}`}
                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-full shadow hover:bg-indigo-700 transition"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </SellerLayout>

    )

}