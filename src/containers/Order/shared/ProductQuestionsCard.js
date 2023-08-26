import React, { useEffect, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { FormikField } from 'Components/Fields';
import { FormControlLabel, Checkbox, TextField, withStyles } from '@material-ui/core';
import Radio from 'src/containers/Event/Shared/Radio.js';
import FormCard from 'Components/Cards/FormCard';
import { HeadingFour } from 'Components/Headings';
import useLengthValidation from '../shared/useLengthValidation';
import colors from 'Styles/Colors';
import './ProductQuestionsCard.scss';

const CheckBoxThemed = withStyles({
  root: {
    color: colors.text.lightGray2,
    opacity: 0.54,
    '&$checked': {
      color: colors.icons.blue,
      opacity: 1
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

const QuestionAnswers = ({ question, productType, updateStatus, index }) => {
  const { questionType, answerOptions, id, minLength, maxLength } = question;
  const { values, setFieldValue } = useFormikContext();
  const { productQuestionAnswers: questionAnswers, hasEmptyRVQuestions, hasEmptyStallQuestions } = values;
  const requiredQuestions = productType === 'stalls' ? hasEmptyStallQuestions : hasEmptyRVQuestions;
  const requiredQuestionsField = productType === 'stalls' ? 'hasEmptyStallQuestions' : 'hasEmptyRVQuestions';
  const questionAnswer = questionAnswers.find(answer => answer.questionId == id);
  const [hasLengthError, setHasLengthError] = useState(false);

  useEffect(() => {
    const hasShortField =
      (questionType === 'multipleSelection' && questionAnswer?.answer.some(ans => ans.replace('Other: ', '').length < 2)) ||
      (questionType === 'openText' && questionAnswer?.answer[0].replace('Other: ', '').length < 1);
    if (question.required) {
      const hasEmptyAnswer = !questionAnswer || !questionAnswer.answer.length || hasShortField;
      if (requiredQuestions[id] && !hasEmptyAnswer) {
        delete requiredQuestions[id];
        setFieldValue(requiredQuestionsField, { ...requiredQuestions });
      } else if (!requiredQuestions[id] && hasEmptyAnswer) {
        setFieldValue(requiredQuestionsField, { ...values.requiredQuestions, [id]: true });
      } else if (hasShortField && !requiredQuestions[id]) {
        setFieldValue(requiredQuestionsField, { ...values.requiredQuestions, [id]: true });
      }
    } else if (!hasShortField && requiredQuestions[id]) {
      delete requiredQuestions[id];
      setFieldValue(requiredQuestionsField, { ...requiredQuestions });
    }
  }, [values.event.stallQuestions, values.event.rvQuestions, questionAnswers, productType]);

  const handleAnswerChange = (answer, isOtherOption, checked) => {
    const newQuestionAnswers = [...questionAnswers];
    const questionAnswerIndex = newQuestionAnswers.findIndex(ans => ans.questionId === id);
    const oldAnswerIndex = isOtherOption
      ? newQuestionAnswers[questionAnswerIndex]?.answer.findIndex(ans => ans.indexOf('Other: ') >= 0)
      : newQuestionAnswers[questionAnswerIndex]?.answer.indexOf(answer);

    if (!checked) {
      newQuestionAnswers[questionAnswerIndex]?.answer?.splice(oldAnswerIndex, 1);
      return setFieldValue('productQuestionAnswers', newQuestionAnswers);
    }

    if (questionAnswerIndex < 0) newQuestionAnswers.push({ questionId: id, answer: [answer] });
    else if (questionType === 'singleSelection' || questionType === 'openText') newQuestionAnswers[questionAnswerIndex].answer = [answer];
    else {
      if (isOtherOption) {
        const newAnswerIndex = oldAnswerIndex < 0 ? newQuestionAnswers[questionAnswerIndex].answer.length : oldAnswerIndex;
        newQuestionAnswers[questionAnswerIndex].answer[newAnswerIndex] = answer;
      } else newQuestionAnswers[questionAnswerIndex].answer.push(answer);
    }
    return setFieldValue('productQuestionAnswers', newQuestionAnswers);
  };

  const onOpenTextQuestionChange = answer => {
    handleAnswerChange(answer, false, true);
    const answerLength = answer?.length;
    const hasMinLengthError = minLength && answerLength < minLength && answerLength > 0;
    const hasMaxLengthError = maxLength && answerLength > maxLength;
    const hasLengthError = hasMinLengthError || hasMaxLengthError;
    setHasLengthError(hasLengthError);
    updateStatus(!hasLengthError, index);
  };

  const getHelperText = () => {
    let errorMessage = '';
    errorMessage = minLength && maxLength ? `Answer must be between ${minLength} and ${maxLength}` : errorMessage;
    errorMessage = minLength === maxLength ? `Answer must be exactly ${minLength}` : errorMessage;
    errorMessage = !minLength ? `max length: ${maxLength}` : errorMessage;
    errorMessage = !maxLength ? `min length: ${minLength}` : errorMessage;
    return hasLengthError ? errorMessage : '';
  };

  if (questionType === 'openText') {
    return (
      <Field
        component={FormikField}
        className="open-text-answer"
        type="text"
        multiline
        value={questionAnswers.find(ans => ans.questionId == id)?.answer[0] || ''}
        rows="1"
        variant="filled"
        name={`openTextAnswer-${id}`}
        error={hasLengthError}
        helperText={getHelperText()}
        onChange={e => onOpenTextQuestionChange(e.target.value)}
      />
    );
  }
  return (
    answerOptions?.map(answer => {
      const currentAnsweredQuestion = questionAnswers.find(ans => ans.questionId == id);
      const currentAnswer =
        answer === 'Other'
          ? currentAnsweredQuestion?.answer.find(ans => ans.indexOf('Other: ') !== -1)
          : currentAnsweredQuestion?.answer.find(ans => ans === answer);

      return (
        <div key={answer}>
          <FormControlLabel
            style={{ marginLeft: 20 }}
            className="question-option"
            control={questionType === 'singleSelection' ? <Radio checked={!!currentAnswer} /> : <CheckBoxThemed checked={!!currentAnswer} />}
            label={answer}
            onChange={e => handleAnswerChange(answer === 'Other' ? 'Other: ' : answer, false, e.target.checked)}
          />
          {answer === 'Other' && (
            <TextField
              value={currentAnswer?.replace('Other: ', '') || ''}
              disabled={!currentAnswer}
              onChange={e => handleAnswerChange(`Other: ${e.target.value}`, true, !!e.target.value)}
            />
          )}
        </div>
      );
    }) || []
  );
};

const ProductQuestions = ({ productType, questions, setProductQuestionsAreValid }) => {
  const product = productType === 'stalls' ? 'Stall' : 'RV';
  const updateStatus = useLengthValidation(questions, setProductQuestionsAreValid);

  return (
    <FormCard className="renter-questions-card" dataTestId="renter-question-card">
      <div className="heading-container">
        <HeadingFour label={`Additional ${product} Info`} />
      </div>
      {questions.map((question, index) => (
        <>
          <p className={question.questionType === 'openText' ? 'open-text' : ''}>
            {question.question}
            {question.required && <span className="required-text"> (Required)</span>}
          </p>
          <QuestionAnswers question={question} productType={productType} updateStatus={updateStatus} index={index} />
        </>
      ))}
    </FormCard>
  );
};

export default ProductQuestions;

export { QuestionAnswers };
