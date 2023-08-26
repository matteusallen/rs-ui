// @flow
import styled from 'styled-components';
import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form } from 'formik';
import { Select, MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { displayFlex } from '../../styles/Mixins';
import { paragraphReg, paragraphBold } from '../../styles/Typography';
import colors from '../../styles/Colors';
import ContextSnackbar from 'Components/Snackbar';
import Button from 'Components/Button';
import AddButton from 'Components/Button/AddButton';
import { VENUES, EVENT_PRODUCTS } from '../../queries/SuperAdmin';
import { UPDATE_EVENT_AND_PRODUCT_INFO } from '../../mutations/UpdateEventAndProductInfo';
import { SnackbarContext } from '../../store/SnackbarContext';
import type { SnackbarContextActionsType } from '../../store/SnackbarContext';
import { isEmpty } from '../../helpers';
import { Link } from 'react-router-dom';
import { subRouteCodes as SUB_ROUTES } from '../../constants/routes';
import { HeadingTwo } from 'Components/Headings';

const useStyles = makeStyles({
  underline: {
    '&&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  }
});

const initialSelectedOption = {
  id: '',
  name: '',
  description: '',
  startDate: '',
  endDate: ''
};

const initialState = {
  events: [],
  venues: [],
  stallProducts: [],
  rvProducts: [],
  addOnProducts: [],
  productsToEdit: {},
  selectedVenue: initialSelectedOption,
  selectedEvent: initialSelectedOption,
  isEventEdit: false,
  productChanges: {},
  eventName: '',
  eventDesc: ''
};

const getOptions = data => {
  if (!data) return null;

  const options = data.map(data => (
    <MenuItem key={data.id} value={data.id}>
      {data.name}
    </MenuItem>
  ));

  return options;
};

const SuperAdminVenueBase = props => {
  const inputStyleProps = useStyles();
  const { className } = props;
  const [state, setState] = useState(initialState);
  const { data: venuesData } = useQuery(VENUES);
  const { data: eventProductsData } = useQuery(EVENT_PRODUCTS, {
    variables: { id: +state.selectedEvent.id }
  });
  const [updateEventAndProductInfo, { loading, error, data: updateResponse }] = useMutation(UPDATE_EVENT_AND_PRODUCT_INFO, {
    refetchQueries: [
      {
        query: VENUES
      },
      {
        query: EVENT_PRODUCTS,
        variables: { id: +state.selectedEvent.id }
      }
    ]
  });
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);

  const handleIsProductEdit = (id, answer) => {
    if (!answer) delete state.productChanges[id];

    setState({
      ...state,
      productsToEdit: {
        ...state.productsToEdit,
        [id]: answer
      }
    });
  };

  const handleProductChange = (e, productKey) => {
    const productKeys = productKey.split('_');

    setState({
      ...state,
      productChanges: {
        ...state.productChanges,
        [productKey]: {
          ...state.productChanges[productKey],
          id: productKeys[1],
          [e.target.name]: e.target.value,
          type: productKeys[0]
        }
      }
    });
  };

  const handleVenueChange = e => {
    const venue = state.venues.filter(venue => venue.id === e.target.value)[0];

    setState({
      ...state,
      selectedVenue: venue,
      events: venue.events,
      selectedEvent: initialSelectedOption,
      stallProducts: [],
      rvProducts: [],
      addOnProducts: []
    });
  };

  const handleEventChange = e => {
    const event = state.events.filter(event => event.id === e.target.value)[0];
    setState({
      ...state,
      selectedEvent: event
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!state.eventName && !state.eventDesc && isEmpty(state.productChanges)) return;

    const input = {
      event: {
        id: state.selectedEvent.id,
        name: state.eventName,
        description: state.eventDesc
      },
      products: Object.values(state.productChanges)
    };

    try {
      await updateEventAndProductInfo({
        variables: { input }
      });
    } catch (error) {
      showSnackbar(`Something went wrong ${JSON.stringify(error)}`, {
        error: true,
        duration: 50000
      });
    }
  };

  const handleReset = () => {
    setState({
      ...state,
      eventName: '',
      eventDesc: '',
      isEventEdit: false,
      productsToEdit: {},
      productChanges: {}
    });
  };

  useEffect(() => {
    if (venuesData)
      setState({
        ...state,
        venues: venuesData.venues
      });
  }, [venuesData]);

  useEffect(() => {
    if (eventProductsData && eventProductsData.event) {
      setState({
        ...state,
        stallProducts: eventProductsData.event.stallProducts,
        rvProducts: eventProductsData.event.rvProducts,
        addOnProducts: eventProductsData.event.addOnProducts
      });
    }
  }, [eventProductsData]);

  useEffect(() => {
    if (error) {
      showSnackbar(`Something went wrong ${JSON.stringify(error)}`, {
        error: true,
        duration: 50000
      });
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      showSnackbar(`saving ...`, {
        error: false,
        duration: 500
      });
    }
  }, [loading]);

  useEffect(() => {
    if (updateResponse) {
      try {
        const { success, error } = updateResponse.updateEventAndProductInfo;
        if (success) {
          setState({
            ...state,
            selectedVenue: initialSelectedOption,
            selectedEvent: initialSelectedOption,
            isEventEdit: false,
            productsToEdit: {},
            productChanges: {}
          });
        }
        if (error)
          showSnackbar(error, {
            error: true,
            duration: 50000
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [updateResponse]);

  return (
    <>
      <div className={className}>
        <ContextSnackbar />
        <div className={`${className}__page-header`}>
          <div className={`${className}__header-wrapper`}>
            <HeadingTwo label="EVENT & PRODUCTS INFO UPDATE" />
          </div>
        </div>
      </div>
      <div className={className}>
        <div className={`${className}__page-body`}>
          <Formik enableReinitialize>
            <Form>
              <div>
                <CreateVenueLink to={SUB_ROUTES.SUPER_ADMIN.CREATE_VENUE}>
                  <AddButton label={'CREATE VENUE'} />
                </CreateVenueLink>
                <h3>choose venue</h3>
                <Select onChange={handleVenueChange} value={state.selectedVenue.id} disabled={state.isEventEdit} disableUnderline>
                  {getOptions(state.venues)}
                </Select>
              </div>

              <div className={`${className}__page-body-child`}>
                {state.selectedVenue.id ? (
                  <div>
                    <h3>Event Name:</h3>
                    {state.isEventEdit ? (
                      <TextField
                        id="eventName"
                        name="name"
                        type="text"
                        defaultValue={state.selectedEvent.name}
                        InputProps={{ classes: inputStyleProps }}
                        onChange={e => setState({ ...state, eventName: e.target.value })}
                      />
                    ) : (
                      <Select onChange={handleEventChange} value={state.selectedEvent.id} disableUnderline>
                        {getOptions(state.events)}
                      </Select>
                    )}

                    {state.selectedEvent.id ? (
                      <>
                        <h3>Event Description:</h3>
                        {state.isEventEdit ? (
                          <TextField
                            id="eventDescription"
                            name="description"
                            type="text"
                            defaultValue={state.selectedEvent.description}
                            InputProps={{ classes: inputStyleProps }}
                            onChange={e => setState({ ...state, eventDesc: e.target.value })}
                          />
                        ) : (
                          <>{state.selectedEvent.description ? state.selectedEvent.description : 'N/A'}</>
                        )}

                        <h3>Dates:</h3>
                        <span>
                          {state.selectedEvent.startDate} - {state.selectedEvent.endDate}
                        </span>
                        <br />
                        {state.isEventEdit ? (
                          <a href="#" onClick={() => setState({ ...state, isEventEdit: false })}>
                            Cancel
                          </a>
                        ) : (
                          <a href="#" onClick={() => setState({ ...state, isEventEdit: true })}>
                            Edit Event
                          </a>
                        )}
                      </>
                    ) : null}
                    <div className={'line'} />
                  </div>
                ) : null}
              </div>

              <div className={`${className}__page-body-child`}>
                {state.selectedEvent.id ? (
                  <FlexWrapper>
                    <FlexRow>
                      <FlexColumn>
                        <div className={`${className}__page-body-child`}>
                          <h3>Stall Products</h3>
                          {state.stallProducts.map(stall => (
                            <div key={stall.id} className={`${className}__page-body-child`}>
                              {state.productsToEdit[`st_${stall.id}`] ? (
                                <>
                                  <TextField
                                    id={`st_name_${stall.id}`}
                                    name="name"
                                    type="text"
                                    defaultValue={stall.name}
                                    InputProps={{ classes: inputStyleProps }}
                                    onChange={e => handleProductChange(e, `st_${stall.id}`)}
                                  />
                                  <TextField
                                    id={`st_description_${stall.id}`}
                                    name="description"
                                    type="text"
                                    defaultValue={stall.description}
                                    InputProps={{ classes: inputStyleProps }}
                                    onChange={e => handleProductChange(e, `st_${stall.id}`)}
                                  />
                                </>
                              ) : (
                                <>
                                  <span> Name: </span>
                                  {stall.name ? stall.name : ''}
                                  <br />
                                  <span> Description: </span>
                                  {stall.description ? stall.description : 'N/A'}
                                </>
                              )}
                              <br />
                              <span> Price: </span> ${stall.price ? stall.price : ''}
                              <br />
                              <span> Dates: </span>
                              {`${stall.startDate} - ${stall.endDate}`}
                              <br />
                              {state.productsToEdit[`st_${stall.id}`] ? (
                                <a href="#" onClick={() => handleIsProductEdit(`st_${stall.id}`, false)}>
                                  Cancel
                                </a>
                              ) : (
                                <a href="#" onClick={() => handleIsProductEdit(`st_${stall.id}`, true)}>
                                  Edit
                                </a>
                              )}
                              <div className={'line'} />
                            </div>
                          ))}
                        </div>
                      </FlexColumn>
                      <FlexColumn>
                        <div className={`${className}__page-body-child`}>
                          <h3>RV Products</h3>
                          {state.rvProducts.map(rv => (
                            <div key={rv.id} className={`${className}__page-body-child`}>
                              {state.productsToEdit[`rv_${rv.id}`] ? (
                                <>
                                  <TextField
                                    id={`rv_name_${rv.id}`}
                                    name="name"
                                    type="text"
                                    defaultValue={rv.name}
                                    InputProps={{ classes: inputStyleProps }}
                                    onChange={e => handleProductChange(e, `rv_${rv.id}`)}
                                  />
                                  <TextField
                                    id={`rv_desc_${rv.id}`}
                                    name="description"
                                    type="text"
                                    defaultValue={rv.description}
                                    InputProps={{ classes: inputStyleProps }}
                                    onChange={e => handleProductChange(e, `rv_${rv.id}`)}
                                  />
                                </>
                              ) : (
                                <>
                                  <span> Name: </span> {rv.name ? rv.name : ''}
                                  <br />
                                  <span> Description: </span>
                                  {rv.description ? rv.description : 'N/A'}
                                </>
                              )}
                              <br />
                              <span> Price: </span> ${rv.price ? rv.price : ''}
                              <br />
                              <span> Dates: </span>
                              {`${rv.startDate} - ${rv.endDate}`}
                              <br />
                              {state.productsToEdit[`rv_${rv.id}`] ? (
                                <a href="#" onClick={() => handleIsProductEdit(`rv_${rv.id}`, false)}>
                                  Cancel
                                </a>
                              ) : (
                                <a href="#" onClick={() => handleIsProductEdit(`rv_${rv.id}`, true)}>
                                  Edit
                                </a>
                              )}
                              <div className={'line'} />
                            </div>
                          ))}
                        </div>
                      </FlexColumn>
                      <FlexColumn>
                        <div className={`${className}__page-body-child`}>
                          <h3>AddOn Products</h3>
                          {state.addOnProducts.map(addOnProduct => (
                            <div key={addOnProduct.addOn.id} className={`${className}__page-body-child`}>
                              {state.productsToEdit[`ao_${addOnProduct.addOn.id}`] ? (
                                <>
                                  <TextField
                                    id={`add_on_name_${addOnProduct.addOn.id}`}
                                    name="name"
                                    type="text"
                                    defaultValue={addOnProduct.addOn.name}
                                    InputProps={{ classes: inputStyleProps }}
                                    onChange={e => handleProductChange(e, `ao_${addOnProduct.addOn.id}`)}
                                  />
                                  <TextField
                                    id={`add_on_desc_${addOnProduct.addOn.id}`}
                                    name="description"
                                    type="text"
                                    defaultValue={addOnProduct.addOn.description}
                                    InputProps={{ classes: inputStyleProps }}
                                    onChange={e => handleProductChange(e, `ao_${addOnProduct.addOn.id}`)}
                                  />
                                </>
                              ) : (
                                <>
                                  <span> Name: </span>
                                  {addOnProduct.addOn.name ? addOnProduct.addOn.name : ''}
                                  <br />
                                  <span> Description: </span>
                                  {addOnProduct.addOn.description ? addOnProduct.addOn.description : 'N/A'}
                                </>
                              )}
                              <br />
                              <span> Price: </span> ${addOnProduct.price ? addOnProduct.price : ''}
                              <br />
                              {state.productsToEdit[`ao_${addOnProduct.addOn.id}`] ? (
                                <a href="#" onClick={() => handleIsProductEdit(`ao_${addOnProduct.addOn.id}`, false)}>
                                  Cancel
                                </a>
                              ) : (
                                <a href="#" onClick={() => handleIsProductEdit(`ao_${addOnProduct.addOn.id}`, true)}>
                                  Edit
                                </a>
                              )}
                              <div className={'line'} />
                            </div>
                          ))}
                        </div>
                      </FlexColumn>
                    </FlexRow>
                  </FlexWrapper>
                ) : null}
              </div>

              <div className={`${className}__page-body-child`}>
                {state.selectedEvent.id ? (
                  <FlexRow>
                    <FlexSmallColumn>
                      <Button type={'submit'} primary onClick={handleSubmit}>
                        Save Changes
                      </Button>
                    </FlexSmallColumn>
                    <FlexSmallColumn>
                      <Button type={'button'} secondary onClick={handleReset}>
                        Reset
                      </Button>
                    </FlexSmallColumn>
                  </FlexRow>
                ) : null}
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};

const CreateVenueLink = styled(Link)`
  text-decoration: none;
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  &:first-child {
    margin: 0 0 30px 0;
  }
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    &:first-child {
      margin: 0 0 30px 0;
    }
  }

  div span {
    ${paragraphBold}
    align-self: flex-start;
    margin: 0;
    padding: 20px 0 0;
    font-size: 12px;
  }
`;

const FlexRow = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const FlexColumn = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 400px;
`;

const FlexSmallColumn = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 180px;
`;

const SuperAdminVenues = styled(SuperAdminVenueBase)`
  &&& {
    ${displayFlex}
    align-items: center;
    width: 100%;
    height: auto;
    padding: 12px 0 11px 20px;
    ${paragraphReg}
    font-size: 14px;
    text-align: left;
    background-color: ${colors.background.primary};
    color: ${colors.text};
    border-radius: 3px;
  }

  &__page-header {
    text-align: left;
    width: 100%
    border-bottom: 1px solid rgb(200, 214, 229);
    &&& {
      margin: 65px 0 25px;
    }

  }

  &__page-body {
    text-align: left;
    width: 100%
    &&& {
      margin: 0;
      padding: 10px
    }

    h3 {
      text-transform: uppercase;
      font-family: IBMPlexSans-Bold;
      font-size: 12px;
      font-weight: 400;
      color: rgb(79, 93, 109);
      margin-top: 0px;
      margin-bottom: 3px;
    }
  }
  
  &__page-body-child {
    margin-top: 20px;
  }

  &__header-wrapper {
    margin: 20px 0px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .MuiInputBase-root {
    border: ${colors.text.lightGray2} 1px solid;
    border-radius: 3px;
    padding: 0 10px;
    min-width: 300px;
  }

  .MuiSvgIcon-root {
    width: .8em;
    height: .8em;
  }

  .MuiIconButton-root {
    padding-top: 6px;
  }
  
  .line {
    background: ${colors.border.primary};
    height: 1px;
    flex: 1;
    position: relative;
    top: 11px;
  }
`;

export default SuperAdminVenues;
