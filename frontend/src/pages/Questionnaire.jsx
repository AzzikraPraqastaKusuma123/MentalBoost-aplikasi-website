import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Questionnaire() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await api.get('/questions');
                setQuestions(data.data);
            } catch (error) {
                console.error("Failed to fetch questions", error);
                alert("Gagal memuat pertanyaan tes. Silakan refresh halaman.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: parseInt(value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            answers: Object.keys(answers).map(id => ({
                question_id: parseInt(id),
                value: answers[id]
            }))
        };

        try {
            await api.post('/submit-test', payload);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Gagal mengirim hasil tes. Coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = questions.length;
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    if (loading) return <div className="flex h-screen items-center justify-center text-brand-600 font-medium">Memuat Soal Tes...</div>;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-dark-900">DASS-21 Self Assessment</h1>
                <p className="text-dark-700 mt-2">Jawablah pertanyaan berikut berdasarkan apa yang Anda rasakan selama <strong>seminggu terakhir</strong>.</p>
            </div>

            <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur py-4 mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-right mt-1 text-gray-500 font-medium">{answeredCount} / {totalQuestions} terjawab</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((q, index) => (
                    <div key={q.id} className="glass-card p-6 transition-all duration-300 hover:shadow-lg hover:border-brand-200">
                        <div className="flex items-start">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-100 text-brand-700 rounded-full font-bold text-sm mr-4">
                                {index + 1}
                            </span>
                            <div className="flex-1">
                                <p className="text-lg font-medium text-dark-800 mb-4">{q.question}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { val: 0, label: 'Tidak Pernah' },
                                        { val: 1, label: 'Kadang-kadang' },
                                        { val: 2, label: 'Sering' },
                                        { val: 3, label: 'Hampir Selalu' }
                                    ].map((opt) => (
                                        <label
                                            key={opt.val}
                                            className={`
                                                cursor-pointer p-3 rounded-xl border text-sm font-medium text-center transition-all duration-200
                                                ${answers[q.id] === opt.val
                                                    ? 'bg-brand-500 border-brand-500 text-white shadow-md transform scale-105'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-brand-50'}
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                value={opt.val}
                                                checked={answers[q.id] === opt.val}
                                                onChange={(e) => handleChange(q.id, e.target.value)}
                                                className="hidden"
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={answeredCount < totalQuestions || submitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform
                        ${answeredCount < totalQuestions || submitting
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 hover:-translate-y-1 hover:shadow-glow'}
                    `}
                >
                    {submitting ? 'Menganalisis Jawaban...' : 'Lihat Hasil Analisis Saya'}
                </button>
            </form>
        </div>
    );
}
