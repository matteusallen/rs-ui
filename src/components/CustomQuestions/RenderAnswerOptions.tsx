import React from 'react';
import { useFormikContext } from 'formik';
import { Radio, FormControlLabel, TextField, Checkbox } from '@material-ui/core';
import { EventFormType } from 'src/containers/Event/Shared/Form/FormTypes';
import CloseIcon from '@material-ui/icons/Close';
import { QuestionType, AnswerOptionType } from './CustomQuestionCard';
import './CustomQuestionCard.scss';

interface RenderAnswerProps {
  product: string;
  index: number;
  question: QuestionType;
  answerId: number;
  setAnswerId: (id: number) => void;
}

const RenderAnswerOptions: any = ({ question, product, index, answerId, setAnswerId }: RenderAnswerProps) => {
  const { setFieldValue } = useFormikContext<EventFormType>();
  const questionAnswerType = question?.questionType;
  const isSelectQuestionType = questionAnswerType === 'singleSelection' || questionAnswerType === 'multipleSelection';
  const emptyAnswerName = product === 'stalls' ? 'hasEmptyStallAnswer' : 'hasEmptyRvAnswer';
  const questionType = product === 'stalls' ? 'stallQuestions' : 'rvQuestions';

  const handleDeleteQuestionOption = (id: number) => {
    if (question.answerOptions.length > 1) {
      const filteredQuestions = question.answerOptions.filter((answer: { id: number }) => answer.id != id);
      setFieldValue(`${questionType}[${index}].answerOptions`, filteredQuestions);
    }
  };

  const handleEditAnswer = (answer: string, i: number) => {
    if (answer?.length > 254) return;
    setFieldValue(`${questionType}[${index}].answerOptions[${i}].text`, answer);
  };

  if (!isSelectQuestionType) return <></>;
  return (
    <div className="possible-answers">
      {question.answerOptions.map((answer: AnswerOptionType, i: number) => (
        <div className={`possible-answer${answer.text?.replace(/\s/g, '') === '' || answer.text === null ? ' empty-answer' : ''}`} key={answer.id}>
          <FormControlLabel
            className="question-option"
            control={questionAnswerType === 'singleSelection' ? <Radio disabled={true} /> : <Checkbox disabled={true} />}
            label={
              <div className="option-text">
                <TextField
                  data-testid="answer-option"
                  onChange={e => handleEditAnswer(e.target.value, i)}
                  variant="standard"
                  defaultValue={answer.text === null ? `Option ${i + 1}` : question.answerOptions[i].text}
                />
                <CloseIcon data-testid="remove-answer-option" onClick={() => handleDeleteQuestionOption(answer.id)} />
              </div>
            }
          />
        </div>
      ))}
      <FormControlLabel
        value="other"
        className="other-parent"
        control={questionAnswerType === 'singleSelection' ? <Radio disabled={true} /> : <Checkbox disabled={true} />}
        label={
          <span
            className="option-radio"
            onClick={() => {
              setFieldValue(`${questionType}[${index}].answerOptions`, [...question.answerOptions, { id: answerId, text: null }]);
              setAnswerId(answerId + 1);
              setFieldValue(emptyAnswerName, true);
            }}>
            Add option or{' '}
            <span
              onClick={e => {
                e.stopPropagation();
                if (!question.answerOptions.some(answer => answer.text === 'Other')) {
                  setFieldValue(`${questionType}[${index}].answerOptions`, [...question.answerOptions, { id: answerId, text: 'Other' }]);
                  setAnswerId(answerId + 1);
                }
              }}
              className="other-radio">
              add "Other"
            </span>
          </span>
        }
      />
    </div>
  );
};

export default RenderAnswerOptions;
