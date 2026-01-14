import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Landing() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (user) {
            if (user.role === 'counselor') {
                navigate('/dashboard-counselor');
            } else {
                navigate('/dashboard');
            }
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 overflow-hidden font-sans text-dark-800">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow mr-3 transform hover:scale-105 transition-transform duration-300">
                                E
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500 tracking-tight">EMO-TRACK</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-500 hover:text-brand-600 font-medium transition-colors">Fitur</a>
                            <a href="#about" className="text-gray-500 hover:text-brand-600 font-medium transition-colors">Tentang</a>
                            <Link to="/login" className="text-gray-900 font-bold hover:text-brand-600 transition-colors">Masuk</Link>
                            <Link to="/register" className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:-translate-y-0.5 transition-all duration-200">
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-semibold text-sm tracking-wide uppercase animate-fade-in">
                        ✨ PKM-KC REVOLUTION
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-slide-up">
                        EMO-TRACK GEN Z: <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-500">Pantau Emosimu, Pahami Dirimu.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Aplikasi monitoring emosi harian berbasis visual dan insight psikologis untuk meningkatkan kesadaran diri yang lebih baik.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/register" className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/40 hover:bg-brand-700 hover:-translate-y-1 transition-all duration-300">
                            Mulai Tracking Emosi
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                            Masuk
                        </Link>
                    </div>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute top-1/4 left-0 -ml-20 w-96 h-96 bg-brand-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-0 -mr-20 w-96 h-96 bg-accent-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-dark-900 mb-4">Kenapa EMO-TRACK?</h2>
                        <p className="text-lg text-gray-500">Solusi tepat untuk Gen Z yang rentan stres namun ingin tetap mindful.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="😊"
                            title="Input Emosi Harian"
                            desc="Pilih emoji yang mewakili perasaanmu hari ini dengan cepat dan mudah, tanpa ribet."
                        />
                        <FeatureCard
                            icon="📈"
                            title="Visualisasi Grafik"
                            desc="Lihat tren mood kamu dalam mingguan atau bulanan untuk memahami pola emosimu."
                        />
                        <FeatureCard
                            icon="🧠"
                            title="Insight Psikologis"
                            desc="Dapatkan saran ringan dan tips regulasi emosi berbasis psikologi sesuai kondisimu."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">E</div>
                        <span className="font-bold text-gray-900 text-lg">EMO-TRACK</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2026 Tim PKM EMO-TRACK. Universitas [Nama Univ].
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">{title}</h3>
            <p className="text-gray-500 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}
