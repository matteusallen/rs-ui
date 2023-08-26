//@flow
import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { useFormikContext } from 'formik';
import { Add, Clear } from '@material-ui/icons';

import { SnackbarContext } from '../../../../store/SnackbarContext';
import type { SnackbarContextActionsType } from '../../../../store/SnackbarContext';
import type { RvLotType } from '../../../../queries/Admin/CreateEvent/VenueRvLots';
import type { EventFormType } from '../Form';
import RVSIcon from '../../../../assets/img/icons/RV.png';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { HeadingFour } from 'Components/Headings';

type ReservableSpotsPropsType = {|
  name: string,
  rvLotId?: string,
  rvLots: RvLotType[]
|};

export const ReservableSpots = ({ rvLotId, rvLots, name }: ReservableSpotsPropsType) => {
  const { setFieldValue, values } = useFormikContext<EventFormType>();
  const rvLot = useMemo(() => rvLots.find(({ id }) => rvLotId && id === rvLotId), [rvLotId, JSON.stringify(rvLots)]);
  const availableRVSpots = rvLot ? rvLot.availableRVSpots?.sort((a, b) => (!!a && !!b ? a.name.localeCompare(b.name, 'en', { numeric: true }) : 0)) : [];
  const selectedSpots = getValueByPropPath(values, name, []);
  const [nodes, setNodes] = useState<{ id: string, name: string, selected: boolean }[]>([]);
  const assignedSpots = values.rvs?.find(rv => rv.rvLotId === rvLotId)?.assignedSpots ?? [];
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);

  const spotIsAssigned = id => {
    return assignedSpots.includes(id);
  };

  const toggleItem = useCallback(
    (itemId: string) => () => {
      if (spotIsAssigned(itemId)) {
        showSnackbar(`This spot cannot be deselected because it was already assigned`, { error: true });
        return;
      }
      const hasItem = selectedSpots.some(spot => spot && spot === itemId);
      const newState = hasItem ? [...selectedSpots.filter(spot => spot !== itemId)] : [...selectedSpots, itemId];
      setFieldValue(name, newState);
    },
    [JSON.stringify(nodes)]
  );

  const selectItemsCount = useMemo(() => nodes.reduce((state, item) => (item.selected ? state + 1 : state), 0), [JSON.stringify(nodes)]);

  const availableItems = rvLot && selectItemsCount === rvLot.availableRVSpots.length;

  const selectAll = () => {
    const newState = availableRVSpots.map(({ id }) => id);
    setFieldValue(name, newState);
  };

  const deSelectAll = () => {
    setFieldValue(name, assignedSpots);
  };

  useEffect(() => {
    const newState = availableRVSpots.map(({ id, name }) => {
      const spot = selectedSpots.find(spotID => spotID && id === spotID);
      return {
        id,
        name,
        selected: Boolean(spot)
      };
    });
    setNodes(newState);
  }, [JSON.stringify(availableRVSpots), JSON.stringify(selectedSpots)]);

  const elements = useMemo(
    () =>
      nodes.map(({ id, name, selected }) => {
        const isAssigned = spotIsAssigned(id);
        return (
          <div
            key={id}
            className={`rv-item ${!selected ? 'inactive' : ''} `}
            onClick={values.hasRvs ? toggleItem(id) : undefined}
            onKeyPress={values.hasRvs ? toggleItem(id) : undefined}
            tabIndex={0}
            role={'button'}>
            <div>{name}</div> <div>{selected ? !isAssigned && <Clear /> : <Add />}</div>
          </div>
        );
      }),
    [JSON.stringify(nodes)]
  );

  return (
    <>
      <div className={'reservable-actions'}>
        <HeadingFour label={`Reservable Spots ${rvLot ? `(${selectItemsCount})` : ''}`} />
        <a
          className={`action ${!rvLot || selectItemsCount === 0 ? 'disabled' : ''}`}
          onClick={values.hasRvs ? deSelectAll : undefined}
          onKeyPress={values.hasRvs ? deSelectAll : undefined}
          tabIndex={0}
          role={'button'}>
          DESELECT ALL
        </a>
        <a
          className={`action ${!rvLot ? 'disabled' : availableItems ? 'disabled' : ''}`}
          onClick={values.hasRvs ? selectAll : undefined}
          onKeyPress={values.hasRvs ? selectAll : undefined}
          tabIndex={0}
          role={'button'}>
          SELECT ALL
        </a>
      </div>
      <div className={'select-spots'}>
        {rvLot ? (
          <>
            <div className={'selected-items-count'}>
              {rvLot.name} ({selectItemsCount}/{rvLot.availableRVSpots.length})
            </div>
            {elements}
          </>
        ) : (
          <div className={'empty-rv-selection'}>
            <div>
              <img src={RVSIcon} alt={'RV Spots'} />
            </div>
            <div>Select an RV Lot to set reservable spots</div>
          </div>
        )}
      </div>
    </>
  );
};
