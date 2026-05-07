import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ArrowRight, ArrowLeft, Check, X, RefreshCw, PlayCircle, BookOpen, VolumeX, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

const LESSON_ITEMS = [
  {
    id: 1,
    phrase: "Put away your book, please.",
    emoji: "📚 ➡️ 🎒",
    color: "bg-pink-100 border-pink-400 text-pink-900",
    btnColor: "bg-pink-500 hover:bg-pink-600",
    shadow: "shadow-pink-200"
  },
  {
    id: 2,
    phrase: "Take out your ruler, please.",
    emoji: "📏 ⬅️ 👝",
    color: "bg-blue-100 border-blue-400 text-blue-900",
    btnColor: "bg-blue-500 hover:bg-blue-600",
    shadow: "shadow-blue-200"
  },
  {
    id: 3,
    phrase: "Pass me a pencil, please.",
    emoji: "✏️ ➡️ 🤲",
    color: "bg-purple-100 border-purple-400 text-purple-900",
    btnColor: "bg-purple-500 hover:bg-purple-600",
    shadow: "shadow-purple-200"
  },
  {
    id: 4,
    phrase: "Open your bag, please.",
    emoji: "🎒 👐",
    color: "bg-green-100 border-green-400 text-green-900",
    btnColor: "bg-green-500 hover:bg-green-600",
    shadow: "shadow-green-200"
  }
];

const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Speak a bit slower for learning
    window.speechSynthesis.speak(utterance);
  }
};

type ViewMode = 'home' | 'learn' | 'quiz';

export default function App() {
  const [view, setView] = useState<ViewMode>('home');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold font-comic flex items-center gap-2 text-indigo-600 cursor-pointer" onClick={() => setView('home')}>
          <BookOpen className="w-6 h-6" />
          Classroom Tutor
        </h1>
        {view !== 'home' && (
          <button 
            onClick={() => setView('home')}
            className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </button>
        )}
      </header>
      
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {view === 'home' && <HomeView key="home" onStart={setView} />}
          {view === 'learn' && <LearnView key="learn" onComplete={() => setView('quiz')} />}
          {view === 'quiz' && <QuizView key="quiz" onFinish={() => setView('home')} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function HomeView({ onStart }: { onStart: (view: ViewMode) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-12 sm:py-20 text-center"
    >
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-lg">
          <BookOpen className="w-12 h-12" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Learn Classroom Commands
        </h2>
        <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10">
          Master basic English classroom phrases with interactive flashcards and a fun quiz!
        </p>

        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <button
            onClick={() => onStart('learn')}
            className="group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 p-8 transition-all hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 text-left"
          >
            <div className="bg-indigo-50 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Learn Mode</h3>
            <p className="text-slate-500 font-medium">Study the phrases with audio and pictures.</p>
          </button>

          <button
            onClick={() => onStart('quiz')}
            className="group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 p-8 transition-all hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 text-left"
          >
            <div className="bg-amber-50 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Check className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Quiz Mode</h3>
            <p className="text-slate-500 font-medium">Test what you've learned in a fun mini-game.</p>
          </button>
        </div>
    </motion.div>
  );
}

function LearnView({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = LESSON_ITEMS[currentIndex];

  useEffect(() => {
    // Speak automatically when card appears
    speak(currentItem.phrase);
  }, [currentIndex]);

  const goToNext = () => {
    if (currentIndex < LESSON_ITEMS.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      onComplete();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto flex flex-col pt-6 sm:pt-12"
    >
      <div className="mb-8 flex justify-between items-center px-2">
        <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          Flashcard {currentIndex + 1} of {LESSON_ITEMS.length}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {LESSON_ITEMS.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-500' : idx < currentIndex ? 'w-2.5 bg-indigo-300' : 'w-2.5 bg-slate-200'}`} 
             />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={`relative rounded-3xl border-4 ${currentItem.color.split(' ')[1]} p-8 sm:p-12 text-center shadow-xl ${currentItem.shadow} bg-white flex flex-col items-center justify-center min-h-[400px] sm:min-h-[450px]`}
        >
          <div className={`text-7xl sm:text-9xl mb-10 ${currentItem.color.split(' ')[0]} p-6 sm:p-10 rounded-full`}>
            {currentItem.emoji}
          </div>
          
          <button 
           onClick={() => speak(currentItem.phrase)}
           className="absolute top-6 right-6 p-3 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors bg-white shadow-sm border border-slate-100"
           aria-label="Listen"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold font-comic text-slate-800 !leading-snug">
            "{currentItem.phrase}"
          </h2>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-10 gap-4">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="p-4 rounded-xl font-bold bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => speak(currentItem.phrase)}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 p-4 rounded-xl font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all border-2 border-indigo-100 active:scale-95"
        >
          <Volume2 className="w-5 h-5" />
          Listen Again
        </button>

        <button
          onClick={goToNext}
          className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-95 ${currentItem.btnColor}`}
        >
          {currentIndex === LESSON_ITEMS.length - 1 ? 'Go to Quiz' : 'Next'}
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}

function QuizView({ onFinish }: { onFinish: () => void }) {
  const [questions, setQuestions] = useState([...LESSON_ITEMS].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  
  // Generate options (1 correct, 3 random wrong) - basically just all 4 shuffled
  const [options, setOptions] = useState(() => {
     return [...LESSON_ITEMS].sort(() => Math.random() - 0.5);
  });

  useEffect(() => {
    // Regenerate options when question changes
    setOptions([...LESSON_ITEMS].sort(() => Math.random() - 0.5));
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [currentIndex]);

  const handleSelect = (id: number) => {
    if (selectedAnswer !== null) return; // Prevent double click
    
    setSelectedAnswer(id);
    const correct = id === currentQuestion.id;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
      speak("Correct!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#fbbf24', '#818cf8']
      });
    } else {
      speak("Try again.");
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        setShowResult(true);
        if (score + (correct ? 1 : 0) === questions.length) {
          confetti({
            particleCount: 300,
            spread: 120,
            origin: { y: 0.5 }
          });
        }
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-20"
      >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-extrabold mb-4">Quiz Complete!</h2>
        <p className="text-2xl text-slate-600 mb-10 font-bold border-b border-slate-200 pb-10">
          You scored {score} out of {questions.length}
        </p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              setQuestions([...LESSON_ITEMS].sort(() => Math.random() - 0.5));
              setCurrentIndex(0);
              setScore(0);
              setShowResult(false);
            }}
            className="px-6 py-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={onFinish}
            className="px-6 py-4 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold transition-transform hover:-translate-y-1"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
       key={currentIndex}
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: -20 }}
       className="max-w-3xl mx-auto pt-6 sm:pt-10 flex flex-col items-center"
    >
      <div className="w-full mb-10 flex justify-between items-center gap-4">
        <div className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="flex-1 max-w-xs bg-slate-200 rounded-full h-3 overflow-hidden ml-auto">
          <div 
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={`w-full sm:w-2/3 aspect-video sm:aspect-[2/1] rounded-3xl ${currentQuestion.color} flex items-center justify-center shadow-lg border-4 mb-10`}>
         <span className="text-6xl sm:text-8xl drop-shadow-md">{currentQuestion.emoji}</span>
      </div>

      <h3 className="text-2xl font-bold mb-8 text-slate-800 text-center">
        Which phrase matches the picture?
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {options.map((opt) => {
          let btnStateClasses = "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md text-slate-700";
          if (selectedAnswer !== null) {
            if (opt.id === currentQuestion.id) {
              btnStateClasses = "bg-green-100 border-green-500 text-green-900 shadow-sm";
            } else if (opt.id === selectedAnswer) {
              btnStateClasses = "bg-red-100 border-red-500 text-red-900 shadow-sm";
            } else {
               btnStateClasses = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={selectedAnswer !== null}
              className={`p-6 border-2 rounded-2xl text-lg sm:text-xl font-bold font-comic text-left transition-all ${btnStateClasses} flex items-center gap-4`}
            >
              <div className="flex-1">{opt.phrase}</div>
              {selectedAnswer !== null && opt.id === currentQuestion.id && (
                <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
              )}
              {selectedAnswer === opt.id && opt.id !== currentQuestion.id && (
                <X className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

