import { useEffect, useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import ChatWindow from '../components/ChatWindow';

export default function CounselorChat() {
    const {
        contacts,
        fetchContacts,
        loadMessages,
        activeChat,
        setActiveChat
    } = useContext(ChatContext);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const getPartnerName = () => {
        if (!activeChat) return 'Chat';
        const partner = contacts.find(c => c.id === activeChat);
        return partner ? partner.name : 'User';
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h1 className="font-bold text-xl text-dark-900 mb-2">Live Chat</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari pengguna..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredContacts.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                            <span className="text-2xl mb-2">📭</span>
                            {searchTerm ? 'Pengguna tidak ditemukan.' : 'Belum ada pesan masuk.'}
                        </div>
                    ) : (
                        filteredContacts.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => { setActiveChat(contact.id); loadMessages(contact.id); }}
                                className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-all flex items-center group
                                    ${activeChat === contact.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : 'border-l-4 border-l-transparent'}
                                `}
                            >
                                <div className="relative mr-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-105
                                        ${activeChat === contact.id ? 'bg-brand-600' : 'bg-gray-300'}
                                    `}>
                                        {contact.name.charAt(0)}
                                    </div>
                                    {/* Unread badge on avatar */}
                                    {contact.unread_count > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
                                            {contact.unread_count > 9 ? '9+' : contact.unread_count}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className={`font-semibold text-sm truncate ${contact.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {contact.name}
                                        </h4>
                                        {contact.last_message_time && (
                                            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                                {new Date(contact.last_message_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs truncate ${contact.unread_count > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                        {contact.last_message || 'Belum ada pesan'}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <ChatWindow partnerName={getPartnerName()} partnerRole="User" />
            </div>
        </div>
    );
}
