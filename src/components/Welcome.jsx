import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Loader2 } from 'lucide-react';

    const Welcome = ({ onStart, tests, isLoading }) => {
      const [selectedTest, setSelectedTest] = useState(null);

      const handleStart = () => {
        if (!selectedTest) return;
        onStart({
          testId: selectedTest.id,
        });
      };

      if (!selectedTest) {
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              Select Your Test
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Begin your cybersecurity challenge by choosing a test.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {tests.map(test => (
                <Button 
                  key={test.id}
                  onClick={() => setSelectedTest(test)}
                  variant="outline"
                  className="h-24 text-xl bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-purple-500 transition-all duration-300"
                >
                  {test.name}
                </Button>
              ))}
            </div>
          </motion.div>
        );
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2"
          >
            {selectedTest.name}
          </motion.h1>
           <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            Ready to test your knowledge?
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full max-w-lg mx-auto flex flex-col items-center gap-4"
          >
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 rounded-full text-lg font-semibold shadow-lg shadow-purple-500/30 w-full sm:w-auto px-10 py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Start Quiz'
                )}
              </Button>
             <Button
                onClick={() => setSelectedTest(null)}
                variant="link"
                className="mt-6 text-slate-400 hover:text-white"
            >
                Back to Test Selection
            </Button>
          </motion.div>
        </motion.div>
      );
    };

    export default Welcome;