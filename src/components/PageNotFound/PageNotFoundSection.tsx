import React from 'react';
import styled from 'styled-components';
import { HeadingOne } from '../Headings';

interface PageNotFoundProps {
  className: string;
}

export const PageNotFoundSection: React.FC<PageNotFoundProps> = ({ className }: PageNotFoundProps) => {
  return (
    <PageNotFoundSectionStyled className={className}>
      <div className={`${className}__Page-Title`}>
        <HeadingOne className={`${className}__Header`} label={'Page not found'} />
        <p className={`${className}__Lead`}>We couldn’t find what you are looking for.</p>
      </div>
    </PageNotFoundSectionStyled>
  );
};

export default PageNotFoundSection;

const PageNotFoundSectionStyled = styled.section`
  text-align: left;
  div {
    p {
      margin-top: 40px;
      font-size: 16px;
    }
  }
`;
