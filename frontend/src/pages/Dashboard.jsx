import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/history');
                setHistory(data.data);
            } catch (err) {
                console.error("Failed to fetch history");
            }
        };
        fetchHistory();
    }, []);

    const reversedHistory = [...history].reverse();

    const chartData = {
        labels: reversedHistory.map(h => new Date(h.created_at).toLocaleDateString()),
        datasets: [
            {
                label: 'Stres',
                data: reversedHistory.map(h => h.stress_score),
                borderColor: '#F43F5E', // Rose 500
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Kecemasan',
                data: reversedHistory.map(h => h.anxiety_score),
                borderColor: '#0EA5E9', // Sky 500
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Depresi',
                data: reversedHistory.map(h => h.depression_score),
                borderColor: '#14B8A6', // Teal 500
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    font: { family: 'Inter' }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    const latest = history[0];

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold mb-2 text-dark-900">Halo, {user.name} 👋</h1>
            <p className="text-dark-700 mb-8">Berikut adalah rangkuman kesehatan mentalmu hari ini.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Tingkat Stres"
                    value={latest?.stress_level || '-'}
                    score={latest?.stress_score}
                    color="rose"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
                />
                <StatCard
                    title="Tingkat Kecemasan"
                    value={latest?.anxiety_level || '-'}
                    score={latest?.anxiety_score}
                    color="sky"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                />
                <StatCard
                    title="Tingkat Depresi"
                    value={latest?.depression_level || '-'}
                    score={latest?.depression_score}
                    color="teal"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h2 className="text-xl font-bold mb-6 text-dark-900 flex items-center">
                        <span className="w-2 h-8 bg-brand-500 rounded-full mr-3"></span>
                        Tren Kesehatan Mental
                    </h2>
                    {history.length > 0 ? (
                        <Line options={chartOptions} data={chartData} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 font-medium mb-2">Belum ada data tes</p>
                            <p className="text-sm text-gray-400">Ikuti tes DASS-21 pertamamu untuk melihat grafik.</p>
                        </div>
                    )}
                </div>

                {/* Recommendations Section */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 h-full">
                        <h2 className="text-xl font-bold mb-6 text-dark-900 flex items-center">
                            <span className="w-2 h-8 bg-accent-500 rounded-full mr-3"></span>
                            Rekomendasi AI
                        </h2>

                        {latest ? (
                            <RecommendationCard latest={latest} />
                        ) : (
                            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-700">
                                <p className="font-medium">Data tidak tersedia.</p>
                                <p className="text-sm mt-1">Silakan lakukan tes terlebih dahulu.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, score, color, icon }) {
    const colors = {
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        sky: 'bg-sky-50 text-sky-600 border-sky-100',
        teal: 'bg-teal-50 text-teal-600 border-teal-100',
    };

    return (
        <div className="glass-card p-6 flex items-start justify-between transform hover:-translate-y-1 transition-transform duration-300 cursor-default">
            <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-dark-900">{value}</h3>
                {score !== undefined && <p className="text-sm text-gray-400 mt-1">Skor: {score}</p>}
            </div>
            <div className={`p-3 rounded-xl ${colors[color] || 'bg-gray-100'}`}>
                {icon}
            </div>
        </div>
    );
}

function RecommendationCard({ latest }) {
    const isSevere = ['Parah', 'Sangat Parah'].includes(latest.stress_level) ||
        ['Parah', 'Sangat Parah'].includes(latest.depression_level);

    const isModerate = ['Sedang'].includes(latest.stress_level) ||
        ['Sedang'].includes(latest.anxiety_level);

    if (isSevere) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">🚨</span>
                    <h3 className="font-bold text-red-700">Perhatian Diperlukan</h3>
                </div>
                <p className="text-sm text-red-800 mb-4 leading-relaxed">
                    Hasil tes Anda menunjukkan tingkat stres/depresi yang cukup tinggi. Jangan ragu untuk mencari bantuan profesional.
                </p>
                <div className="space-y-2">
                    <ActionItem text="Hubungi konselor kampus" color="red" />
                    <ActionItem text="Cerita ke orang terdekat" color="red" />
                    <ActionItem text="Kurangi beban akademik sementara" color="red" />
                </div>
            </div>
        );
    }

    if (isModerate) {
        return (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">🧘</span>
                    <h3 className="font-bold text-orange-700">Butuh Istirahat</h3>
                </div>
                <p className="text-sm text-orange-800 mb-4 leading-relaxed">
                    Anda mengalami tekanan tingkat sedang. Ini saat yang tepat untuk mengevaluasi keseimbangan hidup Anda.
                </p>
                <div className="space-y-2">
                    <ActionItem text="Latihan pernapasan 5 menit" color="orange" />
                    <ActionItem text="Tidur minimal 7 jam" color="orange" />
                    <ActionItem text="Batasi kafein" color="orange" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
            <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🌟</span>
                <h3 className="font-bold text-brand-700">Kondisi Prima</h3>
            </div>
            <p className="text-sm text-brand-800 mb-4 leading-relaxed">
                Kesehatan mental Anda terjaga dengan baik! Terus pertahankan pola hidup positif ini.
            </p>
            <div className="space-y-2">
                <ActionItem text="Olahraga rutin" color="teal" />
                <ActionItem text="Bantu teman yang butuh" color="teal" />
                <ActionItem text="Pertahankan hobi" color="teal" />
            </div>
        </div>
    );
}

function ActionItem({ text, color }) {
    const checkColors = {
        red: 'text-red-500',
        orange: 'text-orange-500',
        teal: 'text-teal-500',
    };
    return (
        <div className="flex items-center bg-white/60 p-2 rounded-lg">
            <svg className={`w-4 h-4 mr-2 ${checkColors[color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-sm font-medium text-dark-700">{text}</span>
        </div>
    );
}
