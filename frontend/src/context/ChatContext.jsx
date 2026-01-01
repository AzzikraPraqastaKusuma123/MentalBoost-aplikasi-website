import { createContext, useState, useEffect, useContext, useRef } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // Total unread messages

    // Fetch contacts (Counselors for User, Users for Counselor)
    const fetchContacts = async () => {
        try {
            const { data } = await api.get('/contacts');
            setContacts(data.data);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        }
    };

    // Load messages for specific user
    const loadMessages = async (userId) => {
        setLoadingChat(true);
        try {
            const { data } = await api.get(`/messages/${userId}`);
            setMessages(data.data);
            setActiveChat(userId);
        } catch (error) {
            console.error("Failed to load messages", error);
        } finally {
            setLoadingChat(false);
        }
    };

    // Send message
    const sendMessage = async (text) => {
        if (!activeChat) return;
        try {
            const { data } = await api.post('/messages', {
                receiver_id: activeChat,
                message: text
            });
            // Optimistic update or wait for re-fetch? 
            // Let's append directly for speed
            setMessages([...messages, data.data]);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    // Ref to track previous message counts to avoid duplicate toasts on re-renders
    const prevMessagesLengthRef = useRef(0);
    const prevContactsRef = useRef([]);

    // Reset ref when active chat changes
    useEffect(() => {
        prevMessagesLengthRef.current = 0;
    }, [activeChat]);

    // Polling for contacts and active chat messages
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(async () => {
            // 1. Poll Contacts and check for new messages
            try {
                const { data } = await api.get('/contacts');
                const newContacts = data.data;

                // Calculate total unread count from backend data
                const totalUnread = newContacts.reduce((sum, contact) => sum + (contact.unread_count || 0), 0);

                // Check if any contact has new messages (for both users and counselors)
                if (prevContactsRef.current.length > 0) {
                    newContacts.forEach((contact) => {
                        const prevContact = prevContactsRef.current.find(c => c.id === contact.id);
                        // If contact exists in previous state and has activity change
                        if (prevContact && contact.last_message_time !== prevContact.last_message_time) {
                            // New message detected from this contact
                            if (!activeChat || activeChat !== contact.id) {
                                // Only notify if not currently chatting with this person
                                toast.success(`Pesan baru dari ${contact.name}`, { icon: '💬', duration: 4000 });
                            }
                        }
                    });
                }

                setUnreadCount(totalUnread);
                setContacts(newContacts);
                prevContactsRef.current = newContacts;
            } catch (error) {
                console.error("Polling contacts failed", error);
            }

            // 2. Poll Active Chat Messages
            if (activeChat) {
                try {
                    const { data } = await api.get(`/messages/${activeChat}`);
                    const newMessages = data.data;

                    if (newMessages.length > prevMessagesLengthRef.current) {
                        // Only notify if we have previous messages (not initial load)
                        if (prevMessagesLengthRef.current > 0) {
                            const lastMsg = newMessages[newMessages.length - 1];
                            if (lastMsg.sender_id !== user.id) {
                                toast.success('Pesan baru diterima!', { icon: '💬' });
                            }
                        }
                        setMessages(newMessages);
                        prevMessagesLengthRef.current = newMessages.length;
                    }
                    // Initial load or no change
                    else if (prevMessagesLengthRef.current === 0 && newMessages.length > 0) {
                        setMessages(newMessages);
                        prevMessagesLengthRef.current = newMessages.length;
                    }
                } catch (error) {
                    console.error("Polling messages failed", error);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [user, activeChat]);

    return (
        <ChatContext.Provider value={{
            contacts,
            messages,
            activeChat,
            loadingChat,
            unreadCount,
            fetchContacts,
            loadMessages,
            sendMessage,
            setActiveChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};
