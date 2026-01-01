import { useEffect, useState } from 'react';
import api from '../api/axios';
import UserTable from '../components/UserTable';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2'; // Changed Pie to Doughnut

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function CounselorDashboard() {
    const [stats, setStats] = useState({
        total_users: 0,
        assessments_today: 0,
        high_risk_users: 0,
        charts: { stress_distribution: {}, weekly_trend: [] }
    });
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    api.get('/counselor/stats'),
                    api.get('/counselor/users')
                ]);
                setStats(statsRes.data);
                setUserList(usersRes.data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Premium Color Palette (Teal/Emerald/Cyan Theme)
    const chartColors = [
        '#10B981', // Emerald 500 (Normal)
        '#0EA5E9', // Sky 500 (Ringan)
        '#FBBF24', // Amber 400 (Sedang)
        '#F97316', // Orange 500 (Parah)
        '#EF4444', // Red 500 (Sangat Parah)
    ];

    const doughnutData = {
        labels: ['Normal', 'Ringan', 'Sedang', 'Parah', 'Sangat Parah'],
        datasets: [
            {
                data: [
                    stats.charts?.stress_distribution?.Normal || 0,
                    stats.charts?.stress_distribution?.Ringan || 0,
                    stats.charts?.stress_distribution?.Sedang || 0,
                    stats.charts?.stress_distribution?.Parah || 0,
                    stats.charts?.stress_distribution?.['Sangat Parah'] || 0,
                ],
                backgroundColor: chartColors,
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 4
            },
        ],
    };

    const barData = {
        labels: stats.charts?.weekly_trend?.map(d => d.date) || [],
        datasets: [
            {
                label: 'Jumlah Asesmen',
                data: stats.charts?.weekly_trend?.map(d => d.count) || [],
                backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald 500 with opacity
                hoverBackgroundColor: '#059669', // Emerald 600
                borderRadius: 8, // Rounded corners
                barThickness: 30,
            }
        ]
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-brand-600 font-medium animate-pulse">Memuat Data Dashboard...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-dark-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Ringkasan statistik dan pemantauan kesehatan mental pengguna.</p>
                </div>
                <div className="hidden md:block text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-gray-600 font-medium">
                    📅 {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Pengguna', value: stats.stats?.total_users || 0, icon: '👥', color: 'bg-blue-50 text-blue-600' },
                    { label: 'Asesmen Hari Ini', value: stats.stats?.assessments_today || 0, icon: '📝', color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'User Berisiko', value: stats.stats?.high_risk_users || 0, icon: '⚠️', color: 'bg-red-50 text-red-600' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">{item.value}</p>
                        </div>
                        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* User Data Table (Full Width) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
                <UserTable users={userList} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Doughnut Chart */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wide w-full text-left">Distribusi Level Stres</h3>
                    <div className="relative w-full h-64">
                        <Doughnut
                            data={doughnutData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }
                                },
                                cutout: '60%', // Donut thickness
                            }}
                        />
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wide">Tren Asesmen (7 Hari Terakhir)</h3>
                    <div className="h-64">
                        <Bar
                            data={barData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: '#f3f4f6', borderDash: [4, 4] },
                                        ticks: { stepSize: 1, color: '#9ca3af' }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { color: '#6b7280', font: { size: 11 } }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
