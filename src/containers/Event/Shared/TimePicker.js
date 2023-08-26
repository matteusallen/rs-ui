import { TimePicker } from 'formik-material-ui-pickers';
import styled from 'styled-components';

const TimePickerStyled = styled(TimePicker)`
  &&& {
    label {
      color: #11181f;
      padding-left: 15px;
      padding-top: 15px;
    }

    input {
      color: #11181f;
      padding-top: 15px;
      padding-left: 12px;
    }
  }
`;
export default TimePickerStyled;
