import React, { useState } from 'react';
import { vivaQuestions } from '../data/reportData';
import { Award, BookOpen, ChevronRight, HelpCircle, Check, X, RotateCcw, AlertCircle, Heart } from 'lucide-react';

export default function VivaVocePrep() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = vivaQuestions[currentQuestionIndex];

  const handleOptionClick = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    if (optionIdx === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentQuestionIndex + 1 < vivaQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="viva_voce_module">
      {/* Quiz Card */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 select-none">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
            BCA Examiner Viva Voce Simulator
          </h3>
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100">
            Question {currentQuestionIndex + 1} of {vivaQuestions.length}
          </span>
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            {/* Question Text */}
            <p className="text-base font-bold text-slate-800 leading-relaxed select-text">
              &ldquo;{currentQuestion.question}&rdquo;
            </p>

            {/* Options List */}
            <div className="space-y-3 select-none">
              {currentQuestion.options.map((opt, idx) => {
                let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium';
                let iconElement = null;

                if (isAnswered) {
                  if (idx === currentQuestion.correctAnswer) {
                    btnStyle = 'border-green-500 bg-green-50/50 text-green-800 font-bold';
                    iconElement = <Check className="h-4 w-4 text-green-600 shrink-0" />;
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-red-500 bg-red-50/50 text-red-800 font-bold';
                    iconElement = <X className="h-4 w-4 text-red-600 shrink-0" />;
                  } else {
                    btnStyle = 'border-slate-100 text-slate-400 bg-slate-50/20';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full flex items-center justify-between text-left p-3.5 border-2 rounded-xl text-xs transition duration-150 cursor-pointer ${btnStyle}`}
                  >
                    <span className="leading-relaxed pr-3">{opt}</span>
                    {iconElement}
                  </button>
                );
              })}
            </div>

            {/* Examiner Explanation Box */}
            {isAnswered && (
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 animate-fade-in border border-slate-800 select-text">
                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Examiner Explanation:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono font-medium">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next trigger */}
            {isAnswered && (
              <div className="flex justify-end pt-2 select-none">
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <span>{currentQuestionIndex + 1 === vivaQuestions.length ? 'Finish Session' : 'Next Question'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 space-y-6 select-none">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-2xs">
              🏆
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-slate-900">Viva-Voce Completed!</h4>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">
                Your Project Defense Readiness score is:
              </p>
              <div className="text-4xl font-extrabold text-blue-600 font-mono">
                {score} / {vivaQuestions.length}
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              {score === vivaQuestions.length
                ? "Perfect! You successfully answered every technical project query. You are ready to score an Outstanding A+ grade in your practical examination."
                : "Great practice! Review the academic documentation chapters and database schemas to address missing points before the external exam."}
            </p>

            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-5 rounded-lg inline-flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Defense Practice
            </button>
          </div>
        )}
      </div>

      {/* Preparation Guidelines Sidebar */}
      <div className="space-y-6 select-none">
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xs space-y-4">
          <h4 className="font-bold text-xs text-yellow-400 uppercase tracking-widest border-b border-slate-800 pb-2.5">
            🔑 Examiner Practical Guidelines
          </h4>

          <ul className="text-xs space-y-3 list-disc pl-4 text-slate-300 leading-relaxed font-mono">
            <li>
              <strong className="text-white font-sans">Relational Integrity:</strong> Be prepared to write queries involving <code className="bg-slate-800 text-yellow-300 px-1 rounded font-bold">INNER JOIN</code> across Students and Marks tables on the spot.
            </li>
            <li>
              <strong className="text-white font-sans">SQL Prepared Statements:</strong> Explain clearly that <code className="bg-slate-800 text-yellow-300 px-1 rounded font-bold">prepare()</code> compiles the query skeleton once, preventing injection vectors.
            </li>
            <li>
              <strong className="text-white font-sans">Normalization Standard:</strong> This Student system is normalized up to 3NF (Third Normal Form) to prevent duplicate records.
            </li>
            <li>
              <strong className="text-white font-sans">Session Management:</strong> Understand how cookies and <code className="bg-slate-800 text-yellow-300 px-1 rounded font-bold">session_start()</code> guard routes against unauthenticated requests.
            </li>
          </ul>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl text-center space-y-2">
          <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-200">
            <Heart className="h-5 w-5 fill-blue-600 text-blue-600" />
          </div>
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">A+ Academic Standards</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            This project has been engineered to perfectly adhere to top computer science college curriculum benchmarks. All diagrams are fully standardized.
          </p>
        </div>
      </div>
    </div>
  );
}
