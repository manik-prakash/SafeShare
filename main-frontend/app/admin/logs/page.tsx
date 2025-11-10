"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogsPage() {
    const router = useRouter()
    const [logs, setLogs] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/")
        return;
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/admin/auth/login");
            return;
        }

        let isMounted = true;

        const fetchLogs = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/logs`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (res.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.replace("/");
                    return;
                }

                const data = await res.json();

                if (isMounted) setLogs(data.logs || "No logs found");

            } catch (error) {
                console.error(error);
                if (isMounted) setLogs("Failed to load logs");
            }
        };

        fetchLogs();
        const intervalId = setInterval(fetchLogs, 5000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []); 

    return (
        <div className="p-4">
            <div className="flex items-center justify-between py-6">
                <h1 className="text-xl font-bold mb-4">Server Logs</h1>
                <button
                    onClick={() => handleLogout()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>

            </div>
            <pre className="bg-black text-green-400 p-4 rounded h-[600px] overflow-auto whitespace-pre-wrap">
                {logs}
            </pre>
        </div>
    );
}
