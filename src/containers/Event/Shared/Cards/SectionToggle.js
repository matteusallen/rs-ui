//@flow
import React from 'react';
import Switch from '@material-ui/core/Switch';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { emptyStallCard, emptyRvCard } from '../Form';
import type { EventFormType } from '../Form';
import colors from '../../../../styles/Colors';

type SectionTogglePropsType = {|
  scope: 'hasStalls' | 'hasRvs',
  product: 'stalls' | 'rvs'
|};

export const useStyles = makeStyles(() => ({
  switch_track: {
    backgroundColor: colors.button.primary.disabled,
    opacity: 1
  },
  switch_base: {
    '&.Mui-checked': {
      color: colors.white
    },
    '&.Mui-checked + .MuiSwitch-track': {
      backgroundColor: colors.button.primary.active,
      opacity: 1
    }
  }
}));

export const SectionToggle = ({ scope, product }: SectionTogglePropsType) => {
  const { values, setFieldValue, touched, setTouched } = useFormikContext<EventFormType>();
  const { hasStalls, hasRvs } = values;
  const classes = useStyles();
  const questionType = product === 'stalls' ? 'stallQuestions' : 'rvQuestions';
  const hasProduct = product === 'stalls' ? hasStalls : hasRvs;
  const emptyCard = product === 'stalls' ? emptyStallCard : emptyRvCard;

  const newRate = () => {
    if (!hasProduct) {
      setFieldValue(product, [JSON.parse(JSON.stringify(emptyCard))]);
      setFieldValue(scope, true);
    } else {
      setFieldValue(product, []);
      setFieldValue(scope, false);
    }
  };

  return (
    <div id="switch-container">
      <Switch
        data-testid="section-toggle"
        classes={{
          track: classes.switch_track,
          switchBase: classes.switch_base,
          colorPrimary: colors.white
        }}
        color={'primary'}
        onChange={e => {
          const { checked } = e.target;
          setFieldValue(scope, checked);
          if (checked) newRate();
          else {
            setFieldValue(questionType, []);
            const newTouchedObj = { ...touched, [`${product}`]: [] };
            setTouched(newTouchedObj);
          }
        }}
        size={'medium'}
        checked={hasProduct}
      />
    </div>
  );
};
