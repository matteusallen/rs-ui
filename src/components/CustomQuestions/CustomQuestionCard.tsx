import React, { FC, useRef, useState, useEffect } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { Field, useFormikContext } from 'formik';
import { MenuItem, FormControl, IconButton } from '@material-ui/core';
import { HeadingFour } from 'Components/Headings';
import FormCard from 'Components/Cards/FormCard';
import { FormikField } from 'Components/Fields';
import { Delete } from '@material-ui/icons';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DragIndicatorOutlined from '@material-ui/icons/DragIndicatorOutlined';
import Switch from '@material-ui/core/Switch';
import colors from '../../styles/Colors';
import { Select } from 'formik-material-ui';
import { emptyQuestionCard, EventFormType } from 'src/containers/Event/Shared/Form';
import RenderAnswerOptions from './RenderAnswerOptions';
import { useStyles } from 'src/containers/Event/Shared/Cards/SectionToggle';
import { LengthInputs } from './LengthInputs';
import { isNullOrWhiteSpace } from '../../utils/stringHelpers';
import './CustomQuestionCard.scss';

const ItemTypes = {
  CARD: 'card'
};

export type AnswerOptionType = {
  id: number;
  text: string | null;
};

export type QuestionType = {
  id: number;
  answerOptions: AnswerOptionType[];
  questionType: string;
  required: boolean;
  question: string;
};

export interface CardProps {
  id: number | string;
  product: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  question: QuestionType;
  updateStatus: (isValid: boolean, index: number) => any;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Card: FC<CardProps> = ({ id, product = 'stalls', index, moveCard, question, updateStatus }) => {
  const {
    values,
    values: { stallQuestions, rvQuestions },
    setFieldValue
  } = useFormikContext<EventFormType>();
  const maxAnswerId = question.answerOptions.length > 0 ? Math.max(...question.answerOptions.map(a => a.id)) : 1;
  const [answerId, setAnswerId] = useState<number>(maxAnswerId + 1);
  const emptyAnswerName = product === 'stalls' ? 'hasEmptyStallAnswer' : 'hasEmptyRvAnswer';
  const questions = product === 'stalls' ? stallQuestions : rvQuestions;
  const questionType = product === 'stalls' ? 'stallQuestions' : 'rvQuestions';
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  const minLengthfieldName = `${questionType}[${index}].minLength`;
  const maxLengthfieldName = `${questionType}[${index}].maxLength`;
  const currentQuestionType = values[`${questionType}`][index]?.questionType;
  const [isOpenText, setIsOpenText] = useState(currentQuestionType === 'openText');
  const [hasLengthError, setHasLengthError] = useState(false);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset?.y || 0 - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  useEffect(() => {
    if (product === 'stalls') {
      const hasEmptyStallAnswers = values.stallQuestions.some((question: QuestionType) => {
        return question.questionType != 'openText' && question.answerOptions.some((answer: AnswerOptionType) => !answer.text?.replace(/\s/g, ''));
      });
      if (hasEmptyStallAnswers) {
        setFieldValue(emptyAnswerName, true);
      } else setFieldValue(emptyAnswerName, false);
    } else {
      const hasEmptyRvAnswers = values.rvQuestions.some((question: QuestionType) => {
        return question.questionType != 'openText' && question.answerOptions.some((answer: AnswerOptionType) => !answer.text?.replace(/\s/g, ''));
      });
      if (hasEmptyRvAnswers) {
        setFieldValue(emptyAnswerName, true);
      } else setFieldValue(emptyAnswerName, false);
    }
  }, [question.answerOptions, question.questionType, questions.length]);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  });

  const options = [
    <MenuItem key={1} value="singleSelection">
      SINGLE SELECTION
    </MenuItem>,
    <MenuItem key={2} value="multipleSelection">
      MULTIPLE SELECTION
    </MenuItem>,
    <MenuItem key={3} value="openText">
      OPEN TEXT
    </MenuItem>
  ];

  const handleDeleteQuestion = () => {
    questions.splice(index, 1);
    setFieldValue(emptyAnswerName, false);
    setFieldValue(questionType, [...questions]);
  };

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const lengthChange = (newValue: string, fieldName: string) => {
    setFieldValue(fieldName, Number(newValue) < 0 ? '' : newValue.replace(/[^0-9]/g, ''));

    const [min, max] = getLengthValues(newValue, fieldName);
    if (isNullOrWhiteSpace(min.toString()) || isNullOrWhiteSpace(max.toString())) {
      setHasLengthError(false);
      updateStatus(true, index);
      return;
    }
    const hasError = Number(min) > Number(max);
    setHasLengthError(hasError);
    updateStatus(!hasError, index);
  };

  const getLengthValues = (newValue: string, fieldName: string) => {
    const min = minLengthfieldName === fieldName ? newValue : values[`${questionType}`][index]?.minLength;
    const max = maxLengthfieldName === fieldName ? newValue : values[`${questionType}`][index]?.maxLength;
    return [min, max];
  };

  const questionTypeChange = (newType: any) => {
    setIsOpenText(newType === 'openText');

    if (newType !== 'openText') {
      setFieldValue(minLengthfieldName, '');
      setFieldValue(maxLengthfieldName, '');
    }
    setFieldValue(`${questionType}[${index}].questionType`, newType);
  };

  return (
    <div key={index} className="custom-question-container" style={{ opacity }} ref={ref} data-handler-id={handlerId} data-testid="custom-question-card">
      <FormCard className={`card-item`}>
        <div>
          <div className="left-col" style={{ display: 'flex' }}>
            <div style={{ width: '50%' }} className="left-col">
              <HeadingFour label={`Question ${index + 1}`} />
              <Field
                className="question"
                data-testid="question-name"
                component={FormikField}
                label="QUESTION"
                name={`${questionType}[${index}].question`}
                type="text"
                variant="filled"
                defaultValue={question?.question}
                disabled={false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value?.length < 255) {
                    setFieldValue(`${questionType}[${index}].question`, e.target.value);
                  }
                }}
              />
              <RenderAnswerOptions question={question} product={product} index={index} answerId={answerId} setAnswerId={setAnswerId} />
            </div>
            <div style={{ margin: '-20px 20px' }}>
              <DragIndicatorOutlined style={{ transform: 'rotate(90deg)', color: colors.text.lightGray2 }} />
            </div>
            <div style={{ width: '50%' }} className="right-col">
              <HeadingFour label="Question Type" />
              <FormControl style={{ width: '100%' }}>
                <Field name={`${questionType}[${index}].questionType`}>
                  {({ meta, ...props }: any) => (
                    <Select
                      data-testid="question-type"
                      value={question.questionType}
                      {...props}
                      meta={meta}
                      error={meta.touched && meta.error ? meta.error : null}
                      disabled={false}
                      onChange={e => questionTypeChange(e.target.value)}>
                      {options}
                    </Select>
                  )}
                </Field>
              </FormControl>
            </div>
          </div>
          <div className="footer">
            <IconButton
              data-testid="add-question-button"
              onClick={() => {
                setFieldValue(questionType, [...questions, { ...emptyQuestionCard, id: answerId }]);
                setAnswerId(answerId + 1);
              }}>
              <AddCircleOutlineIcon fontSize="large" />
            </IconButton>
            <IconButton data-testid="remove-question-button" onClick={handleDeleteQuestion} disabled={false}>
              <Delete />
            </IconButton>
            <p className="separator" />
            <p>Required?</p>
            <Switch
              data-testid="custom-question-required"
              classes={{
                track: classes.switch_track,
                switchBase: classes.switch_base,
                colorPrimary: colors.white
              }}
              checked={!!question?.required}
              onChange={() => setFieldValue(`${questionType}[${index}].required`, !question?.required)}
            />
            {isOpenText && (
              <LengthInputs
                lengthChange={lengthChange}
                minLengthfieldName={minLengthfieldName}
                maxLengthfieldName={maxLengthfieldName}
                hasError={hasLengthError}
              />
            )}
          </div>
        </div>
      </FormCard>
    </div>
  );
};
