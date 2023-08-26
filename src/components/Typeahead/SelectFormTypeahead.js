import React, { useRef, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import moment from 'moment';
import { Checkbox } from '@material-ui/core';
import dropdown from '../../assets/img/icons/dropdown.png';
import { isMobile } from 'react-device-detect';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import './SelectFormTypeahead.scss';

const SelectTypeahead = ({
  options,
  searchText,
  setSearchText,
  onChange,
  placeholder,
  handleSelect,
  loading,
  emptyLabel,
  isMenuOpen,
  setIsMenuOpen,
  prodType
}) => {
  const searchRef = useRef();
  const [isFocus, setIsFocus] = useState(false);

  if (isMobile) {
    const viewport = document.querySelector('meta[name=viewport]');
    viewport?.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
  }

  const trimLength = isMobile ? 33 : 88;

  const handleClick = e => {
    e.stopPropagation();
    const hint = e.target.nextSibling?.value;
    if (options.length && isFocus && hint) {
      setSearchText(hint);
      searchRef.current.setState({ ...searchRef.current.state, text: hint });
    }
    setIsFocus(true);
  };

  const RenderMenu = () => {
    return !options.length ? (
      <div className={'results-menu'} id="form-select-dropdown">
        <div className={'results-item'}>{emptyLabel}</div>
      </div>
    ) : (
      <div className={'results-menu'} id="form-select-dropdown">
        {loading ? (
          <div style={{ alignSelf: 'center' }}>
            <IndeterminateLoading />
          </div>
        ) : (
          options.map((result, index) => (
            <div
              className={'results-item'}
              key={result.id}
              onMouseDown={() => {
                if (
                  (prodType === 'stall' && result.hasStallRes) ||
                  (prodType === 'rv' && result.hasRVRes) ||
                  (!prodType && (result.hasStallRes || result.hasRVRes))
                ) {
                  searchRef.current.clear();
                  handleSelect(result.id);
                  setIsMenuOpen(false);
                } else setIsFocus(false);
              }}
              option={result}
              position={index}>
              <Checkbox type="checkbox" checked={false} />
              <div className="event-name">
                {(prodType === 'stall' && !result.hasStallRes) ||
                (prodType === 'rv' && !result.hasRVRes) ||
                (!prodType && !result.hasStallRes && !result.hasRVRes) ? (
                  <>
                    <i>{result.label}</i>
                    <span>NO RECORDS FOUND FOR THIS EVENT</span>
                  </>
                ) : (
                  <>
                    <span>{result.label}</span>
                    <span>{`${moment(result.startDate).format('MMM D, YYYY')} - ${moment(result.endDate).format('MMM D, YYYY')}`}</span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="search-box" onClick={handleClick} onTouchStart={handleClick}>
      <AsyncTypeahead
        onFocus={() => {
          setIsMenuOpen(true);
        }}
        onBlur={() => setIsFocus(false)}
        ref={searchRef}
        placeholder={placeholder}
        minLength={0}
        isLoading={false}
        id="select-form-typeahead"
        emptyLabel={emptyLabel}
        onSearch={val => onChange(val)}
        className={`search-orders-field${searchText?.length >= trimLength ? ' trim' : ''}`}
        onInputChange={e => {
          if (loading || !e) setSearchText(e);
        }}
        onChange={e => {
          if (e && e[0]) setSearchText(e[0].label);
          searchRef.current.setState({ ...searchRef.current.state, showMenu: true });
        }}
        options={options}>
        {(isFocus || searchRef.current?.state.text) && <span className="info-text">SEARCH EVENTS</span>}
        <img src={dropdown} alt="dropdown" />
        {isMenuOpen && <RenderMenu />}
      </AsyncTypeahead>
    </div>
  );
};

export default SelectTypeahead;
