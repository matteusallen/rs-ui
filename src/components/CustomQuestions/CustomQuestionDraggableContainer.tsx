import React, { useEffect, FC, useState, useCallback } from 'react';
import { Card } from './CustomQuestionCard';
import update from 'immutability-helper';
import { useFormikContext } from 'formik';
import { EventFormType } from 'src/containers/Event/Shared/Form/FormTypes';
import { QuestionType } from './CustomQuestionCard';
export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

interface ContainerProps {
  productType: string;
  questions: [];
  setProductQuestionsAreValid: (isValid: boolean) => void;
}

export const Container: FC<ContainerProps> = ({ productType, questions, setProductQuestionsAreValid }) => {
  {
    const [cards, setCards] = useState(questions);
    const [questionListStatus, setQuestionListStatus] = useState(cards.map(() => true));

    const { setFieldValue } = useFormikContext<EventFormType>();
    const questionType = productType === 'stalls' ? 'stallQuestions' : 'rvQuestions';

    useEffect(() => {
      setProductQuestionsAreValid(questionListStatus.every(status => status));
    }, [questionListStatus]);

    useEffect(() => {
      setCards(questions);
    }, [questions]);

    const moveCard = useCallback(
      (dragIndex: number, hoverIndex: number) => {
        const dragCard = cards[dragIndex];
        const newCards = update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        });
        setFieldValue(questionType, newCards);
        setCards(newCards);
      },
      [cards]
    );

    const updateStatus = (isValid: boolean, index: number) => {
      const updatedArray = [...questionListStatus];
      updatedArray[index] = isValid;
      setQuestionListStatus(updatedArray);
    };

    const renderCard = (card: QuestionType, index: number) => {
      return <Card key={index} index={index} id={card.id} product={productType} moveCard={moveCard} question={card} updateStatus={updateStatus} />;
    };

    return (
      <>
        <div>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    );
  }
};
