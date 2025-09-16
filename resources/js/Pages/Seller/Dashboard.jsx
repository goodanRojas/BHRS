import React from "react";
import { Card, CardContent } from "@/Components/ui/Card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";
import SellerLayout from "@/Layouts/SellerLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ summary, insights }) {
    // 🔹 Transform data
    const cancellationTrendData = Object.entries(insights.cancellationTrend)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => new Date(a.month + "-01") - new Date(b.month + "-01"));

    const mostBookedBedsData = insights.mostBookedBeds || [];

    const monthlyEarningsData = Object.entries(summary.monthlyEarnings)
        .map(([month, earnings]) => ({ month, earnings }))
        .sort((a, b) => new Date(a.month) - new Date(b.month));


    const ratingsByBuildingData = Object.entries(insights.ratingsByBuilding).map(
        ([buildingId, rating]) => ({ buildingId, rating })
    );

    const occupancyByAddressData = Object.values(insights.occupancyByAddress);

    const earningsByAddressData = Object.values(insights.earningsByAddress).map(
        (item) => ({
            name: `${item.address.barangay}, ${item.address.municipality}`,
            earnings: item.earnings,
        })
    );

    const paymentMethodsData = Object.entries(insights.paymentMethods).map(
        ([method, count]) => ({ method, count })
    );

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <SellerLayout>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4">
                {/* 🔹 Top Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent>
                            <h2 className="text-sm font-medium">Total Beds</h2>
                            <p className="text-xl font-bold">{summary.totalBeds}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <h2 className="text-sm font-medium">Available Beds</h2>
                            <p className="text-xl font-bold">{summary.availableBeds}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <h2 className="text-sm font-medium">Active Bookings</h2>
                            <p className="text-xl font-bold">{summary.activeBookings}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <h2 className="text-sm font-medium">Cancellations</h2>
                            <p className="text-xl font-bold">{summary.cancellations}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 🔹 Charts in grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Monthly Earnings */}
                    <Card>
                        <CardContent>
                            <h2 className="font-semibold mb-2">Monthly Earnings</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={monthlyEarningsData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="earnings" stroke="#4ade80" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Occupancy Rate */}
                    <Card>
                        <CardContent>
                            <h2 className="font-semibold mb-2">Occupancy Rate</h2>
                            <div className="text-3xl font-bold text-green-600">
                                {insights.occupancyRate}%
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cancellation Trend */}
                    <Card>
                        <CardContent>
                            <h2 className="font-semibold mb-2">Cancellation Trend</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={cancellationTrendData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Most Booked Beds */}
                    <Card>
                        <CardContent>
                            <h2 className="font-semibold mb-2">Most Booked Beds</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={mostBookedBedsData}>
                                    <XAxis dataKey="bed_name" />
                                    <YAxis />
                                    <Tooltip formatter={(value, name, props) => [`${value} bookings`, `Bookings`]} />
                                    <Bar dataKey="count" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>

                        </CardContent>
                    </Card>

                    {/* Ratings by Building */}
                    <Card>
                        <CardContent>
                            <h2 className="font-semibold mb-2">Ratings by Building</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={ratingsByBuildingData}>
                                    <XAxis dataKey="buildingId" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="rating" fill="#facc15" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Earnings by Address */}
                    <Card>
                        <CardContent>
                            <h2 className="font-semibold mb-2">Earnings by Address</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={earningsByAddressData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="earnings" fill="#60a5fa" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Occupancy by Address */}
                    <Card>
                        <CardContent>
                            <h2 className="font-semibold mb-2">Occupancy by Address</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={occupancyByAddressData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="occupancy" fill="#f87171" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card>
                        <CardContent>
                            <h2 className="font-semibold mb-2">Payment Methods</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={paymentMethodsData}
                                        dataKey="count"
                                        nameKey="method"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {paymentMethodsData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SellerLayout>
    );
}
