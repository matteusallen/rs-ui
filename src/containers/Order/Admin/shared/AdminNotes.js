import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import { useFormikContext, Field } from 'formik';
import { FormikField } from '../../../../components/Fields';
import { HeadingThree } from '../../../../components/Headings';
import { Separator } from '../../../../components/Separator';
import { UPDATE_ORDER } from '../../../../mutations/UpdateOrder';
import Button from '../../../../components/Button';
import { SnackbarContext } from '../../../../store/SnackbarContext';
import UpdatedChip from './UpdatedChip';

function AdminNotesBase(props) {
  const { className, adminNotes, setAdminNotes, isReview = false, lastSavedNote, setLastSavedNote, isOpen, setIsOpen, isEdit } = props;
  const {
    values: { initialOrder }
  } = useFormikContext();
  const { showSnackbar } = useContext(SnackbarContext);
  const [updateOrder, { data, called, loading, error }] = useMutation(UPDATE_ORDER);

  useEffect(() => {
    if (isEdit) {
      setAdminNotes(adminNotes || initialOrder.adminNotes);
      setLastSavedNote(lastSavedNote || initialOrder.adminNotes);
    }
  }, [isEdit]);

  useEffect(() => {
    if (data) {
      showSnackbar('Admin notes successfully saved', {
        error: false,
        duration: 5000
      });
    } else if (error) {
      showSnackbar(error.message || 'Unable to save admin notes', { error: true, duration: 5000 });
    }
  }, [data, error]);

  const handleSave = async () => {
    const updatedOrder = {
      orderId: initialOrder.id,
      refundPayment: false,
      adminNotes: adminNotes,
      reservations: [],
      addOns: [],
      assignments: []
    };
    await updateOrder({
      variables: { input: updatedOrder }
    });
    if (!error) {
      setIsOpen(false);
      setLastSavedNote(adminNotes);
    }
  };

  const renderTextOrInput = () => {
    if (!isOpen) {
      return (
        <div className={`${className}__admin-notes-text`}>
          {lastSavedNote !== adminNotes && !isReview && (
            <span className={`${className}__updated-chip`}>
              <UpdatedChip />
            </span>
          )}
          {adminNotes || '-'}
        </div>
      );
    }

    return (
      <>
        {lastSavedNote !== adminNotes && isEdit && <UpdatedChip />}
        <Field
          id="admin-notes-field"
          component={FormikField}
          label="ADMIN NOTES"
          type="text"
          autoComplete="adminNotes"
          value={adminNotes}
          multiline
          rows="1"
          variant="filled"
          name="adminNotes"
          inputProps={{ maxLength: 250 }}
          onChange={e => setAdminNotes(e.target.value)}
        />
        {isEdit && (
          <div className={`${className}__button-container`}>
            <Button secondary onClick={handleSave} disabled={(called && loading) || adminNotes === lastSavedNote}>
              Save
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div data-testid="card_admin_notes" className={`${className}__${!isEdit ? 'is-review' : ''}`}>
      <div className={`${className}__notes-header`}>{!isEdit && <HeadingThree label={'Admin Notes'} />}</div>
      <Separator margin="0.625rem 0 1.375rem" />
      <div className={`${className}__row `}>
        <div className={`${className}__${isReview ? 'highlighted' : ''}`}>{renderTextOrInput()}</div>
      </div>
    </div>
  );
}

const AdminNotes = styled(AdminNotesBase)`
  &__admin-notes-text {
    font-size: 1rem;
    line-height: 25px;
  }

  &__is-review {
    width: 100%;
    background-color: white;
    padding: 15px 25px;
    box-shadow: 0 2px 10px rgb(17 24 31 / 10%), 0 2px 5px rgb(17 24 31 / 30%);
    margin-bottom: 40px;
  }

  &__row {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: wrap;
    text-align: left

    p:first-child {
      font-family: 'IBMPlexSans-SemiBold';
      font-size: 18px;
      letter-spacing: 0.79px;
      line-height: 23px;
      margin: 5px 0;
    }
  }
  &__updated-chip {
    div {
      margin-left: 0 !important;
      margin-bottom: 5px;
    }
  }

  &__highlighted {
    background-color: #f7e569;
    width: fit-content;
  }

  &__button-container {
    display: flex;
    justify-content: flex-end;

    button {
      width: 93px !important;
    }
  }

  &__notes-header {
    display: flex;
    justify-content: space-between;
  }

  &__item {
    width: 100%;
    margin: 0;
  }
  &__item p {
    margin: 0;
  }
`;

export default AdminNotes;
