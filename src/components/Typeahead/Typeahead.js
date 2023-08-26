import React, { useState, useRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import './Typeahead.scss';

const TypeaheadComponent = ({ options, searchText, setSearchText, onChange, placeholder }) => {
  const searchRef = useRef();
  const [isFocus, setIsFocus] = useState(false);

  if (isMobile) {
    const viewport = document.querySelector('meta[name=viewport]');
    viewport?.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
  }

  const handleClick = e => {
    const hint = e.target.nextSibling?.value;
    if (options.length && hint) {
      setSearchText(hint);
      searchRef.current.setState({ ...searchRef.current.state, text: hint });
    }
    setIsFocus(true);
  };
  const trimLength = isMobile ? 33 : 88;

  return (
    <div onTouchStart={handleClick} onClick={handleClick} onBlur={() => setIsFocus(false)} data-testid="reservation-search" className="search-box">
      <Typeahead
        ref={searchRef}
        placeholder={placeholder}
        id="reservations-typeahead"
        className={`search-orders-field${searchText?.length >= trimLength ? ' trim' : ''}`}
        onInputChange={onChange}
        onChange={e => {
          if (e[0]) setSearchText(e[0]);
        }}
        options={options}>
        {() => (
          <div className="rbt-aux">
            <SearchIcon className={`search-icon ${isFocus || searchText ? 'is-focused' : ''}`} />
            {searchText && (
              <Button
                className="clear-button"
                onClick={e => {
                  e.stopPropagation();
                  setSearchText('');
                  searchRef.current.clear();
                }}>
                <CloseIcon className="clear-text" />
              </Button>
            )}
          </div>
        )}
      </Typeahead>
    </div>
  );
};

export default TypeaheadComponent;
