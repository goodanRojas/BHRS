import AuthenticatedLayout from "./AuthenticatedLayout";
import React from "react";
import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard({ stats, earningsData, bookingsData, bookingsTable, usersTable }) {
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042'];

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />
            <div className="p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map(({ title, value, icon }, i) => (
                        <div key={i} className="bg-white shadow rounded-2xl p-4 text-center">
                            <div className="text-gray-500 text-sm">{title}</div>
                            <div className="text-2xl font-semibold">{value}</div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Earnings Line Chart */}
                    <div className="bg-white rounded-2xl p-4 shadow">
                        <h2 className="font-semibold mb-2">Monthly Earnings</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={earningsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bookings Bar Chart */}
                    <div className="bg-white rounded-2xl p-4 shadow">
                        <h2 className="font-semibold mb-2">Monthly Bookings</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={bookingsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="font-semibold mb-2">Recent Bookings</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left">
                                    <th>User</th><th>Property</th><th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingsTable.map((item, i) => (
                                    <tr key={i} className="border-t">
                                        <td>{item.user}</td>
                                        <td>{item.property}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="font-semibold mb-2">Recent Users</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left">
                                    <th>Name</th><th>Email</th><th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersTable.map((user, i) => (
                                    <tr key={i} className="border-t">
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.joined}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}