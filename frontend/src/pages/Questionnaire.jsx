import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const QUESTIONS = [
    // Stress
    { id: 1, text: 'Saya merasa sulit untuk menenangkan diri', category: 'stress' },
    { id: 2, text: 'Saya cenderung bereaksi berlebihan terhadap situasi', category: 'stress' },
    { id: 3, text: 'Saya merasa menghabiskan banyak energi karena cemas', category: 'stress' },
    { id: 4, text: 'Saya merasa mudah gelisah', category: 'stress' },
    { id: 5, text: 'Saya merasa sulit untuk rileks', category: 'stress' },
    { id: 6, text: 'Saya tidak sabaran dengan gangguan saat sedang sibuk', category: 'stress' },
    { id: 7, text: 'Saya merasa mudah tersinggung', category: 'stress' },

    // Anxiety
    { id: 8, text: 'Saya menyadari mulut saya kering', category: 'anxiety' },
    { id: 9, text: 'Saya mengalami kesulitan bernapas (misal: napas cepat)', category: 'anxiety' },
    { id: 10, text: 'Saya mengalami gemetar (misal: pada tangan)', category: 'anxiety' },
    { id: 11, text: 'Saya khawatir akan situasi di mana saya mungkin panik', category: 'anxiety' },
    { id: 12, text: 'Saya merasa hampir panik', category: 'anxiety' },
    { id: 13, text: 'Saya merasa takut tanpa alasan yang jelas', category: 'anxiety' },
    { id: 14, text: 'Saya merasakan jantung berdebar-debar', category: 'anxiety' },

    // Depression
    { id: 15, text: 'Saya tidak bisa merasakan perasaan positif sama sekali', category: 'depression' },
    { id: 16, text: 'Saya sulit berinisiatif untuk melakukan sesuatu', category: 'depression' },
    { id: 17, text: 'Saya merasa tidak ada yang bisa dinantikan', category: 'depression' },
    { id: 18, text: 'Saya merasa sedih dan murung', category: 'depression' },
    { id: 19, text: 'Saya tidak antusias terhadap apa pun', category: 'depression' },
    { id: 20, text: 'Saya merasa tidak berharga sebagai seseorang', category: 'depression' },
    { id: 21, text: 'Saya merasa hidup ini tidak ada artinya', category: 'depression' },
];

export default function Questionnaire() {
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

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
            alert('Failed to submit test');
        } finally {
            setSubmitting(false);
        }
    };

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = QUESTIONS.length;
    const progress = (answeredCount / totalQuestions) * 100;

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
                {QUESTIONS.map((q, index) => (
                    <div key={q.id} className="glass-card p-6 transition-all duration-300 hover:shadow-lg hover:border-brand-200">
                        <div className="flex items-start">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-brand-100 text-brand-700 rounded-full font-bold text-sm mr-4">
                                {index + 1}
                            </span>
                            <div className="flex-1">
                                <p className="text-lg font-medium text-dark-800 mb-4">{q.text}</p>
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
