import React from 'react';
import useWindowSize from '../../helpers/useWindowSize';
import { Link } from 'react-router-dom';
import { Accordion, Button } from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Footer from '../../containers/Footer';
import { HeadingOne } from 'Components/Headings';
import { HeadingTwo } from 'Components/Headings';
import PhoneLink from 'Components/Links/PhoneLink';
import withLogout from '../../mutations/Logout';
import './RenterHelp.scss';

const RenterHelp = ({ logoutUser }) => {
  const { isMobile } = useWindowSize();
  return (
    <>
      <div className="help-page-container">
        <div className="help-header">
          <HeadingOne label="Help & Support" />
        </div>
        <Accordion className="help-accordion" defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="NeedHelp">
            <HeadingTwo className="separation-header" label={'Need Help Making Changes To Your Reservation?'} />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              For assistance with making changes to your reservation(s) or information about the event, please contact the venue directly via your
              <Link to="/reservations" className="inline-link">
                reservation.
              </Link>
              <br />
              You can find the contact information for each event by tapping “Book Now” and viewing the event details.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion className="help-accordion" defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label="Expand" aria-controls="additional-actions1-content" id="AcountIssues">
            <HeadingTwo className="separation-header" label={'Account Issues?'} />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you are having trouble processing your reservations, have issues with your account or logging in, please give us a call at
              <PhoneLink phone={'8883431123'} className="inline-link" />
              or email us at
              <a href={'mailto:support@rodeologistics.co'} className="inline-link">
                support@rodeologistics.co
              </a>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <p className="terms-privacy">
          <Link to={'/privacy'} rel={'noopener noreferrer'} target={'_blank'} data-testid="privacy-link">
            Privacy Policy
          </Link>
          <span className="bullet-seperator">&bull;</span>
          <Link to={'/terms'} rel={'noopener noreferrer'} target={'_blank'} data-testid="terms-link">
            Terms of Use
          </Link>
        </p>
      </div>
      {isMobile && (
        <div className="bottom-button-wrapper">
          <Button primary variant="outlined" size="large" data-testid="help-sign-out-button-mobile" className="sign-out-button-mobile" onClick={logoutUser}>
            Sign Out
          </Button>
        </div>
      )}
      <Footer />
    </>
  );
};

export default withLogout(RenterHelp);
