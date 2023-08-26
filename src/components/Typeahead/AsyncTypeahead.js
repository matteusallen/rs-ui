import React, { useState, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import './Typeahead.scss';

const TypeaheadComponent = ({ options, searchText, setSearchText, placeholder, handleSearch, loading, className = '' }) => {
  const searchRef = useRef();
  const [isFocus, setIsFocus] = useState(false);

  if (isMobile) {
    const viewport = document.querySelector('meta[name=viewport]');
    viewport?.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
  }

  const trimLength = isMobile ? 33 : 88;

  const handleClick = e => {
    const hint = e.target.nextSibling?.value;
    if (options.length && hint) {
      setSearchText(hint);
      searchRef.current.setState({ ...searchRef.current.state, text: hint });
    }
    setIsFocus(true);
  };

  return (
    <div onTouchStart={handleClick} onClick={handleClick} onBlur={() => setIsFocus(false)} className="search-box" data-testid="event-search">
      <AsyncTypeahead
        ref={searchRef}
        isLoading={false}
        id="event-search-typeahead"
        onSearch={handleSearch}
        onInputChange={e => {
          if (loading || !e) setSearchText(e);
        }}
        placeholder={placeholder}
        minLength={0}
        className={`search-orders-field${searchText?.length >= trimLength ? ' trim' : ''}`}
        onChange={e => {
          if (e && e[0]) setSearchText(e[0]);
        }}
        options={options}>
        {() => (
          <div className="rbt-aux">
            <SearchIcon className={`search-icon ${className} ${isFocus || searchText ? 'is-focused' : ''}`} />
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
      </AsyncTypeahead>
    </div>
  );
};

export default TypeaheadComponent;
