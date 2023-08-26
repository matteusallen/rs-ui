import styled from 'styled-components';

import colors from '../../styles/Colors';

import Button from './index';

const OptionButton = styled(Button)`
  &&& {
    flex: 0.5;
    width: 100%;
    height: 36px;
    background-color: transparent;
    box-shadow: none;
    border: solid 1px ${colors.text.primary};
    color: ${colors.text.primary};
    margin: 0px 10px;
    line-height: 1;
  }
`;

export default OptionButton;
