import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ManageTest() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ question: '', category: 'stress', order: 0 });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const { data } = await api.get('/questions');
            setQuestions(data.data);
            setErrorMsg('');
        } catch (error) {
            console.error("Failed to fetch questions", error);
            setErrorMsg('Gagal memuat data pertanyaan.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (q) => {
        setEditingId(q.id);
        setFormData({ question: q.question, category: q.category, order: q.order });
        setIsFormOpen(true);
        setErrorMsg('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) return;
        try {
            await api.delete(`/questions/${id}`);
            fetchQuestions();
        } catch (error) {
            alert('Gagal menghapus pertanyaan');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ question: '', category: 'stress', order: questions.length + 1 });
        setIsFormOpen(false);
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            console.log("Submitting:", formData); // Debug log
            if (editingId) {
                await api.put(`/questions/${editingId}`, formData);
            } else {
                await api.post('/questions', formData);
            }
            fetchQuestions();
            resetForm();
            alert(editingId ? 'Pertanyaan berhasil diupdate!' : 'Pertanyaan berhasil ditambahkan!');
        } catch (error) {
            console.error("Submit Error:", error.response);
            setErrorMsg(error.response?.data?.message || 'Gagal menyimpan data (Server Error).');
        }
    };

    const categoryColors = {
        stress: 'bg-rose-100 text-rose-700',
        anxiety: 'bg-sky-100 text-sky-700',
        depression: 'bg-teal-100 text-teal-700'
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark-900">Manajemen Tes DASS</h1>
                    <p className="text-gray-500">Tambah, edit, atau hapus pertanyaan tes.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                    className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl shadow-lg hover:bg-brand-700 transition"
                >
                    + Tambah Pertanyaan
                </button>
            </div>

            {errorMsg && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">{errorMsg}</div>
            )}

            {/* Form Modal / Section */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scale-up">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                                <textarea
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 h-24 resize-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                                    >
                                        <option value="stress">Stress</option>
                                        <option value="anxiety">Anxiety</option>
                                        <option value="depression">Depression</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4 w-16">No</th>
                            <th className="px-6 py-4">Pertanyaan</th>
                            <th className="px-6 py-4 w-32">Kategori</th>
                            <th className="px-6 py-4 w-32 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {questions.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-gray-500">{q.order}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{q.question}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${categoryColors[q.category]}`}>
                                        {q.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleEdit(q)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                            ✏️
                                        </button>
                                        <button onClick={() => handleDelete(q.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {questions.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-400">Belum ada pertanyaan.</div>
                )}
            </div>
        </div>
    );
}
