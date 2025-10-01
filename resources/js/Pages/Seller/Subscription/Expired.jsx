export default function Expired() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-50 text-red-700">
            <h1 className="text-2xl font-bold mb-4">Subscription Expired</h1>
            <p className="text-gray-800 mb-6">Your subscription has expired. Please renew to continue using the system.</p>
            <a
                href={route("seller.subscription.landing")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Renew Now
            </a>
        </div>
    );
}
