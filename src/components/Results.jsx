import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Award, Repeat, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const Results = ({ score, totalQuestions, results, onRestart }) => {
  const [showDetails, setShowDetails] = useState(false);
  const percentage = Math.round((score / totalQuestions) * 100);

  const getFeedback = () => {
    if (percentage >= 90) return { title: "Cybersecurity Master!", message: "Incredible work! You're a true digital guardian.", color: "text-green-400" };
    if (percentage >= 70) return { title: "Expert Defender!", message: "Excellent score! Your security knowledge is impressive.", color: "text-blue-400" };
    if (percentage >= 50) return { title: "Skilled Operator", message: "Great job! You have a solid foundation in cybersecurity.", color: "text-yellow-400" };
    return { title: "Novice Explorer", message: "A good start! Keep learning to strengthen your digital defenses.", color: "text-orange-400" };
  };

  const feedback = getFeedback();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full max-w-4xl text-center p-8 bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        className="flex justify-center mb-6"
      >
        <Award className={`h-20 w-20 ${feedback.color}`} />
      </motion.div>
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`text-4xl sm:text-5xl font-bold ${feedback.color} mb-2`}
      >
        {feedback.title}
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg text-slate-300 mb-6"
      >
        {feedback.message}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-slate-800/50 p-6 rounded-xl mb-8"
      >
        <p className="text-xl text-slate-400 mb-2">Your Score</p>
        <p className="text-6xl font-bold text-white">
          {percentage}%
        </p>
        <p className="text-slate-400 mt-2">You answered {score} out of {totalQuestions} questions correctly.</p>
      </motion.div>

      {results && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-8"
        >
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            className="bg-slate-800/50 text-slate-200 border-purple-500/30 hover:bg-slate-700/50 hover:text-white mb-4"
          >
            {showDetails ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Hide Detailed Results
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                View Detailed Results
              </>
            )}
          </Button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 text-left max-h-96 overflow-y-auto"
            >
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.isCorrect
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start mb-2">
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mr-2 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 mb-1">
                        Question {index + 1} {result.category && `• ${result.category}`}
                      </p>
                      <p className="text-slate-100 font-semibold mb-2">{result.question}</p>
                      <div className="space-y-1 text-sm">
                        <p className={result.isCorrect ? 'text-green-300' : 'text-red-300'}>
                          <span className="font-semibold">Your answer:</span> {result.selectedAnswer}
                        </p>
                        {!result.isCorrect && (
                          <p className="text-green-300">
                            <span className="font-semibold">Correct answer:</span> {result.correctAnswer}
                          </p>
                        )}
                        {result.explanation && (
                          <p className="text-slate-300 mt-2 pt-2 border-t border-slate-700">
                            <span className="font-semibold">Explanation:</span> {result.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5, type: 'spring', stiffness: 120 }}
      >
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 rounded-full text-lg font-semibold shadow-lg shadow-purple-500/30"
        >
          <Repeat className="mr-2 h-5 w-5" />
          Take Quiz Again
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Results;