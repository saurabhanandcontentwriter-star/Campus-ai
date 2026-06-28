import React, { useState } from 'react';
import { Subject } from '../types';
import { Sparkles, Brain, BookOpen, HelpCircle, Send, Check, X, Clipboard, ArrowRight, Loader2 } from 'lucide-react';

interface AIStudyAssistantProps {
  subjects: Subject[];
  onAwardPoints?: (points: number, reason: string) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function AIStudyAssistant({ subjects, onAwardPoints }: AIStudyAssistantProps) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'qa' | 'notes' | 'quiz'>('qa');

  // Q&A State
  const [questionText, setQuestionText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Hello! I am your AI Study Assistant. Select a subject and ask me any question, or toggle tabs to generate complete summaries or mock quizzes!" }
  ]);
  const [isQaLoading, setIsQaLoading] = useState(false);

  // Notes State
  const [notesTopic, setNotesTopic] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [isNotesLoading, setIsNotesLoading] = useState(false);

  // Quiz State
  const [quizTopic, setQuizTopic] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Subject details
  const currentSub = subjects.find(s => s.id === selectedSubject);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const userMsg = questionText;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuestionText('');
    setIsQaLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `As an academic professor of computer science, answer this question clearly and academically.
Subject: ${currentSub ? `${currentSub.code} - ${currentSub.name}` : 'General Computer Science'}
Question: ${userMsg}`,
          systemInstruction: 'You are an educational AI tutor explaining topics clearly for BCA/BSc Computer Science students. Use markdown formatting with bullet points and code blocks where relevant.'
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setChatHistory(prev => [...prev, { role: 'assistant', text: data.text }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', text: `Sorry, there was an error generating a response: ${data.error || 'Server error'}` }]);
      }
    } catch (error: any) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: `Failed to connect to the server: ${error.message || 'Network error'}` }]);
    } finally {
      setIsQaLoading(false);
    }
  };

  const handleGenerateNotes = async () => {
    if (!notesTopic.trim()) {
      alert("Please enter a topic first.");
      return;
    }

    setIsNotesLoading(true);
    setGeneratedNotes('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate comprehensive, highly structured, final-year level revision study notes and cheat-sheet. Include standard subheadings, theoretical background, key mechanisms, and where appropriate, detailed code/SQL/diagram mock representations.
Subject: ${currentSub ? `${currentSub.code} - ${currentSub.name}` : 'General CS'}
Topic: ${notesTopic}`,
          systemInstruction: 'You are a highly acclaimed senior computer science lecturer. Write professional, academic, well-spaced study notes using markdown.'
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setGeneratedNotes(data.text);
        if (onAwardPoints) {
          onAwardPoints(10, 'Generated Revision Notes');
        }
      } else {
        setGeneratedNotes(`Error generating notes: ${data.error || 'Server error'}`);
      }
    } catch (error: any) {
      setGeneratedNotes(`Connection failed: ${error.message}`);
    } finally {
      setIsNotesLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    const topic = quizTopic.trim() || 'Core concepts';
    setIsQuizLoading(true);
    setGeneratedQuiz([]);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate exactly 3 multiple-choice questions for checking a student's understanding of this academic topic.
Subject: ${currentSub ? `${currentSub.code} - ${currentSub.name}` : 'General Computer Science'}
Topic: ${topic}

You MUST return the output as a valid raw JSON array conforming exactly to this structure (do not wrap in markdown \`\`\`json blocks):
[
  {
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of why A is correct..."
  }
]`,
          systemInstruction: 'You are an automated curriculum exam test generator. Always return JSON only, with no trailing commas or additional text. CorrectAnswer must be a 0-indexed number.'
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        // Clean markdown wrap if any
        let cleanText = data.text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        cleanText = cleanText.trim();

        const parsed: QuizQuestion[] = JSON.parse(cleanText);
        setGeneratedQuiz(parsed);
      } else {
        alert(`Error generating quiz: ${data.error || 'Server error'}`);
      }
    } catch (error: any) {
      alert(`Failed to parse quiz response. Error: ${error.message}. Please try again.`);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === generatedQuiz[currentQuizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentQuizIndex + 1 < generatedQuiz.length) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Award leaderboard points on perfect score or partial score
      const pointsWon = quizScore * 10;
      if (pointsWon > 0 && onAwardPoints) {
        onAwardPoints(pointsWon, `Cleared AI Study Quiz (${quizScore}/${generatedQuiz.length})`);
      }
    }
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(generatedNotes);
    alert('Notes copied to clipboard!');
  };

  return (
    <div className="space-y-6" id="ai_study_assistant_module">
      {/* Top Config Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              CampusSphere AI Study Assistant
              <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded font-extrabold">Active</span>
            </h3>
            <p className="text-xs text-slate-500">Subject-specific academic guidance, automated notes, and MCQ quizzes.</p>
          </div>
        </div>

        {/* Subject Select */}
        <div className="min-w-[200px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Active Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex border-b border-slate-200 select-none bg-white px-3 pt-2 rounded-xl border shadow-xs">
        <button
          onClick={() => setActiveSubTab('qa')}
          className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'qa'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Ask AI Tutor
        </button>
        <button
          onClick={() => setActiveSubTab('notes')}
          className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'notes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Generate Study Notes
        </button>
        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          AI Quiz Generator
        </button>
      </div>

      {/* Content Areas */}
      {activeSubTab === 'qa' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[500px]">
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-3.5 text-xs ${
                  chat.role === 'user'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-700 font-medium border border-slate-100 whitespace-pre-line'
                }`}>
                  {chat.role === 'assistant' && (
                    <div className="font-bold text-[9px] uppercase tracking-wider text-blue-600 mb-1">AI Tutor Response:</div>
                  )}
                  {chat.text}
                </div>
              </div>
            ))}
            {isQaLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 text-slate-400 p-3.5 rounded-xl border border-slate-100 text-xs flex items-center gap-2 font-semibold">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  AI Tutor is analyzing and thinking...
                </div>
              </div>
            )}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleAskQuestion} className="p-3 border-t border-slate-100 bg-slate-50/50 flex gap-2 rounded-b-xl">
            <input
              type="text"
              placeholder={`Ask any doubt about ${currentSub ? currentSub.name : 'Computer Science'}...`}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={isQaLoading}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-blue-500 font-medium"
            />
            <button
              type="submit"
              disabled={isQaLoading || !questionText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 px-4 rounded-lg flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

      {activeSubTab === 'notes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Subject Revision Notes Summarizer</h4>
            <p className="text-xs text-slate-500">Enter any core syllabus topic below to instantly output comprehensive summaries and bullet points ready for exam revision.</p>
          </div>

          <div className="flex gap-2 max-w-xl">
            <input
              type="text"
              placeholder="e.g. Session Management, Normalization forms (1NF to 3NF), Prepared Statements..."
              value={notesTopic}
              onChange={(e) => setNotesTopic(e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-blue-500 font-semibold"
            />
            <button
              onClick={handleGenerateNotes}
              disabled={isNotesLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
            >
              {isNotesLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Notes
                </>
              )}
            </button>
          </div>

          {generatedNotes && (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <div className="bg-slate-100 p-3 px-4 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Output Syllabus Summary Report</span>
                <button
                  onClick={handleCopyNotes}
                  className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Clipboard className="h-3.5 w-3.5" />
                  Copy Notes
                </button>
              </div>
              <div className="p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line select-text max-h-[400px] overflow-y-auto font-medium">
                {generatedNotes}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'quiz' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Self-Assessment AI Quiz Generator</h4>
            <p className="text-xs text-slate-500">Test your curriculum proficiency. Enter any topic (or leave blank for core concepts) and have Gemini compile an interactive 3-question evaluation quiz.</p>
          </div>

          {generatedQuiz.length === 0 && (
            <div className="flex gap-2 max-w-xl">
              <input
                type="text"
                placeholder="Topic: e.g. SQL Injections, C Pointers, Data Structures, PHP Session arrays..."
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-blue-500 font-semibold"
              />
              <button
                onClick={handleGenerateQuiz}
                disabled={isQuizLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
              >
                {isQuizLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Create MCQ Quiz
                  </>
                )}
              </button>
            </div>
          )}

          {generatedQuiz.length > 0 && !quizFinished && (
            <div className="space-y-6 border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-blue-600 uppercase font-mono">Question {currentQuizIndex + 1} of {generatedQuiz.length}</span>
                <span className="text-xs font-bold text-emerald-600 font-mono">Score: {quizScore} / {generatedQuiz.length}</span>
              </div>

              <p className="font-bold text-sm text-slate-800 leading-relaxed">
                {generatedQuiz[currentQuizIndex].question}
              </p>

              <div className="space-y-2">
                {generatedQuiz[currentQuizIndex].options.map((opt, oIdx) => {
                  let btnStyle = "border-slate-200 hover:bg-white bg-white text-slate-700";
                  let iconElement = null;

                  if (isAnswered) {
                    if (oIdx === generatedQuiz[currentQuizIndex].correctAnswer) {
                      btnStyle = "border-green-500 bg-green-50 text-green-800 font-bold";
                      iconElement = <Check className="h-4 w-4 text-green-600 shrink-0" />;
                    } else if (oIdx === selectedOption) {
                      btnStyle = "border-red-500 bg-red-50 text-red-800 font-bold";
                      iconElement = <X className="h-4 w-4 text-red-600 shrink-0" />;
                    } else {
                      btnStyle = "border-slate-100 bg-slate-50/30 text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full flex items-center justify-between p-3 border-2 rounded-lg text-xs transition duration-150 text-left ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {iconElement}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="p-4 bg-slate-900 text-white rounded-lg text-xs space-y-1">
                  <span className="font-bold text-yellow-400 uppercase tracking-widest block font-mono text-[10px]">AI Professor Explanation:</span>
                  <p className="font-mono text-slate-300 leading-relaxed">{generatedQuiz[currentQuizIndex].explanation}</p>
                </div>
              )}

              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuizQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>{currentQuizIndex + 1 === generatedQuiz.length ? 'Finish Quiz' : 'Next Question'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {quizFinished && (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto">
              <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl border border-green-200">
                ⭐
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">Syllabus Evaluation Scorecard</h4>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Test Completed Successfully</p>
              </div>
              <div className="text-4xl font-extrabold text-blue-600 font-mono">
                {quizScore} / {generatedQuiz.length}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {quizScore === generatedQuiz.length 
                  ? `Perfect performance! You scored a perfect ${quizScore}/${generatedQuiz.length}. You have earned +${quizScore * 10} points on the leaderboard!` 
                  : `Good effort! You answered ${quizScore} questions correctly. Keep reviewing syllabus concepts and try again! Earned +${quizScore * 10} points.`}
              </p>
              <button
                onClick={() => {
                  setGeneratedQuiz([]);
                  setQuizFinished(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-5 rounded-lg transition shadow-xs cursor-pointer"
              >
                Retake Another Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
