import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ notifications }) {
    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            </div>
        </AuthenticatedLayout>
    );
};