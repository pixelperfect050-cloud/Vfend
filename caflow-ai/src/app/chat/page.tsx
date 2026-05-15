"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Paperclip, Image, Mic, MoreVertical, Search, Phone, Video,
  Check, CheckCheck, MessageCircle, X, Smile, CornerDownLeft
} from "lucide-react";
import { DEMO_CLIENTS } from "@/lib/data";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  status: "sent" | "delivered" | "read";
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: Date;
  unread: number;
  online: boolean;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>("c1");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    c1: [
      { id: "1", text: "Hello, I have uploaded the GSTR-1 for November", timestamp: new Date(Date.now() - 3600000), isOwn: false, status: "read" },
      { id: "2", text: "Thank you! I will verify it shortly.", timestamp: new Date(Date.now() - 3500000), isOwn: true, status: "read" },
      { id: "3", text: "Please also send the bank statement for reconciliation", timestamp: new Date(Date.now() - 3000000), isOwn: true, status: "read" },
      { id: "4", text: "Sure, I will upload it today.", timestamp: new Date(Date.now() - 1800000), isOwn: false, status: "read" },
    ],
    c2: [
      { id: "1", text: "Documents still pending for October GST", timestamp: new Date(Date.now() - 86400000), isOwn: true, status: "read" },
      { id: "2", text: "I will send them by tomorrow", timestamp: new Date(Date.now() - 7200000), isOwn: false, status: "delivered" },
    ],
    c3: [
      { id: "1", text: "ITR filing completed successfully!", timestamp: new Date(Date.now() - 172800000), isOwn: true, status: "read" },
      { id: "2", text: "Thank you for the quick turnaround", timestamp: new Date(Date.now() - 170000000), isOwn: false, status: "read" },
    ],
  });
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts: ChatContact[] = [
    { id: "c1", name: "Ramesh Industries", avatar: "R", lastMessage: "Sure, I will upload it today.", lastTime: new Date(Date.now() - 1800000), unread: 0, online: true },
    { id: "c2", name: "Sharma Trading", avatar: "S", lastMessage: "I will send them by tomorrow", lastTime: new Date(Date.now() - 7200000), unread: 1, online: false },
    { id: "c3", name: "Tech Solutions LLP", avatar: "T", lastMessage: "Thank you for the quick turnaround", lastTime: new Date(Date.now() - 170000000), unread: 0, online: true },
    { id: "c5", name: "Patel Retail", avatar: "P", lastMessage: "Please follow up with payment", lastTime: new Date(Date.now() - 86400000), unread: 2, online: false },
  ];

  const selectedContact = contacts.find(c => c.id === selectedChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChat]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      isOwn: true,
      status: "sent",
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), message],
    }));
    setNewMessage("");
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
      setRecordingTime(0);
    }, 10000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-slate-50">
      {/* Chat List */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-600" />
            Messages
          </h2>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedChat(contact.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors ${selectedChat === contact.id ? 'bg-amber-50 border-r-2 border-amber-600' : ''}`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold border border-slate-200">
                  {contact.avatar}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 truncate">{contact.name}</span>
                  <span className="text-xs text-slate-400">{formatTime(contact.lastTime)}</span>
                </div>
                <p className="text-sm text-slate-500 truncate mt-1">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-sm">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat && selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold border border-slate-200">
                    {selectedContact.avatar}
                  </div>
                  {selectedContact.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedContact.name}</h3>
                  <p className="text-xs text-slate-500">{selectedContact.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5 text-slate-500" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <Video className="w-5 h-5 text-slate-500" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              <div className="text-center">
                <span className="px-3 py-1 bg-white rounded-full text-xs text-slate-400 border border-slate-100 shadow-sm">Today</span>
              </div>

              {messages[selectedChat]?.map((message, index) => {
                const prevMessage = messages[selectedChat][index - 1];
                const showDate = !prevMessage || message.timestamp.toDateString() !== prevMessage.timestamp.toDateString();

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.isOwn 
                          ? 'bg-amber-600 text-white rounded-br-md shadow-lg shadow-amber-600/10' 
                          : 'bg-white text-slate-900 rounded-bl-md shadow-sm border border-slate-100'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-slate-400">{formatTime(message.timestamp)}</span>
                        {message.isOwn && (
                          message.status === "read" ? <CheckCheck className="w-4 h-4 text-blue-500" /> :
                          message.status === "delivered" ? <CheckCheck className="w-4 h-4 text-zinc-400" /> :
                          <Check className="w-4 h-4 text-zinc-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <Image className="w-5 h-5 text-slate-400" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>

                {newMessage.trim() ? (
                  <button
                    onClick={sendMessage}
                    className="p-3 bg-amber-600 hover:bg-amber-700 rounded-xl text-white transition-all shadow-lg shadow-amber-600/20"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onMouseDown={startRecording}
                    onMouseUp={() => setIsRecording(false)}
                    className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm text-red-500"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Recording... {recordingTime}s
                  <button onClick={() => setIsRecording(false)} className="ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <MessageCircle className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Your Conversations</h3>
              <p className="text-slate-500">Select a client to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}