import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
      .then((response) => response.json())
      .then((response) => {
        const formattedData = response.results.map((question) => ({
          question: question.question,
          correctAnswer: question.correct_answer,
          options: [...question.incorrect_answers, question.correct_answer].sort(
            () => Math.random() - 0.5
          ),
        }));
        setData(formattedData);
      });
  }, []);

  const handleOptionChange = (selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < data.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setIsQuizFinished(true);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    data.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  if (data.length === 0) {
    return <p>Loading questions...</p>;
  }

  if (isQuizFinished) {
    return (
      <div className="App result-screen">
        <h2>Your score: {score} / {data.length}</h2>
      </div>
    );
  }
  const currentQuestionData = data[currentQuestionIndex];
  const isOptionSelected = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="App">
      <h1 className="quiz-title">Quiz</h1>
      <div className="question-block">
        <h3 className="question">{currentQuestionData.question}</h3>
        <div className="options-container">
          {currentQuestionData.options.map((option, optionIndex) => (
            <label key={optionIndex} className="option-label">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={selectedAnswers[currentQuestionIndex] === option}
                onChange={() => handleOptionChange(option)}
                className="option-input"
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>
      <button 
        className={`next-btn ${isOptionSelected ? '' : 'disabled-btn'}`}
        onClick={handleNextQuestion} 
        disabled={!isOptionSelected}
      >
        {currentQuestionIndex < data.length - 1 ? 'Next' : 'Submit'}
      </button>
    </div>
  );
}

export default App;



