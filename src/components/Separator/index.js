import styled from 'styled-components';

import colors from '../../styles/Colors';

export const Separator = styled.hr`
  margin: ${props => props.margin || '1.375rem 0'};
  border: none;
  border-top: 1px solid ${colors.border.primary};
`;
