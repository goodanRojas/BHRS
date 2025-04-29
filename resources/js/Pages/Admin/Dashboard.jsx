import AuthenticatedLayout from "./AuthenticatedLayout";
import React from "react";
import {Head} from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
        </AuthenticatedLayout>
    );
}