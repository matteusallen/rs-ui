import React, { useEffect, useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { FormikField } from 'Components/Fields';
import { FormControlLabel, Checkbox, TextField, withStyles } from '@material-ui/core';
import Radio from 'src/containers/Event/Shared/Radio.js';
import colors from 'Styles/Colors';
import './ProductQuestionsCard.scss';
import { cloneDeep } from 'lodash';

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

const EditQuestionAnswers = ({ question, productType, updateStatus, index }) => {
  const { questionType, answerOptions, id, questionId, minLength, maxLength } = question;
  const { values, setFieldValue } = useFormikContext();
  const { productQuestionAnswers: questionAnswers, hasEmptyRVQuestions, hasEmptyStallQuestions } = values;
  const requiredQuestions = productType === 'stalls' ? hasEmptyStallQuestions : hasEmptyRVQuestions;
  const requiredQuestionsField = productType === 'stalls' ? 'hasEmptyStallQuestions' : 'hasEmptyRVQuestions';
  const questionAnswer = questionAnswers.find(answer => answer.id == id);
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
  }, [values.productQuestionAnswers, productType]);

  const handleAnswerChange = (answer, isOtherOption, checked, currentAnsweredQuestion) => {
    const newQuestionAnswers = [...questionAnswers].map(q => cloneDeep(q));
    const questionAnswerIndex = newQuestionAnswers.findIndex(ans => ans.id === id);
    const oldAnswerIndex = isOtherOption
      ? currentAnsweredQuestion?.answer.findIndex(ans => ans.indexOf('Other: ') !== -1)
      : newQuestionAnswers[questionAnswerIndex]?.answer.indexOf(answer);

    if (!checked) {
      newQuestionAnswers[questionAnswerIndex]?.answer?.splice(oldAnswerIndex, 1);
      return setFieldValue('productQuestionAnswers', newQuestionAnswers);
    }

    if (questionAnswerIndex < 0) newQuestionAnswers.push({ id, answer: [answer] });
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
        value={questionAnswers.find(ans => ans.id == id)?.answer[0] || ''}
        rows="1"
        variant="filled"
        name={`openTextAnswer-${questionId}`}
        error={hasLengthError}
        helperText={getHelperText()}
        onChange={e => onOpenTextQuestionChange(e.target.value)}
      />
    );
  }
  return (
    answerOptions?.map(answer => {
      const currentAnsweredQuestion = questionAnswers.find(ans => ans.id == id);
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
            onChange={e => handleAnswerChange(answer === 'Other' ? 'Other: ' : answer, false, e.target.checked, currentAnsweredQuestion)}
          />
          {answer === 'Other' && (
            <TextField
              value={currentAnswer?.replace('Other: ', '') || ''}
              disabled={!currentAnswer}
              onChange={e => handleAnswerChange(`Other: ${e.target.value}`, true, !!e.target.value, currentAnsweredQuestion)}
            />
          )}
        </div>
      );
    }) || []
  );
};

export default EditQuestionAnswers;
