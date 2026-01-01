import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Line, Bar } from 'react-chartjs-2';
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

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/history');
            setHistory(data.data || []);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setLoading(false);
        }
    };

    const getLevelColor = (level) => {
        const colors = {
            'Normal': 'bg-green-100 text-green-800 border-green-200',
            'Ringan': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Sedang': 'bg-orange-100 text-orange-800 border-orange-200',
            'Parah': 'bg-red-100 text-red-800 border-red-200',
            'Sangat Parah': 'bg-red-200 text-red-900 border-red-300'
        };
        return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Prepare chart data
    const chartData = {
        labels: history.map((test, index) =>
            new Date(test.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        ).reverse(),
        datasets: [
            {
                label: 'Depresi',
                data: history.map(test => test.depression_score).reverse(),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Kecemasan',
                data: history.map(test => test.anxiety_score).reverse(),
                borderColor: 'rgb(251, 146, 60)',
                backgroundColor: 'rgba(251, 146, 60, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Stres',
                data: history.map(test => test.stress_score).reverse(),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 12,
                        weight: '600'
                    }
                }
            },
            title: {
                display: true,
                text: 'Tren Skor DASS-21',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: 20
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-brand-500 animate-pulse">Memuat riwayat...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-dark-900">Riwayat Tes DASS-21</h1>
                <p className="text-gray-600 mt-1">Lihat semua hasil tes kesehatan mental yang pernah Anda lakukan</p>
            </div>

            {history.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Riwayat</h3>
                    <p className="text-gray-500 mb-6">Anda belum pernah melakukan tes DASS-21</p>
                    <a
                        href="/test"
                        className="inline-block px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                    >
                        Mulai Tes Sekarang
                    </a>
                </div>
            ) : (
                <>
                    {/* Chart Section */}
                    {history.length > 1 && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="h-80">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    )}

                    {/* History List */}
                    <div className="space-y-4">
                        {history.map((test, index) => (
                            <div
                                key={test.id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">
                                            Tes #{history.length - index}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(test.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Depression */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600">Depresi</span>
                                            <span className="text-2xl font-bold text-gray-900">{test.depression_score}</span>
                                        </div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(test.depression_level)}`}>
                                            {test.depression_level}
                                        </span>
                                    </div>

                                    {/* Anxiety */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600">Kecemasan</span>
                                            <span className="text-2xl font-bold text-gray-900">{test.anxiety_score}</span>
                                        </div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(test.anxiety_level)}`}>
                                            {test.anxiety_level}
                                        </span>
                                    </div>

                                    {/* Stress */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600">Stres</span>
                                            <span className="text-2xl font-bold text-gray-900">{test.stress_score}</span>
                                        </div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(test.stress_level)}`}>
                                            {test.stress_level}
                                        </span>
                                    </div>
                                </div>

                                {/* Mini Bar Chart for this test */}
                                <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Visualisasi Skor</h4>
                                    <div className="h-40">
                                        <Bar
                                            data={{
                                                labels: ['Depresi', 'Kecemasan', 'Stres'],
                                                datasets: [{
                                                    label: 'Skor',
                                                    data: [test.depression_score, test.anxiety_score, test.stress_score],
                                                    backgroundColor: [
                                                        'rgba(239, 68, 68, 0.8)',
                                                        'rgba(251, 146, 60, 0.8)',
                                                        'rgba(59, 130, 246, 0.8)',
                                                    ],
                                                    borderColor: [
                                                        'rgb(239, 68, 68)',
                                                        'rgb(251, 146, 60)',
                                                        'rgb(59, 130, 246)',
                                                    ],
                                                    borderWidth: 2,
                                                    borderRadius: 8,
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        padding: 10,
                                                        cornerRadius: 6,
                                                        callbacks: {
                                                            label: function (context) {
                                                                return `Skor: ${context.parsed.y}`;
                                                            }
                                                        }
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        max: 42,
                                                        grid: {
                                                            color: 'rgba(0, 0, 0, 0.05)',
                                                        },
                                                        ticks: {
                                                            font: {
                                                                size: 10
                                                            }
                                                        }
                                                    },
                                                    x: {
                                                        grid: {
                                                            display: false
                                                        },
                                                        ticks: {
                                                            font: {
                                                                size: 11,
                                                                weight: '600'
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
