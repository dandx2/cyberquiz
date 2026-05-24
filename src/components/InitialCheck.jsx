import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const InitialCheck = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full max-w-md text-center p-8 bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        className="flex justify-center mb-6"
      >
        <ShieldCheck className="h-20 w-20 text-teal-400" />
      </motion.div>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400 mb-4">
        Welcome, Digital Explorer
      </h1>
      <p className="text-slate-300 mb-8">
        Just a quick check to make sure you're human. Click below to start your quiz adventure!
      </p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 120 }}
      >
        <Button
          onClick={onComplete}
          size="lg"
          className="bg-teal-600 text-white hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 rounded-full text-lg font-semibold shadow-lg shadow-teal-500/30"
        >
          I'm Ready to Start
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default InitialCheck;