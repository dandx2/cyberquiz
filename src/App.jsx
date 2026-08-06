import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';
import Welcome from '@/components/Welcome';
import Quiz from '@/components/Quiz';
import Results from '@/components/Results';
import InitialCheck from '@/components/InitialCheck';
import AdBanner from '@/components/AdBanner';
import { supabase } from './lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
//test
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

function App() {
  const [gameState, setGameState] = useState('initial');
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameResults, setGameResults] = useState(null);
  const [tests, setTests] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoadingData(true);
      const [testsRes, categoriesRes] = await Promise.all([
        supabase.from('tests').select('*').order('name'),
        supabase.from('categories').select('*').order('objective_code')
      ]);

      if (testsRes.error) {
        toast({ 
          variant: "destructive", 
          title: "Error fetching tests",
          description: testsRes.error.message 
        });
      } else {
        setTests(testsRes.data);
      }

      if (categoriesRes.error) {
        toast({ 
          variant: "destructive", 
          title: "Error fetching categories",
          description: categoriesRes.error.message 
        });
      } else {
        setAllCategories(categoriesRes.data);
      }
      setIsLoadingData(false);
    }
    
    fetchData();
  }, [toast]);
  
  const handleHumanCheckComplete = () => {
    setGameState('welcome');
  };

  const startGame = async (selection) => {
    setIsLoadingQuestions(true);
    const quizSize = 10;
    
    const selectedTest = tests.find(t => t.id === selection.testId);

    if (!selectedTest) {
      toast({
        variant: "destructive",
        title: "No Test Selected",
        description: "Please select a test before starting.",
      });
      setIsLoadingQuestions(false);
      return;
    }

    try {
      // Step 1: Fetch categories for the selected test
 const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, objective_code, description')
    .eq('test_id', selection.testId);
      if (catError) {
        console.error('Error fetching categories:', catError);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to load categories. Please try again.",
        });
        setIsLoadingQuestions(false);
        return;
      }

      if (!categories || categories.length === 0) {
        toast({
          variant: "destructive",
          title: "No Categories Found",
          description: "This test has no categories. Please choose another test.",
        });
        setIsLoadingQuestions(false);
        return;
      }

      const categoryIds = categories.map(c => c.id);

      // Step 2: Fetch questions for those categories with category details
      const { data: allQuestions, error: qError } = await supabase
        .from('questions')
        .select('*, categories(*)')
        .in('category_id', categoryIds);

      if (qError) {
        console.error('Error fetching questions:', qError);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to load questions. Please try again.",
        });
        setIsLoadingQuestions(false);
        return;
      }

      if (!allQuestions || allQuestions.length === 0) {
        toast({
          variant: "destructive",
          title: "No Questions Found",
          description: "No questions are available for this test. Please choose another test.",
        });
        setIsLoadingQuestions(false);
        return;
      }

      console.log('Fetched questions from database:', {
        totalQuestions: allQuestions.length,
        sampleQuestion: allQuestions[0],
        sampleAnswers: allQuestions[0]?.answers
      });

      // Step 3: Shuffle and select quiz size number of questions
      const shuffledQuestions = shuffleArray(allQuestions);
      const selectedQuestions = shuffledQuestions.slice(0, Math.min(quizSize, shuffledQuestions.length));

      // Step 4: Format questions - shuffle answers for each question
      const formattedQuestions = selectedQuestions.map(q => {
        // Verify answers are properly parsed from jsonb
        if (!q.answers || !Array.isArray(q.answers)) {
          console.error('Invalid answers structure for question:', q.id, q.answers);
          return null;
        }

        return {
          ...q,
          answers: shuffleArray(q.answers)
        };
      }).filter(q => q !== null);

      if (formattedQuestions.length === 0) {
        toast({
          variant: "destructive",
          title: "Invalid Questions",
          description: "The questions data is corrupted. Please contact support.",
        });
        setIsLoadingQuestions(false);
        return;
      }

      console.log('Starting quiz with questions:', {
        count: formattedQuestions.length,
        questions: formattedQuestions
      });

      setQuestions(formattedQuestions);
      setScore(0);
      setGameResults(null);
      setGameState('quiz');

    } catch (error) {
      console.error("Error starting game:", error);
      toast({
        variant: "destructive",
        title: "Failed to Start Quiz",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const finishGame = (results) => {
    console.log('Quiz finished with results:', results);
    setScore(results.score);
    setGameResults(results);
    setGameState('results');
  };

  const restartGame = () => {
    setGameState('welcome');
    setQuestions([]);
    setGameResults(null);
  };

  const renderContent = () => {
    switch (gameState) {
      case 'initial':
        return <InitialCheck key="initial" onComplete={handleHumanCheckComplete} />;
      case 'welcome':
        return <Welcome key="welcome" onStart={startGame} tests={tests} isLoading={isLoadingData || isLoadingQuestions} />;
      case 'quiz':
        return <Quiz key="quiz" questions={questions} onFinish={finishGame} />;
      case 'results':
        return (
          <Results 
            key="results" 
            score={score} 
            totalQuestions={gameResults?.totalQuestions || questions.length} 
            results={gameResults?.results}
            onRestart={restartGame} 
          />
        );
      default:
        return <InitialCheck key="default-initial" onComplete={handleHumanCheckComplete} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>CyberScore Quiz - Test Your Knowledge</title>
        <meta name="description" content="Take our interactive cybersecurity quiz to test your knowledge. Fresh questions from our database every time!" />
      </Helmet>
      <div className="min-h-screen w-full flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 sm:p-6 lg:p-8 gap-8">
        <main className="w-full flex-grow flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
        <AdBanner />
      </div>
    </>
  );
}

export default App;
