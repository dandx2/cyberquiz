import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from 'lucide-react';

const Quiz = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerResults, setAnswerResults] = useState([]);

  useEffect(() => {
    // Reset state when questions change (new quiz started)
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsAnswered(false);
    setAnswerResults([]);
  }, [questions]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    // Ensure proper boolean comparison for isCorrect
    const isCorrect = answer.isCorrect === true;
    
    // Debug logging
    console.log('Answer validation:', {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedAnswerText: answer.text,
      selectedAnswerIsCorrect: answer.isCorrect,
      calculatedIsCorrect: isCorrect,
      allAnswers: currentQuestion.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect }))
    });
    
    // Find the correct answer for this question
    const correctAnswer = currentQuestion.answers.find(a => a.isCorrect === true);
    
    // Store detailed result for this question
    const result = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      category: currentQuestion.categories?.objective_code || currentQuestion.category?.objective_code || 'N/A',
      selectedAnswer: answer.text,
      correctAnswer: correctAnswer?.text || 'Unknown',
      isCorrect: isCorrect,
      explanation: currentQuestion.explanation
    };
    
    setAnswerResults(prev => [...prev, result]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz complete - calculate final score from results array to ensure accuracy
      const finalScore = answerResults.filter(r => r.isCorrect).length;
      
      console.log('Quiz completed:', {
        totalQuestions: questions.length,
        finalScore: finalScore,
        results: answerResults
      });
      
      onFinish({
        score: finalScore,
        totalQuestions: questions.length,
        results: answerResults
      });
    }
  };

  const getButtonClass = (answer) => {
    if (!isAnswered) {
      return 'bg-slate-200 text-slate-800 hover:bg-slate-300';
    }
    // Strict boolean comparison for isCorrect
    if (answer.isCorrect === true) {
      return 'bg-green-500/90 border-green-400 text-white';
    }
    if (answer === selectedAnswer && answer.isCorrect !== true) {
      return 'bg-red-500/90 border-red-400 text-white';
    }
    return 'bg-slate-200/50 text-slate-800/60';
  };

  if (!currentQuestion) {
    return (
      <div className="w-full max-w-3xl p-6 sm:p-8 text-center text-white">
        Loading questions...
      </div>
    );
  }

  return (
    <motion.div
      key={currentQuestion.id || currentQuestionIndex}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="w-full max-w-3xl p-6 sm:p-8 bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-sm text-slate-400 font-mono">
          <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <Progress value={progress} className="w-full h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500" />
      </div>
      
      {(currentQuestion.categories || currentQuestion.category) && (
        <div className="mb-4 text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full inline-block">
          Objective: {currentQuestion.categories?.objective_code || currentQuestion.category?.objective_code || 'N/A'}
        </div>
      )}

      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-100 min-h-[84px]">{currentQuestion.question}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentQuestion.answers && currentQuestion.answers.map((answer, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: isAnswered ? 1 : 1.03 }}
            whileTap={{ scale: isAnswered ? 1 : 0.98 }}
          >
            <Button
              onClick={() => handleAnswer(answer)}
              disabled={isAnswered}
              className={`w-full h-auto text-left justify-start p-4 rounded-lg transition-all duration-300 border-2 border-transparent text-base whitespace-normal font-semibold ${getButtonClass(answer)}`}
            >
              {answer.text}
            </Button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAnswered && selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="mb-6 overflow-hidden"
          >
            <div className={`p-4 rounded-lg ${selectedAnswer.isCorrect === true ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} border`}>
              <div className="flex items-center mb-2">
                {selectedAnswer.isCorrect === true ? (
                  <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400 mr-2" />
                )}
                <h3 className="text-lg font-bold text-slate-100">
                  {selectedAnswer.isCorrect === true ? 'Correct!' : 'Incorrect'}
                </h3>
              </div>
              <p className="text-slate-300">{currentQuestion.explanation}</p>
{/* Objective Code & Description */}
{(currentQuestion.categories || currentQuestion.category) && (
  <p className="text-sm font-mono text-purple-300 mb-2">
    {currentQuestion.categories?.objective_code || currentQuestion.category?.objective_code}: {currentQuestion.categories?.description || currentQuestion.category?.description}
  </p>
)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="flex justify-end"
          >
            <Button
              onClick={handleNext}
              size="lg"
              className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 rounded-full font-semibold shadow-lg shadow-purple-500/30"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Quiz;
