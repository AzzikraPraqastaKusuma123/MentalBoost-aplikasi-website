import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        nim: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);
        const res = await register(formData);
        setIsLoading(false);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setErrors(res.errors);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-4">
            <div className="w-full max-w-lg p-8 glass-card animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 -mt-10 -ml-10 w-40 h-40 bg-accent-500 opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-brand-500 opacity-10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-dark-900 tracking-tight">Buat Akun Baru</h2>
                        <p className="text-dark-700 mt-2">Mulai perjalanan kesehatan mentalmu hari ini</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-dark-700">Nama Lengkap</label>
                                <input
                                    type="text" name="name"
                                    className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                                    placeholder="John Doe"
                                    onChange={handleChange} required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                            </div>

                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-dark-700">NIM</label>
                                <input
                                    type="text" name="nim"
                                    className={`input-field ${errors.nim ? 'border-red-300 focus:ring-red-500' : ''}`}
                                    placeholder="418..."
                                    onChange={handleChange}
                                />
                                {errors.nim && <p className="mt-1 text-xs text-red-500">{errors.nim[0]}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-dark-700">Email</label>
                            <input
                                type="email" name="email"
                                className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                                placeholder="mahasiswa@mercubuana.ac.id"
                                onChange={handleChange} required
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-dark-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} name="password"
                                        className={`input-field pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                                        placeholder="••••••••"
                                        onChange={handleChange} required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-600 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-dark-700">Konfirmasi Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"} name="password_confirmation"
                                        className="input-field pr-10"
                                        placeholder="••••••••"
                                        onChange={handleChange} required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-600 focus:outline-none"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary mt-6 flex justify-center items-center"
                        >
                            {isLoading ? 'Creating Account...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-dark-700">
                        Sudah punya akun? <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 hover:underline transition-colors">Login disini</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
