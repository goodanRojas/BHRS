import AuthenticatedLayout from "./AuthenticatedLayout";
import React from "react";
import { Head } from "@inertiajs/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

export default function Dashboard({ stats, charts, tables }) {
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#FF8042", "#00C49F"];

  return (
    <AuthenticatedLayout>
      <Head title="Admin Dashboard" />

      <div className="p-6 space-y-6">
        {/* --- Stats --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="p-4 bg-white rounded-2xl shadow">
              <h3 className="text-sm text-gray-500 capitalize">{key}</h3>
              <p className="text-xl font-semibold">
              
                {value}</p>
            </div>
          ))}
        </div>

        {/* --- Charts --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Earnings */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Monthly Earnings</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={charts.monthlyEarnings}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Bookings */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Monthly Bookings</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.monthlyBookings}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ratings */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Ratings Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={charts.ratings}
                  dataKey="total"
                  nameKey="stars"
                  outerRadius={100}
                  label
                >
                  {charts.ratings.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Cancels */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Cancellation Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={charts.cancels}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#FF8042" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Features */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Top Features</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.topFeatures}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings_count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Most Booked Buildings */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Most Booked Buildings</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts.topBuildings}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings_count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Tables --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Sellers */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Top Owners</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th>Name</th>
                  <th>Bookings</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {tables.topSellers.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td>{s.name}</td>
                    <td>{s.bookings_count}</td>
                    <td>
                      ₱
                      {s.earnings_sum
                        ? Number(s.earnings_sum).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                        : '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Bookers */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Recent Bookers</h2>
            <ul className="space-y-2">
              {tables.recentBookers.map((b) => (
                <li key={b.id} className="border-b pb-1">
                  {b.user?.name} – {new Date(b.start_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Users */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Recent Users</h2>
            <ul className="space-y-2">
              {tables.recentUsers.map((u) => (
                <li key={u.id} className="border-b pb-1">
                  {u.name} – {u.email}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
