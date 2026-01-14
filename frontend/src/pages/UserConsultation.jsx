import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { ChatContext } from '../context/ChatContext';
import ChatWindow from '../components/ChatWindow';

export default function UserConsultation() {
    const { contacts, fetchContacts, loadMessages, activeChat, setActiveChat } = useContext(ChatContext);
    const [view, setView] = useState('list'); // list, chat

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleStartChat = (counselorId) => {
        setActiveChat(counselorId);
        loadMessages(counselorId);
        setView('chat');
    };

    const handleBackToList = () => {
        setView('list');
        setActiveChat(null);
    };

    const getActivePartnerName = () => {
        const partner = contacts.find(c => c.id === activeChat);
        return partner ? partner.name : 'Konselor';
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-dark-900">Konsultasi dengan Ahli</h1>
            <p className="text-gray-600">Pilih konselor kami untuk memulai sesi curhat secara privat dan aman.</p>

            {view === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {contacts.map((counselor) => (
                        <div key={counselor.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-center relative">
                            {/* Unread badge */}
                            {counselor.unread_count > 0 && (
                                <span className="absolute top-4 right-4 flex items-center justify-center min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                    {counselor.unread_count > 9 ? '9+' : counselor.unread_count}
                                </span>
                            )}

                            <div className="w-20 h-20 mx-auto bg-brand-100 rounded-full flex items-center justify-center text-3xl mb-4 overflow-hidden border-2 border-white shadow-md">
                                {counselor.avatar ? (
                                    <img
                                        src={`http://localhost:8000/storage/${counselor.avatar}`}
                                        alt={counselor.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>👨‍⚕️</span>
                                )}
                            </div>
                            <h3 className="font-bold text-xl text-gray-900">{counselor.name}</h3>
                            <p className="text-brand-600 font-medium mb-2">Konselor Profesional</p>

                            {/* Last message preview */}
                            {counselor.last_message && (
                                <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg text-left">
                                    <p className={`text-xs truncate ${counselor.unread_count > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                        {counselor.last_message}
                                    </p>
                                    {counselor.last_message_time && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(counselor.last_message_time).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => handleStartChat(counselor.id)}
                                className="w-full py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                            >
                                Chat Sekarang
                            </button>
                        </div>
                    ))}
                    {contacts.length === 0 && (
                        <div className="col-span-3 text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                            Belum ada konselor yang tersedia saat ini.
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-6">
                    <button
                        onClick={handleBackToList}
                        className="mb-4 text-sm text-gray-500 hover:text-brand-600 flex items-center gap-1 font-medium"
                    >
                        ← Kembali ke Daftar Konselor
                    </button>
                    <div className="max-w-4xl mx-auto">
                        <ChatWindow
                            partnerName={getActivePartnerName()}
                            partnerRole="Konselor"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
