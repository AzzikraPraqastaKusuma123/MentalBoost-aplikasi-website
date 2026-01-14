import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Line, Bar } from 'react-chartjs-2'; // Added Bar
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
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
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [moods, setMoods] = useState([]);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [keywords, setKeywords] = useState('');
    const [note, setNote] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [historyRes, moodRes] = await Promise.all([
                api.get('/history'),
                api.get('/moods?days=7')
            ]);
            setHistory(historyRes.data.data);
            setMoods(moodRes.data.data.reverse()); // Reverse to have oldest first for chart
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMoodSubmit = async () => {
        if (!selectedEmoji) return;
        setSubmitLoading(true);
        try {
            await api.post('/moods', {
                emoji: selectedEmoji,
                keywords: keywords,
                note: note
            });
            // Reset form and refresh data
            setSelectedEmoji(null);
            setKeywords('');
            setNote('');
            fetchData();
            alert('Mood berhasil dicatat! 🌟');
        } catch (err) {
            console.error("Failed to submit mood", err);
            alert('Gagal menyimpan mood. Coba lagi.');
        } finally {
            setSubmitLoading(false);
        }
    };

    // --- Chart Data Preparation ---

    // 1. Mood Chart (Mapping emojis to numeric values for visualization)
    const moodValueMap = { 'angry': 1, 'anxious': 2, 'sad': 3, 'neutral': 4, 'happy': 5 };
    const moodLabelMap = { 'angry': '😠 Marah', 'anxious': '😰 Cemas', 'sad': '😢 Sedih', 'neutral': '😐 Biasa', 'happy': '😄 Senang' };

    // Group moods by date to handle multiple entries per day (taking the last one or average)
    // For simplicity, let's just show the sequence of inputs
    const moodChartData = {
        labels: moods.map(m => new Date(m.created_at).toLocaleDateString('id-ID', { weekday: 'short' })),
        datasets: [
            {
                label: 'Mood Level',
                data: moods.map(m => moodValueMap[m.emoji] || 3),
                borderColor: '#10B981', // Emerald 500
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#10B981',
                pointRadius: 6,
                fill: true,
            }
        ]
    };

    const moodChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const val = context.raw;
                        const emojiKey = Object.keys(moodValueMap).find(key => moodValueMap[key] === val);
                        return moodLabelMap[emojiKey] || 'Unknown';
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 6,
                ticks: {
                    callback: function (value) {
                        const emojiKey = Object.keys(moodValueMap).find(key => moodValueMap[key] === value);
                        return emojiKey ? moodLabelMap[emojiKey].split(' ')[0] : '';
                    }
                },
                grid: { display: false }
            },
            x: {
                grid: { display: false }
            }
        }
    };


    // 2. DASS Chart (Existing)
    const reversedHistory = [...history].reverse(); // history is desc in API? API returns latest first usually.
    const dassChartData = {
        labels: reversedHistory.map(h => new Date(h.created_at).toLocaleDateString()),
        datasets: [
            {
                label: 'Stres',
                data: reversedHistory.map(h => h.stress_score),
                borderColor: '#F43F5E',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Kecemasan',
                data: reversedHistory.map(h => h.anxiety_score),
                borderColor: '#0EA5E9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Depresi',
                data: reversedHistory.map(h => h.depression_score),
                borderColor: '#14B8A6',
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const latest = history[0];

    return (
        <div className="max-w-7xl mx-auto animate-fade-in space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2 text-dark-900">Halo, {user.name} 👋</h1>
                <p className="text-dark-700">Selamat datang di EMO-TRACK. Bagaimana perasaanmu hari ini?</p>
            </div>

            {/* --- MOOD TRACKER SECTION (NEW) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Mood Input Widget */}
                <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-xl shadow-brand-500/5 border border-brand-100">
                    <h2 className="text-lg font-bold text-dark-900 mb-4 flex items-center">
                        <span className="bg-brand-100 text-brand-600 p-2 rounded-lg mr-3">📝</span>
                        Catat Mood Harian
                    </h2>

                    <div className="flex justify-between mb-6 px-2">
                        {['happy', 'neutral', 'sad', 'anxious', 'angry'].map((emojiName) => (
                            <button
                                key={emojiName}
                                onClick={() => setSelectedEmoji(emojiName)}
                                className={`text-4xl transition-transform duration-200 hover:scale-125 ${selectedEmoji === emojiName ? 'scale-125 drop-shadow-md' : 'opacity-70 hover:opacity-100'}`}
                                title={moodLabelMap[emojiName]}
                            >
                                {moodLabelMap[emojiName].split(' ')[0]}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kata Kunci (Opsional)</label>
                            <input
                                type="text"
                                placeholder="Cth: Lelah, Tugas Selesai, Hujan..."
                                className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catatan Singkat</label>
                            <textarea
                                placeholder="Ceritakan sedikit tentang harimu..."
                                className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm h-20 resize-none"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            onClick={handleMoodSubmit}
                            disabled={!selectedEmoji || submitLoading}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all 
                                ${!selectedEmoji ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/30 hover:-translate-y-1'}
                            `}
                        >
                            {submitLoading ? 'Menyimpan...' : 'Simpan Mood'}
                        </button>
                    </div>
                </div>

                {/* Mood Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h2 className="text-lg font-bold text-dark-900 mb-6 flex items-center">
                        <span className="bg-brand-100 text-brand-600 p-2 rounded-lg mr-3">📈</span>
                        Grafik Emosi Seminggu Terakhir
                    </h2>
                    {moods.length > 0 ? (
                        <div className="h-64">
                            <Line options={moodChartOptions} data={moodChartData} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <span className="text-4xl mb-2">😶</span>
                            <p className="text-gray-500 font-medium">Belum ada data mood.</p>
                            <p className="text-sm text-gray-400">Mulai catat moodmu hari ini!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- INSIGHT & MEDICAL CHECKUP (EXISTING DASS) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recommendation / Insight Card */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 h-full">
                        <h2 className="text-xl font-bold mb-6 text-dark-900 flex items-center">
                            <span className="w-2 h-8 bg-accent-500 rounded-full mr-3"></span>
                            Insight Psikologis
                        </h2>
                        {latest ? (
                            <RecommendationCard latest={latest} />
                        ) : (
                            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 text-brand-700">
                                <p className="font-medium">Data DASS belum tersedia.</p>
                                <p className="text-sm mt-1">Lakukan tes lengkap untuk insight mendalam.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* DASS History Chart (Condensed) */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-dark-900 flex items-center">
                            <span className="bg-gray-100 text-gray-600 p-2 rounded-lg mr-3">🩺</span>
                            Riwayat Tes Klinis (DASS-21)
                        </h2>
                    </div>
                    {history.length > 0 ? (
                        <div className="h-64">
                            <Line options={{ ...moodChartOptions, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }} data={dassChartData} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 font-medium">Belum ada riwayat tes klinis.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Disclaimer for PKM */}
            <div className="text-center text-xs text-gray-400 mt-8 pb-4">
                <p>Disclaimer: EMO-TRACK adalah alat bantu refleksi diri dan bukan pengganti diagnosis medis profesional.</p>
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
