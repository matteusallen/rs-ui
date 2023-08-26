import React, { useState } from 'react';
import styled from 'styled-components';
import { Document } from 'react-pdf/dist/esm/entry.webpack';
import { Page } from 'react-pdf';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { HeadingOne } from 'Components/Headings';

const PdfViewerBase = props => {
  const {
    className,
    documentTitle,
    documentUrl,
    titleSize = 20, // eslint-disable-line
    ...rest
  } = props;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = offset => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const paginationControls = () => {
    return (
      <div className="pagination">
        <button type="button" disabled={pageNumber <= 1} onClick={previousPage} className={pageNumber === 1 ? 'disabled' : null}>
          <ArrowBackIcon />
        </button>
        <span className="page-numbers">
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </span>
        <button type="button" disabled={pageNumber >= numPages} onClick={nextPage} className={pageNumber === numPages ? 'disabled' : null}>
          <ArrowForwardIcon />
        </button>
      </div>
    );
  };

  return (
    <div className={`${className}__pdf-viewer`}>
      <HeadingOne label={documentTitle} />
      {paginationControls()}
      <Document file={documentUrl} onLoadSuccess={onDocumentLoadSuccess} {...rest}>
        <Page pageNumber={pageNumber} width={1280} />
      </Document>
      {paginationControls()}
    </div>
  );
};

const PdfViewer = styled(PdfViewerBase)`
  &__pdf-viewer {
    width: 1280px;
    margin: 0 auto;

    .pagination {
      margin: 20px 0 40px 0;

      .page-numbers {
        font-size: 16px
        text-transform: uppercase;
        font-family: 'IBMPlexSans-Bold';
      }

      button {
        border: 0;
        background: transparent;
        padding: 0 12px;
        cursor: pointer;
        color: #2573c2;

        &.disabled {
          color: #a6a6a6;
        }

        svg {
          top: 6px;
          position: relative;
        }
      }
    }
  }
`;

export default PdfViewer;
