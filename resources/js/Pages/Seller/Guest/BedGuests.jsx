export default function BedGuests({ bookings }) {
  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bed bookings found.</p>
      ) : (
        <table className="min-w-full text-sm text-gray-800 border-collapse">
          <thead className="bg-indigo-50 text-indigo-700 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Bed</th>
              <th className="px-6 py-3 text-left">Booking Dates</th>
              <th className="px-6 py-3 text-left">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gray-200 hover:bg-indigo-50">
                {/* User Info */}
                <td className="px-6 py-4 flex items-center gap-4 whitespace-nowrap">
                  <img
                    src={`/storage/${booking.user.avatar || 'profile/default_avatar.png'}`}
                    alt={booking.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-xs text-gray-500">{booking.user.email}</p>
                    {booking.user.address && (
                      <p className="text-xs text-gray-400">{booking.user.address}</p>
                    )}
                  </div>
                </td>

                {/* Bed Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-semibold">{booking.bookable.name}</p>
                  {booking.bookable.image && (
                    <img
                      src={booking.bookable.image.startsWith('https')
                        ? booking.bookable.image
                        : `/storage/${booking.bookable.image}`}
                      alt={booking.bookable.name}
                      className="w-16 h-16 object-cover rounded-lg mt-2"
                    />
                  )}
                </td>

                {/* Booking Dates */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-500">
                    <strong>Start:</strong> {new Date(booking.start_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>End:</strong> {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                </td>

                {/* Payment Info */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <p className="font-semibold text-gray-800">&#8369;{booking.payment.amount}</p>
                  <p className="text-xs text-gray-500">{booking.payment.payment_method}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
