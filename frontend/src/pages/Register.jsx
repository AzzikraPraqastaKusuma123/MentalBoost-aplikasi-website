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
                                <input
                                    type="password" name="password"
                                    className={`input-field ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                                    placeholder="••••••••"
                                    onChange={handleChange} required
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                            </div>
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-dark-700">Konfirmasi Password</label>
                                <input
                                    type="password" name="password_confirmation"
                                    className="input-field"
                                    placeholder="••••••••"
                                    onChange={handleChange} required
                                />
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
