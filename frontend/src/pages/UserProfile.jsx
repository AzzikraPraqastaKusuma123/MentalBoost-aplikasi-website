import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import Spinner from '../components/Spinner';

export default function UserProfile() {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Cropper State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        }
    }, [user]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const file = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });

            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(croppedImageBlob));
            setIsCropping(false);
            setImageSrc(null);
        } catch (e) {
            console.error(e);
            alert('Gagal memproses gambar');
        }
    };

    const handleCropCancel = () => {
        setIsCropping(false);
        setImageSrc(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const data = new FormData();
            data.append('_method', 'PUT');
            data.append('name', formData.name);
            data.append('email', formData.email);

            if (showChangePassword && formData.password && formData.password.trim() !== '') {
                data.append('password', formData.password);
                data.append('password_confirmation', formData.password_confirmation);
            }

            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            const response = await api.post('/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
            setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error("Submit Error:", error);
            const errorMsg = error.response?.data?.message || 'Gagal memperbarui profil.';
            const validationErrors = error.response?.data?.errors;

            let displayText = errorMsg;
            if (validationErrors) {
                const details = Object.values(validationErrors).flat().join(', ');
                displayText = `${errorMsg}: ${details}`;
            }

            setMessage({ type: 'error', text: displayText });
        } finally {
            setLoading(false);
        }
    };

    const getAvatarSrc = () => {
        if (avatarPreview) return avatarPreview;
        if (user?.avatar) return `http://localhost:8000/storage/${user.avatar}`;
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in relative">
            {/* Cropper Modal */}
            {isCropping && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-scale-up">
                        <h3 className="text-xl font-bold mb-4 text-center">Sesuaikan Foto</h3>
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs text-gray-500">Zoom</span>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCropCancel}
                                className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCropSave}
                                className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-brand-700 transition"
                            >
                                Simpan Foto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-2xl font-bold text-dark-900 mb-6">Profil Saya</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row items-center mb-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-5xl font-bold overflow-hidden border-4 border-white shadow-lg transition-transform hover:scale-105">
                            {getAvatarSrc() ? (
                                <img src={getAvatarSrc()} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0)
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full">
                            Role: User
                        </span>
                        <p className="text-xs text-gray-400 mt-2">Klik foto untuk menyesuaikan</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 mb-6 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-md font-bold text-gray-800">Keamanan</h3>
                            <button
                                type="button"
                                onClick={() => setShowChangePassword(!showChangePassword)}
                                className="text-sm text-brand-600 font-semibold hover:text-brand-700 hover:underline"
                            >
                                {showChangePassword ? 'Batal Ganti Password' : 'Ganti Password?'}
                            </button>
                        </div>

                        {showChangePassword && (
                            <div className="space-y-4 animate-fade-in bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                        placeholder="Masukkan password baru"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                        placeholder="Ulangi password baru"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center justify-center px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="ml-2">Menyimpan...</span>
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
