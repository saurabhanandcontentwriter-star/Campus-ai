import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sliders, 
  Settings, 
  RefreshCw, 
  User, 
  Cpu, 
  Check, 
  Info,
  ChevronRight,
  Headphones,
  Glasses,
  Pocket
} from 'lucide-react';

interface AIVoiceChatbotProps {
  onAwardPoints?: (points: number, reason: string) => void;
  isCompact?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

type ChatTheme = 'cyberpunk' | 'matrix' | 'solar' | 'gold';
type AvatarStyle = 'visor' | 'headset' | 'glasses';
type OutfitStyle = 'hoodie' | 'techwear' | 'blazer';

export default function AIVoiceChatbot({ onAwardPoints, isCompact = false }: AIVoiceChatbotProps) {
  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      text: "Yo! I'm Leo, your 3D-interactive AI assistant. I can help you summarize chapters, brainstorm code, or prepare for your viva defense. You can talk to me via text or speak using the mic!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice States
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceRate, setVoiceRate] = useState(1.0); // speech speed
  const [voicePitch, setVoicePitch] = useState(1.0); // voice tone (boyish tone)
  const [voiceSelected, setVoiceSelected] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Avatar customization States
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>('headset');
  const [outfitStyle, setOutfitStyle] = useState<OutfitStyle>('hoodie');
  const [chatbotTheme, setChatbotTheme] = useState<ChatTheme>('cyberpunk');
  const [showSettings, setShowSettings] = useState(false);

  // Expression States (idle, thinking, speaking, listening)
  const [avatarState, setAvatarState] = useState<'idle' | 'thinking' | 'speaking' | 'listening'>('idle');

  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis and Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        if (synthRef.current) {
          const voices = synthRef.current.getVoices();
          setAvailableVoices(voices);
          // Try to select a male or high-quality default voice for "Leo"
          const englishMaleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('google us english') || v.name.toLowerCase().includes('natural')));
          setVoiceSelected(englishMaleVoice || voices[0] || null);
        }
      };

      loadVoices();
      if (synthRef.current && 'onvoiceschanged' in synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }

      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setAvatarState('listening');
        };

        recognition.onend = () => {
          setIsListening(false);
          setAvatarState(prev => prev === 'listening' ? 'idle' : prev);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setAvatarState('idle');
        };

        recognition.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          if (resultText) {
            setInputText(resultText);
            // Auto submit
            handleSendMessage(resultText);
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Scroll messages to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle TTS (speak response aloud)
  const speakResponse = (text: string) => {
    if (isMuted || !synthRef.current) return;

    // Cancel active synthesis
    synthRef.current.cancel();

    // Clean markdown bold and bullet points for clean speech
    const cleanText = text
      .replace(/[*_`#]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .substring(0, 300); // Limit speech length to keep it responsive

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (voiceSelected) {
      utterance.voice = voiceSelected;
    }
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;

    utterance.onstart = () => {
      setAvatarState('speaking');
    };

    utterance.onend = () => {
      setAvatarState('idle');
    };

    utterance.onerror = () => {
      setAvatarState('idle');
    };

    synthRef.current.speak(utterance);
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (synthRef.current) synthRef.current.cancel(); // Stop talking when user speaks
      setInputText('');
      recognitionRef.current.start();
    }
  };

  // Submit Text/Voice Message
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: rawText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setAvatarState('thinking');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `User is talking to an interactive 3D boy avatar AI companion named Leo. 
Keep the answer conversational, highly friendly, full of positive energy, cool student slang where appropriate, but strictly helpful academically. Keep it relatively concise (under 3-4 sentences) so it's easy to read and vocalize.
Question/Input: ${rawText}`,
          systemInstruction: 'You are Leo, a cool, smart, and highly interactive male AI Study Companion for BCA / Computer Science students. Your tone is supportive, energetic, clever, and academic yet approachable. Use bullet points or tiny code examples only if necessary.'
        })
      });

      const data = await response.json();
      
      if (response.ok && data.text) {
        const systemMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          text: data.text,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, systemMessage]);
        
        // Speak out response
        speakResponse(data.text);
        
        // Award gamified points for interacting with chatbot
        if (onAwardPoints) {
          onAwardPoints(5, 'Engaged with Interactive Avatar Chatbot');
        }
      } else {
        const errorMsg = `Ah, sorry dude, I hit a snag: ${data.error || 'Server error'}`;
        setMessages(prev => [...prev, {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          text: errorMsg,
          timestamp: new Date()
        }]);
        setAvatarState('idle');
      }
    } catch (error: any) {
      const netError = `Ouch, network lag is real! Couldn't reach my server. Check your connection or retry.`;
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        text: netError,
        timestamp: new Date()
      }]);
      setAvatarState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  // Theme color maps
  const themeStyles = {
    cyberpunk: {
      accent: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-500/20',
      bgGrad: 'from-slate-950 via-slate-900 to-indigo-950/40',
      avatarGlow: '#06b6d4',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      chatUser: 'bg-cyan-600/10 border-cyan-500/20 text-cyan-100',
      chatBot: 'bg-slate-900/80 border-slate-800 text-slate-100',
      primaryBtn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20 text-slate-950',
      textAccent: 'text-cyan-400',
    },
    matrix: {
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/20',
      bgGrad: 'from-slate-950 via-slate-900 to-emerald-950/30',
      avatarGlow: '#10b981',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      chatUser: 'bg-emerald-600/10 border-emerald-500/20 text-emerald-100',
      chatBot: 'bg-slate-900/80 border-slate-800 text-slate-100',
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-slate-950',
      textAccent: 'text-emerald-400',
    },
    solar: {
      accent: 'border-orange-500/30 text-orange-400 bg-orange-950/20',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)] border-orange-500/20',
      bgGrad: 'from-slate-950 via-slate-900 to-orange-950/20',
      avatarGlow: '#f97316',
      badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      chatUser: 'bg-orange-600/10 border-orange-500/20 text-orange-100',
      chatBot: 'bg-slate-900/80 border-slate-800 text-slate-100',
      primaryBtn: 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20 text-slate-950',
      textAccent: 'text-orange-400',
    },
    gold: {
      accent: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)] border-amber-500/20',
      bgGrad: 'from-slate-950 via-slate-900 to-amber-950/20',
      avatarGlow: '#f59e0b',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      chatUser: 'bg-amber-600/10 border-amber-500/20 text-amber-100',
      chatBot: 'bg-slate-900/80 border-slate-800 text-slate-100',
      primaryBtn: 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20 text-slate-950',
      textAccent: 'text-amber-400',
    }
  };

  const currentTheme = themeStyles[chatbotTheme];

  // Helper arrays for soundwaves
  const dummyWaveBars = Array.from({ length: 14 });

  if (isCompact) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 select-none overflow-hidden">
        {/* Compact Head / Avatar Status Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-3.5 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 blur-md opacity-35" 
                style={{ backgroundColor: currentTheme.avatarGlow }} 
              />
              {/* Mini SVG head representation of Leo */}
              <svg viewBox="50 20 100 100" className="w-7 h-7 relative z-10">
                <defs>
                  <linearGradient id="skinGradCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffdbb5" />
                    <stop offset="100%" stopColor="#e0a96d" />
                  </linearGradient>
                  <linearGradient id="hairGradCompact" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#312e81" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </linearGradient>
                </defs>
                <rect x="88" y="90" width="24" height="30" rx="3" fill="url(#skinGradCompact)" />
                <rect x="70" y="45" width="60" height="60" rx="22" fill="url(#skinGradCompact)" />
                <path d="M66,55 C64,30 85,25 100,25 C115,25 136,30 134,55 C132,65 126,52 120,48 C114,44 100,48 95,45 C90,42 80,48 74,52 C68,56 68,58 66,55 Z" fill="url(#hairGradCompact)" />
                {avatarState === 'thinking' ? (
                  <g>
                    <path d="M78,66 Q83,62 88,66" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M112,66 Q117,62 122,66" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </g>
                ) : (
                  <g>
                    <ellipse cx="83" cy="67" rx="4.5" ry="4.5" fill="#111827" />
                    <ellipse cx="117" cy="67" rx="4.5" ry="4.5" fill="#111827" />
                  </g>
                )}
                {avatarState === 'speaking' ? (
                  <ellipse cx="100" cy="87" rx="6" ry="4" fill="#7f1d1d" />
                ) : (
                  <path d="M94,84 Q100,90 106,84" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                )}
              </svg>
              {/* LED Status light */}
              <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-slate-900 ${
                avatarState === 'speaking' ? 'bg-emerald-500' :
                avatarState === 'thinking' ? 'bg-amber-500 animate-pulse' :
                avatarState === 'listening' ? 'bg-rose-500' :
                'bg-slate-400'
              }`} />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Leo Assistant</div>
              <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">
                {avatarState === 'idle' && 'Standby'}
                {avatarState === 'thinking' && 'Thinking...'}
                {avatarState === 'speaking' && 'Speaking'}
                {avatarState === 'listening' && 'Listening...'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleListening}
              className={`p-1 rounded-md border transition-all cursor-pointer ${
                isListening 
                  ? 'bg-rose-600/20 border-rose-500 text-rose-400' 
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-250'
              }`}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? <MicOff className="w-3 h-3 animate-pulse" /> : <Mic className="w-3 h-3" />}
            </button>
            <button
              onClick={toggleMute}
              className={`p-1 rounded-md border transition-all cursor-pointer ${
                isMuted 
                  ? 'bg-slate-800/40 border-slate-800 text-rose-400' 
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-emerald-400'
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-emerald-500" />}
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 bg-slate-800/40 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-md transition-all cursor-pointer"
              title="Settings"
            >
              <Settings className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-[11px] relative">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div className={`p-2 rounded-xl border ${
                msg.role === 'user' ? currentTheme.chatUser : currentTheme.chatBot
              }`}>
                {msg.text}
              </div>
              <span className="text-[8px] text-slate-500 mt-0.5 px-1 font-mono">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-slate-900 border border-slate-850 p-2 rounded-xl flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                <span>Leo thinking...</span>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />

          {/* Quick theme customization inline in logs when settings is active */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-x-2 bottom-2 bg-slate-950 border border-slate-850 p-3 rounded-xl z-20 space-y-2.5 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Customizer Panel</span>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-[9px] font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    Done
                  </button>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Hologram Theme</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(['cyberpunk', 'matrix', 'solar', 'gold'] as ChatTheme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setChatbotTheme(t)}
                        className={`py-1 rounded text-[9px] font-bold uppercase border transition-all cursor-pointer ${
                          chatbotTheme === t ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-transparent'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-900 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none select-none">
          <button 
            onClick={() => handleSendMessage("Explain OOP in simple terms")}
            className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 rounded text-[9px] whitespace-nowrap cursor-pointer"
          >
            Explain OOP
          </button>
          <button 
            onClick={() => handleSendMessage("What are key computer network viva questions?")}
            className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 rounded text-[9px] whitespace-nowrap cursor-pointer"
          >
            Viva Questions
          </button>
        </div>

        {/* Console Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="p-2 bg-slate-950 border-t border-slate-900 flex gap-1.5 shrink-0"
        >
          <input
            type="text"
            placeholder="Ask Leo anything..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              inputText.trim() ? currentTheme.primaryBtn : 'bg-slate-900 text-slate-600 border border-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br ${currentTheme.bgGrad} p-6 rounded-2xl border border-slate-800 transition-all duration-500`}>
      
      {/* 1. Interactive 3D Boy Avatar Panel (Left) */}
      <div className="lg:col-span-5 flex flex-col justify-between items-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-6 relative overflow-hidden min-h-[420px]">
        
        {/* Futuristic Floating HUD Elements */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">SYSTEM STATUS</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${avatarState !== 'idle' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'} duration-1000`}></span>
            <span className="text-xs font-mono font-bold text-slate-300">
              {avatarState === 'idle' && 'STANDBY'}
              {avatarState === 'thinking' && 'COMPUTING_RESPONSE'}
              {avatarState === 'speaking' && 'AUDIO_OUTPUT_ACTIVE'}
              {avatarState === 'listening' && 'SPEECH_DECODING'}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 right-4 p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all z-10 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* 3D Boy Avatar (Custom Animated SVG Puppet) */}
        <div className="w-full flex-1 flex flex-col items-center justify-center relative mt-6 select-none">
          {/* Ambient Glowing Aura */}
          <div 
            className="absolute w-56 h-56 rounded-full blur-[80px] opacity-25 transition-all duration-1000"
            style={{ 
              backgroundColor: currentTheme.avatarGlow,
              transform: avatarState === 'thinking' ? 'scale(1.2)' : avatarState === 'speaking' ? 'scale(1.15)' : 'scale(1)'
            }}
          />

          {/* Interactive Custom boy avatar */}
          <motion.div
            animate={{ 
              y: avatarState === 'thinking' ? [0, -6, 0] : [0, -10, 0],
              rotate: avatarState === 'speaking' ? [-1, 1, -1] : 0
            }}
            transition={{ 
              repeat: Infinity, 
              duration: avatarState === 'thinking' ? 1.5 : 4, 
              ease: "easeInOut" 
            }}
            className="w-56 h-56 relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffdbb5" />
                  <stop offset="100%" stopColor="#e0a96d" />
                </linearGradient>
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#312e81" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </linearGradient>
                <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={currentTheme.avatarGlow} />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>

              {/* 1. Hoodie/Outfit Body */}
              {outfitStyle === 'hoodie' && (
                <path d="M50,150 C50,120 70,110 100,110 C130,110 150,120 150,150 L160,185 C160,195 140,200 100,200 C60,200 40,195 40,185 Z" fill="url(#jacketGrad)" />
              )}
              {outfitStyle === 'techwear' && (
                <g>
                  <path d="M50,150 C50,115 75,105 100,105 C125,105 150,115 150,150 L158,190 C155,198 135,200 100,200 C65,200 45,198 42,190 Z" fill="#111827" />
                  {/* Harness / Strap details */}
                  <path d="M70,120 L85,195" stroke={currentTheme.avatarGlow} strokeWidth="3" opacity="0.8" />
                  <path d="M130,120 L115,195" stroke={currentTheme.avatarGlow} strokeWidth="3" opacity="0.8" />
                  <rect x="90" y="140" width="20" height="8" rx="2" fill="#374151" />
                </g>
              )}
              {outfitStyle === 'blazer' && (
                <g>
                  <path d="M50,150 C50,120 70,110 100,110 C130,110 150,120 150,150 L160,195 L40,195 Z" fill="#1e1b4b" />
                  <path d="M80,110 L100,155 L120,110 Z" fill="#f8fafc" /> {/* Shirt collar V */}
                  <path d="M98,135 L102,135 L100,185 Z" fill="#be123c" /> {/* Red Tie */}
                  <path d="M50,150 L100,190 L150,150" stroke="#312e81" strokeWidth="4" fill="none" /> {/* Blazer lapels */}
                </g>
              )}

              {/* Glowing Collar Accent (Holographic effect) */}
              <path d="M75,115 C85,125 115,125 125,115" stroke="url(#accentGrad)" strokeWidth="3" fill="none" className="animate-pulse" />

              {/* 2. Neck */}
              <rect x="88" y="90" width="24" height="30" rx="3" fill="url(#skinGrad)" />

              {/* 3. Face */}
              <rect x="70" y="45" width="60" height="60" rx="22" fill="url(#skinGrad)" />

              {/* 4. Hair (Stylish Boy Haircut) */}
              <path d="M66,55 C64,30 85,25 100,25 C115,25 136,30 134,55 C132,65 126,52 120,48 C114,44 100,48 95,45 C90,42 80,48 74,52 C68,56 68,58 66,55 Z" fill="url(#hairGrad)" />
              {/* Boy's stylish side locks */}
              <path d="M68,52 L66,72 L72,66 Z" fill="#1e1b4b" />
              <path d="M132,52 L134,72 L128,66 Z" fill="#1e1b4b" />

              {/* 5. Eyes (With blinking) */}
              <g>
                {/* Left Eye */}
                {avatarState === 'thinking' ? (
                  // Curved/puzzled eyes for thinking
                  <path d="M78,66 Q83,62 88,66" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
                ) : (
                  <g>
                    <ellipse cx="83" cy="67" rx="5" ry="5" fill="#111827" />
                    {/* Glowing pupil */}
                    <circle cx="83" cy="67" r="2.2" fill={currentTheme.avatarGlow} />
                    <circle cx="81.5" cy="65.5" r="1" fill="#ffffff" /> {/* reflection */}
                  </g>
                )}

                {/* Right Eye */}
                {avatarState === 'thinking' ? (
                  // Curved/puzzled eyes for thinking
                  <path d="M112,66 Q117,62 122,66" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
                ) : (
                  <g>
                    <ellipse cx="117" cy="67" rx="5" ry="5" fill="#111827" />
                    {/* Glowing pupil */}
                    <circle cx="117" cy="67" r="2.2" fill={currentTheme.avatarGlow} />
                    <circle cx="115.5" cy="65.5" r="1" fill="#ffffff" /> {/* reflection */}
                  </g>
                )}
              </g>

              {/* Eyebrows */}
              <path d="M76,58 Q83,55 89,59" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M111,59 Q117,55 124,58" stroke="#1e1b4b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Nose */}
              <path d="M98,73 L102,73 L100,79 Z" fill="#cf9358" />

              {/* 6. Mouth (Lip sync speaking simulation) */}
              {avatarState === 'speaking' ? (
                // Mouth morphing/moving
                <motion.ellipse 
                  cx="100" 
                  cy="87" 
                  rx="7" 
                  animate={{ ry: [2, 6, 1.5, 5, 2] }} 
                  transition={{ repeat: Infinity, duration: 0.6 }} 
                  fill="#7f1d1d" 
                />
              ) : avatarState === 'thinking' ? (
                // Flat line/side-mouth
                <line x1="94" y1="88" x2="104" y2="87" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              ) : avatarState === 'listening' ? (
                // Open surprised O mouth for listening
                <circle cx="100" cy="87" r="4.5" fill="#1e293b" />
              ) : (
                // Gentle smile
                <path d="M94,84 Q100,90 106,84" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}

              {/* 7. Accessories Selection (Visor / Headset / Glasses) */}
              {avatarStyle === 'visor' && (
                <g>
                  {/* Neon Cyberpunk Visor */}
                  <path d="M70,58 L130,58 L126,76 L74,76 Z" fill="url(#accentGrad)" opacity="0.9" />
                  <path d="M68,58 L132,58" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                  {/* Glowing text inside visor */}
                  <text x="82" y="70" fill="#ffffff" fontSize="6.5" fontFamily="monospace" fontWeight="bold" opacity="0.9" className="animate-pulse">
                    AI_LINK
                  </text>
                </g>
              )}

              {avatarStyle === 'headset' && (
                <g>
                  {/* Over-ear Pro Gaming Headphones */}
                  <path d="M66,60 A34,34 0 0,1 134,60" fill="none" stroke="#1e293b" strokeWidth="6" />
                  {/* Left ear cup */}
                  <rect x="62" y="55" width="10" height="24" rx="4" fill="url(#accentGrad)" />
                  <rect x="60" y="58" width="3" height="18" rx="1" fill="#111827" />
                  {/* Right ear cup */}
                  <rect x="128" y="55" width="10" height="24" rx="4" fill="url(#accentGrad)" />
                  <rect x="137" y="58" width="3" height="18" rx="1" fill="#111827" />
                  {/* Microphone boom */}
                  <path d="M66,74 L84,86 L84,88" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="84" cy="88" r="3.5" fill={currentTheme.avatarGlow} className="animate-pulse" />
                </g>
              )}

              {avatarStyle === 'glasses' && (
                <g>
                  {/* Smart spectacles */}
                  <circle cx="83" cy="67" r="11" fill="none" stroke="#111827" strokeWidth="3.5" />
                  <circle cx="117" cy="67" r="11" fill="none" stroke="#111827" strokeWidth="3.5" />
                  <line x1="94" y1="65" x2="106" y2="65" stroke="#111827" strokeWidth="3.5" />
                  <line x1="68" y1="65" x2="72" y2="65" stroke="#111827" strokeWidth="3" />
                  <line x1="128" y1="65" x2="132" y2="65" stroke="#111827" strokeWidth="3" />
                </g>
              )}
            </svg>
          </motion.div>

          {/* Interactive Particle Rings under the Avatar */}
          <div className="absolute bottom-6 flex items-center justify-center">
            <div 
              className="w-32 h-6 rounded-full border-2 border-dashed animate-spin opacity-45 duration-10000"
              style={{ borderColor: currentTheme.avatarGlow }}
            ></div>
            <div 
              className="absolute w-24 h-4 rounded-full border border-double animate-ping opacity-30"
              style={{ borderColor: currentTheme.avatarGlow }}
            ></div>
          </div>
        </div>

        {/* Dynamic Voice Soundwave Indicator (Bottom of panel) */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex items-center gap-1 h-8">
            {dummyWaveBars.map((_, idx) => {
              // Generate standard heights or responsive animated ones
              let barHeight = "h-1";
              if (avatarState === 'speaking') {
                const randomHeights = ["h-6", "h-4", "h-7", "h-5", "h-2", "h-8"];
                barHeight = randomHeights[idx % randomHeights.length];
              } else if (avatarState === 'listening') {
                const randomHeights = ["h-4", "h-2", "h-5", "h-3"];
                barHeight = randomHeights[idx % randomHeights.length];
              } else if (avatarState === 'thinking') {
                barHeight = "h-2 animate-pulse";
              }
              
              return (
                <div 
                  key={idx}
                  style={{ 
                    height: avatarState === 'speaking' || avatarState === 'listening' ? undefined : '4px',
                    backgroundColor: currentTheme.avatarGlow,
                    opacity: avatarState === 'idle' ? 0.3 : 1
                  }}
                  className={`${barHeight} w-1 rounded-full transition-all duration-200`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={toggleListening}
              className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                isListening 
                  ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleMute}
              className={`p-3 rounded-full border transition-all cursor-pointer ${
                isMuted 
                  ? 'bg-slate-900 border-slate-800 text-rose-400 hover:text-rose-300' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
              title={isMuted ? "Unmute Voice Output" : "Mute Voice Output"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* 2. Customizer Dropdown Drawer */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 bg-slate-950/95 border-t border-slate-800 p-5 rounded-t-xl z-20 space-y-4 max-h-[85%] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-200 tracking-wider uppercase flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" /> Customizer Dashboard
                </h4>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-slate-500 hover:text-slate-300 text-xs font-bold font-mono border border-slate-800 px-2 py-0.5 rounded cursor-pointer"
                >
                  CLOSE
                </button>
              </div>

              {/* Theme Swapper */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Interface Hologram Theme</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['cyberpunk', 'matrix', 'solar', 'gold'] as ChatTheme[]).map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => setChatbotTheme(themeName)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-black uppercase border transition-all cursor-pointer ${
                        chatbotTheme === themeName 
                          ? 'bg-slate-800 text-white border-slate-600 font-bold' 
                          : 'bg-slate-900/40 text-slate-400 border-transparent hover:border-slate-800'
                      }`}
                    >
                      {themeName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glasses/Visor accessories */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Avatar Accessories (Boy Gear)</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAvatarStyle('headset')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-xs cursor-pointer ${
                      avatarStyle === 'headset' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/50 border-slate-850 text-slate-400'
                    }`}
                  >
                    <Headphones className="w-4 h-4" />
                    <span>Gamer Headset</span>
                  </button>
                  <button
                    onClick={() => setAvatarStyle('visor')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-xs cursor-pointer ${
                      avatarStyle === 'visor' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/50 border-slate-850 text-slate-400'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Cyber Visor</span>
                  </button>
                  <button
                    onClick={() => setAvatarStyle('glasses')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-xs cursor-pointer ${
                      avatarStyle === 'glasses' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/50 border-slate-850 text-slate-400'
                    }`}
                  >
                    <Glasses className="w-4 h-4" />
                    <span>Smart Specs</span>
                  </button>
                </div>
              </div>

              {/* Outfit Style */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Outfit Styling</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setOutfitStyle('hoodie')}
                    className={`py-1.5 px-2 rounded-lg border text-xs transition-all cursor-pointer ${
                      outfitStyle === 'hoodie' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/50 border-slate-850 text-slate-400'
                    }`}
                  >
                    Street Hoodie
                  </button>
                  <button
                    onClick={() => setOutfitStyle('techwear')}
                    className={`py-1.5 px-2 rounded-lg border text-xs transition-all cursor-pointer ${
                      outfitStyle === 'techwear' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/50 border-slate-850 text-slate-400'
                    }`}
                  >
                    Tech Jacket
                  </button>
                  <button
                    onClick={() => setOutfitStyle('blazer')}
                    className={`py-1.5 px-2 rounded-lg border text-xs transition-all cursor-pointer ${
                      outfitStyle === 'blazer' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900/50 border-slate-850 text-slate-400'
                    }`}
                  >
                    College Blazer
                  </button>
                </div>
              </div>

              {/* TTS Controls */}
              <div className="space-y-3 pt-2 border-t border-slate-850">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Voice Synthesizer Settings</span>
                
                {/* Available Voices Dropdown */}
                {availableVoices.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 uppercase font-bold">Vocal Accent Select</label>
                    <select
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-1.5 text-xs focus:outline-none focus:border-slate-700"
                      value={voiceSelected?.name || ''}
                      onChange={(e) => {
                        const voice = availableVoices.find(v => v.name === e.target.value);
                        if (voice) setVoiceSelected(voice);
                      }}
                    >
                      {availableVoices.map(voice => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-400 uppercase font-bold">
                      <span>Tempo (Rate)</span>
                      <span>{voiceRate}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1"
                      value={voiceRate}
                      onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-400 uppercase font-bold">
                      <span>Pitch</span>
                      <span>{voicePitch}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1"
                      value={voicePitch}
                      onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Interactive Terminal Chat Dialogue (Right) */}
      <div className="lg:col-span-7 flex flex-col h-[420px] bg-slate-950/40 rounded-xl border border-slate-800/80 overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">leo@campussphere:~chatbot$</span>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] border uppercase font-mono font-bold ${currentTheme.badge}`}>
            {chatbotTheme} Mode
          </span>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div className={`p-3 rounded-xl border ${
                msg.role === 'user' ? currentTheme.chatUser : currentTheme.chatBot
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl flex items-center gap-2 text-slate-400 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Leo is compiling thoughts...</span>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/20 border-t border-slate-900 flex gap-2 overflow-x-auto shrink-0 scrollbar-none select-none">
          <button 
            onClick={() => handleSendMessage("Give me a quick 3-line definition of OOP")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded text-[10px] whitespace-nowrap cursor-pointer"
          >
            Explain OOP
          </button>
          <button 
            onClick={() => handleSendMessage("What are critical questions for Computer Networks viva?")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded text-[10px] whitespace-nowrap cursor-pointer"
          >
            Viva Questions
          </button>
          <button 
            onClick={() => handleSendMessage("How can I boost my semester attendance score?")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded text-[10px] whitespace-nowrap cursor-pointer"
          >
            Attendance Tips
          </button>
        </div>

        {/* Console Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="p-3 bg-slate-950/80 border-t border-slate-850 flex gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Type your academic query or speak to Leo..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700 font-mono"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              inputText.trim() ? currentTheme.primaryBtn : 'bg-slate-900 text-slate-600 border border-slate-850'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
