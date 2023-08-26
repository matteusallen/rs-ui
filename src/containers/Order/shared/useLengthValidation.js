import { useState, useEffect } from 'react';

const useLengthValidation = (productQuestions, setProductQuestionsAreValid) => {
  const [questionListStatus, setQuestionListStatus] = useState([]);

  useEffect(() => {
    const questions = productQuestions ?? [];
    setQuestionListStatus(questions.map(() => true));
  }, [productQuestions]);

  useEffect(() => {
    setProductQuestionsAreValid(questionListStatus.every(status => status));
  }, [questionListStatus]);

  const updateStatus = (isValid, index) => {
    const updatedArray = [...questionListStatus];
    updatedArray[index] = isValid;
    setQuestionListStatus(updatedArray);
  };

  return updateStatus;
};

export default useLengthValidation;
