import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../styles/funkiai.css';

const QUICK_ACTIONS = [
  { label: '💰 Payment Status', msg: 'What is my current maintenance payment status?' },
  { label: '🏠 Dashboard Help', msg: 'How do I navigate the dashboard?' },
  { label: '🧾 Receipt Info', msg: 'How do I download my payment receipt?' },
  { label: '💸 Fund Details', msg: 'Explain society funds and how they work' },
  { label: '👥 Member Guide', msg: 'How does member management work?' },
  { label: '📊 Expense Report', msg: 'How can I view expense reports?' },
];

const FunkiAI = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: `Namaste${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 👋\n\nI'm **FunkiAI**, your smart society assistant. I can help you with:\n\n• 💰 Maintenance payments\n• 🧾 Receipts & billing\n• 📊 Dashboard navigation\n• 💸 Society funds\n• 👥 Member management\n\nAsk me anything or tap a quick action below!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [language, setLanguage] = useState('hindi');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Stop pulse after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setPulseAnimation(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        if (event.results[0].isFinal) {
          handleSend(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      setInput('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  }, [isListening]);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/[•\-]\s/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\(Offline mode.*?\)/gi, '')
      .replace(/\(AI temporarily.*?\)/gi, '')
      .replace(/\(Demo mode.*?\)/gi, '')
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/📱|💰|🧾|📊|💸|🏦|👥|🔧|🙏|🎉|📡|🔐|💥|🇮🇳|🇬🇧/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Language-specific settings
    const langMap = { hindi: 'hi-IN', english: 'en-IN', hinglish: 'en-IN' };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = language === 'hindi' ? 0.9 : 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (language === 'hindi') {
      selectedVoice = voices.find(v => v.lang.includes('hi')) || 
                     voices.find(v => v.name.includes('Google') && v.lang.includes('hi')) ||
                     voices.find(v => v.lang.includes('en-IN'));
    } else {
      selectedVoice = voices.find(v => v.lang.includes('en-IN') && v.name.includes('Google')) ||
                     voices.find(v => v.lang.includes('en-IN')) ||
                     voices.find(v => v.lang.includes('en'));
    }
    
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const handleSend = useCallback(async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      const res = await api.post('/api/ai/chat', { message: text, language });
      
      const aiMsg = { role: 'ai', content: res.response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      speak(res.response);
    } catch (error) {
      console.error('FunkiAI Error Detail:', error);
      
      let errorMsg = error.message || 'Unknown connection error';
      
      if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMsg = 'Network Error: Unable to reach the AI server. 📡';
      } else if (error.message?.includes('404')) {
        errorMsg = 'Server Error (404): The AI service was not found on this server. 🔧';
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        errorMsg = 'Auth Error: Your session is invalid. Please relogin. 🔐';
      } else if (error.message?.includes('500')) {
        errorMsg = 'Server Error (500): The AI service encountered an internal error. 💥';
      }
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Debug Info: ${errorMsg} \n\n(If you still see the old "trouble connecting" message, please clear your browser cache!)`, 
        timestamp: new Date(), 
        isError: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, speak]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      content: `Chat cleared! 🧹 How can I help you, ${user?.name?.split(' ')[0] || 'there'}?`,
      timestamp: new Date()
    }]);
    setShowQuickActions(true);
  };

  return (
    <div className="funkiai-container">
      {/* ═══ FLOATING TRIGGER BUTTON ═══ */}
      <button 
        className={`funkiai-trigger ${isOpen ? 'funkiai-trigger--active' : ''} ${pulseAnimation ? 'funkiai-trigger--pulse' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close FunkiAI' : 'Open FunkiAI'}
        id="funkiai-trigger-btn"
      >
        <div className="funkiai-trigger__glow" />
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span className="funkiai-trigger__badge">AI</span>
          </>
        )}
      </button>

      {/* ═══ CHAT WINDOW ═══ */}
      <div className={`funkiai-window ${isOpen ? 'funkiai-window--open' : ''}`} ref={chatWindowRef}>
        
        {/* ─── Header ─── */}
        <div className="funkiai-header">
          <div className="funkiai-header__left">
            <div className="funkiai-avatar">
              <div className="funkiai-avatar__inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1h-1a2 2 0 0 0 0 4h1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1h1a2 2 0 0 0 0-4H3v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="13" r="1" fill="currentColor"/>
                  <circle cx="15" cy="13" r="1" fill="currentColor"/>
                  <path d="M9 17c1.5 1 4.5 1 6 0" strokeLinecap="round"/>
                </svg>
              </div>
              <span className={`funkiai-avatar__status ${isTyping ? 'funkiai-avatar__status--typing' : ''}`} />
            </div>
            <div className="funkiai-header__info">
              <h3>FunkiAI</h3>
              <p>{isTyping ? 'Thinking...' : isSpeaking ? '🔊 Speaking...' : 'Online • AI Assistant'}</p>
            </div>
            <select 
              className="funkiai-lang-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setMessages([{
                  role: 'ai',
                  content: e.target.value === 'hindi' ? 'बिल्कुल! अब में हिंदी में बात करूंगा!' : 
                          'Sure! I will respond in English from now!',
                  timestamp: new Date()
                }]);
              }}
              aria-label="Select language"
            >
              <option value="hindi">🇮🇳 हिंदी</option>
              <option value="english">🇬🇧 English</option>
            </select>
          </div>
          <div className="funkiai-header__actions">
            {isSpeaking && (
              <button className="funkiai-header__btn" onClick={stopSpeaking} title="Stop speaking" aria-label="Stop speaking">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                </svg>
              </button>
            )}
            <button className="funkiai-header__btn" onClick={clearChat} title="Clear chat" aria-label="Clear chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
            </button>
            <button className="funkiai-header__btn funkiai-header__btn--close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ─── Messages Area ─── */}
        <div className="funkiai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`funkiai-msg funkiai-msg--${msg.role} ${msg.isError ? 'funkiai-msg--error' : ''}`}>
              {msg.role === 'ai' && (
                <div className="funkiai-msg__avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1h-1a2 2 0 0 0 0 4h1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1h1a2 2 0 0 0 0-4H3v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <div className="funkiai-msg__bubble">
                <div 
                  className="funkiai-msg__text"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
                <span className="funkiai-msg__time">{formatTime(msg.timestamp)}</span>
              </div>
              {msg.role === 'ai' && !msg.isError && (
                <button 
                  className="funkiai-msg__speak" 
                  onClick={() => speak(msg.content)}
                  title="Listen to this message"
                  aria-label="Listen to message"
                >
                  🔊
                </button>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="funkiai-msg funkiai-msg--ai funkiai-msg--typing">
              <div className="funkiai-msg__avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1h-1a2 2 0 0 0 0 4h1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1h1a2 2 0 0 0 0-4H3v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="funkiai-msg__bubble">
                <div className="funkiai-typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ─── Quick Actions ─── */}
        {showQuickActions && messages.length <= 1 && (
          <div className="funkiai-quick-actions">
            {QUICK_ACTIONS.map((action, i) => (
              <button 
                key={i} 
                className="funkiai-quick-btn"
                onClick={() => handleSend(action.msg)}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* ─── Input Area ─── */}
        <div className="funkiai-input-area">
          {/* Voice Listening Indicator */}
          {isListening && (
            <div className="funkiai-listening">
              <div className="funkiai-listening__waves">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <span className="funkiai-listening__text">Listening...</span>
            </div>
          )}
          
          <div className="funkiai-input-wrap">
            <input
              ref={inputRef}
              type="text"
              placeholder={isListening ? 'Listening...' : 'Type your message...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isListening}
              id="funkiai-input"
              autoComplete="off"
            />
            <button 
              className={`funkiai-btn funkiai-btn--mic ${isListening ? 'funkiai-btn--mic-active' : ''}`}
              onClick={toggleVoice}
              title={isListening ? 'Stop listening' : 'Voice input'}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              id="funkiai-mic-btn"
            >
              {isListening ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>
            <button 
              className="funkiai-btn funkiai-btn--send"
              onClick={() => handleSend()}
              disabled={!input.trim() && !isListening}
              title="Send message"
              aria-label="Send message"
              id="funkiai-send-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M22 2L11 13"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
              </svg>
            </button>
          </div>

          <div className="funkiai-footer">
            Powered by <strong>FunkiAI</strong> • Gemini
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunkiAI;
