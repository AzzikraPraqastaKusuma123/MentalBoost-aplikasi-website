import { useState, useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

export default function ChatWindow({ partnerName, partnerRole }) {
    const { messages, sendMessage, loadingChat, activeChat } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        sendMessage(inputText);
        setInputText('');
    };

    if (!activeChat) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Pilih seseorang untuk memulai percakapan</p>
            </div>
        );
    }

    if (loadingChat) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-brand-500 animate-pulse">Memuat percakapan...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-brand-600 p-4 text-white flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg">{partnerName || 'Chat'}</h3>
                    <span className="text-xs bg-brand-700 px-2 py-0.5 rounded-full">{partnerRole || 'User'}</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">Belum ada pesan. Sapa sekarang! 👋</div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${isMe
                                    ? 'bg-brand-500 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm">{msg.message}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-brand-100' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tulis pesan..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="bg-brand-600 text-white px-6 py-2 rounded-xl hover:bg-brand-700 transition-colors font-medium disabled:opacity-50"
                    disabled={!inputText.trim()}
                >
                    Kirim
                </button>
            </form>
        </div>
    );
}
