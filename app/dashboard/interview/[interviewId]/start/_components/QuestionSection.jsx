import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text to speech');
    }
  };

  // Fix: access the interviewQuestions array properly
  const questionsArray = 
    Array.isArray(mockInterviewQuestion)
      ? mockInterviewQuestion
      : Array.isArray(mockInterviewQuestion?.interviewQuestions)
        ? mockInterviewQuestion.interviewQuestions
        : [];

  const currentQuestionObj = questionsArray[activeQuestionIndex] || {};

  // Extract question text, assume question property is 'Question' or 'question' or fallback to string itself
  let currentQuestion = null;
  if (typeof currentQuestionObj === 'string') {
    currentQuestion = currentQuestionObj;
  } else if (currentQuestionObj.Question) {
    currentQuestion = currentQuestionObj.Question;
  } else if (currentQuestionObj.question) {
    currentQuestion = currentQuestionObj.question;
  } else {
    // fallback: first string property in object
    for (const key in currentQuestionObj) {
      if (typeof currentQuestionObj[key] === 'string') {
        currentQuestion = currentQuestionObj[key];
        break;
      }
    }
  }

  if (!currentQuestion) currentQuestion = 'No question found';

  return questionsArray.length > 0 ? (
    <div className="p-5 border rounded-lg my-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {questionsArray.map((_, index) => (
          <h2
            key={index}
            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
              activeQuestionIndex === index ? 'text-red-400' : ''
            }`}
          >
            Question#{index + 1}
          </h2>
        ))}
      </div>

      <h2 className="my-5 text-md md:text-lg">{currentQuestion}</h2>

      <Volume2
        className="cursor-pointer"
        onClick={() => textToSpeak(currentQuestion)}
      />

      <div className="border rounded-lg p-5 bg-blue-100 mt-2.5">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-primary my-2">
          Click on Record Answer when you want to answer the question. At the
          end of the interview we will give you feedback along with the correct
          answer for each question and your answer to compare it.
        </h2>
      </div>
    </div>
  ) : (
    <div className="p-5 my-5 text-center text-sm text-muted">
      No questions available.
    </div>
  );
}

export default QuestionSection;
