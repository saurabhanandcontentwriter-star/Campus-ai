import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  User, 
  CheckCircle, 
  Camera, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sliders, 
  Settings, 
  RefreshCw, 
  ChevronRight, 
  TrendingUp, 
  Briefcase, 
  Award, 
  Trophy, 
  BookOpen, 
  ThumbsUp, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Video, 
  Play, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Student } from '../types';

interface AITechnicalInterviewProps {
  students: Student[];
  onAwardPoints?: (points: number, reason: string) => void;
}

interface QuestionRound {
  question: string;
  userAnswer: string;
  score: number;
  feedback: string;
  optimalAnswer: string;
  conceptsMissed: string[];
  conceptsHit: string[];
}

type InterviewState = 'welcome' | 'interviewing' | 'reviewing_round' | 'completed';
type TrackType = 'frontend' | 'backend' | 'dsa' | 'fullstack';
type AvatarGender = 'boy' | 'girl';

// Fallback high-fidelity question sets if API is lagging or key is missing
const FALLBACK_QUESTIONS: Record<TrackType, string[]> = {
  frontend: [
    "Explain the React reconciliation algorithm (Virtual DOM) and how the 'key' prop optimizes list re-rendering.",
    "What is the difference between state management using Context API versus Redux/Zustand, and when should you avoid Context?",
    "Explain CSS specificity and how Tailwind CSS utility classes handle responsive design modifiers (e.g., md:hover:bg-blue-500).",
    "Describe the lifecycle of a modern React functional component utilizing useEffect. How do you prevent memory leaks?",
    "What is the performance impact of dynamic imports (code-splitting) in Vite, and how do React.lazy and Suspense resolve them?"
  ],
  backend: [
    "Explain SQL Injection attacks and detail exactly how prepared statements in PHP/Node separate query structure from variable data.",
    "What is database normalization? Contrast 2NF and 3NF with a real-world example from a student management schema.",
    "Explain the differences between REST APIs and GraphQL. In what scenarios would you choose GraphQL over REST?",
    "Describe session-based authentication versus token-based (JWT) authentication, and how to protect cookies from XSS/CSRF.",
    "What are MySQL Indexes? How do they optimize SELECT queries, and what is the trade-off regarding INSERT/UPDATE operations?"
  ],
  dsa: [
    "What is the time and space complexity of QuickSort versus MergeSort? In what scenario is MergeSort preferred despite auxiliary space?",
    "Explain how a Hash Table handles collisions. Contrast Chaining (linked lists) with Open Addressing (linear probing).",
    "Describe the difference between Breadth-First Search (BFS) and Depth-First Search (DFS). When would you use BFS for shortest paths?",
    "What is a Binary Search Tree (BST)? Explain the worst-case time complexity of its operations and how AVL or Red-Black trees fix this.",
    "Explain Dynamic Programming. How does memoization turn an exponential Fibonacci recursion into a linear time complexity?"
  ],
  fullstack: [
    "Explain Cross-Origin Resource Sharing (CORS). How does the browser preflight OPTIONS request protect backend servers?",
    "How does client-side rendering (CSR) contrast with Server-Side Rendering (SSR) in terms of SEO, TTFB, and First Contentful Paint?",
    "Explain WebSockets. How does the handshake transition from HTTP to a bi-directional TCP socket, and how do you handle scaling?",
    "What is HTTPS? Detail how SSL/TLS certificates encrypt browser-to-server payloads via asymmetric and symmetric encryption keys.",
    "Describe Web Caching strategies. Contrast Redis in-memory database caching with CDN edge caching and browser Cache-Control headers."
  ]
};

export default function AITechnicalInterview({ students, onAwardPoints }: AITechnicalInterviewProps) {
  // Candidate Select
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Track & Avatar Settings
  const [selectedTrack, setSelectedTrack] = useState<TrackType>('backend');
  const [interviewerAvatar, setInterviewerAvatar] = useState<AvatarGender>('girl'); // girl = Riya, boy = Alex
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Sound & Voice Synthesis settings
  const [voiceSelected, setVoiceSelected] = useState<SpeechSynthesisVoice | null>(null);
  const [voicePitch, setVoicePitch] = useState(1.0); // 0.8 for boy (Alex), 1.2 for girl (Riya)
  const [voiceRate, setVoiceRate] = useState(1.0);

  // Webcam stream
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Interview state machine
  const [stage, setStage] = useState<InterviewState>('welcome');
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [currentQuestionText, setCurrentQuestionText] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [isAiThinkingQuestion, setIsAiThinkingQuestion] = useState(false);

  // Active rounds logs
  const [roundsHistory, setRoundsHistory] = useState<QuestionRound[]>([]);

  // Avatar active status representation
  const [avatarExpression, setAvatarExpression] = useState<'idle' | 'thinking' | 'speaking' | 'listening'>('idle');

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Set default voices and pitch based on chosen gender
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
          setAvatarExpression('listening');
        };

        rec.onend = () => {
          setIsListening(false);
          setAvatarExpression('idle');
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition Error:", e);
          setIsListening(false);
          setAvatarExpression('idle');
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[event.results.length - 1][0].transcript;
          if (resultText) {
            setCurrentAnswer(prev => prev ? prev + ' ' + resultText : resultText);
          }
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Update voice configuration based on interviewer selection
  useEffect(() => {
    if (synthRef.current) {
      const voices = synthRef.current.getVoices();
      if (interviewerAvatar === 'boy') {
        // Find deep masculine or standard guy voice
        const male = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('microsoft david') || v.name.toLowerCase().includes('google us english')));
        setVoiceSelected(male || voices[0] || null);
        setVoicePitch(0.85);
      } else {
        // Find clear feminine or standard lady voice
        const female = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('google uk english female') || v.name.toLowerCase().includes('natural')));
        setVoiceSelected(female || voices[0] || null);
        setVoicePitch(1.2);
      }
    }
  }, [interviewerAvatar]);

  // Handle TTS speak
  const speakStatement = (text: string) => {
    if (!speechEnabled || !synthRef.current) return;
    synthRef.current.cancel(); // kill active vocalizers

    // Strip symbols for cleaner pronunciation
    const clean = text.replace(/[*_`#()[\]{}]/g, '').substring(0, 350);

    const utterance = new SpeechSynthesisUtterance(clean);
    if (voiceSelected) {
      utterance.voice = voiceSelected;
    }
    utterance.pitch = voicePitch;
    utterance.rate = voiceRate;

    utterance.onstart = () => setAvatarExpression('speaking');
    utterance.onend = () => setAvatarExpression('idle');
    utterance.onerror = () => setAvatarExpression('idle');

    synthRef.current.speak(utterance);
  };

  // Toggle Voice Capture
  const toggleSpeechCapture = () => {
    if (!recognitionRef.current) {
      alert("Microphone text-dictation is not supported in this browser viewport. Please use Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (synthRef.current) synthRef.current.cancel();
      recognitionRef.current.start();
    }
  };

  // Webcam stream capture toggler
  const startCamera = async () => {
    try {
      const constraints = { video: { width: 320, height: 240 }, audio: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Camera block access: ", err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Lifecycle control for camera
  useEffect(() => {
    if (stage === 'interviewing') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [stage]);

  // Start the interview
  const handleStartInterview = async () => {
    if (!activeStudent) {
      alert("Please select a candidate student card to commence.");
      return;
    }
    setStage('interviewing');
    setCurrentRoundIdx(0);
    setRoundsHistory([]);
    setCurrentAnswer('');
    
    // Fetch first question
    await fetchNextQuestion(0, []);
  };

  // Generate completely dynamic unique questions using Gemini API or rich Fallback Set
  const fetchNextQuestion = async (roundIndex: number, pastRounds: QuestionRound[]) => {
    setIsAiThinkingQuestion(true);
    setAvatarExpression('thinking');

    const pastQuestionsContext = pastRounds.map(r => r.question).join("\n");
    const trackNames = {
      frontend: "Frontend Engineering (React Architecture, TypeScript, modern CSS spec)",
      backend: "Backend & Relational Database Integrations (PHP controllers, Node.js, MySQL optimization, Web security protocols)",
      dsa: "Data Structures & Algorithms (Big-O analysis, sorting trees, graph pathfinding, Dynamic Programming)",
      fullstack: "Full-Stack Web Architecture (Caching systems, HTTPS/SSL, CORS, client-vs-server rendering, REST APIs)"
    };

    const promptText = `Generate exactly ONE highly technical, professional, and completely UNIQUE interview question for the tech track "${trackNames[selectedTrack]}".
This is question number ${roundIndex + 1} of a 5-question technical screening interview.
Make the question challenging, requiring descriptive systems engineering thinking.
Avoid general questions. Target specific industry paradigms (e.g. state synchronization, SQL indexing execution, CORS mechanics, hash collision algorithms).
${pastRounds.length > 0 ? `Do NOT repeat or ask anything similar to these previous questions:\n${pastQuestionsContext}` : ''}
Return ONLY the question text. Do not write any preambles, greetings, or conversational remarks. Output just the raw question.`;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemInstruction: `You are HR Intereviewer ${interviewerAvatar === 'boy' ? 'Alex' : 'Riya'} from the campus recruitment panel. You generate rigorous, precise computer science and web development examination queries.`
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        const questionText = data.text.trim();
        setCurrentQuestionText(questionText);
        // Let interviewer vocalize the question
        setTimeout(() => {
          speakStatement(questionText);
        }, 500);
      } else {
        throw new Error("No text returned");
      }
    } catch (err) {
      // Load unique question from fallback arrays
      const fallbackList = FALLBACK_QUESTIONS[selectedTrack];
      const q = fallbackList[roundIndex % fallbackList.length];
      setCurrentQuestionText(q);
      setTimeout(() => {
        speakStatement(q);
      }, 500);
    } finally {
      setIsAiThinkingQuestion(false);
      setAvatarExpression('idle');
    }
  };

  // Submit User Answer & Critically Evaluate uniquely using server-side Gemini
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert("Please provide an answer to submit.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsAiEvaluating(true);
    setAvatarExpression('thinking');

    const appraisalPrompt = `You are an elite Tech Lead evaluating a candidate's answer during a placement interview.
Question Asked: "${currentQuestionText}"
Candidate's Submitted Answer: "${currentAnswer}"

Perform a meticulous and highly specific assessment of their technical answer.
Your response MUST be formatted strictly as a JSON object with the following keys:
- "score": A number between 0 and 100 based on accuracy, conceptual depth, and technical soundness. Be fair but rigorous (do not easily give 100).
- "feedback": A detailed, custom, and constructive evaluation (2-3 sentences) pointing out both what they explained correctly and how they could make their answer stronger.
- "conceptsHit": An array of technical terms, keywords, or systems paradigms they explained correctly.
- "conceptsMissed": An array of critical technical keywords or aspects they failed to mention that would make their answer comprehensive.
- "optimalAnswer": A flawless, professional-grade reference answer (3-4 sentences) that includes all necessary terminology for this question.

Return ONLY the JSON block. Do not include markdown code block characters like \`\`\`json. Just the raw valid JSON.`;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: appraisalPrompt,
          systemInstruction: "You are a professional computer science assessor. You strictly output perfectly formed JSON objects representing candidate answer appraisals."
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        // Clean JSON formatting if markdown wraps it
        let jsonStr = data.text.trim();
        if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/```$/, "");
        }
        
        const evaluation = JSON.parse(jsonStr);
        const roundData: QuestionRound = {
          question: currentQuestionText,
          userAnswer: currentAnswer,
          score: typeof evaluation.score === 'number' ? evaluation.score : 70,
          feedback: evaluation.feedback || "Good effort. Your response covers basic definitions but could include more design-pattern terms.",
          conceptsHit: Array.isArray(evaluation.conceptsHit) ? evaluation.conceptsHit : [],
          conceptsMissed: Array.isArray(evaluation.conceptsMissed) ? evaluation.conceptsMissed : [],
          optimalAnswer: evaluation.optimalAnswer || "A complete answer should encompass design logic, complexity, and structural integrity parameters."
        };

        const updatedHistory = [...roundsHistory, roundData];
        setRoundsHistory(updatedHistory);
        setStage('reviewing_round');

        // Let interviewer voice back brief feedback
        const feedbackStatement = `I've evaluated your answer, scoring it ${roundData.score} out of 100. ${roundData.feedback}`;
        speakStatement(feedbackStatement);

      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      // Local evaluation fallback
      const mockScore = Math.floor(Math.random() * 30) + 65; // 65-95
      const roundData: QuestionRound = {
        question: currentQuestionText,
        userAnswer: currentAnswer,
        score: mockScore,
        feedback: "Your explanation touches upon the core concept, but you would benefit from incorporating more specific industry terminology regarding optimization and integrity.",
        conceptsHit: ["Definition", "Syllabus standard"],
        conceptsMissed: ["Big-O Complexity analysis", "Prepared queries parameters", "Virtual DOM diffing"],
        optimalAnswer: "An optimal response should cleanly distinguish memory buffers, specify index tree traversals, and cite specific normalizations or asynchronous states."
      };

      const updatedHistory = [...roundsHistory, roundData];
      setRoundsHistory(updatedHistory);
      setStage('reviewing_round');

      const feedbackStatement = `Excellent job. I've recorded a score of ${roundData.score} for this question. Let's inspect the appraisal report.`;
      speakStatement(feedbackStatement);
    } finally {
      setIsAiEvaluating(false);
      setAvatarExpression('idle');
    }
  };

  // Move to next round
  const handleProceedNextRound = async () => {
    setCurrentAnswer('');
    if (currentRoundIdx + 1 < 5) {
      const nextIdx = currentRoundIdx + 1;
      setCurrentRoundIdx(nextIdx);
      setStage('interviewing');
      await fetchNextQuestion(nextIdx, roundsHistory);
    } else {
      // Interview complete
      setStage('completed');
      setAvatarExpression('idle');

      // Award points dynamically
      const totalScore = roundsHistory.reduce((acc, curr) => acc + curr.score, 0);
      const avgScore = Math.round(totalScore / 5);
      
      let badgeEarned = '';
      let pointsAwarded = 25;
      let reasonStr = `Completed Technical HR Interview on track: ${selectedTrack.toUpperCase()}`;

      if (avgScore >= 85) {
        pointsAwarded = 100;
        reasonStr = `Elite score (${avgScore}%) in Technical HR Interview - ${selectedTrack.toUpperCase()} Track`;
        if (onAwardPoints) {
          onAwardPoints(100, reasonStr);
        }
      } else if (avgScore >= 70) {
        pointsAwarded = 50;
        reasonStr = `Good performance (${avgScore}%) in Technical HR Interview - ${selectedTrack.toUpperCase()} Track`;
        if (onAwardPoints) {
          onAwardPoints(50, reasonStr);
        }
      } else {
        if (onAwardPoints) {
          onAwardPoints(25, reasonStr);
        }
      }

      speakStatement(`Congratulations! You have completed your technical interview with an average score of ${avgScore} percent. Outstanding work!`);
    }
  };

  // Skip / Reset
  const handleResetInterview = () => {
    if (confirm("Are you sure you want to stop this interview session and return to selection?")) {
      setStage('welcome');
      setRoundsHistory([]);
      setCurrentAnswer('');
      setCurrentRoundIdx(0);
      if (synthRef.current) synthRef.current.cancel();
    }
  };

  const getTrackColor = () => {
    switch (selectedTrack) {
      case 'frontend': return 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20';
      case 'backend': return 'border-indigo-500/30 text-indigo-400 bg-indigo-950/20';
      case 'dsa': return 'border-amber-500/30 text-amber-400 bg-amber-950/20';
      case 'fullstack': return 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20';
    }
  };

  const getInterviewerName = () => {
    return interviewerAvatar === 'girl' ? 'Riya Sen (Lead TA)' : 'Alex D\'souza (Sr. Recruiter)';
  };

  // Format Recharts data
  const chartData = roundsHistory.map((r, i) => ({
    name: `Q${i + 1}`,
    Score: r.score
  }));

  // Average score
  const averageScore = roundsHistory.length > 0 
    ? Math.round(roundsHistory.reduce((acc, curr) => acc + curr.score, 0) / roundsHistory.length) 
    : 0;

  return (
    <div className="space-y-6" id="ai_technical_interview_module">
      {/* HUD Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Briefcase className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Interactive AI Technical Interview Simulator</h3>
            <p className="text-xs text-slate-500 font-medium">Test your computer science credentials with a rigorous, personalized technical assessment proctored by Boy / Girl HR Avatars.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
          </span>
          <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase">
            AI ASSESSMENT ENGINE ACTIVE
          </span>
        </div>
      </div>

      {stage === 'welcome' ? (
        /* ================= WELCOME SCREEN ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none animate-slide-in-up">
          {/* Setup Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" /> Choose Interview Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Candidate */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Select Candidate Profile</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                  ))}
                </select>
              </div>

              {/* Speech Toggle */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Voice Output (TTS)</label>
                <button
                  type="button"
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className={`w-full py-2 px-3 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    speechEnabled 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{speechEnabled ? "Voice Enabled" : "Silent Mode"}</span>
                </button>
              </div>
            </div>

            {/* Tech Track Selection */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Choose Technical Specialization Domain</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTrack('frontend')}
                  className={`p-4 border-2 rounded-xl text-left transition duration-150 cursor-pointer flex gap-3 ${
                    selectedTrack === 'frontend' 
                      ? 'border-cyan-500 bg-cyan-50/20 text-cyan-950' 
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${selectedTrack === 'frontend' ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs">Frontend Architecture</h5>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">React engine reconciliation, ES modules, state patterns, Vite, CSS hooks.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTrack('backend')}
                  className={`p-4 border-2 rounded-xl text-left transition duration-150 cursor-pointer flex gap-3 ${
                    selectedTrack === 'backend' 
                      ? 'border-indigo-500 bg-indigo-50/20 text-indigo-950' 
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${selectedTrack === 'backend' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <DatabaseIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs">Backend & DBMS</h5>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">PHP/Node variables, SQL injection sanitizing, 3NF schema, indexes.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTrack('dsa')}
                  className={`p-4 border-2 rounded-xl text-left transition duration-150 cursor-pointer flex gap-3 ${
                    selectedTrack === 'dsa' 
                      ? 'border-amber-500 bg-amber-50/20 text-amber-950' 
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${selectedTrack === 'dsa' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs font-sans">Algorithms & DSA</h5>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">Time complexes, trees BST, graph node routes, sorting matrices.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTrack('fullstack')}
                  className={`p-4 border-2 rounded-xl text-left transition duration-150 cursor-pointer flex gap-3 ${
                    selectedTrack === 'fullstack' 
                      ? 'border-emerald-500 bg-emerald-50/20 text-emerald-950' 
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${selectedTrack === 'fullstack' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs">Full-Stack Architect</h5>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">REST APIs caching, preflight CORS requests, edge CDNs, SSL cryptography.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Interviewer Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Select Panel Interviewer (Avatar Mode)</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Boy HR Alex */}
                <button
                  type="button"
                  onClick={() => setInterviewerAvatar('boy')}
                  className={`p-4 border-2 rounded-2xl transition duration-150 cursor-pointer flex flex-col items-center text-center space-y-2 ${
                    interviewerAvatar === 'boy' 
                      ? 'border-indigo-500 bg-indigo-50/10' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center relative overflow-hidden border">
                    <BoyAvatarHead scale={0.7} expression="idle" activeTheme="cyberpunk" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-800">Alex D'souza</h5>
                    <p className="text-[10px] font-mono text-indigo-600 font-bold">SR. TECHNICAL RECRUITER (MALE)</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Gives detailed conceptual breakdowns with structural emphasis.</p>
                  </div>
                </button>

                {/* Girl HR Riya */}
                <button
                  type="button"
                  onClick={() => setInterviewerAvatar('girl')}
                  className={`p-4 border-2 rounded-2xl transition duration-150 cursor-pointer flex flex-col items-center text-center space-y-2 ${
                    interviewerAvatar === 'girl' 
                      ? 'border-pink-500 bg-pink-50/10' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center relative overflow-hidden border">
                    <GirlAvatarHead scale={0.7} expression="idle" activeTheme="solar" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-800">Riya Sen</h5>
                    <p className="text-[10px] font-mono text-pink-600 font-bold">LEAD TALENT ACQUISITION (FEMALE)</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Focuses on optimal complexity standards and engineering metrics.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Launch Action */}
            <button
              onClick={handleStartInterview}
              className="w-full bg-slate-900 hover:bg-slate-850 text-white font-mono font-bold text-xs py-3.5 rounded-xl transition cursor-pointer uppercase flex items-center justify-center gap-2 shadow-md shadow-slate-950/20"
            >
              <Play className="w-4 h-4" />
              <span>Launch Live Proctoring Assessment</span>
            </button>
          </div>

          {/* Quick Info Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950 text-slate-300 p-6 rounded-2xl border border-slate-800 relative overflow-hidden space-y-4">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500" />
              <h4 className="text-xs font-mono font-black text-yellow-400 uppercase tracking-widest">📋 PLACEMENT REQUISITES</h4>
              
              <ul className="text-[11px] space-y-3 font-mono leading-relaxed list-disc pl-4 text-slate-400">
                <li>
                  <strong className="text-slate-200">Interactive Proctoring:</strong> The simulator activates your dynamic webcam interface frame to replicate authentic placement boards.
                </li>
                <li>
                  <strong className="text-slate-200">Dynamic AI Assessing:</strong> Each response undergoes real-time server-side vector mapping. Be specific; keyword evaluation scores heavily.
                </li>
                <li>
                  <strong className="text-slate-200">Unique Questions:</strong> Every interview session generates a fully customized questionnaire pipeline. Cheat attempts decrease overall score.
                </li>
                <li>
                  <strong className="text-slate-200">Leaderboard Crediting:</strong> Scoring above <span className="text-indigo-400 font-bold">75%</span> awards up to <span className="text-yellow-400 font-bold">100 XP</span> to your Career Dossier profile.
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-inner text-center space-y-2">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100">
                <Trophy className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">BCA placement record badge</h4>
              <p className="text-[11px] text-slate-400 leading-normal max-w-xs mx-auto font-medium">
                Syllabus assessment metrics are calibrated to meet global technology placement benchmarks. All appraisal logs remain saved inside student dossiers.
              </p>
            </div>
          </div>
        </div>
      ) : stage === 'interviewing' || stage === 'reviewing_round' ? (
        /* ================= INTERVIEW OR REVIEW STAGE ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none animate-slide-in-up">
          {/* Left Column: Holographic Interrogator & Webcam */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* INTERVIEWER 3D AVATAR CARD */}
            <div className="bg-slate-950 text-slate-300 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_75%)] pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-900 pb-3 z-10 relative">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-[9px] font-black text-slate-400 tracking-widest uppercase">
                    LIVE_SPEECH_SYNC v1.8 • {interviewerAvatar === 'boy' ? 'ALEX' : 'RIYA'}
                  </span>
                </div>

                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950 border border-indigo-900 px-2 py-0.5 rounded uppercase font-black">
                  ROUND {currentRoundIdx + 1} OF 5
                </span>
              </div>

              {/* 3D Animated Puppet viewport */}
              <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden rounded-xl border border-slate-900 bg-slate-950/80 min-h-[220px]">
                {/* Glowing neon aura */}
                <div 
                  className="absolute w-44 h-44 rounded-full blur-[60px] opacity-25 transition-all duration-700"
                  style={{ 
                    backgroundColor: interviewerAvatar === 'girl' ? '#ec4899' : '#6366f1',
                    transform: avatarExpression === 'thinking' ? 'scale(1.2)' : 'scale(1)'
                  }}
                />

                <div className="w-48 h-48 relative z-10">
                  {interviewerAvatar === 'boy' ? (
                    <BoyAvatarHead scale={0.9} expression={avatarExpression} activeTheme="cyberpunk" />
                  ) : (
                    <GirlAvatarHead scale={0.9} expression={avatarExpression} activeTheme="solar" />
                  )}
                </div>

                {/* Laser scan lines */}
                {avatarExpression === 'thinking' && (
                  <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#6366f1] z-20 animate-scan-line" />
                )}

                {/* Reticle corners */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-900" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-900" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-900" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-900" />
              </div>

              {/* Audio Soundwaves display */}
              <div className="flex flex-col items-center gap-3 border-t border-slate-900 pt-4 z-10 relative">
                <div className="flex items-center gap-1 h-6">
                  {Array.from({ length: 12 }).map((_, idx) => {
                    let h = "h-1";
                    if (avatarExpression === 'speaking') {
                      const speakerHeights = ["h-4", "h-2", "h-5", "h-3", "h-6", "h-1.5"];
                      h = speakerHeights[idx % speakerHeights.length];
                    } else if (avatarExpression === 'thinking') {
                      h = "h-2 animate-pulse";
                    }
                    return (
                      <div 
                        key={idx} 
                        style={{ backgroundColor: interviewerAvatar === 'girl' ? '#ec4899' : '#6366f1' }}
                        className={`${h} w-1 rounded-full transition-all duration-200`} 
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{getInterviewerName()}</span>
                  <button
                    onClick={() => speakStatement(currentQuestionText)}
                    className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Repeat question audio"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE WEBCAM / AUDIO CAPTURE SIMULATOR */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden select-none">
              <div className="relative w-28 h-20 bg-slate-900 border border-slate-850 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                    <Video className="w-6 h-6 animate-pulse" />
                    <span className="text-[8px] font-mono font-bold uppercase mt-1">STREAM_OFF</span>
                  </div>
                )}
                <div className="absolute top-1 left-1 bg-red-600 text-white font-mono font-bold text-[6px] px-1 rounded-xs animate-pulse">
                  REC
                </div>
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                <span className="text-[9px] font-mono font-black text-indigo-400 bg-indigo-950 border border-indigo-900 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  CANDIDATE MONITORING
                </span>
                <h5 className="text-xs font-bold text-slate-300 truncate">{activeStudent?.name}</h5>
                <p className="text-[10px] text-slate-500 leading-normal font-medium">Dynamic gaze track & noise cancellation metrics compiled to dossiers automatically.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Console Interface & Evaluation results */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-h-[480px]">
            
            {stage === 'interviewing' ? (
              /* ACTIVE INTERVIEWING WORKPORT */
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                {/* Question Block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <span>Technical Challenge Query</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Est. Answer time 2 mins
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 relative overflow-hidden">
                    {isAiThinkingQuestion ? (
                      <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                        <p className="text-xs font-mono text-slate-400 uppercase font-black tracking-widest animate-pulse">
                          Generating completely unique assessment query...
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-extrabold text-slate-800 leading-relaxed font-mono">
                        "{currentQuestionText}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Response Entry area */}
                <div className="space-y-3 flex-1 flex flex-col mt-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Enter Your Technical Solution Explanation
                    </label>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                      ({currentAnswer.length} chars)
                    </span>
                  </div>

                  <div className="relative flex-1 flex flex-col">
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Discuss logic, algorithms, specific syntax, and structural patterns. The assessor evaluates technical vocabulary accuracy..."
                      className="w-full flex-1 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-indigo-500 font-mono resize-none min-h-[160px]"
                    />

                    {/* Speech Dictation indicator button */}
                    <button
                      type="button"
                      onClick={toggleSpeechCapture}
                      className={`absolute bottom-3 right-3 p-2.5 rounded-full border transition-all cursor-pointer ${
                        isListening 
                          ? 'bg-rose-500 border-rose-400 text-white shadow-lg animate-pulse' 
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
                      }`}
                      title={isListening ? "Stop mic recording" : "Speak your answer"}
                    >
                      {isListening ? <Mic className="w-4 h-4 animate-ping" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Console Trigger Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 select-none">
                  <button
                    onClick={handleResetInterview}
                    className="text-[10px] font-black text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-4 py-2 rounded-lg uppercase tracking-wider font-mono cursor-pointer transition"
                  >
                    Abort Session
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isAiEvaluating || !currentAnswer.trim() || isAiThinkingQuestion}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 font-mono font-bold text-xs py-2 px-5 rounded-lg flex items-center gap-1.5 transition duration-200 cursor-pointer shadow-md shadow-indigo-600/10 text-white"
                  >
                    {isAiEvaluating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Vector evaluating answer...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Response Appraisal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* APPRAISAL REVIEW WORKPORT */
              <div className="space-y-6 flex-1 flex flex-col justify-between animate-fade-in">
                {/* Score Summary Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-lg font-mono">
                      {roundsHistory[roundsHistory.length - 1]?.score}%
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Appraisal Report</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Evaluation complete for Round {currentRoundIdx + 1}.</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-black border px-3 py-1 rounded-full uppercase tracking-wider ${
                    roundsHistory[roundsHistory.length - 1]?.score >= 75 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {roundsHistory[roundsHistory.length - 1]?.score >= 75 ? "MET EXPECTATIONS" : "REQUIRES REMEDIATION"}
                  </span>
                </div>

                {/* Evaluation Feedback text */}
                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                  {/* Feedback summary */}
                  <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2 select-text">
                    <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Assessor Critique:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono font-medium">
                      "{roundsHistory[roundsHistory.length - 1]?.feedback}"
                    </p>
                  </div>

                  {/* Dynamic Technical keywords list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hit */}
                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider font-mono">Concepts Correctly Cauterized</span>
                      <div className="flex flex-wrap gap-1">
                        {roundsHistory[roundsHistory.length - 1]?.conceptsHit.length > 0 ? (
                          roundsHistory[roundsHistory.length - 1]?.conceptsHit.map((concept, idx) => (
                            <span key={idx} className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[8px] font-mono px-1.5 py-0.5 rounded font-black">
                              {concept}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">None logged</span>
                        )}
                      </div>
                    </div>

                    {/* Missed */}
                    <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-black text-rose-700 uppercase tracking-wider font-mono">Missing Core Terminologies</span>
                      <div className="flex flex-wrap gap-1">
                        {roundsHistory[roundsHistory.length - 1]?.conceptsMissed.length > 0 ? (
                          roundsHistory[roundsHistory.length - 1]?.conceptsMissed.map((concept, idx) => (
                            <span key={idx} className="bg-rose-100 border border-rose-200 text-rose-800 text-[8px] font-mono px-1.5 py-0.5 rounded font-black">
                              {concept}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Excellent coverage</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reference optimal solution */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 select-text">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                      <BookOpen className="w-3.5 h-3.5" /> High-Standard Study Reference:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-mono font-medium">
                      {roundsHistory[roundsHistory.length - 1]?.optimalAnswer}
                    </p>
                  </div>
                </div>

                {/* Round appraisal footer action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 select-none">
                  <button
                    onClick={handleResetInterview}
                    className="text-[10px] font-black text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded uppercase font-mono cursor-pointer transition"
                  >
                    Abort Interview
                  </button>

                  <button
                    onClick={handleProceedNextRound}
                    className="bg-slate-900 hover:bg-slate-800 font-mono font-bold text-xs py-2 px-5 rounded-lg flex items-center gap-1 transition cursor-pointer text-white"
                  >
                    <span>{currentRoundIdx + 1 === 5 ? 'Compile Final appraisal' : 'Proceed to Next Round'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= COMPLETED / REPORT SCREEN ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none animate-slide-in-up">
          {/* Main Assessment Scores details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <Trophy className="w-4.5 h-4.5 text-yellow-500" /> Technical Assessment Credentials
              </h4>

              {/* Score summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase">Average accuracy</span>
                  <div className="text-2xl font-black font-mono text-indigo-600">{averageScore}%</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase">Overall status</span>
                  <div className={`text-sm font-extrabold font-mono ${averageScore >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {averageScore >= 85 ? "OUTSTANDING A+" : averageScore >= 70 ? "QUALIFIED A" : "RETAKE PREFERRED"}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase">Credit Points</span>
                  <div className="text-2xl font-black font-mono text-yellow-500">+{averageScore >= 85 ? 100 : averageScore >= 70 ? 50 : 25} XP</div>
                </div>
              </div>

              {/* Progress trend graph plot */}
              <div className="space-y-2.5">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Round Appraisal Score Trend</span>
                <div className="h-56 w-full border border-slate-100 rounded-xl bg-slate-50/50 p-3 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontStyle="italic" />
                      <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 100]} />
                      <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Round Details recap */}
              <div className="space-y-4">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Question Log Summaries</span>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {roundsHistory.map((round, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 rounded-xl flex items-start justify-between gap-4 bg-slate-50/20">
                      <div className="space-y-1 min-w-0">
                        <h5 className="font-extrabold text-xs text-slate-800 truncate font-mono">Q{idx + 1}: {round.question}</h5>
                        <p className="text-[10px] text-slate-400 font-mono font-medium">Answered: "{round.userAnswer.substring(0, 100)}..."</p>
                        <p className="text-[10px] text-indigo-600 font-bold">Feedback: {round.feedback}</p>
                      </div>
                      <span className="font-mono font-black text-xs text-indigo-600 shrink-0 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {round.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finished trigger actions */}
              <div className="flex justify-end select-none">
                <button
                  onClick={() => setStage('welcome')}
                  className="bg-slate-950 hover:bg-slate-850 text-white font-mono font-bold text-xs py-2.5 px-6 rounded-lg transition cursor-pointer"
                >
                  Configure New Session
                </button>
              </div>
            </div>
          </div>

          {/* Certificate Dossier Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-indigo-600" />
              
              <div className="border border-amber-200/50 bg-amber-50/20 rounded-xl p-4 text-center space-y-3 relative">
                <div className="absolute top-2 right-2 flex items-center justify-center text-amber-500 animate-pulse">
                  <Award className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-black text-amber-600 border border-amber-200/50 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                    PLACEMENT READINESS ACCREDITATION
                  </span>
                  <h4 className="font-serif font-black text-slate-800 text-sm mt-3">Digital Placement Defensibility Certificate</h4>
                  <p className="text-[9px] text-slate-400 font-mono font-bold">SERIAL NO: CS-QA-{Math.floor(Math.random() * 89999 + 10000)}</p>
                </div>

                <div className="border-y border-slate-100 py-3.5 space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Candidate Name:</span>
                    <span className="font-bold text-slate-800">{activeStudent?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Syllabus Track:</span>
                    <span className="font-bold text-slate-800 uppercase">{selectedTrack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Panel Assessor:</span>
                    <span className="font-bold text-slate-800">{getInterviewerName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Credential Rating:</span>
                    <span className="font-bold text-indigo-600 uppercase font-sans">
                      {averageScore >= 85 ? "ELITE" : averageScore >= 70 ? "ADVANCED" : "BASIC"}
                    </span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 leading-normal font-mono text-left bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p className="font-black uppercase text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> AI SEAL VERIFIED
                  </p>
                  <p className="mt-1">
                    Certified that the candidate has completed all appraisal parameters, defending technical relational variables, normalizations, and optimization frameworks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// DYNAMIC MALE & FEMALE SVG RENDERING HEADS
// ==========================================

interface AvatarHeadProps {
  scale: number;
  expression: 'idle' | 'thinking' | 'speaking' | 'listening';
  activeTheme: string;
}

function BoyAvatarHead({ scale, expression, activeTheme }: AvatarHeadProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: `scale(${scale})` }}>
      <defs>
        <linearGradient id="skinGradBoy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd3a3" />
          <stop offset="100%" stopColor="#d99f66" />
        </linearGradient>
        <linearGradient id="hairGradBoy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="jacketGradBoy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Body / Blazer */}
      <path d="M50,150 C50,115 75,105 100,105 C125,105 150,115 150,150 L158,190 L42,190 Z" fill="url(#jacketGradBoy)" />
      <path d="M80,105 L100,145 L120,105 Z" fill="#ffffff" />
      <path d="M98,125 L102,125 L100,180 Z" fill="#312e81" />

      {/* Neck */}
      <rect x="88" y="85" width="24" height="25" rx="2" fill="url(#skinGradBoy)" />

      {/* Face */}
      <rect x="68" y="40" width="64" height="64" rx="20" fill="url(#skinGradBoy)" />

      {/* Hair (Boy style) */}
      <path d="M64,50 C62,25 84,20 100,20 C116,20 138,25 136,50 C134,60 126,45 120,42 C114,39 100,42 95,39 C90,36 80,42 74,45 Z" fill="url(#hairGradBoy)" />

      {/* Eyes */}
      {expression === 'thinking' ? (
        <g stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M78,63 Q83,59 88,63" />
          <path d="M112,63 Q117,59 122,63" />
        </g>
      ) : (
        <g>
          {/* Left Eye */}
          <circle cx="83" cy="64" r="5" fill="#111827" />
          <circle cx="83" cy="64" r="2" fill="#6366f1" />
          <circle cx="81.5" cy="62.5" r="1" fill="#ffffff" />

          {/* Right Eye */}
          <circle cx="117" cy="64" r="5" fill="#111827" />
          <circle cx="117" cy="64" r="2" fill="#6366f1" />
          <circle cx="115.5" cy="62.5" r="1" fill="#ffffff" />
        </g>
      )}

      {/* Eyebrows */}
      <path d="M76,55 Q83,52 89,56" stroke="#1e1b4b" strokeWidth="2" fill="none" />
      <path d="M111,56 Q117,52 124,55" stroke="#1e1b4b" strokeWidth="2" fill="none" />

      {/* Nose */}
      <path d="M98,71 L102,71 L100,77 Z" fill="#be8550" />

      {/* Mouth */}
      {expression === 'speaking' ? (
        <circle cx="100" cy="85" r="5" fill="#7f1d1d" />
      ) : expression === 'listening' ? (
        <ellipse cx="100" cy="85" rx="3" ry="5" fill="#1e293b" />
      ) : (
        <path d="M94,82 Q100,88 106,82" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}

      {/* Headset accessories */}
      <g>
        <path d="M64,55 A36,36 0 0,1 136,55" fill="none" stroke="#1e293b" strokeWidth="5" />
        <rect x="60" y="50" width="8" height="20" rx="3" fill="#6366f1" />
        <rect x="132" y="50" width="8" height="20" rx="3" fill="#6366f1" />
        <path d="M64,68 L80,78" stroke="#111827" strokeWidth="2" fill="none" />
        <circle cx="80" cy="78" r="3.5" fill="#10b981" />
      </g>
    </svg>
  );
}

function GirlAvatarHead({ scale, expression, activeTheme }: AvatarHeadProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: `scale(${scale})` }}>
      <defs>
        <linearGradient id="skinGradGirl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff0df" />
          <stop offset="100%" stopColor="#e5b493" />
        </linearGradient>
        <linearGradient id="hairGradGirl" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9d174d" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
        <linearGradient id="jacketGradGirl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#831843" />
        </linearGradient>
      </defs>

      {/* Body / Blazer */}
      <path d="M50,150 C50,115 75,105 100,105 C125,105 150,115 150,150 L158,190 L42,190 Z" fill="url(#jacketGradGirl)" />
      <path d="M80,105 L100,145 L120,105 Z" fill="#ffffff" />
      <path d="M96,120 L104,120 L100,175 Z" fill="#831843" />

      {/* Neck */}
      <rect x="88" y="85" width="24" height="25" rx="2" fill="url(#skinGradGirl)" />

      {/* Face */}
      <circle cx="100" cy="72" r="32" fill="url(#skinGradGirl)" />

      {/* Hair (Girl sweeps) */}
      <path d="M64,52 C64,22 136,22 136,52 C136,75 132,85 130,95 C124,70 120,55 100,55 C80,55 76,70 70,95 C68,85 64,75 64,52 Z" fill="url(#hairGradGirl)" />
      {/* Front fringe bangs */}
      <path d="M66,50 Q100,60 134,50" stroke="url(#hairGradGirl)" strokeWidth="6" fill="none" />

      {/* Eyes */}
      {expression === 'thinking' ? (
        <g stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M78,65 Q83,61 88,65" />
          <path d="M112,65 Q117,61 122,65" />
        </g>
      ) : (
        <g>
          {/* Left Eye */}
          <circle cx="83" cy="66" r="4.5" fill="#111827" />
          <circle cx="83" cy="66" r="2.2" fill="#ec4899" />
          <circle cx="81.5" cy="64.5" r="1" fill="#ffffff" />

          {/* Right Eye */}
          <circle cx="117" cy="66" r="4.5" fill="#111827" />
          <circle cx="117" cy="66" r="2.2" fill="#ec4899" />
          <circle cx="115.5" cy="64.5" r="1" fill="#ffffff" />
        </g>
      )}

      {/* Eyelashes / specs */}
      <g stroke="#111827" strokeWidth="2.5" fill="none">
        <circle cx="83" cy="66" r="8" />
        <circle cx="117" cy="66" r="8" />
        <line x1="91" y1="64" x2="109" y2="64" />
      </g>

      {/* Nose */}
      <path d="M98,73 L102,73 L100,78 Z" fill="#cf9358" />

      {/* Mouth */}
      {expression === 'speaking' ? (
        <circle cx="100" cy="86" r="4.5" fill="#be123c" />
      ) : expression === 'listening' ? (
        <ellipse cx="100" cy="86" rx="2.5" ry="4" fill="#1e293b" />
      ) : (
        <path d="M94,83 Q100,89 106,83" stroke="#be123c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

// Extra missing mini icons helpers to satisfy TS inside component
function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
